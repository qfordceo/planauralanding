import { supabase } from '@/integrations/supabase/client';

export const SUPPORTED_FORMATS = {
  'application/pdf': 'pdf',
  'application/x-dwg': 'dwg',
  'application/x-dxf': 'dxf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg'
} as const;

export type SupportedFormat = keyof typeof SUPPORTED_FORMATS;

export async function uploadFloorPlan(file: File): Promise<string> {
  try {
    // Validate file type
    const fileType = file.type || `application/x-${file.name.split('.').pop()}`;
    if (!Object.keys(SUPPORTED_FORMATS).includes(fileType)) {
      throw new Error("Unsupported file format");
    }

    const fileExt = SUPPORTED_FORMATS[fileType as SupportedFormat];
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Upload to floor-plan-originals bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('floor-plan-originals')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Initiate conversion if needed
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      const { data: conversionData, error: conversionError } = await supabase.functions
        .invoke('convert-floor-plan', {
          body: { 
            fileUrl: filePath,
            fileType
          }
        });

      if (conversionError) {
        throw conversionError;
      }

      // Return the converted file path if available
      if (conversionData?.convertedFilePath) {
        const { data: convertedUrlData } = supabase.storage
          .from('floor-plans')
          .getPublicUrl(conversionData.convertedFilePath);

        if (convertedUrlData?.publicUrl) {
          return convertedUrlData.publicUrl;
        }
      }
    }

    // Get the public URL for the original file
    const { data: publicUrlData } = supabase.storage
      .from('floor-plan-originals')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFloorPlan:', error);
    throw error;
  }
}
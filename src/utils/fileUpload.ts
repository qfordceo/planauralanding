import { supabase } from '@/integrations/supabase/client';

export const SUPPORTED_FORMATS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/x-ifc': 'ifc',
  'application/x-dwg': 'dwg',
  'application/x-rvt': 'rvt'
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

    // First, get the upload URL
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('floor-plans')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Then get the public URL in a separate call
    const { data: publicUrlData } = supabase.storage
      .from('floor-plans')
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
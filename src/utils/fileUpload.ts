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

    // Upload file with single response handling
    const { error: uploadError } = await supabase.storage
      .from('floor-plans')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL in separate call
    const { data: urlData } = supabase.storage
      .from('floor-plans')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFloorPlan:', error);
    throw error;
  }
}
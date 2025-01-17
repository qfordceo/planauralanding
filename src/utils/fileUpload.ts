import { supabase } from '@/integrations/supabase/client';

export const SUPPORTED_FORMATS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/x-ifc': 'ifc',
  'application/x-dwg': 'dwg',
  'application/x-rvt': 'rvt'
} as const;

export type SupportedFormat = keyof typeof SUPPORTED_FORMATS;

export async function uploadFloorPlan(file: File) {
  const fileType = file.type || `application/x-${file.name.split('.').pop()}`;
  
  if (!Object.keys(SUPPORTED_FORMATS).includes(fileType)) {
    throw new Error("Unsupported file format");
  }

  const fileExt = SUPPORTED_FORMATS[fileType as SupportedFormat];
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  
  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('floor-plans')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  // Get public URL after successful upload
  const { data: { publicUrl } } = supabase.storage
    .from('floor-plans')
    .getPublicUrl(fileName);

  // For BIM files, process them first
  if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
    const { data: processData, error: processError } = await supabase.functions
      .invoke('process-bim-file', {
        body: { 
          fileUrl: publicUrl,
          fileType: fileExt
        }
      });

    if (processError) {
      console.error('Processing error:', processError);
      throw processError;
    }

    // Return the processed data if available
    if (processData) {
      return publicUrl;
    }
  }

  return publicUrl;
}
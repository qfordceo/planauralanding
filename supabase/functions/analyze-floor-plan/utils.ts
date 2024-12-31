import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function downloadImageFromStorage(imageUrl: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Extract bucket and path from URL
  const storageUrl = new URL(imageUrl);
  const pathParts = storageUrl.pathname.split('/storage/v1/object/public/');
  if (pathParts.length !== 2) {
    throw new Error('Invalid Supabase storage URL format');
  }

  const [bucket, ...pathSegments] = pathParts[1].split('/');
  const path = pathSegments.join('/');

  console.log('Downloading from bucket:', bucket, 'path:', path);

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .download(path);

  if (error) {
    console.error('Storage download error:', error);
    throw new Error(`Failed to download image from Supabase storage: ${error.message}`);
  }

  return data;
}

export async function downloadExternalImage(imageUrl: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Image URL is not accessible');
  }
  return await response.arrayBuffer();
}

export async function analyzeImageWithAzure(imageBuffer: ArrayBuffer) {
  const endpoint = Deno.env.get('AZURE_CV_ENDPOINT');
  const apiKey = Deno.env.get('AZURE_CV_KEY');

  if (!endpoint || !apiKey) {
    throw new Error('Azure CV credentials not configured');
  }

  const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
  const analysisUrl = `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read,objects,tags`;

  const response = await fetch(analysisUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey,
    },
    body: JSON.stringify({ base64Image }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure CV API error (${response.status}): ${errorText}`);
  }

  return await response.json();
}
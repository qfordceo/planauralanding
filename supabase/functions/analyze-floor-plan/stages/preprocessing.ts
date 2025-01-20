import { downloadImageFromStorage, downloadExternalImage } from '../utils';

export async function preprocessImage(imageUrl: string) {
  console.log('Starting image preprocessing:', { imageUrl });
  
  const imageData = imageUrl.startsWith('https://') 
    ? await downloadExternalImage(imageUrl)
    : await downloadImageFromStorage(imageUrl);

  return imageData;
}
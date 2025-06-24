import type { CroppedAreaPixels } from "@/Types/User/Cropper/IcropperArea";


export async function getCroppedImg(imageSrc: string, croppedAreaPixels: CroppedAreaPixels): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'cropped.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
}
// src/utils/cropImage.js

// Hàm hỗ trợ load ảnh từ URL
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Cần thiết để tránh lỗi CORS
    image.src = url;
  });

// Hàm chính: Cắt ảnh và trả về Base64
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Set kích thước canvas bằng kích thước vùng cắt
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Vẽ ảnh lên canvas tại vị trí đã cắt
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Trả về ảnh dạng Base64 (để hiển thị ngay lập tức)
  return canvas.toDataURL("image/png");
}
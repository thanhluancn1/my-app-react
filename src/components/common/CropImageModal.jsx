// src/components/CropImageModal.jsx
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage"; // Import hàm tiện ích

export default function CropImageModal({ isOpen, imageSrc, onCancel, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Khi người dùng dừng thao tác cắt, lưu lại toạ độ pixel
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Xử lý khi bấm Lưu
  const handleSave = async () => {
    try {
      // Gọi hàm tiện ích để lấy ảnh base64 từ toạ độ pixel
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImageBase64);
    } catch (e) {
      console.error("Lỗi khi cắt ảnh:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-border-light flex justify-between items-center flex-shrink-0">
          <h3 className="font-bold text-lg text-text-primary">Chỉnh sửa hình ảnh</h3>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-secondary">
            <img src="https://unpkg.com/lucide-static/icons/x.svg" className="w-6 h-6" alt="Close" />
          </button>
        </div>

        {/* Body chứa Cropper */}
        <div className="relative flex-1 bg-gray-900 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // Tỉ lệ khung hình mặc định (có thể bỏ nếu muốn tự do)
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Footer với thanh trượt Zoom */}
        <div className="p-4 border-t border-border-light flex flex-col gap-4 flex-shrink-0">
          
          {/* Thanh zoom */}
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-text-secondary">Zoom:</span>
             <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 font-medium"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Cắt & Lưu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
// src/components/DeleteStudentModal.jsx
import React from "react";

export default function DeleteStudentModal({ isOpen, onClose, onConfirm }) {
  // Nếu không mở thì không render gì
  if (!isOpen) return null;

  return (
    // Overlay background
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in">
        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Title and Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-inter text-text-primary text-center">
              Xóa học sinh
            </h2>
            <p className="text-base font-inter text-text-primary text-center">
              Bạn có chắc chắn muốn xóa những học sinh đã chọn?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-white border border-border-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-primary font-semibold font-inter">Hủy</span>
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-10 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span className="font-semibold font-inter">Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
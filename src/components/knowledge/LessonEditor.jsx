// src/components/knowledge/LessonEditor.jsx
import { useEffect, useState } from "react";
import KnowledgeUnitList from "./KnowledgeUnitList";

export default function LessonEditor({ lessonData, onChange }) {
  
  if (!lessonData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-text-secondary">
        <img 
          src="https://unpkg.com/lucide-static/icons/book-open.svg" 
          className="w-16 h-16 mb-4 text-gray-300" 
          alt="" 
        />
        <p className="text-lg font-medium">Vui lòng chọn một bài học để chỉnh sửa</p>
      </div>
    );
  }

  // Xử lý thay đổi thông tin cơ bản
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // Xử lý thay đổi units từ component con
  const handleUnitsChange = (newUnits) => {
    onChange('knowledge_units', newUnits);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto pl-4 custom-scrollbar">
      <div className="mx-auto space-y-6">
        
        {/* 1. Thông tin Bài học */}
        <div className="bg-white rounded-xl border border-border-light p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 border-b border-border-light pb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-primary border border-blue-100">
              <img src="https://unpkg.com/lucide-static/icons/file-text.svg" className="w-6 h-6" alt="" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Chỉnh sửa Bài học</h2>
              <p className="text-xs text-text-secondary mt-0.5">ID: {lessonData.lesson_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Tên bài học</label>
              <input
                type="text"
                name="lesson_name" // Khớp với DB
                value={lessonData.lesson_name || ""}
                onChange={handleBasicChange}
                className="w-full p-2.5 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-primary"
                placeholder="Nhập tên bài học..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Mô tả</label>
              <textarea
                name="description"
                rows="3"
                value={lessonData.description || ""}
                onChange={handleBasicChange}
                className="w-full p-2.5 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-sm text-text-primary resize-none"
                placeholder="Nhập mô tả..."
              />
            </div>
          </div>
        </div>

        {/* 2. Danh sách Đơn vị kiến thức */}
        <KnowledgeUnitList 
          units={lessonData.knowledge_units || []}
          onUnitsChange={handleUnitsChange}
        />

      </div>
    </div>
  );
}
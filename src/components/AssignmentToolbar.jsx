// src/components/AssignmentToolbar.jsx
import React from "react";

export default function AssignmentToolbar({ 
  viewSettings, 
  onToggleSetting, 
  onSplitScore, 
  onDownload, 
  onSave 
}) {
  return (
    <div className="flex items-center gap-4 bg-white py-2 px-4 rounded-lg border border-border-light shadow-sm mx-6 my-2">
      
      {/* Breadcrumb rút gọn hoặc Title */}
      <div className="flex-1">
        <span className="font-semibold text-text-primary">Công cụ:</span>
      </div>

      {/* Checkbox Group */}
      <div className="flex items-center gap-4 mr-4 border-r border-border-light pr-4">
        <label className="flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors">
          <input 
            type="checkbox" 
            checked={viewSettings.hideAnswers}
            onChange={(e) => onToggleSetting("hideAnswers", e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">Ẩn đáp án</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors">
          <input 
            type="checkbox" 
            checked={viewSettings.hideSolutions}
            onChange={(e) => onToggleSetting("hideSolutions", e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">Ẩn lời giải</span>
        </label>
      </div>

      {/* Action Buttons */}
      <button 
        onClick={onSplitScore}
        className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
      >
        <img src="https://unpkg.com/lucide-static/icons/divide.svg" className="w-4 h-4" alt="" />
        Chia điểm đều
      </button>

      <button 
        onClick={onDownload}
        className="flex items-center gap-1 px-3 py-2 bg-white border border-border-medium text-text-secondary rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
      >
        <img src="https://unpkg.com/lucide-static/icons/download.svg" className="w-4 h-4" alt="" />
        Tải PDF
      </button>

      <button 
        onClick={onSave}
        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors shadow-sm"
      >
        <img src="https://unpkg.com/lucide-static/icons/save.svg" className="w-4 h-4" alt="" />
        Lưu đề
      </button>
    </div>
  );
}
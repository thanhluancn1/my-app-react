// src/components/AssignmentEditorItem.jsx
import { useLayoutEffect, useRef } from "react";

export default function AssignmentEditorItem({ item, index, onUpdate, onDelete }) {
  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const solutionRef = useRef(null);

  // --- HÀM FIX LỖI RESIZE ---
  const adjustHeight = (element) => {
    if (element) {
      // 1. Reset chiều cao về 0 để trình duyệt tính toán lại scrollHeight chuẩn xác nhất
      element.style.height = "0px"; 
      // 2. Gán chiều cao bằng nội dung thực tế
      element.style.height = element.scrollHeight + "px";
    }
  };

  // Tính toán chiều cao ngay khi render xong (để hiển thị đúng từ đầu)
  useLayoutEffect(() => {
    adjustHeight(questionRef.current);
    adjustHeight(answerRef.current);
    adjustHeight(solutionRef.current);
  }, [item.question, item.answer, item.solution_guide]);

  const handleChange = (field, value) => {
    onUpdate(item.assignment_id, field, value);
  };

  return (
    <div className="rounded-lg border border-border-medium bg-white p-4 mb-4 animate-fade-in">
      {/* --- Toolbar (Giữ nguyên) --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-border-light pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-lg">Câu {index + 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Điểm:</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={item.score}
            onChange={(e) => handleChange("score", parseFloat(e.target.value) || 0)}
            className="w-16 h-9 px-2 border border-border-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium text-center"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={item.type || "Trắc nghiệm"}
            onChange={(e) => handleChange("type", e.target.value)}
            className="h-9 px-2 border border-border-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
          >
            <option value="Trắc nghiệm">Trắc nghiệm</option>
            <option value="Tự luận">Tự luận</option>
          </select>
        </div>

        <button 
          onClick={() => onDelete(item.assignment_id)}
          className="text-red-500 text-sm font-medium hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors ml-auto"
        >
          Xóa
        </button>
      </div>

      {/* --- Các ô nhập liệu (Đã bỏ min-height) --- */}
      <div className="space-y-4">
        {/* Câu hỏi */}
        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nội dung câu hỏi</label>
          <textarea
            ref={questionRef}
            rows={1} // Mặc định 1 dòng
            placeholder="Nhập nội dung câu hỏi..."
            value={item.question || ""}
            onInput={(e) => adjustHeight(e.target)}
            onChange={(e) => handleChange("question", e.target.value)}
            // Đã xóa min-h-[80px], chỉ giữ padding
            className="w-full p-3 border border-border-medium rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden leading-relaxed block"
          />
        </div>

        {/* Đáp án */}
        <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Đáp án</label>
            <textarea
                ref={answerRef}
                rows={1}
                placeholder="Nhập đáp án..."
                value={item.answer || ""}
                onInput={(e) => adjustHeight(e.target)}
                onChange={(e) => handleChange("answer", e.target.value)}
                // Đã xóa min-h-[40px]
                className="w-full p-3 border border-border-medium rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden bg-gray-50 block"
            />
        </div>

        {/* Hướng dẫn giải */}
        <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Hướng dẫn giải</label>
            <textarea
                ref={solutionRef}
                rows={1}
                placeholder="Nhập hướng dẫn giải chi tiết..."
                value={item.solution_guide || ""}
                onInput={(e) => adjustHeight(e.target)}
                onChange={(e) => handleChange("solution_guide", e.target.value)}
                // Đã xóa min-h-[60px]
                className="w-full p-3 border border-border-medium rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden bg-gray-50 block"
            />
        </div>
      </div>
    </div>
  );
}
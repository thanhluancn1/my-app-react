// src/components/assignment-list/AssignmentCard.jsx
import React from "react";

export default function AssignmentCard({ batch }) {
  // 1. Lấy thời gian làm bài trực tiếp từ API (Thay vì tính toán)
  // Sử dụng tên trường 'duration' như đã thêm vào API
  const durationMinutes = batch.duration || 0; 

  // 2. Hàm format hiển thị lịch (vẫn giữ để hiển thị ngày giờ)
  const formatSchedule = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
    const startTime = start.toLocaleTimeString('vi-VN', optionsTime);
    const endTime = end.toLocaleTimeString('vi-VN', optionsTime);
    const day = start.toLocaleDateString('vi-VN', optionsDate);
    
    return `${startTime} - ${endTime} ${day}`;
  };

  const scheduleLabel = formatSchedule(batch.start_date, batch.due_date);

  return (
    <div className="bg-white border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="space-y-4 flex-1">
        {/* Tên bài tập */}
        <div>
          <h3 className="text-lg font-semibold text-text-secondary leading-snug">
            {batch.batch_name}
          </h3>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-3">
          {/* Số câu hỏi */}
          <div className="flex items-center gap-2">
            <img 
              src="https://unpkg.com/lucide-static/icons/help-circle.svg" 
              alt="Questions" 
              className="w-5 h-5 text-gray-600 opacity-60"
            />
            <span className="text-sm font-medium text-text-secondary">
              {batch.total_questions} câu hỏi
            </span>
          </div>

          {/* Thời gian làm bài */}
          <div className="flex items-center gap-2">
            <img 
              src="https://unpkg.com/lucide-static/icons/clock.svg" 
              alt="Duration" 
              className="w-5 h-5 text-gray-600 opacity-60"
            />
            <span className="text-sm font-medium text-text-secondary">
              {durationMinutes} phút
            </span>
          </div>

          {/* Lịch hiển thị */}
          <div className="flex items-center gap-2">
            <img 
              src="https://unpkg.com/lucide-static/icons/calendar.svg" 
              alt="Calendar" 
              className="w-5 h-5 text-gray-600 opacity-60"
            />
            <span className="text-sm font-medium text-text-secondary">
              {scheduleLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
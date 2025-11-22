// src/components/AssignmentCard.jsx
import React from "react";

export default function AssignmentCard({ batch }) {
  // 1. Tính toán thời gian làm bài (phút)
  const startDateObj = new Date(batch.start_date);
  const endDateObj = new Date(batch.due_date);
  const diffMs = endDateObj - startDateObj;
  const durationMinutes = Math.round(diffMs / 60000);

  // 2. Hàm format hiển thị lịch (HH:mm - HH:mm dd/MM/yyyy)
  const formatSchedule = (start, end) => {
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
    const startTime = start.toLocaleTimeString('vi-VN', optionsTime);
    const endTime = end.toLocaleTimeString('vi-VN', optionsTime);
    const day = start.toLocaleDateString('vi-VN', optionsDate);
    
    return `${startTime} - ${endTime} ${day}`;
  };

  const scheduleLabel = formatSchedule(startDateObj, endDateObj);

  return (
    <div className="bg-white border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="space-y-4 flex-1">
        {/* Tên bài tập */}
        <div>
          <h3 className="text-lg font-semibold font-inter text-text-secondary leading-snug">
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
            <span className="text-sm font-medium font-inter text-text-secondary">
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
            <span className="text-sm font-medium font-inter text-text-secondary">
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
            <span className="text-sm font-medium font-inter text-text-secondary">
              {scheduleLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
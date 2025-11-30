// src/components/assignment-list/AssignmentCard.jsx
import React from "react";

export default function AssignmentCard({ batch }) {
  // SỬA: batch.duration -> batch.duration_minutes
  const durationMinutes = batch.duration_minutes || 0;
  
  const targetStudents = batch.target_students || [];
  const status = batch.batch_status || "Bản nháp";

  // ... (Phần logic formatSchedule và getStatusColor giữ nguyên như cũ)
  const formatSchedule = (startStr, endStr) => {
    if (!startStr || !endStr) return "Chưa có lịch";
    const start = new Date(startStr);
    const end = new Date(endStr);
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${start.toLocaleTimeString('vi-VN', optionsTime)} - ${end.toLocaleTimeString('vi-VN', optionsTime)} ${start.toLocaleDateString('vi-VN', optionsDate)}`;
  };
  const scheduleLabel = formatSchedule(batch.start_date, batch.due_date);
  
  const getStatusColor = (st) => {
    switch (st) {
      case "Đang diễn ra": return "bg-green-50 text-green-700 border-green-200";
      case "Đã kết thúc": return "bg-gray-100 text-gray-500 border-gray-200";
      case "Bản nháp": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="bg-white border border-border-light rounded-xl p-5 cursor-pointer h-full flex flex-col hover:shadow-md transition-all duration-200 group">
      <div className="space-y-4 flex-1">
        
        {/* Header */}
        <div className="border-b border-border-light pb-3">
          <h3 className="text-lg font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors" title={batch.batch_name}>
            {batch.batch_name}
          </h3>
        </div>
        
        {/* Body */}
        <div className="space-y-2.5">
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img src="https://unpkg.com/lucide-static/icons/help-circle.svg" alt="Questions" className="w-4 h-4 text-text-secondary opacity-70"/>
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">{batch.total_questions}</span> câu hỏi
                </span>
            </div>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(status)}`}>
                {status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img src="https://unpkg.com/lucide-static/icons/clock.svg" alt="Duration" className="w-4 h-4 text-text-secondary opacity-70"/>
            <span className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">{durationMinutes}</span> phút
            </span>
          </div>

          <div className="flex items-start gap-3">
            <img src="https://unpkg.com/lucide-static/icons/users.svg" alt="Targets" className="w-4 h-4 text-text-secondary opacity-70 mt-0.5"/>
            <span className="text-sm text-text-secondary line-clamp-1" title={targetStudents.join(', ')}>
               {targetStudents.length > 0 ? targetStudents.join(', ') : "Chưa có đối tượng"}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img src="https://unpkg.com/lucide-static/icons/calendar.svg" alt="Calendar" className="w-4 h-4 text-text-secondary opacity-70"/>
            <span className="text-xs text-text-secondary bg-gray-50 px-2 py-1 rounded border border-gray-200">
              {scheduleLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
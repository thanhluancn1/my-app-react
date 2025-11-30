// src/components/schedule/ScheduleTable.jsx
import React from "react";

export default function ScheduleTable({ schedules, onEdit, weekDates }) {
  const totalPeriods = 16;

  // Helper: Kiểm tra ô bị chiếm chỗ
  const isSlotCovered = (dateStr, period) => {
    return schedules.some(
      (s) =>
        s.schedule_date === dateStr && // <--- SỬA: s.date -> s.schedule_date
        s.start_period < period &&
        s.end_period >= period
    );
  };

  // Helper: Lấy lịch bắt đầu
  const getScheduleStartingAt = (dateStr, period) => {
    return schedules.find(
      (s) => s.schedule_date === dateStr && s.start_period === period // <--- SỬA: s.date -> s.schedule_date
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[5%]" />
            {weekDates.map((_, index) => (
              <col key={index} className="w-[13.5%]" />
            ))}
          </colgroup>

          <thead>
            <tr className="bg-gray-50 border-b border-border-light">
              <th className="border-r border-border-light px-1 py-3 text-center text-text-secondary font-semibold bg-gray-100">
                Tiết
              </th>
              {weekDates.map((dayInfo, index) => (
                <th
                  key={index}
                  className="border-r border-border-light px-2 py-3 text-center text-text-primary font-semibold last:border-r-0"
                >
                  <div className="flex flex-col">
                    <span className="uppercase text-xs text-text-secondary mb-1">{dayInfo.dayName}</span>
                    <span className="text-sm font-bold text-primary">{dayInfo.displayDate}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: totalPeriods }, (_, i) => {
              const period = i + 1;
              return (
                <tr key={period} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                  <td className="border-r border-border-light px-1 py-2 text-center text-text-secondary font-medium bg-gray-50">
                    {period}
                  </td>

                  {weekDates.map((dayInfo) => {
                    const dateStr = dayInfo.fullDate; 

                    const scheduleItem = getScheduleStartingAt(dateStr, period);

                    if (scheduleItem) {
                      const rowSpan =
                        scheduleItem.end_period - scheduleItem.start_period + 1;
                      return (
                        <td
                          key={`${dateStr}-${period}`}
                          rowSpan={rowSpan}
                          className="relative rounded-md bg-blue-50 p-1 cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100 align-top"
                          onClick={() => onEdit(scheduleItem)}
                        >
                          <div className="h-full w-full text-blue-900 p-2 text-xs flex flex-col gap-1 border-l-4 border-blue-500 rounded-sm">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-blue-800">{scheduleItem.class_name}</span>
                                <span className="text-[10px] bg-blue-200 px-1 rounded text-blue-800">{scheduleItem.start_period}-{scheduleItem.end_period}</span>
                            </div>
                            <div className="font-bold text-sm text-blue-700 truncate" title={scheduleItem.subject_name}>
                              {scheduleItem.subject_name}
                            </div>
                            <div className="truncate text-text-secondary" title={scheduleItem.lesson_name}>
                              {scheduleItem.lesson_name}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    if (isSlotCovered(dateStr, period)) {
                      return null; 
                    }

                    return (
                      <td
                        key={`${dateStr}-${period}`}
                        className="border-r border-border-light p-2 last:border-r-0"
                      ></td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
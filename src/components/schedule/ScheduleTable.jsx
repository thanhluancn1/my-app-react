// src/components/ScheduleTable.jsx
import React from "react";

export default function ScheduleTable({ schedules, onEdit }) {
  const days = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];
  const totalPeriods = 16; // Tổng số tiết

  // Helper: Kiểm tra xem ô (thứ, tiết) có bị chiếm chỗ bởi lịch học kéo dài từ tiết trước không
  const isSlotCovered = (day, period) => {
    return schedules.some(
      (s) =>
        s.week_day === day &&
        s.start_period < period &&
        s.end_period >= period
    );
  };

  // Helper: Lấy lịch học bắt đầu tại ô (thứ, tiết)
  const getScheduleStartingAt = (day, period) => {
    return schedules.find(
      (s) => s.week_day === day && s.start_period === period
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-sm">
          {/* Định nghĩa độ rộng cột */}
          <colgroup>
            <col className="w-[5%]" /> {/* Cột Tiết */}
            {days.map((_, index) => (
              <col key={index} className="w-[13.5%]" />
            ))}
          </colgroup>

          {/* Header */}
          <thead>
            <tr className="bg-white border-b border-border-light">
              <th className="border-r border-border-light px-1 py-3 text-center text-text-secondary font-medium">
                Tiết
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border-r border-border-light px-2 py-3 text-center text-text-secondary font-medium last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Array.from({ length: totalPeriods }, (_, i) => {
              const period = i + 1;
              return (
                <tr key={period} className="border-b border-border-light">
                  {/* Cột hiển thị số tiết */}
                  <td className="border-r border-border-light px-1 py-2 text-center text-text-primary font-medium bg-gray-50">
                    Tiết {period}
                  </td>

                  {/* Các cột ngày trong tuần */}
                  {days.map((day) => {
                    // 1. Kiểm tra có lịch bắt đầu tại đây không
                    const scheduleItem = getScheduleStartingAt(day, period);

                    if (scheduleItem) {
                      const rowSpan =
                        scheduleItem.end_period - scheduleItem.start_period + 1;
                      return (
                        <td
                          key={`${day}-${period}`}
                          rowSpan={rowSpan}
                          className="relative rounded-md bg-blue-50 p-1 cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500 before:rounded-l-md"
                          onClick={() => onEdit(scheduleItem)}
                        >
                          <div className="h-full w-full text-blue-900 p-2 text-xs flex flex-col gap-1 ">
                            <div>
                              <span className="text-text-secondary">Lớp: </span>
                              <span className="font-bold">{scheduleItem.class_name}</span>
                            </div>
                            <div className="font-bold text-sm text-blue-700">
                              {scheduleItem.subject_name}
                            </div>
                            <div>
                              <span className="text-text-secondary">Bài: </span>
                              <span className="font-medium">{scheduleItem.lesson_name}</span>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // 2. Nếu không có lịch bắt đầu, kiểm tra xem có bị chiếm chỗ (rowspan) không
                    if (isSlotCovered(day, period)) {
                      return null; // Không render ô này để nhường chỗ cho rowSpan
                    }

                    // 3. Nếu trống hoàn toàn -> Render ô rỗng
                    return (
                      <td
                        key={`${day}-${period}`}
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
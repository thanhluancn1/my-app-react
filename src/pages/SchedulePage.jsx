// src/pages/Schedule.jsx
import { useState, useEffect, useMemo } from "react";
import {
  fetchSchedules,
  fetchClasses,
  saveSchedule,
  deleteSchedule,
} from "../api/scheduleApi";
import ScheduleTable from "../components/schedule/ScheduleTable";
import ScheduleModal from "../components/schedule/ScheduleModal";

export default function Schedule() {
  // --- 1. State Management ---
  const [allSchedules, setAllSchedules] = useState([]); // Kho chứa dữ liệu 5 tuần
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý ngày đang xem (mặc định là hôm nay)
  const [currentDate, setCurrentDate] = useState(new Date());

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // --- 2. Helpers: Xử lý ngày tháng ---
  
  // Lấy ngày Thứ 2 của tuần chứa date
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (CN) -> 6 (T7)
    // Nếu là CN (0) thì trừ 6 ngày, ngược lại trừ (day - 1)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Lấy ngày CN của tuần chứa date
  const getEndOfWeek = (date) => {
    const monday = getStartOfWeek(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  };

  // Format date YYYY-MM-DD để so sánh với data API
  const formatDateStr = (date) => {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - (offset*60*1000));
    return d.toISOString().split('T')[0];
  };

  // --- 3. Load Data ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [schedulesData, classesData] = await Promise.all([
          fetchSchedules(),
          fetchClasses(),
        ]);
        setAllSchedules(schedulesData);
        setClasses(classesData);
      } catch (error) {
        console.error("Failed to load schedule data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- 4. Computed Data (Lọc dữ liệu theo tuần) ---
  
  const currentWeekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  const currentWeekEnd = useMemo(() => getEndOfWeek(currentDate), [currentDate]);

  const filteredSchedules = useMemo(() => {
    // Chuẩn hóa chuỗi ngày để so sánh
    const startStr = formatDateStr(currentWeekStart);
    const endStr = formatDateStr(currentWeekEnd);

    return allSchedules.filter((s) => {
      return s.schedule_date >= startStr && s.schedule_date <= endStr;
    });
  }, [allSchedules, currentWeekStart, currentWeekEnd]);

  // --- 5. Handlers ---

  // Điều hướng tuần
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // CRUD Handlers
  const handleAdd = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (scheduleItem) => {
    setEditingSchedule(scheduleItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    const savedItem = await saveSchedule(formData);
    setAllSchedules((prev) => {
      const index = prev.findIndex((s) => s.schedule_id === savedItem.schedule_id);
      if (index !== -1) {
        const newSchedules = [...prev];
        newSchedules[index] = savedItem;
        return newSchedules;
      } else {
        return [...prev, savedItem];
      }
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch dạy này?")) {
      await deleteSchedule(scheduleId);
      setAllSchedules((prev) => prev.filter((s) => s.schedule_id !== scheduleId));
      setIsModalOpen(false);
    }
  };

  // --- 6. Render ---
  if (loading) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  // Format hiển thị khoảng thời gian (Ví dụ: 23/10 - 29/10)
  const weekLabel = `${currentWeekStart.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})} - ${currentWeekEnd.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}`;

  return (
    <div className="p-6 bg-bg-light min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-text-primary font-roboto">
            Quản lý lịch học
            </h1>
            <span className="text-sm text-text-secondary mt-1">Tuần: {weekLabel}</span>
        </div>
        

        {/* Week Navigation */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <button 
                onClick={handlePrevWeek}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-medium bg-white text-primary hover:bg-blue-50 transition text-sm font-medium"
            >
              <span className="text-lg leading-none">&laquo;</span>
              Tuần trước
            </button>
            <button 
                onClick={handleToday}
                className="px-3 py-1.5 text-text-primary font-medium font-inter hover:bg-gray-100 rounded-md transition"
            >
              Tuần này
            </button>
            <button 
                onClick={handleNextWeek}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-medium bg-white text-primary hover:bg-blue-50 transition text-sm font-medium"
            >
              Tuần sau
              <span className="text-lg leading-none">&raquo;</span>
            </button>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <img
            src="https://unpkg.com/lucide-static/icons/plus.svg"
            alt="Add"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm font-inter font-semibold">Thêm lịch học</span>
        </button>
      </header>

      {/* Main Content: Table */}
      <div className="flex-1">
        {/* Truyền danh sách đã lọc xuống bảng */}
        <ScheduleTable schedules={filteredSchedules} onEdit={handleEdit} />
      </div>

      {/* Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
        scheduleData={editingSchedule}
        classesList={classes}
      />
    </div>
  );
}
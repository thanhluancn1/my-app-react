// src/pages/SchedulePage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  fetchSchedules,
  fetchClasses,
  saveSchedule,
  deleteSchedule,
} from "../api/scheduleApi";
import ScheduleTable from "../components/schedule/ScheduleTable";
import ScheduleModal from "../components/schedule/ScheduleModal";
import { useAuth } from "../context/AuthContext"; // Import Auth để lấy user hiện tại

export default function SchedulePage() {
  const { user } = useAuth();

  // --- 1. State Management ---
  const [schedules, setSchedules] = useState([]); // Dữ liệu lịch của tuần hiện tại
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
    // Nếu là CN (0) thì trừ 6 ngày, ngược lại trừ (day - 1) để về Thứ 2
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

  // Tính toán ngày bắt đầu và kết thúc của tuần hiện tại
  const currentWeekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  const currentWeekEnd = useMemo(() => getEndOfWeek(currentDate), [currentDate]);

  // --- 3. Load Data ---

  // Effect 1: Load danh sách lớp (Chạy 1 lần khi mount hoặc khi user thay đổi)
  useEffect(() => {
    const loadClasses = async () => {
      if (user) {
        try {
          const data = await fetchClasses();
          setClasses(data);
        } catch (error) {
          console.error("Lỗi tải danh sách lớp:", error);
        }
      }
    };
    loadClasses();
  }, [user]);

  // Effect 2: Load lịch dạy (Chạy mỗi khi đổi tuần)
  useEffect(() => {
    const loadSchedules = async () => {
      if (user) {
        setLoading(true);
        try {
          // Gọi API với ngày bắt đầu và kết thúc của tuần
          const data = await fetchSchedules(currentWeekStart, currentWeekEnd);
          setSchedules(data);
        } catch (error) {
          console.error("Lỗi tải lịch dạy:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSchedules();
  }, [user, currentWeekStart, currentWeekEnd]); // Dependency: Chạy lại khi user hoặc tuần thay đổi

  const weekDates = useMemo(() => {
    const dates = [];
    const tempDate = new Date(currentWeekStart);
    
    // Tạo mảng 7 ngày từ Thứ 2 đến Chủ Nhật
    for (let i = 0; i < 7; i++) {
      const dayName = i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`;
      
      // Format hiển thị: "30-11"
      const displayDate = tempDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      // Format đầy đủ để so sánh logic: "YYYY-MM-DD"
      // Lưu ý: Cần điều chỉnh múi giờ để tránh lệch ngày khi toISOString
      const offset = tempDate.getTimezoneOffset();
      const d = new Date(tempDate.getTime() - (offset*60*1000));
      const fullDate = d.toISOString().split('T')[0];

      dates.push({
        dayName,
        displayDate,
        fullDate
      });

      // Tăng thêm 1 ngày
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return dates;
  }, [currentWeekStart]);

  // --- 4. Handlers ---

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
    try {
      const savedItem = await saveSchedule(formData);
      
      setSchedules((prev) => {
        const index = prev.findIndex((s) => s.schedule_id === savedItem.schedule_id);
        if (index !== -1) {
          const newSchedules = [...prev];
          newSchedules[index] = savedItem;
          return newSchedules;
        } else {
          // THAY ĐỔI Ở ĐÂY: savedItem.date -> savedItem.schedule_date
          const scheduleDate = new Date(savedItem.schedule_date);
          if (scheduleDate >= currentWeekStart && scheduleDate <= currentWeekEnd) {
             return [...prev, savedItem];
          }
          return prev;
        }
      });
      
      setIsModalOpen(false);
      alert("Lưu lịch thành công!");

    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch dạy này?")) {
      try {
        await deleteSchedule(scheduleId);
        setSchedules((prev) => prev.filter((s) => s.schedule_id !== scheduleId));
        setIsModalOpen(false);
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  // --- 5. Render ---
  
  // Format hiển thị khoảng thời gian (Ví dụ: 23/10 - 29/10)
  const weekLabel = `${currentWeekStart.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})} - ${currentWeekEnd.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}`;

  return (
    <div className="p-2 bg-bg-light min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-text-primary">
            Quản lý lịch dạy
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-medium bg-white text-primary hover:bg-blue-50 transition text-sm font-medium"
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
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <img
            src="https://unpkg.com/lucide-static/icons/plus.svg"
            alt="Add"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm font-semibold">Thêm lịch học</span>
        </button>
      </header>

      {/* Main Content: Table */}
      <div className="flex-1 relative min-h-[400px]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
              </svg>
           </div>
        ) : null}
        
        {/* Truyền trực tiếp schedules (đã lọc theo tuần từ API) xuống bảng */}
        <ScheduleTable schedules={schedules} onEdit={handleEdit} weekDates={weekDates}/>
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
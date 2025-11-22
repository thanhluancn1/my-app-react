// src/components/ScheduleModal.jsx
import { useState, useEffect, useRef } from "react";

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  scheduleData,
  classesList = [],
}) {
  // State khởi tạo
  const initialFormState = {
    class_id: "",
    subject_name: "",
    lesson_name: "",
    lesson_id: "",
    schedule_date: "",
    start_period: "",
    end_period: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentClassLessons, setCurrentClassLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);

  const suggestionsRef = useRef(null);

  // --- Helper: Tính thứ trong tuần từ ngày (VN) ---
  const getWeekDay = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return days[date.getDay()];
  };

  // 1. Load dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (scheduleData) {
        // --- SỬA ---
        setFormData({
          schedule_id: scheduleData.schedule_id,
          class_id: scheduleData.class_id,
          subject_name: scheduleData.subject_name || "",
          lesson_name: scheduleData.lesson_name || "",
          lesson_id: scheduleData.lesson_id || "",
          schedule_date: scheduleData.schedule_date || "",
          start_period: scheduleData.start_period || "",
          end_period: scheduleData.end_period || "",
        });

        // Load bài học của lớp đó
        const currentClass = classesList.find(
          (c) => c.class_id === parseInt(scheduleData.class_id)
        );
        if (currentClass) {
          setCurrentClassLessons(currentClass.lessons || []);
        }
      } else {
        // --- THÊM MỚI ---
        setFormData(initialFormState);
        setCurrentClassLessons([]);
      }
      setShowSuggestions(false);
    }
  }, [isOpen, scheduleData, classesList]);

  // 2. Xử lý đổi lớp
  const handleClassChange = (e) => {
    const newClassId = e.target.value;
    const selectedClass = classesList.find(
      (c) => c.class_id === parseInt(newClassId)
    );

    setFormData((prev) => ({
      ...prev,
      class_id: newClassId,
      subject_name: selectedClass ? selectedClass.subject_name : "",
      lesson_name: "", // Reset bài học
      lesson_id: "",
    }));

    setCurrentClassLessons(selectedClass ? selectedClass.lessons : []);
  };

  // 3. Click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Xử lý input thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Xử lý tìm kiếm bài học
  const handleLessonInputChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      lesson_name: value,
      lesson_id: "",
    }));

    if (value.trim()) {
      const filtered = currentClassLessons.filter((l) =>
        l.lesson_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLessons(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectLesson = (lesson) => {
    setFormData((prev) => ({
      ...prev,
      lesson_name: lesson.lesson_name,
      lesson_id: lesson.lesson_id,
    }));
    setShowSuggestions(false);
  };

  // 6. LƯU DỮ LIỆU (Quan trọng: Xử lý logic ở đây)
  const handleSave = () => {
    // Validate
    if (!formData.class_id || !formData.schedule_date || !formData.start_period || !formData.end_period) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Chuẩn bị dữ liệu chuẩn để gửi đi
    const dataToSave = {
      ...formData,
      // Ép kiểu số (Fix lỗi String vs Number)
      class_id: parseInt(formData.class_id),
      lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : null,
      start_period: parseInt(formData.start_period),
      end_period: parseInt(formData.end_period),
      // Tính toán Thứ trong tuần (Fix lỗi hiển thị cột)
      week_day: getWeekDay(formData.schedule_date),
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-2xl font-medium font-roboto text-text-primary">
            {scheduleData ? "Chỉnh sửa lịch dạy" : "Thêm lịch dạy"}
          </h2>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
            <img src="https://unpkg.com/lucide-static/icons/x.svg" alt="Close" className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Lớp học */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">Chọn lớp học</label>
            <div className="relative">
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleClassChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white"
              >
                <option value="">-- Chọn lớp --</option>
                {classesList.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              <img src="https://unpkg.com/lucide-static/icons/chevron-down.svg" alt="Arrow" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Môn học */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">Môn học</label>
            <input
              type="text"
              value={formData.subject_name}
              readOnly
              className="w-full h-12 px-4 border border-border-medium rounded-lg bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Bài học (Autocomplete) */}
          <div className="space-y-2 relative" ref={suggestionsRef}>
            <label className="text-sm font-medium text-gray-600 font-manrope">Bài học</label>
            <input
              type="text"
              name="lesson_name"
              value={formData.lesson_name}
              onChange={handleLessonInputChange}
              disabled={!formData.class_id}
              className={`w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary ${!formData.class_id ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder={formData.class_id ? "Nhập để tìm bài học" : "Vui lòng chọn lớp trước"}
              autoComplete="off"
            />
            {showSuggestions && filteredLessons.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-border-medium rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {filteredLessons.map((lesson) => (
                  <li key={lesson.lesson_id} onClick={() => handleSelectLesson(lesson)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-text-primary">
                    {lesson.lesson_name}
                  </li>
                ))}
              </ul>
            )}
             {/* Thông báo không tìm thấy */}
             {showSuggestions && filteredLessons.length === 0 && formData.lesson_name && (
                <div className="absolute z-10 w-full bg-white border border-border-medium rounded-lg mt-1 p-2 text-sm text-gray-500 shadow-lg text-center">
                    Không tìm thấy bài học phù hợp trong lớp này
                </div>
            )}
          </div>

          {/* Ngày dạy */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">Ngày dạy</label>
            <div className="relative">
              <input
                name="schedule_date"
                value={formData.schedule_date}
                onChange={handleChange}
                type="date"
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img src="https://unpkg.com/lucide-static/icons/calendar.svg" alt="Calendar" className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Tiết */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 font-manrope">Tiết bắt đầu</label>
              <input name="start_period" value={formData.start_period} onChange={handleChange} type="number" min="1" max="16" className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 font-manrope">Tiết kết thúc</label>
              <input name="end_period" value={formData.end_period} onChange={handleChange} type="number" min="1" max="16" className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light flex justify-between gap-4">
          {scheduleData ? (
            <button onClick={() => onDelete(scheduleData.schedule_id)} className="w-1/2 h-12 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold font-inter">Xóa</button>
          ) : (
            <button onClick={onClose} className="w-1/2 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold font-inter">Hủy</button>
          )}
          <button onClick={handleSave} className="w-1/2 h-12 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold font-inter">Lưu</button>
        </div>
      </div>
    </div>
  );
}
// src/components/StudentModal.jsx
import { useState, useEffect } from "react";

export default function StudentModal({ isOpen, onClose, onSave, studentData, classId }) {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    status: "active",
  });

  // Điền dữ liệu vào form khi mở modal (hoặc khi studentData thay đổi)
  useEffect(() => {
    if (studentData) {
      // Chế độ Sửa
      setFormData({
        full_name: studentData.full_name || "",
        date_of_birth: studentData.date_of_birth || "",
        email: studentData.email || "",
        phone_number: studentData.phone_number || "",
        status: studentData.status || "active",
        student_id: studentData.student_id, // Giữ ID để biết là update
      });
    } else {
      // Chế độ Thêm mới -> Reset form
      setFormData({
        full_name: "",
        date_of_birth: "",
        email: "",
        phone_number: "",
        status: "active",
      });
    }
  }, [studentData, isOpen]);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý lưu
  const handleSave = () => {
    // Gửi dữ liệu ra ngoài, kèm theo classId đang chọn
    onSave({ ...formData, class_id: classId });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-2xl font-medium font-roboto text-text-primary">
            {studentData ? "Sửa thông tin học sinh" : "Thêm học sinh"}
          </h2>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img
              src="https://unpkg.com/lucide-static/icons/x.svg"
              alt="Close"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Họ tên */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">
              Họ và tên
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              type="text"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Ngày sinh (Giữ nguyên style custom date picker của bạn) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">
              Ngày sinh
            </label>
            <div className="relative">
              <input
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                type="date"
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                placeholder="Nhập ngày sinh"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img
                  src="https://unpkg.com/lucide-static/icons/calendar.svg"
                  alt="Calendar"
                  className="w-6 h-6 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập email"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">
              Số điện thoại
            </label>
            <input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              type="tel"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 font-manrope">
              Trạng thái
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <img
                src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
                alt="Arrow"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light">
          <button
            onClick={handleSave}
            className="w-full h-12 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold font-inter"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
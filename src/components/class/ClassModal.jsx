// src/components/class/ClassModal.jsx
import { useState, useEffect } from "react";

export default function ClassModal({ isOpen, onClose, onSave, classData }) {
  // State cho các trường input
  const [formData, setFormData] = useState({
    class_name: "",
    school_name: "",
    subject_name: "Toán",
    grade_level: "10", // <--- Thêm trường grade_level, mặc định khối 10
    start_year: "",
    end_year: "",
    class_status: "Hoạt động",
  });

  // useEffect: Theo dõi sự thay đổi của classData
  useEffect(() => {
    if (classData) {
      setFormData({
        class_name: classData.class_name || "",
        school_name: classData.school_name || "",
        subject_name: classData.subject_name || "Toán",
        grade_level: classData.grade_level || "10", // <--- Load grade_level từ data cũ
        start_year: classData.start_year || "",
        end_year: classData.end_year || "",
        class_status: classData.class_status || "Hoạt động",
        class_id: classData.class_id, // Quan trọng: Giữ lại ID
      });
    } else {
      // Reset form khi tạo mới
      setFormData({
        class_name: "",
        school_name: "",
        subject_name: "Toán",
        grade_level: "10",
        start_year: "",
        end_year: "",
        class_status: "Hoạt động",
      });
    }
  }, [classData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Đảm bảo grade_level là số nguyên khi gửi đi (nếu backend yêu cầu int)
    const dataToSend = {
        ...formData,
        grade_level: parseInt(formData.grade_level)
    };
    onSave(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-md relative animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-2xl font-medium text-text-primary">
            {classData ? "Sửa thông tin lớp học" : "Thêm lớp học"}
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
          
          {/* Tên trường */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Tên trường
            </label>
            <input
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              type="text"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập tên trường"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tên lớp */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                Tên lớp
                </label>
                <input
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                type="text"
                className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="VD: 10A1"
                />
            </div>

            {/* Khối lớp (MỚI) */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                Khối
                </label>
                <div className="relative">
                    <select
                        name="grade_level"
                        value={formData.grade_level}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pr-10 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white cursor-pointer"
                    >
                        <option value="6">Khối 6</option>
                        <option value="7">Khối 7</option>
                        <option value="8">Khối 8</option>
                        <option value="9">Khối 9</option>
                        <option value="10">Khối 10</option>
                        <option value="11">Khối 11</option>
                        <option value="12">Khối 12</option>
                    </select>
                    <img
                        src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
                        alt="Arrow"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                    />
                </div>
            </div>
          </div>

          {/* Môn học */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Môn Học
            </label>
            <div className="relative">
              <select
                name="subject_name"
                value={formData.subject_name}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white cursor-pointer"
              >
                <option value="Toán">Toán</option>
                <option value="Lý">Lý</option>
                <option value="Hóa">Hóa</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Sinh">Sinh</option>
              </select>
              <img
                src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
                alt="Arrow"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Năm bắt đầu */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                Năm bắt đầu
                </label>
                <input
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
                type="number"
                className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="VD: 2024"
                />
            </div>

            {/* Năm kết thúc */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                Năm kết thúc
                </label>
                <input
                name="end_year"
                value={formData.end_year}
                onChange={handleChange}
                type="number"
                className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="VD: 2025"
                />
            </div>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Trạng thái
            </label>
            <div className="relative">
              <select
                name="class_status"
                value={formData.class_status}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white cursor-pointer"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Không hoạt động">Không hoạt động</option>
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
            className="w-full h-12 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
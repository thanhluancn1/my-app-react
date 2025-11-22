// src/components/ClassModal.jsx
import { useState, useEffect } from "react";

export default function ClassModal({ isOpen, onClose, onSave, classData }) {
  // State cho các trường input
  const [formData, setFormData] = useState({
    class_name: "",
    school_name: "",
    subject_name: "Toán", // Giá trị mặc định
    start_year: "",
    end_year: "",
    class_status: "Hoạt động", // Giá trị mặc định
  });

  // useEffect: Theo dõi sự thay đổi của classData
  // Nếu có classData (chế độ Sửa) -> điền vào form
  // Nếu không (chế độ Thêm) -> reset form
  useEffect(() => {
    if (classData) {
      setFormData({
        class_name: classData.class_name || "",
        school_name: classData.school_name || "",
        subject_name: classData.subject_name || "Toán",
        start_year: classData.start_year || "",
        end_year: classData.end_year || "",
        class_status: classData.class_status || "Hoạt động",
        class_id: classData.class_id, // Giữ lại ID để biết là đang update
      });
    } else {
      setFormData({
        class_name: "",
        school_name: "",
        subject_name: "Toán",
        start_year: "",
        end_year: "",
        class_status: "Hoạt động",
      });
    }
  }, [classData, isOpen]); // Chạy lại khi mở modal hoặc đổi data

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi bấm Lưu
  const handleSave = () => {
    onSave(formData);
  };

  // Nếu isOpen = false thì không render gì cả
  if (!isOpen) return null;

  return (
    // Overlay background (click ra ngoài để đóng)
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in">
        {/* Modal Header */}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Tên lớp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Tên lớp
            </label>
            <input
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              type="text"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập tên lớp"
            />
          </div>

          {/* Tên trường */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
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

          {/* Môn học */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Môn Học
            </label>
            <div className="relative">
              <select
                name="subject_name"
                value={formData.subject_name}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white"
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

          {/* Năm bắt đầu */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Năm bắt đầu
            </label>
            <input
              name="start_year"
              value={formData.start_year}
              onChange={handleChange}
              type="number"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập năm bắt đầu"
            />
          </div>

          {/* Năm kết thúc */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Năm kết thúc
            </label>
            <input
              name="end_year"
              value={formData.end_year}
              onChange={handleChange}
              type="number"
              className="w-full h-12 px-4 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              placeholder="Nhập năm kết thúc"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Trạng thái
            </label>
            <div className="relative">
              <select
                name="class_status"
                value={formData.class_status}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none bg-white"
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

        {/* Modal Footer */}
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
// src/pages/ClassManagement.jsx
import { useState, useEffect } from "react";
import { fetchClasses, saveClass } from "../api/classApi";
import ClassModal from "../components/ClassModal";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null); // Dữ liệu lớp đang sửa (null nếu là thêm mới)

  // Load dữ liệu khi vào trang
  useEffect(() => {
    const loadData = async () => {
      // Truyền dummy userId vì đang dùng mock API
      const data = await fetchClasses(1);
      setClasses(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Xử lý khi bấm nút "Thêm lớp học"
  const handleAddNew = () => {
    setCurrentClass(null); // Reset form
    setIsModalOpen(true);
  };

  // Xử lý khi bấm nút "Sửa" (icon bút chì)
  const handleEdit = (classItem) => {
    setCurrentClass(classItem); // Điền data vào form
    setIsModalOpen(true);
  };

  // Xử lý khi đóng Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý khi bấm Lưu ở Modal
  const handleSaveModal = async (formData) => {
    // Gọi API lưu (mock)
    const savedClass = await saveClass(formData);

    // Cập nhật State danh sách lớp học
    setClasses((prevClasses) => {
      // Kiểm tra xem là update (đã có ID) hay create (ID mới)
      const exists = prevClasses.find((c) => c.class_id === savedClass.class_id);
      
      if (exists) {
        // Nếu ID đã tồn tại -> Thay thế item cũ bằng item mới
        return prevClasses.map((c) =>
          c.class_id === savedClass.class_id ? savedClass : c
        );
      } else {
        // Nếu ID chưa tồn tại -> Thêm vào cuối danh sách
        return [...prevClasses, savedClass];
      }
    });

    // Đóng modal
    handleCloseModal();
  };

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      {/* Title Section */}
      <h1 className="text-2xl font-medium font-roboto text-text-primary mb-8">
        Quản lý lớp học
      </h1>

      {/* Action Container */}
      <div className="space-y-4">
        {/* Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium font-roboto text-text-primary mb-4 sm:mb-0">
            Danh sách lớp
          </h2>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <img
                src="https://unpkg.com/lucide-static/icons/plus.svg"
                alt="Add"
                className="w-6 h-6 mr-2 text-white"
              />
              <span className="text-sm font-inter">Thêm lớp học</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-white border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Tên lớp
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Tên trường
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Môn học
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Năm bắt đầu
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Năm kết thúc
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">
                    Sửa
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  classes.map((classItem, index) => (
                    <tr
                      key={classItem.class_id}
                      className="border-b border-border-light hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {index + 1}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {classItem.class_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {classItem.school_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {classItem.subject_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {classItem.start_year}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">
                        {classItem.end_year}
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium font-inter ${
                            classItem.class_status === "active"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          {classItem.class_status === "active"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="flex items-center justify-center w-10 h-10 bg-white border border-border-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src="https://unpkg.com/lucide-static/icons/pencil.svg"
                            alt="Edit"
                            className="w-5 h-5 text-gray-600"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        classData={currentClass}
      />
    </div>
  );
}
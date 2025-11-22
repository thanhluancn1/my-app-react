// src/pages/ClassPage.jsx
import { useState, useEffect } from "react";
import { fetchSchoolData, saveClass } from "../api/schoolApi";
import ClassModal from "../components/class/ClassModal";

export default function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  // ... (Giữ nguyên phần logic load data và handlers) ...
  
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchSchoolData();
      setClasses(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddNew = () => {
    setCurrentClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = async (formData) => {
    const savedClass = await saveClass(formData);
    setClasses((prevClasses) => {
      const exists = prevClasses.find((c) => c.class_id === savedClass.class_id);
      if (exists) {
        return prevClasses.map((c) =>
          c.class_id === savedClass.class_id ? savedClass : c
        );
      } else {
        return [...prevClasses, savedClass];
      }
    });
    handleCloseModal();
  };

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      <h1 className="text-2xl font-medium text-text-primary mb-8">
        Quản lý lớp học
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-text-primary mb-4 sm:mb-0">
            Danh sách lớp
          </h2>

          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <img
                src="https://unpkg.com/lucide-static/icons/plus.svg"
                alt="Add"
                className="w-6 h-6 mr-2"
                style={{ filter: "invert(1)" }}
              />
              <span className="text-sm">Thêm lớp học</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">STT</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Tên lớp</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Tên trường</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Môn học</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Sĩ số</th> 
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Năm bắt đầu</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Năm kết thúc</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Sửa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-text-secondary">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  classes.map((classItem, index) => (
                    <tr
                      key={classItem.class_id}
                      className="border-b border-border-light hover:bg-gray-50 transition-colors"
                    >
                      {/* ĐÃ SỬA: text-base -> text-sm */}
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {index + 1}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.class_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.school_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.subject_name}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.students ? classItem.students.length : 0}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.start_year}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.end_year}
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-full text-xs ${
                            classItem.class_status === "Hoạt động"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          {classItem.class_status}
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
                            className="w-5 h-5 text-text-secondary"
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

      <ClassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        classData={currentClass}
      />
    </div>
  );
}
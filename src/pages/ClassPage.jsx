// src/pages/ClassPage.jsx
import { useState, useEffect } from "react";
import { fetchSchoolData, saveClass } from "../api/schoolApi";
import ClassModal from "../components/class/ClassModal";
import { useAuth } from "../context/AuthContext"; 

export default function ClassPage() {
  const { user } = useAuth(); 
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (user) { 
        setLoading(true);
        try {
          const data = await fetchSchoolData(); 
          setClasses(data);
        } catch (error) {
          console.error("Lỗi load lớp:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]); 

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
    try {
      const savedClass = await saveClass(formData);
      setClasses((prevClasses) => {
        // Sử dụng class_id để so sánh
        const exists = prevClasses.find((c) => c.class_id === savedClass.class_id);
        if (exists) {
          return prevClasses.map((c) =>
            c.class_id === savedClass.class_id 
              ? { ...savedClass, students: c.students } 
              : c
          );
        } else {
          return [savedClass, ...prevClasses];
        }
      });
      handleCloseModal();
    } catch (error) {
      alert("Lỗi khi lưu lớp học: " + error.message);
    }
  };

  return (
    <div className="p-2 bg-bg-light min-h-screen">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-medium text-text-primary mb-4 sm:mb-0">
            Danh sách lớp học
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

        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">STT</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Tên lớp</th>
                  {/* CỘT MỚI */}
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Khối</th> 
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Tên trường</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Môn học</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Sĩ số</th> 
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Năm học</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Sửa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center p-6 text-text-secondary">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-6 text-text-secondary italic">
                      Chưa có lớp học nào. Hãy tạo lớp mới!
                    </td>
                  </tr>
                ) : (
                  classes.map((classItem, index) => (
                    <tr
                      key={classItem.class_id} // Sử dụng class_id làm key
                      className="border-b border-border-light hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {index + 1}
                      </td>
                      <td className="px-6 py-2 text-text-primary text-sm font-medium">
                        {classItem.class_name}
                      </td>
                      {/* Hiển thị Khối */}
                      <td className="px-6 py-2 text-text-primary text-sm">
                        {classItem.grade_level ? `Khối ${classItem.grade_level}` : '-'}
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
                        {classItem.start_year} - {classItem.end_year}
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
// src/pages/StudentPage.jsx
import { useState, useEffect, useMemo } from "react";
import { fetchSchoolData, saveStudent } from "../api/schoolApi"; // <--- IMPORT TỪ API MỚI
import StudentModal from "../components/student/StudentModal";

export default function StudentPage() {
  // --- 1. State Management ---
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState(""); 
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // --- 2. Load Data (Dùng API Hợp nhất) ---
  useEffect(() => {
    const loadData = async () => {
      // Gọi 1 API duy nhất lấy cả Lớp và Học sinh
      const data = await fetchSchoolData();
      setClasses(data);
      
      // Mặc định chọn lớp đầu tiên
      if (data.length > 0) {
        setSelectedClassId(data[0].class_id);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // --- 3. Computed Data (Lọc học sinh từ dữ liệu Local) ---
  const filteredStudents = useMemo(() => {
    if (!selectedClassId) return [];
    const currentClass = classes.find(c => c.class_id === parseInt(selectedClassId));
    // Trả về mảng students có sẵn trong object Class
    return currentClass ? currentClass.students : [];
  }, [classes, selectedClassId]);

  // --- 4. Handlers ---

  const handleClassChange = (e) => {
    setSelectedClassId(parseInt(e.target.value));
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsAddModalOpen(true);
  };

  // Lưu Học sinh (Gọi API mới)
  const handleSaveStudent = async (studentData) => {
    try {
      // 1. Gọi API lưu xuống "Server"
      const savedStudent = await saveStudent(studentData);
      
      // 2. Cập nhật UI (Local State)
      setClasses(prevClasses => {
        // Copy mảng classes để đảm bảo tính bất biến
        const newClasses = prevClasses.map(cls => ({
           ...cls, 
           students: [...cls.students] // Copy cả mảng students con
        }));

        // Tìm lớp tương ứng
        const classIndex = newClasses.findIndex(c => c.class_id === parseInt(selectedClassId));
        
        if (classIndex > -1) {
          const targetClass = newClasses[classIndex];
          
          if (studentData.student_id) {
            // --- UPDATE ---
            const studentIndex = targetClass.students.findIndex(s => s.student_id === savedStudent.student_id);
            if (studentIndex > -1) {
              targetClass.students[studentIndex] = savedStudent;
            }
          } else {
            // --- CREATE ---
            targetClass.students.push(savedStudent);
          }
        }
        return newClasses;
      });

      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu học sinh:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (loading) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-medium text-text-primary mb-8">Quản lý học sinh</h1>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-border-light p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
          <label className="text-text-secondary text-base mb-2 lg:mb-0 lg:w-32">Lớp học</label>
          <div className="flex-1">
            <div className="relative">
              <select 
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full h-12 px-4 pr-10 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {classes.map(cls => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} ({cls.school_name})
                  </option>
                ))}
              </select>
              <img src="https://unpkg.com/lucide-static/icons/chevron-down.svg" alt="Arrow" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-text-primary mb-4 sm:mb-0">Danh sách học sinh</h2>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <img src="https://unpkg.com/lucide-static/icons/plus.svg" alt="Add" className="w-5 h-5 mr-2" style={{ filter: "invert(1)" }} />
              <span className="text-sm">Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">STT</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Họ và tên</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Ngày sinh</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm">Sửa</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredStudents.length === 0 ? (
                   <tr><td colSpan="7" className="text-center p-8 text-text-muted italic">Không có học sinh nào trong lớp này.</td></tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.student_id} className="border-b border-border-light hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-text-primary text-base font-medium">{index + 1}</td>
                      <td className="px-6 py-3 text-text-primary text-base font-medium">{student.full_name}</td>
                      <td className="px-6 py-3 text-text-primary text-base font-medium">{student.date_of_birth}</td>
                      <td className="px-6 py-3 text-text-primary text-base font-medium">{student.email}</td>
                      <td className="px-6 py-3 text-text-primary text-base font-medium">{student.phone_number}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${student.status === 'Hoạt động' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                            {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button 
                          onClick={() => handleEdit(student)}
                          className="flex items-center justify-center w-9 h-9 bg-white border border-border-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src="https://unpkg.com/lucide-static/icons/pencil.svg" alt="Edit" className="w-4 h-4 text-gray-600" />
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

      <StudentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStudent}
        studentData={editingStudent}
        classId={selectedClassId}
      />
    </div>
  );
}
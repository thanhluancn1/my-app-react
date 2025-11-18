// src/pages/Student.jsx
import { useState, useEffect, useMemo } from "react";
import { fetchClasses, saveStudent } from "../api/studentApi";
import StudentModal from "../components/StudentModal";

export default function Student() {
  // --- 1. State Management ---
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState(""); // ID lớp đang chọn
  
  // State cho Modal Thêm/Sửa
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Học sinh đang sửa (null = thêm mới)

  // --- 2. Load Data ---
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchClasses();
      setClasses(data);
      
      // Mặc định chọn lớp đầu tiên nếu có dữ liệu
      if (data.length > 0) {
        setSelectedClassId(data[0].class_id);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // --- 3. Computed Data (Lọc học sinh theo lớp đang chọn) ---
  const filteredStudents = useMemo(() => {
    if (!selectedClassId) return [];
    const currentClass = classes.find(c => c.class_id == selectedClassId);
    return currentClass ? currentClass.students : [];
  }, [classes, selectedClassId]);

  // --- 4. Handlers (Xử lý sự kiện) ---

  // Đổi lớp trong dropdown
  const handleClassChange = (e) => {
    setSelectedClassId(parseInt(e.target.value));
  };

  // Mở Modal Thêm
  const handleAdd = () => {
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  // Mở Modal Sửa
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsAddModalOpen(true);
  };

  // Lưu Học sinh (Thêm/Sửa)
  const handleSaveStudent = async (studentData) => {
    // Gọi API
    const savedStudent = await saveStudent(studentData);
    
    // Cập nhật UI Client-side
    setClasses(prevClasses => {
      const newClasses = [...prevClasses];
      const classIndex = newClasses.findIndex(c => c.class_id == selectedClassId);
      
      if (classIndex > -1) {
        const students = newClasses[classIndex].students;
        
        if (studentData.student_id) {
          // Update
          const studentIndex = students.findIndex(s => s.student_id === studentData.student_id);
          if (studentIndex > -1) {
            students[studentIndex] = savedStudent;
          }
        } else {
          // Create
          students.push(savedStudent);
        }
      }
      return newClasses;
    });

    setIsAddModalOpen(false);
  };

  // --- 5. Render ---
  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-medium font-roboto text-text-primary mb-8">Quản lý học sinh</h1>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-border-light p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
          <label className="text-text-secondary text-base font-inter mb-2 lg:mb-0 lg:w-32">Lớp học</label>
          <div className="flex-1">
            <div className="relative">
              <select 
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full h-12 px-4 pr-10 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
          <h2 className="text-lg font-medium font-roboto text-text-primary mb-4 sm:mb-0">Danh sách học sinh</h2>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <img src="https://unpkg.com/lucide-static/icons/plus.svg" alt="Add" className="w-6 h-6 mr-2" />
              <span className="text-sm font-inter">Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">STT</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Họ và tên</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Ngày sinh</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Email</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-text-secondary text-sm font-inter">Sửa</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredStudents.length === 0 ? (
                   <tr><td colSpan="7" className="text-center p-6 text-gray-500">Không có học sinh nào trong lớp này.</td></tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.student_id} className="border-b border-border-light hover:bg-gray-50">
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">{index + 1}</td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">{student.full_name}</td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">{student.date_of_birth}</td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">{student.email}</td>
                      <td className="px-6 py-2 text-text-primary text-base font-medium font-inter">{student.phone_number}</td>
                      <td className="px-6 py-2">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium font-inter ${student.status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                            {student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <button 
                          onClick={() => handleEdit(student)}
                          className="flex items-center justify-center w-10 h-10 bg-white border border-border-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img src="https://unpkg.com/lucide-static/icons/pencil.svg" alt="Edit" className="w-6 h-6 text-gray-600" />
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

      {/* Modal (Chỉ còn modal Thêm/Sửa) */}
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
// src/pages/AssignmentManagementPage.jsx
import { useState, useEffect } from "react";
import { fetchClassExams } from "../api/examApi";
import ClassAssignmentGroup from "../components/assignment-list/ClassAssignmentGroup";

export default function AssignmentManagementPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClassExams();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi tải danh sách bài tập:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-medium text-text-primary leading-8">
          Quản lý bài tập
        </h1>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <img src="https://unpkg.com/lucide-static/icons/plus.svg" alt="add" className="w-5 h-5" />
            <span className="text-sm font-medium">Thêm bài tập</span>
          </button>
          
          <button className="flex items-center justify-center w-10 h-10 bg-white border border-border-light rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <img src="https://unpkg.com/lucide-static/icons/trash-2.svg" alt="delete" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* --- Danh sách các lớp --- */}
      <div className="flex flex-col gap-6">
        {classes.length === 0 ? (
            <p className="text-center text-text-secondary italic">Chưa có lớp học nào.</p>
        ) : (
            classes.map((cls) => (
                <ClassAssignmentGroup key={cls.class_id} classData={cls} />
            ))
        )}
      </div>

    </div>
  );
}
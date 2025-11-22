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
    <div className="p-2 bg-bg-light min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-medium text-text-primary leading-8">
          Quản lý bài tập
        </h1>
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
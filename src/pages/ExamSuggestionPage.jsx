// src/pages/ExamSuggestionPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExamSuggestions } from "../api/examApi";
import LessonCard from "../components/exam-suggestion/LessonCard";

export default function ExamSuggestionPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Gọi API lấy dữ liệu khi trang vừa load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchExamSuggestions();
        setLessons(data);
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Xử lý sự kiện khi click vào card gợi ý (chuyển sang trang chi tiết bài tập)
  const handleCardClick = (batchId) => {
    console.log("Navigate to batch:", batchId);
    navigate(`/assignment-detail/${batchId}`);
  };

  // 3. Xử lý click nút "Tạo đề từ ma trận" -> Chuyển sang trang CreateExam
  const handleCreateMatrix = () => {
    navigate('/exam'); // Điều hướng đến route /exam đã định nghĩa trong App.jsx
  };

  if (loading) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="p-2 flex flex-col gap-6 items-start relative w-full bg-bg-light min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between relative w-full gap-4">
        {/* Title */}
        <div className="flex gap-2 items-center">
          <h1 className="font-medium text-2xl text-text-primary whitespace-nowrap">
            Gợi ý đề thi
          </h1>
        </div>

        {/* Buttons Group */}
        <div className="flex gap-3 items-center justify-end">
          {/* Nút "Tạo đề từ ma trận" đã được thêm sự kiện onClick */}
          <button 
            onClick={handleCreateMatrix}
            className="bg-primary flex gap-1 items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="font-normal text-base text-white whitespace-nowrap">
              Tạo đề từ ma trận
            </span>
          </button>
          
          <button className="bg-white border border-border-medium flex gap-2 h-10 items-center justify-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span className="font-normal text-primary text-base whitespace-nowrap">
              Tải lên đề có sẵn
            </span>
          </button>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="flex flex-col gap-4 items-start relative w-full">
        {lessons.length === 0 ? (
             <p className="text-text-secondary italic">Không có dữ liệu gợi ý nào.</p>
        ) : (
            lessons.map(lesson => (
                <LessonCard 
                    key={lesson.lesson_id} 
                    lesson={lesson} 
                    onCardClick={handleCardClick} 
                />
            ))
        )}
      </div>

    </div>
  );
}
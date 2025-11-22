// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// --- IMPORT MỚI (Đã đổi tên) ---
import HomePage from "./pages/HomePage";
import ClassPage from "./pages/ClassPage";
import StudentPage from "./pages/StudentPage";
import SchedulePage from "./pages/SchedulePage";
import ExamMatrixPage from "./pages/ExamMatrixPage";
import ExamSuggestionPage from "./pages/ExamSuggestionPage";
import AssignmentListPage from "./pages/AssignmentListPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import KnowledgePage from "./pages/KnowledgePage";


export default function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Trang chung */}
        <Route path="/" element={<HomePage />} />

        {/* Quản lý danh mục */}
        <Route path="/classes" element={<ClassPage />} />
        <Route path="/students" element={<StudentPage />} />
        <Route path="/schedules" element={<SchedulePage />} />

        {/* Module Đề thi & Bài tập */}
        <Route path="/exam" element={<ExamMatrixPage />} />
        <Route path="/exam-suggestions" element={<ExamSuggestionPage />} />
        <Route path="/assignment-management" element={<AssignmentListPage />} />
        <Route path="/assignment-detail/:batchId" element={<AssignmentDetailPage />} />
        
        {/* Module Kiến thức */}
        <Route path="/knowledge" element={<KnowledgePage />} />
      </Routes>
    </MainLayout>
  );
}
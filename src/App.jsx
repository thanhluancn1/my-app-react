// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage"; // <--- Import mới
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
    <Routes>
      {/* 1. Route Public: Trang Login (Không có Sidebar/Header) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Route Private: Các trang nội bộ (Có Sidebar/Header) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/classes" element={<ClassPage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/schedules" element={<SchedulePage />} />
                <Route path="/exam" element={<ExamMatrixPage />} />
                <Route path="/exam-suggestions" element={<ExamSuggestionPage />} />
                <Route path="/assignment-management" element={<AssignmentListPage />} />
                <Route path="/assignment-detail/:batchId" element={<AssignmentDetailPage />} />
                <Route path="/knowledge" element={<KnowledgePage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
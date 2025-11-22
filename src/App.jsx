import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ClassManagement from "./pages/ClassManagement";
import Student from "./pages/Student";
import Schedule from "./pages/Schedule";
import CreateExam from "./pages/CreateExam";
import ExamSuggestionPage from "./pages/ExamSuggestionPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import AssignmentManagementPage from "./pages/AssignmentManagementPage";



export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/classes" element={<ClassManagement />} />
        <Route path="/students" element={<Student />} />
        <Route path="/schedules" element={<Schedule />} />
        <Route path="/exam" element={<CreateExam />} />
        <Route path="/exam-suggestions" element={<ExamSuggestionPage />} />
        <Route 
          path="/assignment-detail/:batchId" 
          element={<AssignmentDetailPage />} 
        />
        <Route 
          path="/assignment-management" 
          element={<AssignmentManagementPage />} 
        />
      </Routes>
    </MainLayout>
  );
}

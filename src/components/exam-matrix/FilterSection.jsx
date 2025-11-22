// src/components/FilterSection.jsx
import { useState, useEffect } from "react";

export default function FilterSection({ data, onFilterChange }) {
  // State lưu ID đang chọn
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");

  // State lưu danh sách phụ thuộc (Môn theo Khối, Sách theo Môn)
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);

  // Reset khi dữ liệu đầu vào thay đổi
  useEffect(() => {
    setSelectedGradeId("");
    setSubjects([]);
    setBooks([]);
    setSelectedBookId("");
  }, [data]);

  // Xử lý chọn Khối
  const handleGradeChange = (e) => {
    const gradeId = e.target.value;
    setSelectedGradeId(gradeId);

    // Reset cấp con
    setSelectedSubjectId("");
    setBooks([]);
    setSelectedBookId("");
    onFilterChange(null); // Xóa kết quả lọc cũ

    if (gradeId && data) {
      const grade = data.education_data.find((g) => g.grade_level_id == gradeId);
      setSubjects(grade ? grade.subjects : []);
    } else {
      setSubjects([]);
    }
  };

  // Xử lý chọn Môn
  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubjectId(subjectId);

    // Reset cấp con
    setSelectedBookId("");
    onFilterChange(null);

    if (subjectId) {
      const subject = subjects.find((s) => s.subject_id == subjectId);
      setBooks(subject ? subject.books : []);
    } else {
      setBooks([]);
    }
  };

  // Xử lý chọn Sách (Bước cuối cùng)
  const handleBookChange = (e) => {
    const bookId = e.target.value;
    setSelectedBookId(bookId);

    if (bookId) {
      const book = books.find((b) => b.book_id == bookId);
      // QUAN TRỌNG: Gửi danh sách chương (chapters) lên component cha
      onFilterChange(book ? book.chapters : []);
    } else {
      onFilterChange(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border-light p-6 mb-2 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Dropdown Khối */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary text-sm font-medium">Khối</label>
          <div className="relative">
            <select
              value={selectedGradeId}
              onChange={handleGradeChange}
              className="w-full h-11 px-4 pr-10 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Chọn khối</option>
              {data?.education_data?.map((g) => (
                <option key={g.grade_level_id} value={g.grade_level_id}>
                  {g.grade_level_name}
                </option>
              ))}
            </select>
            <img
              src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
              alt="v"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Dropdown Môn học */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary text-sm font-medium">Môn học</label>
          <div className="relative">
            <select
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              disabled={!selectedGradeId}
              className="w-full h-11 px-4 pr-10 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:bg-gray-50 disabled:text-text-muted cursor-pointer disabled:cursor-not-allowed"
            >
              <option value="">Chọn môn học</option>
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name}
                </option>
              ))}
            </select>
            <img
              src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
              alt="v"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Dropdown Sách */}
        <div className="flex flex-col gap-2">
          <label className="text-text-secondary text-sm font-medium">Sách</label>
          <div className="relative">
            <select
              value={selectedBookId}
              onChange={handleBookChange}
              disabled={!selectedSubjectId}
              className="w-full h-11 px-4 pr-10 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:bg-gray-50 disabled:text-text-muted cursor-pointer disabled:cursor-not-allowed"
            >
              <option value="">Chọn sách</option>
              {books.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.book_name}
                </option>
              ))}
            </select>
            <img
              src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
              alt="v"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
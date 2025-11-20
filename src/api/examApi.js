// src/api/examApi.js

// Dữ liệu Mock từ mock_data_central.js
const EXAM_SUGGESTIONS_DATA = [
  {
    "lesson_id": 1, 
    "lesson_name": "Bài học tổng hợp về Mệnh đề, Tập hợp, Hàm số và Vector",
    "assignment_batches": [
      {
        "batch_id": 1,
        "batch_name": "Ôn tập Chương 1 (Cơ bản)",
        "target_student": "học sinh cả lớp", // Lưu ý: Dữ liệu gốc là chữ thường
        "recognition": 5,
        "understanding": 3,
        "application": 2,
        "multiple_choice": 8,
        "essay": 2,
        "true_false": 0,
        "fill_in_blank": 0,
        "total_questions": 10,
        "total_points": 100,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 2,
        "batch_name": "Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "recognition": 1,
        "understanding": 3,
        "application": 4,
        "multiple_choice": 4,
        "essay": 4,
        "true_false": 0,
        "fill_in_blank": 0,
        "total_questions": 8,
        "total_points": 100,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      }
    ]
  }
];

// Hàm giả lập gọi API
export const fetchExamSuggestions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(EXAM_SUGGESTIONS_DATA)));
    }, 300);
  });
};
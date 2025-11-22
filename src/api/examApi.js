// src/api/examApi.js

// ... (Giữ nguyên EXAM_SUGGESTIONS_DATA cũ) ...
const EXAM_SUGGESTIONS_DATA = [
  {
    "lesson_id": 1, 
    "lesson_name": "Bài học tổng hợp về Mệnh đề, Tập hợp, Hàm số và Vector",
    "assignment_batches": [
      {
        "batch_id": 1,
        "batch_name": "Ôn tập Chương 1 (Cơ bản)",
        "target_student": "học sinh cả lớp", // Lưu ý: data gốc là chữ thường
        "recognition": 5,
        "understanding": 3,
        "application": 2,
        "multiple_choice": 8,
        "essay": 2,
        "true_false": 0,
        "fill_in_blank": 0,
        "total_questions": 10,
        "total_points": 100,
        "duration": 45,
        "subject_name":"Toán",
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z",
        // Dữ liệu chi tiết câu hỏi (Mô phỏng cấu trúc lồng nhau từ mock_data_central.js)
        "knowledge_components": [
            {
                "knowledge_title": "Mệnh đề",
                "assignments": [
                    { 
                        "assignment_id": 101, 
                        "question": "Câu 1: Mệnh đề nào sau đây là đúng?\n A. $\\pi$ là số hữu tỉ.\n B. Tổng hai cạnh của một tam giác lớn hơn cạnh thứ ba.\n C. Bạn có chăm học không?\n D. Con mèo này đẹp quá!", 
                        "answer": "B", 
                        "solution_guide": "**Giải thích:**\n- Câu A sai vì $\\pi$ là số vô tỉ.\n- Câu B đúng (Bất đẳng thức tam giác).\n- Câu C và D không phải là mệnh đề.", 
                        "score": 1, 
                        "type": "Trắc nghiệm" 
                    },
                    { 
                        "assignment_id": 102, 
                        "question": "Câu 2: Cho tập hợp $A = \\{x \\in \\mathbb{R} | x^2 - 4 = 0\\}$. Tập hợp A viết dưới dạng liệt kê là:", 
                        "answer": "A = {-2; 2}", 
                        "solution_guide": "Giải phương trình $x^2 - 4 = 0 \\Leftrightarrow x = \\pm 2$.", 
                        "score": 1, 
                        "type": "Trắc nghiệm" 
                    }
                ]
            },
            {
                "knowledge_title": "Tập hợp",
                "assignments": [
                    { 
                        "assignment_id": 103, 
                        "question": "Câu 3: (Tự luận) Tìm tập xác định của hàm số $y = \\sqrt{x-1} + \\frac{1}{x-3}$.", 
                        "answer": "D = [1; +∞) \\ {3}", 
                        "solution_guide": "Điều kiện:\n1. $x - 1 \\ge 0 \\Leftrightarrow x \\ge 1$\n2. $x - 3 \\ne 0 \\Leftrightarrow x \\ne 3$\n\nVậy $D = [1; +\\infty) \\setminus \\{3\\}$.", 
                        "score": 2, 
                        "type": "Tự luận" 
                    }
                ]
            }
        ]
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
        "duration": 45,
        "subject_name":"Toán",
        "batch_status": "Đang diễn ra",
        "knowledge_components": [
            {
                "assignments": [
                    { "assignment_id": 201, "question": "Câu 1 (Nâng cao): Chứng minh rằng...", "answer": "...", "solution_guide": "...", "score": 5, "type": "Tự luận" }
                ]
            }
        ]
      }
    ]
  }
];

// --- DỮ LIỆU MỚI: Danh sách Lớp học & Bài tập (Từ getAllClassExams) ---
const CLASS_EXAM_DATA = [
  {
    "class_id": 1, 
    "class_name": "Lớp 12A1",
    "start_year": 2024,
    "end_year": 2025,
    "student_count": 40,
    "assignment_batches": [
      {
        "batch_id": 1,
        "batch_name": "Ôn tập Chương 1 (Cơ bản)",
        "target_student": "học sinh cả lớp",
        "total_questions": 10,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 2,
        "batch_name": "Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "total_questions": 8,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 3,
        "batch_name": "Tổng hợp Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "total_questions": 8,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 4,
        "batch_name": "Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "total_questions": 8,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      }
    ]
  },
  {
    "class_id": 2, 
    "class_name": "Lớp 12A2",
    "start_year": 2024,
    "end_year": 2025,
    "student_count": 40,
    "assignment_batches": [
      {
        "batch_id": 1,
        "batch_name": "Ôn tập Chương 1 (Cơ bản)",
        "target_student": "học sinh cả lớp",
        "total_questions": 10,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 2,
        "batch_name": "Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "total_questions": 8,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      },
      {
        "batch_id": 3,
        "batch_name": "Tổng hợp Chuyên đề Hàm số và Vector (Nâng cao)",
        "target_student": "học sinh giỏi",
        "total_questions": 8,
        "total_points": 100,
        "duration": 45,
        "batch_status": "Đang diễn ra",
        "start_date": "2025-10-25T10:00:00Z",
        "due_date": "2025-10-25T10:30:00Z"
      }
    ]
  }
];

// ... (Giữ nguyên fetchExamSuggestions cũ) ...
export const fetchExamSuggestions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(EXAM_SUGGESTIONS_DATA)));
    }, 300);
  });
};

// ... (Giữ nguyên fetchAssignmentsByBatchId cũ) ...
// export const fetchAssignmentsByBatchId = (batchId) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const targetId = parseInt(batchId);
//       let foundBatch = null;

//       for (const lesson of EXAM_SUGGESTIONS_DATA) {
//         if (lesson.assignment_batches) {
//           foundBatch = lesson.assignment_batches.find(b => b.batch_id === targetId);
//           if (foundBatch) break;
//         }
//       }

//       if (foundBatch) {
//         const allAssignments = [];
//         if (foundBatch.knowledge_components) {
//             foundBatch.knowledge_components.forEach(comp => {
//                 if (comp.assignments) {
//                     allAssignments.push(...comp.assignments);
//                 }
//             });
//         }
//         resolve(JSON.parse(JSON.stringify(allAssignments)));
//       } else {
//         // Fallback data for testing if mock data is missing assignments
//         const fallbackAssignments = [];
//         for(let i=1; i<=5; i++) {
//             fallbackAssignments.push({
//                 assignment_id: Date.now() + i,
//                 question: `Câu hỏi mẫu số ${i} (Batch ${targetId}) - Dữ liệu fallback`,
//                 answer: `Đáp án mẫu ${i}`,
//                 solution_guide: `Hướng dẫn giải chi tiết cho câu ${i}`,
//                 score: 2,
//                 type: "Trắc nghiệm"
//             });
//         }
//         resolve(fallbackAssignments);
//       }
//     }, 300);
//   });
// };


// src/api/examApi.js

// ... (Giữ nguyên phần Data ở trên)

// --- HÀM MỚI: Lấy chi tiết Batch + Assignments ---
export const fetchAssignmentsByBatchId = (batchId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const targetId = parseInt(batchId);
      let foundBatch = null;

      // 1. Tìm batch tương ứng
      for (const lesson of EXAM_SUGGESTIONS_DATA) {
        if (lesson.assignment_batches) {
          foundBatch = lesson.assignment_batches.find(b => b.batch_id === targetId);
          if (foundBatch) break;
        }
      }

      if (foundBatch) {
        // 2. Gom tất cả assignments từ knowledge_components thành 1 mảng phẳng
        const allAssignments = [];
        if (foundBatch.knowledge_components) {
            foundBatch.knowledge_components.forEach(comp => {
                if (comp.assignments) {
                    allAssignments.push(...comp.assignments);
                }
            });
        }
        
        // 3. Tạo đối tượng kết quả theo đúng Format yêu cầu
        // Copy batch info nhưng loại bỏ knowledge_components (vì đã gom ra ngoài)
        const { knowledge_components, ...batchInfo } = foundBatch;
        
        const result = {
            ...batchInfo,       // Gồm: batch_id, batch_name, duration, subject_name...
            assignments: allAssignments // Mảng câu hỏi
        };

        resolve(JSON.parse(JSON.stringify(result)));
      } else {
        console.warn(`Không tìm thấy batch ID: ${targetId}`);
        resolve(null);
      }
    }, 300);
  });
};

// --- HÀM MỚI: Lấy danh sách lớp và bài tập ---
export const fetchClassExams = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trả về dữ liệu mock
      resolve(JSON.parse(JSON.stringify(CLASS_EXAM_DATA)));
    }, 300); // Giả lập delay 300ms
  });
};
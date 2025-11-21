// src/api/examApi.js

// Dữ liệu Mock (Được mở rộng thêm phần 'assignments' chi tiết để test)
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

// Hàm giả lập gọi API lấy danh sách gợi ý (đã có từ trước)
export const fetchExamSuggestions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(EXAM_SUGGESTIONS_DATA)));
    }, 300);
  });
};

// --- HÀM MỚI: Lấy chi tiết bài tập theo batchId ---
export const fetchAssignmentsByBatchId = (batchId) => {
  return new Promise((resolve) => {
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
        // 2. Gom tất cả assignments từ các knowledge_components lại thành 1 mảng phẳng
        const allAssignments = [];
        if (foundBatch.knowledge_components) {
            foundBatch.knowledge_components.forEach(comp => {
                if (comp.assignments) {
                    allAssignments.push(...comp.assignments);
                }
            });
        }
        
        // 3. Trả về dữ liệu
        resolve(JSON.parse(JSON.stringify(allAssignments)));
      } else {
        console.warn(`Không tìm thấy batch ID: ${targetId}`);
        resolve([]); // Trả về mảng rỗng nếu không tìm thấy
      }
    }, 300); // Giả lập độ trễ 300ms
  });
};
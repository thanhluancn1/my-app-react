// src/api/knowledgeApi.js

/**
 * Dữ liệu gốc được lấy từ mock_data_central.js
 * Cấu trúc: Khối -> Môn -> Sách -> Chương -> Bài -> Đơn vị kiến thức
 */
const KNOWLEDGE_DATA = {
  "education_data": [
    {
      "grade_level_id": 1,
      "grade_level_name": "Khối 10",
      "grade_level": 10,
      "subjects": [
        {
          "subject_id": 1,
          "subject_name": "Toán học",
          "books": [
            {
              "book_id": 1,
              "book_name": "Toán 10 - Kết nối tri thức",
              "chapters": [
                {
                  "chapter_id": 1,
                  "chapter_number": 1,
                  "chapter_name": "Chương 1: Mệnh đề và Tập hợp",
                  "lessons": [
                    {
                      "lesson_id": 1,
                      "lesson_number": 1,
                      "lesson_name": "Bài 1: Mệnh đề",
                      "knowledge_units": [
                        { "knowledge_id": 1, "content": "Hiểu khái niệm mệnh đề, mệnh đề chứa biến.", "knowledge_type": "Concept" },
                        { "knowledge_id": 2, "content": "Biết cách xác định tính đúng/sai của một mệnh đề.", "knowledge_type": "Skill" },
                        { "knowledge_id": 3, "content": "Hiểu về phép phủ định mệnh đề, mệnh đề kéo theo, mệnh đề tương đương.", "knowledge_type": "Concept" }
                      ]
                    },
                    {
                      "lesson_id": 2,
                      "lesson_number": 2,
                      "lesson_name": "Bài 2: Tập hợp và các phép toán trên tập hợp",
                      "knowledge_units": [
                        { "knowledge_id": 4, "content": "Nhận biết các tập hợp con và tập hợp bằng nhau.", "knowledge_type": "Concept" },
                        { "knowledge_id": 5, "content": "Thực hiện các phép toán: hợp, giao, hiệu của hai tập hợp.", "knowledge_type": "Skill" }
                      ]
                    }
                  ]
                },
                {
                  "chapter_id": 2,
                  "chapter_number": 2,
                  "chapter_name": "Chương 2: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
                  "lessons": [
                    {
                      "lesson_id": 3,
                      "lesson_number": 1,
                      "lesson_name": "Bài 3: Bất phương trình bậc nhất hai ẩn",
                      "knowledge_units": [
                        { "knowledge_id": 6, "content": "Biểu diễn miền nghiệm của bất phương trình trên mặt phẳng tọa độ.", "knowledge_type": "Skill" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "book_id": 2,
              "book_name": "Toán 10 - Cánh Diều",
              "chapters": [
                {
                  "chapter_id": 3,
                  "chapter_number": 1,
                  "chapter_name": "Chuyên đề 1: Mệnh đề toán học",
                  "lessons": [
                    {
                      "lesson_id": 4,
                      "lesson_number": 1,
                      "lesson_name": "Bài 1: Mệnh đề, Mệnh đề phủ định",
                      "knowledge_units": [
                        { "knowledge_id": 7, "content": "Phân biệt mệnh đề và mệnh đề chứa biến.", "knowledge_type": "Concept" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "subject_id": 2,
          "subject_name": "Vật Lý",
          "books": [
            {
              "book_id": 3,
              "book_name": "Vật Lý 10 - Kết nối tri thức",
              "chapters": [
                {
                  "chapter_id": 4,
                  "chapter_number": 1,
                  "chapter_name": "Chương 1: Động học",
                  "lessons": [
                    {
                      "lesson_id": 5,
                      "lesson_number": 1,
                      "lesson_name": "Bài 1: Chuyển động thẳng đều",
                      "knowledge_units": [
                        { "knowledge_id": 8, "content": "Viết phương trình chuyển động thẳng đều.", "knowledge_type": "Skill" },
                        { "knowledge_id": 9, "content": "Vẽ đồ thị độ dịch chuyển - thời gian.", "knowledge_type": "Skill" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "grade_level_id": 2,
      "grade_level_name": "Khối 11",
      "grade_level": 11,
      "subjects": [
        {
          "subject_id": 3,
          "subject_name": "Hóa học",
          "books": [
            {
              "book_id": 4,
              "book_name": "Hóa học 11 - Kết nối tri thức",
              "chapters": [
                {
                  "chapter_id": 5,
                  "chapter_number": 1,
                  "chapter_name": "Chương 1: Cân bằng hóa học",
                  "lessons": [
                    {
                      "lesson_id": 6,
                      "lesson_number": 1,
                      "lesson_name": "Bài 1: Phản ứng thuận nghịch và trạng thái cân bằng",
                      "knowledge_units": [
                        { "knowledge_id": 10, "content": "Phân biệt phản ứng một chiều và phản ứng thuận nghịch.", "knowledge_type": "Concept" },
                        { "knowledge_id": 11, "content": "Hiểu khái niệm hằng số cân bằng (Kc) và ý nghĩa.", "knowledge_type": "Concept" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "subject_id": 4,
          "subject_name": "Ngữ Văn",
          "books": [
            {
              "book_id": 5,
              "book_name": "Ngữ Văn 11 - Cánh Diều - Tập 1",
              "chapters": [
                {
                  "chapter_id": 6,
                  "chapter_number": 1,
                  "chapter_name": "Bài 1: Thơ ca trữ tình",
                  "lessons": [
                    {
                      "lesson_id": 7,
                      "lesson_number": 1,
                      "lesson_name": "Đọc hiểu: Tây Tiến (Quang Dũng)",
                      "knowledge_units": [
                        { "knowledge_id": 12, "content": "Phân tích hình tượng người lính Tây Tiến.", "knowledge_type": "Skill" },
                        { "knowledge_id": 13, "content": "Cảm nhận vẻ đẹp bi tráng, lãng mạn của bài thơ.", "knowledge_type": "Skill" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Hàm giả lập gọi API (bất đồng bộ)
export const fetchKnowledgeTree = () => {
  return new Promise((resolve) => {
    // Giả lập độ trễ mạng 300ms giống các API khác trong dự án
    setTimeout(() => {
      // Trả về bản sao deep copy của dữ liệu để đảm bảo tính bất biến (immutability) ban đầu
      resolve(JSON.parse(JSON.stringify(KNOWLEDGE_DATA)));
    }, 300);
  });
};
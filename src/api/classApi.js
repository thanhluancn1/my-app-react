// src/api/classApi.js

// Hàm giả lập lấy danh sách lớp học
export const fetchClasses = async (userId) => {
  // Giả lập delay mạng 300ms
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          class_id: 10,
          class_name: "12A5",
          class_status: "active",
          end_year: 2022,
          role_in_class: "teacher",
          school_name: "B Kim Bảng",
          start_year: 2021,
          subject_name: "Toán",
        },
        {
          class_id: 11,
          class_name: "12A6",
          class_status: "active",
          end_year: 2026,
          role_in_class: "teacher",
          school_name: "B Kim Bảng",
          start_year: 2021,
          subject_name: "Toán",
        },
        {
          class_id: 12,
          class_name: "12A7",
          class_status: "active",
          end_year: 2026,
          role_in_class: "teacher",
          school_name: "B Kim Bảng",
          start_year: 2021,
          subject_name: "Toán",
        },
      ]);
    }, 300);
  });
};

// Hàm giả lập lưu lớp học (Thêm mới hoặc Cập nhật)
export const saveClass = async (classData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Nếu classData chưa có class_id, tức là thêm mới -> tạo ID ngẫu nhiên
      if (!classData.class_id) {
        const newClass = {
          ...classData,
          class_id: Date.now(), // Tạo ID giả bằng timestamp
        };
        resolve(newClass);
      } else {
        // Nếu đã có ID, tức là cập nhật -> trả về dữ liệu đã cập nhật
        resolve(classData);
      }
    }, 300); // Giả lập delay 300ms
  });
};
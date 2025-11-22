// src/api/schoolApi.js

// Dữ liệu giả lập (Lớp học chứa danh sách học sinh bên trong)
let schoolData = [
  {
    class_id: 1,
    class_name: "10A1",
    school_name: "THPT Chu Văn An",
    subject_name: "Toán",
    start_year: 2023,
    end_year: 2024,
    class_status: "Hoạt động",
    students: [
      {
        student_id: 101,
        full_name: "Nguyễn Văn A",
        date_of_birth: "2008-05-10",
        email: "nguyenvana@example.com",
        phone_number: "0987654321",
        status: "Hoạt động",
      },
      {
        student_id: 102,
        full_name: "Trần Thị B",
        date_of_birth: "2008-08-20",
        email: "tranthib@example.com",
        phone_number: "0912345678",
        status: "Không hoạt động",
      },
    ],
  },
  {
    class_id: 2,
    class_name: "11B2",
    school_name: "THPT Kim Liên",
    subject_name: "Lý",
    start_year: 2023,
    end_year: 2024,
    class_status: "Hoạt động",
    students: [
      {
        student_id: 201,
        full_name: "Lê Văn C",
        date_of_birth: "2007-02-15",
        email: "levanc@example.com",
        phone_number: "0909090909",
        status: "Hoạt động",
      },
    ],
  },
  {
    class_id: 3,
    class_name: "12C3",
    school_name: "THPT Yên Hòa",
    subject_name: "Hóa",
    start_year: 2023,
    end_year: 2024,
    class_status: "Hoạt động",
    students: [],
  },
];

// --- 1. Lấy toàn bộ dữ liệu (Dùng chung cho cả 2 màn hình) ---
export const fetchSchoolData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trả về bản sao dữ liệu để tránh tham chiếu trực tiếp gây lỗi side-effect
      resolve(JSON.parse(JSON.stringify(schoolData)));
    }, 300);
  });
};

// --- 2. Các hàm bổ trợ (Để thay thế hoàn toàn classApi và studentApi cũ) ---

// Lưu thông tin Lớp học (Thêm mới / Cập nhật)
export const saveClass = (classInfo) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (classInfo.class_id) {
        // Update
        const index = schoolData.findIndex((c) => c.class_id === parseInt(classInfo.class_id));
        if (index !== -1) {
          // Giữ nguyên students cũ khi update thông tin lớp
          schoolData[index] = { ...schoolData[index], ...classInfo };
          resolve(schoolData[index]);
        }
      } else {
        // Create
        const newClass = {
          ...classInfo,
          class_id: Date.now(),
          students: [], // Lớp mới chưa có học sinh
        };
        schoolData.push(newClass);
        resolve(newClass);
      }
    }, 300);
  });
};

// Lưu thông tin Học sinh (Thêm mới / Cập nhật)
export const saveStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { class_id, ...studentInfo } = studentData;
      const classIndex = schoolData.findIndex((c) => c.class_id === parseInt(class_id));

      if (classIndex === -1) {
        return reject(new Error("Không tìm thấy lớp học!"));
      }

      const targetClass = schoolData[classIndex];
      let savedStudent;

      if (studentInfo.student_id) {
        // Update Student
        const studentIndex = targetClass.students.findIndex(
          (s) => s.student_id === parseInt(studentInfo.student_id)
        );
        if (studentIndex > -1) {
          targetClass.students[studentIndex] = {
            ...targetClass.students[studentIndex],
            ...studentInfo,
            student_id: parseInt(studentInfo.student_id),
          };
          savedStudent = targetClass.students[studentIndex];
        }
      } else {
        // Create Student
        const newStudent = {
          ...studentInfo,
          student_id: Date.now(),
        };
        targetClass.students.push(newStudent);
        savedStudent = newStudent;
      }
      
      resolve(savedStudent);
    }, 300);
  });
};
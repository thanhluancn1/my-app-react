// src/api/studentApi.js

// Dữ liệu giả lập ban đầu (giống cấu trúc trong file index.js cũ của bạn)
let classesData = [
  {
    class_id: 1,
    class_name: "10A1",
    school_name: "THPT Chu Văn An",
    students: [
      {
        student_id: 101,
        full_name: "Nguyễn Văn A",
        date_of_birth: "2008-05-10",
        email: "nguyenvana@example.com",
        phone_number: "0987654321",
        status: "active",
      },
      {
        student_id: 102,
        full_name: "Trần Thị B",
        date_of_birth: "2008-08-20",
        email: "tranthib@example.com",
        phone_number: "0912345678",
        status: "inactive",
      },
    ],
  },
  {
    class_id: 2,
    class_name: "11B2",
    school_name: "THPT Kim Liên",
    students: [
      {
        student_id: 201,
        full_name: "Lê Văn C",
        date_of_birth: "2007-02-15",
        email: "levanc@example.com",
        phone_number: "0909090909",
        status: "active",
      },
    ],
  },
  {
    class_id: 3,
    class_name: "12C3",
    school_name: "THPT Yên Hòa",
    students: [],
  },
];

// 1. Lấy danh sách lớp kèm học sinh
export const fetchClasses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trả về bản sao của dữ liệu để tránh tham chiếu trực tiếp
      resolve(JSON.parse(JSON.stringify(classesData)));
    }, 300);
  });
};

// 2. Thêm hoặc Sửa học sinh
export const saveStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { class_id, ...studentInfo } = studentData;
      const classIndex = classesData.findIndex(
        (c) => c.class_id === parseInt(class_id)
      );

      if (classIndex === -1) {
        return reject(new Error("Không tìm thấy lớp học!"));
      }

      const targetClass = classesData[classIndex];
      let savedStudent;

      if (studentInfo.student_id) {
        // --- CẬP NHẬT (UPDATE) ---
        const studentIndex = targetClass.students.findIndex(
          (s) => s.student_id === parseInt(studentInfo.student_id)
        );

        if (studentIndex > -1) {
          targetClass.students[studentIndex] = {
            ...targetClass.students[studentIndex],
            ...studentInfo,
            student_id: parseInt(studentInfo.student_id), // Đảm bảo ID là số
          };
          savedStudent = targetClass.students[studentIndex];
        }
      } else {
        // --- THÊM MỚI (CREATE) ---
        const newStudent = {
          ...studentInfo,
          student_id: Date.now(), // Tạo ID ngẫu nhiên
        };
        targetClass.students.push(newStudent);
        savedStudent = newStudent;
      }

      // Trả về dữ liệu học sinh đã lưu
      resolve(savedStudent);
    }, 300);
  });
};

// 3. Xóa nhiều học sinh
export const deleteStudents = (studentIds, classId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classIndex = classesData.findIndex(
        (c) => c.class_id === parseInt(classId)
      );

      if (classIndex > -1) {
        // Lọc bỏ các học sinh có ID nằm trong danh sách studentIds
        classesData[classIndex].students = classesData[
          classIndex
        ].students.filter(
          (s) => !studentIds.includes(s.student_id.toString()) && !studentIds.includes(s.student_id)
        );
      }
      resolve(true);
    }, 300);
  });
};
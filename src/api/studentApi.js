// src/api/studentApi.js

let students = [
  { id: 1, name: "Nguyen Van A", age: 15 },
  { id: 2, name: "Tran Thi B", age: 16 },
  { id: 3, name: "Le Van C", age: 14 },
];

// Lấy danh sách
export function fetchStudents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...students]), 300);
  });
}

// Thêm học sinh
export function addStudent(student) {
  return new Promise((resolve) => {
    const newStudent = { id: Date.now(), ...student };
    students.push(newStudent);
    setTimeout(() => resolve(newStudent), 300);
  });
}

// Sửa học sinh
export function updateStudent(id, updatedData) {
  return new Promise((resolve) => {
    students = students.map((s) =>
      s.id === id ? { ...s, ...updatedData } : s
    );
    setTimeout(() => resolve(true), 300);
  });
}

// Xóa học sinh
export function deleteStudent(id) {
  return new Promise((resolve) => {
    students = students.filter((s) => s.id !== id);
    setTimeout(() => resolve(true), 300);
  });
}

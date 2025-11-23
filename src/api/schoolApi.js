// src/api/schoolApi.js

const API_BASE_URL = "http://localhost:8000/api/v1";

// Helper: Lấy token từ storage để xác thực
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // Gửi kèm thẻ bài (Token)
  };
};

// 1. Lấy dữ liệu trường học (Không cần truyền User ID nữa)
export const fetchSchoolData = async () => {
  try {
    // Backend tự lấy ID từ token trong header
    const response = await fetch(`${API_BASE_URL}/school-data`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Lỗi tải dữ liệu trường học");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 2. Lưu Lớp học (Tạo mới hoặc Cập nhật)
export const saveClass = async (classData) => {
  const isUpdate = !!classData.class_id;
  const url = isUpdate 
    ? `${API_BASE_URL}/classes/${classData.class_id}` 
    : `${API_BASE_URL}/classes`;
  
  const method = isUpdate ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: getHeaders(),
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Lỗi lưu lớp học");
    }
    return await response.json();
  } catch (error) {
    console.error("Save Class Error:", error);
    throw error;
  }
};

// 3. Lưu Học sinh (Tạo mới hoặc Cập nhật)
export const saveStudent = async (studentData) => {
  const isUpdate = !!studentData.student_id;
  const url = isUpdate 
    ? `${API_BASE_URL}/students/${studentData.student_id}` 
    : `${API_BASE_URL}/students`;
  
  const method = isUpdate ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Lỗi lưu học sinh");
    }
    return await response.json();
  } catch (error) {
    console.error("Save Student Error:", error);
    throw error;
  }
};
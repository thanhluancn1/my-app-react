// src/api/authApi.js

const API_BASE_URL = "http://localhost:8000/api/v1";

export const loginApi = async (username, password) => {
  try {
    // 1. Tạo Form Data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        // 2. Đổi Content-Type thành form-urlencoded
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // 3. Gửi formData thay vì JSON string
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Đăng nhập thất bại");
    }

    return data;
    
  } catch (error) {
    throw error;
  }
};
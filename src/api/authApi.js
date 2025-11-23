// src/api/authApi.js

// Địa chỉ Backend của bạn (Mặc định FastAPI chạy port 8000)
const API_BASE_URL = "http://localhost:8000/api/v1";

export const loginApi = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    // Nếu API trả về lỗi (HTTP 400, 401, 403...)
    if (!response.ok) {
      throw new Error(data.detail || "Đăng nhập thất bại");
    }

    // Trả về dữ liệu chuẩn: { access_token, user, ... }
    return data;
    
  } catch (error) {
    // Ném lỗi ra để AuthContext bắt
    throw error;
  }
};
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check Login khi tải trang
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 2. Hàm Login (Gọi API thật)
  const login = async (username, password) => {
    try {
      // Gọi API
      const data = await loginApi(username, password);
      
      // Backend trả về: { access_token, token_type, user }
      if (data.access_token) {
        // Lưu vào Storage
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        
        // Cập nhật State
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: "Không nhận được token từ server" };
      }

    } catch (error) {
      console.error("Login Error:", error);
      // Trả về thông báo lỗi từ backend (ví dụ: "Mật khẩu không chính xác")
      return { success: false, message: error.message };
    }
  };

  // 3. Hàm Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
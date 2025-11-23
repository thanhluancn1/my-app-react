// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Khi app vừa chạy, kiểm tra xem trong LocalStorage đã có Token chưa
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      // Nếu có token -> coi như đã đăng nhập
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Hàm Đăng nhập
  const login = async (username, password) => {
    try {
      // 1. Gọi API
      const data = await loginApi(username, password);
      
      // 2. Nếu thành công, lưu Token & User
      if (data.success) {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Hàm Đăng xuất
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

// Hook custom để các component con gọi nhanh: const { login, user } = useAuth();
export const useAuth = () => useContext(AuthContext);
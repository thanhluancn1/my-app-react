// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Nếu đang load thông tin từ localStorage thì chưa làm gì cả (hiển thị loading trắng)
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // Nếu chưa đăng nhập -> Chuyển về Login
  if (!isAuthenticated) {
    // state={{ from: location }} giúp sau khi login xong có thể redirect lại đúng trang cũ
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
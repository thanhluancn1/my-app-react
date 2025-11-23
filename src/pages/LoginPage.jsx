// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Gọi hàm login từ Context
    const result = await login(username, password);

    if (result.success) {
      // Nếu thành công, chuyển hướng về trang chủ
      navigate("/");
    } else {
      // Nếu thất bại, hiện lỗi
      setError(result.message || "Đăng nhập thất bại");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-border-light overflow-hidden animate-fade-in">
        
        {/* Header Section */}
        <div className="p-8 text-center bg-blue-50 border-b border-blue-100">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm mb-4">
             {/* Logo giả lập */}
             <img 
                src="https://picsum.photos/64?random=1" 
                alt="Logo" 
                className="w-12 h-12 rounded-lg object-cover"
             />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Chào mừng trở lại!</h1>
          <p className="text-text-secondary text-sm mt-2">Đăng nhập vào hệ thống AronEdu</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Thông báo lỗi */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                <img src="https://unpkg.com/lucide-static/icons/alert-circle.svg" className="w-4 h-4" alt="" />
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Tên đăng nhập</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                  placeholder="Ví dụ: admin"
                  required
                />
                <img 
                  src="https://unpkg.com/lucide-static/icons/user.svg" 
                  className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 opacity-50" 
                  alt="" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-text-secondary">Mật khẩu</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                  placeholder="••••••"
                  required
                />
                <img 
                  src="https://unpkg.com/lucide-static/icons/lock.svg" 
                  className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 opacity-50" 
                  alt="" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                </svg>
              )}
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Bạn chưa có tài khoản? <a href="#" className="text-primary hover:underline font-medium">Liên hệ quản trị viên</a>
          </div>
        </div>
      </div>
    </div>
  );
}
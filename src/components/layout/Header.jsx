// src/components/layout/Header.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Import hook

export default function Header() {
  const { user, logout } = useAuth(); // Lấy user và hàm logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border-light h-16 flex items-center justify-between px-6 z-20 relative">
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            src="https://picsum.photos/40?random=1"
            alt="Logo"
            className="w-10 h-10 mr-3 rounded"
          />
          <span className="text-xl font-bold text-text-primary">AronEdu</span>
        </div>
      </div>

      {/* User Info & Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors focus:outline-none"
          >
            <div className="relative">
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-border-medium"
              />
              {/* Online status dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            
            <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-text-primary leading-none">{user?.full_name || "Guest"}</p>
                <p className="text-xs text-text-secondary mt-1">{user?.role === 'teacher' ? 'Giáo viên' : 'Admin'}</p>
            </div>

            <img
              src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
              alt="Dropdown"
              className={`w-5 h-5 text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border-light py-1 animate-fade-in">
                <div className="px-4 py-2 border-b border-border-light">
                    <p className="text-xs font-bold text-text-muted uppercase">Tài khoản</p>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50">Hồ sơ cá nhân</a>
                <a href="#" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50">Cài đặt</a>
                <div className="border-t border-border-light my-1"></div>
                <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                >
                    <img src="https://unpkg.com/lucide-static/icons/log-out.svg" className="w-4 h-4" alt="" />
                    Đăng xuất
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
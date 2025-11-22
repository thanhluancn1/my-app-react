// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-border-light h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            src="https://picsum.photos/40?random=1"
            alt="Logo"
            className="w-10 h-10 mr-3 rounded"
          />
          <span className="text-xl font-bold font-gilroy text-text-primary">AronEdu</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src="https://unpkg.com/lucide-static/icons/message-square.svg"
            alt="Chat"
            className="w-6 h-6"
          />
        </div>

        <div className="relative">
          <img
            src="https://unpkg.com/lucide-static/icons/bell.svg"
            alt="Notifications"
            className="w-6 h-6"
          />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            5
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://picsum.photos/36?random=2"
              alt="User Avatar"
              className="w-9 h-9 rounded-full"
            />
          </div>
          <span className="text-text-secondary text-sm font-inter">Thanh Luan</span>
          <img
            src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
            alt="Dropdown"
            className="w-6 h-6"
          />
        </div>
      </div>
    </header>
  );
}

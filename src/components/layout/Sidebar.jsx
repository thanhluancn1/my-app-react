// src/components/Sidebar.jsx
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="p-4 space-y-2">
        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/home.svg"
          label="Trang chủ"
          href="/"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/list.svg"
          label="Quản lý lớp học"
          href="/classes"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/tag.svg"
          label="Quản lý học sinh"
          href="/students"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/folder.svg"
          label="Quản lý lịch dạy"
          href="/schedules"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/bar-chart-2.svg"
          label="Tạo bài tập"
          href="/exam-suggestions"
        />


        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/file-text.svg" // Đổi icon cho phù hợp
          label="Quản lý bài tập"
          href="/assignment-management" // <--- Link tới trang mới
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/layout-grid.svg"
          label="Quản lý bài giảng"
          href="/lessons"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/users.svg"
          label="Quản lý kho nội dung"
          href="/content"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/star.svg"
          label="Tạo bài tập"
          href="/exercise"
        />

        <p className="text-text-muted text-xs font-inter px-3 mb-2 pt-4">Báo cáo</p>

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/layout-grid.svg"
          label="Thời gian làm việc giáo viên"
          href="/teacher-time"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/help-circle.svg"
          label="Phân tích lớp học"
          href="/class-analytics"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/ribbon.svg"
          label="Phân tích học sinh"
          href="/student-analytics"
        />

        <p className="text-text-muted text-xs font-inter px-3 mb-2 pt-4">Cài đặt</p>

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/user.svg"
          label="Cài đặt cá nhân"
          href="/profile"
        />

        <SidebarItem
          icon="https://unpkg.com/lucide-static/icons/settings.svg"
          label="Cài đặt chung"
          href="/settings"
        />
      </div>
    </aside>
  );
}

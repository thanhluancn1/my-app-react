import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({ children }) {
  return (
    // 1. h-screen: Chiếm toàn bộ chiều cao màn hình
    // 2. overflow-hidden: Ngăn không cho body cuộn (để cố định Header)
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* Header: Sẽ đứng yên vì container cha không scroll */}
      <Header /> 
      
      {/* Container chính: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Sẽ đứng yên bên trái */}
        <Sidebar /> 
        
        {/* Main: Chỉ cho phép cuộn nội dung bên trong khu vực này */}
        {/* overflow-y-auto: Hiện thanh cuộn dọc khi nội dung dài */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-light relative">
          {children}
        </main>

      </div>
    </div>
  );
}
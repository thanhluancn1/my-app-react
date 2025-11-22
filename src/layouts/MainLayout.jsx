import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header full width */}
      <Header /> {/* h-16 */}
      
      {/* Container chính: Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar /> {/* width cố định */}
        <main className="flex-1 p-6 bg-bg-light">{children}</main>
      </div>
    </div>
  );
}

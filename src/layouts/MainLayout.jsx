import Navbar from "../components/Navbar";

export default function MainLayout({ children, onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onNavigate} />

      <main className="p-6">
        {children}
      </main>

      <footer className="text-center py-4 text-gray-500">
        © 2025 My SPA
      </footer>
    </div>
  );
}

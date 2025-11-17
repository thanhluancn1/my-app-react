export default function Navbar({ onNavigate }) {
  return (
    <nav className="flex gap-4 p-4 bg-white shadow">
      <button
        onClick={() => onNavigate("home")}
        className="text-blue-600 hover:underline"
      >
        Home
      </button>

      <button
        onClick={() => onNavigate("about")}
        className="text-blue-600 hover:underline"
      >
        About
      </button>

      <button
        onClick={() => onNavigate("student")}
        className="text-blue-600 hover:underline"
      >
        Student
      </button>
    </nav>
  );
}

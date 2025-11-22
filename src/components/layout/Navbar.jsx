// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-3 py-2 rounded";
  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "text-blue-600 hover:underline";

  return (
    <nav className="flex gap-4 p-4 bg-white">
      <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? activeClass : inactiveClass}`}>
        Home
      </NavLink>

      <NavLink to="/about" className={({ isActive }) => `${base} ${isActive ? activeClass : inactiveClass}`}>
        About
      </NavLink>

      <NavLink to="/student" className={({ isActive }) => `${base} ${isActive ? activeClass : inactiveClass}`}>
        Students
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => `${base} ${isActive ? activeClass : inactiveClass}`}>
        Contact
      </NavLink>
    </nav>
  );
}

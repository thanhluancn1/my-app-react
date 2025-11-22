// src/components/SidebarItem.jsx
import { NavLink } from "react-router-dom";

export default function SidebarItem({ icon, label, href }) {
  return (
    <NavLink
      to={href || "#"} // nếu không có href thì không dẫn đi đâu
      className={({ isActive }) =>
        `flex items-center p-3 rounded cursor-pointer ${
          isActive ? "bg-gray-200" : "hover:bg-gray-50"
        }`
      }
    >
      <img src={icon} alt={label} className="w-6 h-6 mr-3" />
      <span className="text-text-secondary text-sm font-inter">{label}</span>
    </NavLink>
  );
}

// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/about"); // chuyển sang trang About
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-600">Home Page</h1>
      <p className="text-text-secondary">
        Đây là trang Home. Bạn có thể chuyển sang trang About bằng nút dưới đây.
      </p>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={goToAbout}
      >
        Go to About
      </button>
    </div>
  );
}

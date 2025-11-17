export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to the Home Page
      </h1>

      <p className="text-gray-600 text-lg">
        Đây là trang Home của Single Page Application.  
        Nội dung chỉ thay đổi bên trong trang, không tải lại web.
      </p>

      <div className="p-6 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Card Demo
        </h2>

        <p className="text-gray-600 mb-4">
          Đây là một card demo được style bằng TailwindCSS.  
          Bạn có thể thay đổi, mở rộng hoặc thêm component tùy ý.
        </p>

        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Click me
        </button>
      </div>
    </div>
  );
}

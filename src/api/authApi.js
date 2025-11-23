// src/api/authApi.js

// Token giả lập (thường là JWT)
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMSwiZXhwIjoxNzE2MjM5MDIyfQ.fakeTokenSignature123";

// Thông tin user giả lập (thường đi kèm hoặc decode từ token)
const MOCK_USER = {
  id: 101,
  username: "admin",
  full_name: "Đỗ Thanh Luân",
  email: "luan.nt@aronedu.com",
  avatar: "https://picsum.photos/200",
  role: "teacher"
};

export const loginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập check DB: user=admin, pass=123456
      if (username === "admin" && password === "123456") {
        resolve({
          success: true,
          token: MOCK_TOKEN, // Backend trả về Token
          user: MOCK_USER    // Backend trả về User Info
        });
      } else {
        reject(new Error("Tên đăng nhập hoặc mật khẩu không đúng (thử admin/123456)"));
      }
    }, 1000); // Delay 1s cho giống mạng thật
  });
};
// src/api/aboutData.js
export const fetchAboutData = () => {
  // Giả lập API call với Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "About Us",
        description:
          "Chúng tôi là công ty công nghệ, chuyên xây dựng ứng dụng SPA với React.",
        team: [
          { id: 1, name: "Alice", role: "Frontend" },
          { id: 2, name: "Bob", role: "Backend" },
          { id: 3, name: "Charlie", role: "UI/UX" },
        ],
      });
    }, 500); // giả lập delay 0.5s
  });
};

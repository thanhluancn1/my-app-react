// src/api/sampleApi.js
export async function fetchAboutData() {
  // Giả lập call API với delay 500ms
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "About Item 1", description: "Description for item 1" },
        { id: 2, title: "About Item 2", description: "Description for item 2" },
        { id: 3, title: "About Item 3", description: "Description for item 3" }
      ]);
    }, 1);
  });
}

// src/api/scheduleApi.js

// --- 1. Mock Data: Danh sách lớp học (Nested Data) ---
const classesData = [
  {
    class_id: 1,
    class_name: "10A1",
    subject_name: "Toán",
    lessons: [
      { lesson_id: 101, lesson_name: "Bài 1: Tập hợp" },
      { lesson_id: 102, lesson_name: "Bài 2: Hàm số bậc nhất" },
      { lesson_id: 103, lesson_name: "Bài 3: Phương trình quy về bậc hai" },
    ],
  },
  {
    class_id: 2,
    class_name: "11B2",
    subject_name: "Lý",
    lessons: [
      { lesson_id: 301, lesson_name: "Chương 1: Động học chất điểm" },
      { lesson_id: 302, lesson_name: "Chương 2: Động lực học chất điểm" },
    ],
  },
  {
    class_id: 3,
    class_name: "12C3",
    subject_name: "Hóa",
    lessons: [
      { lesson_id: 401, lesson_name: "Chương 1: Este - Lipit" },
      { lesson_id: 402, lesson_name: "Chương 2: Cacbohidrat" },
    ],
  },
  {
    class_id: 4,
    class_name: "10A2",
    subject_name: "Tiếng Anh",
    lessons: [
      { lesson_id: 201, lesson_name: "Unit 1: Family Life" },
      { lesson_id: 202, lesson_name: "Unit 2: Humans and the Environment" },
    ],
  },
];

// --- 2. Mock Data: Lịch mẫu theo tuần (Weekly Template) ---
// Đây là khuôn mẫu sẽ được nhân bản cho 5 tuần
const templateSchedules = [
  {
    class_id: 1,
    class_name: "10A1",
    subject_name: "Toán",
    lesson_id: 101,
    lesson_name: "Bài 1: Tập hợp",
    week_day: "Thứ Hai",
    start_period: 2,
    end_period: 3,
  },
  {
    class_id: 2,
    class_name: "11B2",
    subject_name: "Lý",
    lesson_id: 301,
    lesson_name: "Chương 1: Động học chất điểm",
    week_day: "Thứ Ba",
    start_period: 4,
    end_period: 5,
  },
  {
    class_id: 4,
    class_name: "10A2",
    subject_name: "Tiếng Anh",
    lesson_id: 201,
    lesson_name: "Unit 1: Family Life",
    week_day: "Thứ Sáu",
    start_period: 1,
    end_period: 2,
  },
  {
    class_id: 3,
    class_name: "12C3",
    subject_name: "Hóa",
    lesson_id: 401,
    lesson_name: "Chương 1: Este - Lipit",
    week_day: "Thứ Năm",
    start_period: 7,
    end_period: 8,
  },
];

// --- 3. Helpers: Xử lý ngày tháng ---

// Map thứ sang số (0 = Thứ Hai ... 6 = Chủ Nhật) để dễ cộng ngày
const weekDayOffset = {
  "Thứ Hai": 0,
  "Thứ Ba": 1,
  "Thứ Tư": 2,
  "Thứ Năm": 3,
  "Thứ Sáu": 4,
  "Thứ Bảy": 5,
  "Chủ Nhật": 6,
};

// Hàm lấy ngày Thứ 2 của tuần chứa ngày date
const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sun, 1 = Mon...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

// Hàm format date thành YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// --- 4. Hàm sinh dữ liệu 5 tuần ---
let generatedSchedules = []; // Biến lưu trữ dữ liệu giả lập trong bộ nhớ

const generateMockData = () => {
  if (generatedSchedules.length > 0) return; // Đã sinh rồi thì thôi

  const today = new Date();
  const currentWeekMonday = getMonday(today);
  
  // Sinh dữ liệu cho 5 tuần: từ -2 tuần trước đến +2 tuần sau
  for (let weekOffset = -2; weekOffset <= 2; weekOffset++) {
    // Tính ngày Thứ 2 của tuần đang xét
    const weekMonday = new Date(currentWeekMonday);
    weekMonday.setDate(weekMonday.getDate() + (weekOffset * 7));

    // Duyệt qua lịch mẫu và tạo lịch cụ thể cho tuần này
    templateSchedules.forEach((template, index) => {
      // Tính ngày cụ thể dựa trên thứ
      const offset = weekDayOffset[template.week_day];
      const scheduleDate = new Date(weekMonday);
      scheduleDate.setDate(scheduleDate.getDate() + offset);

      // Tạo ID duy nhất: (offset tuần + 10) * 100 + index
      const uniqueId = (weekOffset + 10) * 100 + index;

      generatedSchedules.push({
        ...template,
        schedule_id: uniqueId,
        schedule_date: formatDate(scheduleDate),
        // Giả lập bài học thay đổi theo tuần (chỉ demo)
        lesson_name: `${template.lesson_name} (Tuần ${weekOffset + 3})`, 
      });
    });
  }
};

// Gọi hàm sinh dữ liệu ngay khi file được load lần đầu
generateMockData();

// --- API Functions ---

export const fetchClasses = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...classesData]), 300);
  });
};

export const fetchSchedules = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trả về toàn bộ kho dữ liệu 5 tuần
      resolve([...generatedSchedules]);
    }, 300);
  });
};

export const saveSchedule = (scheduleData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Logic lưu giữ nguyên như trước
      const selectedClass = classesData.find(
        (c) => c.class_id === parseInt(scheduleData.class_id)
      );

      if (!selectedClass) {
        reject(new Error("Lớp học không hợp lệ"));
        return;
      }

      const selectedLesson = selectedClass.lessons.find(
        (l) => l.lesson_id === parseInt(scheduleData.lesson_id)
      );

      const fullScheduleData = {
        ...scheduleData,
        class_name: selectedClass.class_name,
        subject_name: selectedClass.subject_name,
        lesson_name: selectedLesson ? selectedLesson.lesson_name : scheduleData.lesson_name,
      };

      if (scheduleData.schedule_id) {
        // Update
        const index = generatedSchedules.findIndex(
          (s) => s.schedule_id === parseInt(scheduleData.schedule_id)
        );
        if (index !== -1) {
          generatedSchedules[index] = {
            ...generatedSchedules[index],
            ...fullScheduleData,
            schedule_id: parseInt(scheduleData.schedule_id),
          };
          resolve(generatedSchedules[index]);
        }
      } else {
        // Create
        const newSchedule = {
          ...fullScheduleData,
          schedule_id: Date.now(),
        };
        generatedSchedules.push(newSchedule);
        resolve(newSchedule);
      }
    }, 300);
  });
};

export const deleteSchedule = (scheduleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      generatedSchedules = generatedSchedules.filter(
        (s) => s.schedule_id !== parseInt(scheduleId)
      );
      resolve(true);
    }, 300);
  });
};
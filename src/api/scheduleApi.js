// src/api/scheduleApi.js

const API_BASE_URL = "http://localhost:8000/api/v1";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fetchSchedules = async (startDate, endDate) => {
  try {
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const response = await fetch(
      `${API_BASE_URL}/schedules?start_date=${startStr}&end_date=${endStr}`, 
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) throw new Error("Lỗi tải lịch dạy");
    return await response.json();
  } catch (error) {
    console.error("Fetch Schedules Error:", error);
    return [];
  }
};

export const fetchClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/classes-lessons`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Lỗi tải danh sách lớp");
    return await response.json(); 
  } catch (error) {
    console.error("Fetch Classes Error:", error);
    return [];
  }
};

export const saveSchedule = async (scheduleData) => {
  // Xác định là Update hay Create
  const isUpdate = !!scheduleData.schedule_id;
  
  // URL: Nếu update thì thêm ID vào cuối
  const url = isUpdate 
    ? `${API_BASE_URL}/schedules/${scheduleData.schedule_id}`
    : `${API_BASE_URL}/schedules`;
    
  const method = isUpdate ? "PUT" : "POST";

  const payload = {
    class_id: parseInt(scheduleData.class_id),
    start_period: parseInt(scheduleData.start_period),
    end_period: parseInt(scheduleData.end_period),
    lesson_id: scheduleData.lesson_id ? parseInt(scheduleData.lesson_id) : null,
    schedule_date: typeof scheduleData.schedule_date === 'string' 
          ? scheduleData.schedule_date 
          : formatDate(scheduleData.schedule_date)
  };

  try {
    const response = await fetch(url, {
      method: method, // POST hoặc PUT
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Lỗi lưu lịch dạy");
    }

    return await response.json();
  } catch (error) {
    console.error("Save Schedule Error:", error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Lỗi xóa lịch");
    }
    return true;
  } catch (error) {
    console.error("Delete Schedule Error:", error);
    throw error;
  }
};
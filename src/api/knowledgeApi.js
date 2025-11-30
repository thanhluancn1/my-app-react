// src/api/knowledgeApi.js

const API_BASE_URL = "http://localhost:8000/api/v1";

// Helper: Lấy header có token xác thực
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// ==========================================
// 1. LẤY DỮ LIỆU CÂY (GET TREE)
// ==========================================

export const fetchKnowledgeTree = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-tree`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
        throw new Error("Lỗi tải cây kiến thức");
    }
    
    const data = await response.json();
    // Frontend mong đợi cấu trúc { education_data: [...] }
    return { education_data: data };
    
  } catch (error) {
    console.error("Fetch Tree Error:", error);
    return { education_data: [] };
  }
};

// Helper: Tìm bài học trong cây (để hiển thị chi tiết mà không cần gọi API riêng)
const findLessonRecursive = (data, lessonId) => {
  if (!data || !data.education_data) return null;
  
  for (const grade of data.education_data) {
    for (const subject of grade.subjects) {
      for (const book of subject.books) {
        for (const chapter of book.chapters) {
          if (chapter.lessons) {
            const found = chapter.lessons.find(l => l.lesson_id === parseInt(lessonId));
            if (found) return found;
          }
        }
      }
    }
  }
  return null;
};

export const fetchLessonDetail = async (lessonId) => {
  // Lấy toàn bộ cây về rồi lọc (đảm bảo dữ liệu mới nhất)
  const treeData = await fetchKnowledgeTree();
  const lesson = findLessonRecursive(treeData, lessonId);
  return lesson || null;
};

// ==========================================
// 2. CẬP NHẬT BÀI HỌC (SAVE LESSON)
// Bao gồm cả lưu danh sách Knowledge Units
// ==========================================

export const saveLessonData = async (updatedLesson) => {
  // A. Cập nhật thông tin chính của bài học
  const lessonUrl = `${API_BASE_URL}/lessons/${updatedLesson.lesson_id}`;
  
  try {
    const lessonResponse = await fetch(lessonUrl, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_name: updatedLesson.lesson_name,
        description: updatedLesson.description,
        order_number: updatedLesson.order_number
      }),
    });

    if (!lessonResponse.ok) throw new Error("Lỗi lưu thông tin bài học");

    // B. Xử lý danh sách Knowledge Units
    let newKnowledgeUnits = [];

    if (updatedLesson.knowledge_units && updatedLesson.knowledge_units.length > 0) {
        
        // Dùng Promise.all để lấy lại kết quả trả về từ Backend
        newKnowledgeUnits = await Promise.all(updatedLesson.knowledge_units.map(async (unit) => {
            
            // Logic check ID thật
            const isRealId = unit.knowledge_unit_id && unit.knowledge_unit_id < 1000000000000;

            if (isRealId) { 
                // UPDATE
                const res = await fetch(`${API_BASE_URL}/knowledge-units/${unit.knowledge_unit_id}`, {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        content: unit.content,
                        knowledge_type: unit.knowledge_type
                    })
                });
                return await res.json(); // Trả về unit đã update từ Server
            } 
            else {
                // CREATE
                const res = await fetch(`${API_BASE_URL}/knowledge-units`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        content: unit.content,
                        knowledge_type: unit.knowledge_type || 'Khái niệm',
                        lesson_id: updatedLesson.lesson_id
                    })
                });
                return await res.json(); // Trả về unit mới tạo (có ID thật) từ Server
            }
        }));
    }

    // C. Trả về object Lesson hoàn chỉnh với danh sách Units mới nhất (đã có ID thật)
    return {
        ...updatedLesson,
        knowledge_units: newKnowledgeUnits
    };

  } catch (error) {
    console.error("Save Lesson Error:", error);
    throw error;
  }
};

// ==========================================
// 3. CÁC HÀM CRUD NODE (ADD/RENAME/DELETE)
// ==========================================

// Map 'type' sang cấu hình API
const getNodeConfig = (type) => {
  switch (type) {
    case 'grade': return { endpoint: 'grades', nameField: 'grade_level_name', idField: 'grade_level_id' };
    case 'subject': return { endpoint: 'subjects', nameField: 'subject_name', idField: 'subject_id' };
    case 'book': return { endpoint: 'books', nameField: 'book_name', idField: 'book_id' };
    case 'chapter': return { endpoint: 'chapters', nameField: 'chapter_name', idField: 'chapter_id' };
    case 'lesson': return { endpoint: 'lessons', nameField: 'lesson_name', idField: 'lesson_id' };
    case 'knowledge_unit': return { endpoint: 'knowledge-units', nameField: 'content', idField: 'knowledge_unit_id' };
    default: return null;
  }
};

export const renameNode = async (id, type, newName) => {
  const config = getNodeConfig(type);
  if (!config) throw new Error("Loại node không hợp lệ");

  const url = `${API_BASE_URL}/${config.endpoint}/${id}`;
  const body = { [config.nameField]: newName };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Lỗi đổi tên");
    return true;
  } catch (error) {
    console.error("Rename Error:", error);
    throw error;
  }
};

export const addNode = async (parentId, parentType, name) => {
  let childType = '';
  let parentField = '';
  
  if (parentType === 'root') { childType = 'grade'; parentField = ''; }
  else if (parentType === 'grade') { childType = 'subject'; parentField = 'grade_level_id'; }
  else if (parentType === 'subject') { childType = 'book'; parentField = 'subject_id'; }
  else if (parentType === 'book') { childType = 'chapter'; parentField = 'book_id'; }
  else if (parentType === 'chapter') { childType = 'lesson'; parentField = 'chapter_id'; }
  else { throw new Error("Không thể thêm node con cho loại này"); }

  const config = getNodeConfig(childType);
  const url = `${API_BASE_URL}/${config.endpoint}`;
  
  const body = { [config.nameField]: name };
  if (parentField) {
    body[parentField] = parseInt(parentId);
  }
  // Riêng grade cần value
  if (childType === 'grade') {
      const match = name.match(/\d+/);
      body['value'] = match ? parseInt(match[0]) : 0;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Lỗi thêm mới");
    return true;
  } catch (error) {
    console.error("Add Error:", error);
    throw error;
  }
};

export const deleteNode = async (id, type) => {
  const config = getNodeConfig(type);
  if (!config) throw new Error("Loại node không hợp lệ");

  const url = `${API_BASE_URL}/${config.endpoint}/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Lỗi xóa node");
    return true;
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};
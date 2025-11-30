// src/api/knowledgeApi.js

/**
 * Dữ liệu gốc (Giả lập Database)
 */
const KNOWLEDGE_DATA = {
  "education_data": [
    {
      "grade_level_id": 1,
      "grade_level_name": "Khối 10",
      "grade_level": 10,
      "subjects": [
        {
          "subject_id": 1,
          "subject_name": "Toán học",
          "books": [
            {
              "book_id": 1,
              "book_name": "Toán 10 - Kết nối tri thức",
              "chapters": [
                {
                  "chapter_id": 1,
                  "chapter_number": 1,
                  "chapter_name": "Chương 1: Mệnh đề và Tập hợp",
                  "lessons": [
                    {
                      "lesson_id": 1,
                      "lesson_number": 1,
                      "lesson_name": "Bài 1: Mệnh đề",
                      "description": "Bài học giới thiệu về các khái niệm cơ bản của mệnh đề toán học.",
                      "knowledge_units": [
                        { "knowledge_id": 1, "content": "Hiểu khái niệm mệnh đề, mệnh đề chứa biến.", "knowledge_type": "Concept" },
                        { "knowledge_id": 2, "content": "Biết cách xác định tính đúng/sai của một mệnh đề.", "knowledge_type": "Skill" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// --- 1. Các hàm lấy dữ liệu (GET) ---

export const fetchKnowledgeTree = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(KNOWLEDGE_DATA)));
    }, 300);
  });
};

// Helper: Tìm bài học (dùng cho editor bên phải)
const findLessonRecursive = (data, lessonId) => {
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

export const fetchLessonDetail = (lessonId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = findLessonRecursive(KNOWLEDGE_DATA, lessonId);
      resolve(lesson ? JSON.parse(JSON.stringify(lesson)) : null);
    }, 200);
  });
};

// --- 2. Các hàm cập nhật dữ liệu (UPDATE) ---

export const saveLessonData = (updatedLesson) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const original = findLessonRecursive(KNOWLEDGE_DATA, updatedLesson.lesson_id);
      if (original) {
        original.lesson_name = updatedLesson.lesson_name;
        original.description = updatedLesson.description;
        original.knowledge_units = updatedLesson.knowledge_units;
        resolve(true);
      } else {
        reject(new Error("Không tìm thấy bài học!"));
      }
    }, 300);
  });
};

// --- 3. CÁC HÀM CHO TÍNH NĂNG INLINE EDIT/ADD/DELETE ---

// Helper: Tìm node bất kỳ để sửa tên
const findNodeAndUpdate = (id, type, newName) => {
  const targetId = parseInt(id);
  
  for (const grade of KNOWLEDGE_DATA.education_data) {
    if (type === 'grade' && grade.grade_level_id === targetId) {
      grade.grade_level_name = newName; return true;
    }
    for (const subject of grade.subjects) {
      if (type === 'subject' && subject.subject_id === targetId) {
        subject.subject_name = newName; return true;
      }
      for (const book of subject.books) {
        if (type === 'book' && book.book_id === targetId) {
          book.book_name = newName; return true;
        }
        for (const chapter of book.chapters) {
          if (type === 'chapter' && chapter.chapter_id === targetId) {
            chapter.chapter_name = newName; return true;
          }
          if (chapter.lessons) {
            const lesson = chapter.lessons.find(l => l.lesson_id === targetId);
            if (type === 'lesson' && lesson) {
              lesson.lesson_name = newName; return true;
            }
          }
        }
      }
    }
  }
  return false;
};

export const renameNode = (id, type, newName) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = findNodeAndUpdate(id, type, newName);
      if (success) resolve(true);
      else reject(new Error("Không tìm thấy node để đổi tên"));
    }, 300);
  });
};

// Helper: Tìm node cha để thêm con
const findParentAndAddChild = (parentId, parentType, name) => {
  const pId = parseInt(parentId);
  const newId = Date.now(); // ID ngẫu nhiên

  // 1. Thêm Khối mới (Root)
  if (parentType === 'root') {
    KNOWLEDGE_DATA.education_data.push({
      grade_level_id: newId,
      grade_level_name: name,
      subjects: []
    });
    return true;
  }

  for (const grade of KNOWLEDGE_DATA.education_data) {
    // 2. Cha là Khối -> Thêm Môn
    if (parentType === 'grade' && grade.grade_level_id === pId) {
      grade.subjects.push({ subject_id: newId, subject_name: name, books: [] });
      return true;
    }
    for (const subject of grade.subjects) {
      // 3. Cha là Môn -> Thêm Sách
      if (parentType === 'subject' && subject.subject_id === pId) {
        subject.books.push({ book_id: newId, book_name: name, chapters: [] });
        return true;
      }
      for (const book of subject.books) {
        // 4. Cha là Sách -> Thêm Chương
        if (parentType === 'book' && book.book_id === pId) {
          book.chapters.push({ chapter_id: newId, chapter_name: name, lessons: [] });
          return true;
        }
        for (const chapter of book.chapters) {
          // 5. Cha là Chương -> Thêm Bài
          if (parentType === 'chapter' && chapter.chapter_id === pId) {
            if (!chapter.lessons) chapter.lessons = [];
            chapter.lessons.push({ 
              lesson_id: newId, 
              lesson_name: name, 
              knowledge_units: [] 
            });
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const addNode = (parentId, parentType, name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = findParentAndAddChild(parentId, parentType, name);
      if (success) resolve(true);
      else reject(new Error("Không tìm thấy cha để thêm con"));
    }, 300);
  });
};

// Helper: Tìm node cha để xóa con (MỚI)
const findParentAndDeleteChild = (id, type) => {
  const targetId = parseInt(id);

  // 1. Xóa Khối (Root)
  if (type === 'grade') {
    const initialLen = KNOWLEDGE_DATA.education_data.length;
    KNOWLEDGE_DATA.education_data = KNOWLEDGE_DATA.education_data.filter(g => g.grade_level_id !== targetId);
    return KNOWLEDGE_DATA.education_data.length < initialLen;
  }

  for (const grade of KNOWLEDGE_DATA.education_data) {
    // 2. Xóa Môn
    if (type === 'subject') {
      const idx = grade.subjects.findIndex(s => s.subject_id === targetId);
      if (idx !== -1) {
        grade.subjects.splice(idx, 1);
        return true;
      }
    }
    for (const subject of grade.subjects) {
      // 3. Xóa Sách
      if (type === 'book') {
        const idx = subject.books.findIndex(b => b.book_id === targetId);
        if (idx !== -1) {
          subject.books.splice(idx, 1);
          return true;
        }
      }
      for (const book of subject.books) {
        // 4. Xóa Chương
        if (type === 'chapter') {
          const idx = book.chapters.findIndex(c => c.chapter_id === targetId);
          if (idx !== -1) {
            book.chapters.splice(idx, 1);
            return true;
          }
        }
        for (const chapter of book.chapters) {
          // 5. Xóa Bài
          if (type === 'lesson' && chapter.lessons) {
            const idx = chapter.lessons.findIndex(l => l.lesson_id === targetId);
            if (idx !== -1) {
              chapter.lessons.splice(idx, 1);
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

// API: Xóa Node (MỚI)
export const deleteNode = (id, type) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = findParentAndDeleteChild(id, type);
      if (success) resolve(true);
      else reject(new Error("Không tìm thấy node để xóa"));
    }, 300);
  });
};
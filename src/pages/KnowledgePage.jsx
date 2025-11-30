// src/pages/KnowledgePage.jsx
import { useState, useEffect } from "react";
import {
  fetchKnowledgeTree,
  fetchLessonDetail,
  saveLessonData,
  renameNode,
  addNode,
  deleteNode // <--- 1. Import thêm hàm xóa
} from "../api/knowledgeApi";
import KnowledgeTree from "../components/knowledge/KnowledgeTree";
import LessonEditor from "../components/knowledge/LessonEditor";

export default function KnowledgePage() {
  // --- 1. State Management ---
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [currentLessonData, setCurrentLessonData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- 2. Load Tree Data ---
  const loadTree = async () => {
    try {
      const data = await fetchKnowledgeTree();
      setTreeData(data);
    } catch (error) {
      console.error("Lỗi tải cây kiến thức:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  // --- 3. Load Lesson Detail ---
  useEffect(() => {
    const loadLesson = async () => {
      if (!selectedLessonId) {
        setCurrentLessonData(null);
        return;
      }
      try {
        const data = await fetchLessonDetail(selectedLessonId);
        setCurrentLessonData(data);
      } catch (error) {
        console.error("Lỗi tải bài học:", error);
      }
    };
    loadLesson();
  }, [selectedLessonId]);

  // --- 4. Handlers ---

  // Chọn bài học
  const handleSelectNode = (nodeId, type) => {
    if (type === 'lesson') {
      setSelectedLessonId(nodeId);
    }
  };

  // Thêm Khối mới (Root)
  const handleAddRoot = async () => {
    const gradeName = prompt("Nhập tên Khối mới (Ví dụ: Khối 12):");
    if (gradeName && gradeName.trim() !== "") {
      await addNode(null, 'root', gradeName);
      loadTree();
    }
  };

  // Đổi tên Node (Inline)
  const handleRenameNode = async (id, type, newName) => {
    try {
      await renameNode(id, type, newName);

      if (type === 'lesson' && id === selectedLessonId) {
        setCurrentLessonData(prev => ({ ...prev, lesson_name: newName }));
      }

      loadTree();
    } catch (error) {
      alert("Lỗi đổi tên: " + error.message);
    }
  };

  // Thêm Node Con (Inline)
  const handleAddNode = async (parentId, parentType, name) => {
    try {
      await addNode(parentId, parentType, name);
      loadTree();
    } catch (error) {
      alert("Lỗi thêm mới: " + error.message);
    }
  };

  // LOGIC MỚI: Xóa Node
  const handleDeleteNode = async (id, type) => {
    // 1. Xác nhận trước khi xóa
    const confirmMsg = "Bạn có chắc chắn muốn xóa mục này không? Hành động này sẽ xóa cả các mục con bên trong.";
    if (!window.confirm(confirmMsg)) return;

    try {
      // 2. Gọi API xóa
      await deleteNode(id, type);

      // 3. Nếu mục bị xóa là bài học đang mở -> Reset Editor bên phải
      if (type === 'lesson' && id === selectedLessonId) {
        setSelectedLessonId(null);
        setCurrentLessonData(null);
      }
      // (Nâng cao: Nếu xóa Chương/Sách/Môn chứa bài học đang chọn thì cũng nên reset, 
      // nhưng ở mức độ mock đơn giản ta tạm bỏ qua hoặc reset thủ công nếu cần)

      // 4. Tải lại cây
      loadTree();
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };

  // Editor thay đổi
  const handleLessonChange = (field, value) => {
    setCurrentLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Lưu bài học
  const handleSave = async () => {
    if (!currentLessonData) return;
    setIsSaving(true);
    try {
      // 1. Gọi API và NHẬN KẾT QUẢ TRẢ VỀ (chứa ID thật)
      const updatedData = await saveLessonData(currentLessonData);
      
      // 2. CẬP NHẬT NGAY VÀO STATE
      // Việc này giúp các Unit đang có ID tạm chuyển thành ID thật ngay trên giao diện
      setCurrentLessonData(updatedData);

      alert("Đã lưu thay đổi thành công!");
      
      // 3. Load lại cây bên trái (để cập nhật tên bài học nếu có sửa)
      loadTree(); 
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !treeData) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="h-screen flex flex-col bg-bg-light overflow-hidden">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-medium text-text-primary sm:mb-0">
          Nội dung kiến thức
        </h2>
        <div className="flex space-x-3">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-border-medium rounded-lg text-sm font-medium hover:bg-gray-50 text-text-secondary transition-colors">
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!currentLessonData || isSaving}
              className={`px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${(!currentLessonData || isSaving) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                </svg>
              )}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>


      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <KnowledgeTree
          data={treeData}
          selectedId={selectedLessonId}
          onSelect={handleSelectNode}
          onAdd={handleAddRoot}
          onRenameNode={handleRenameNode}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode} // <--- Truyền hàm xóa xuống
        />

        <LessonEditor
          lessonData={currentLessonData}
          onChange={handleLessonChange}
        />
      </div>
    </div>
  );
}
// src/pages/CreateExam.jsx
import { useState, useEffect } from "react";
import { fetchKnowledgeTree } from "../api/knowledgeApi";
import FilterSection from "../components/FilterSection";
import KnowledgeTree from "../components/KnowledgeTree";
import MatrixTable from "../components/MatrixTable";

export default function CreateExam() {
  const [rawKnowledgeData, setRawKnowledgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayTreeData, setDisplayTreeData] = useState(null);
  const [selectedMatrixItems, setSelectedMatrixItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchKnowledgeTree();
        setRawKnowledgeData(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFilterChange = (filteredChapters) => {
    setDisplayTreeData(filteredChapters);
    setSelectedMatrixItems([]); 
  };

  const handleTreeItemToggle = (item, type, parents = {}) => {
    const rawId = type === 'chapter' ? item.chapter_id : type === 'lesson' ? item.lesson_id : item.knowledge_id;
    const uniqueId = `${type}-${rawId}`;

    setSelectedMatrixItems(prev => {
      const exists = prev.find(i => i.id === uniqueId);
      
      if (exists) {
        return prev.filter(i => i.id !== uniqueId);
      } else {
        const contentLabel = type === 'chapter' ? item.chapter_name 
                           : type === 'lesson' ? item.lesson_name 
                           : item.content;

        const chapterId = parents.chapterId || (type === 'chapter' ? rawId : null);
        const lessonId = parents.lessonId || (type === 'lesson' ? rawId : null);
        const knowledge_id = type === 'knowledge' ? rawId : null;

        const newItem = {
            id: uniqueId,
            content: contentLabel,
            chapterId: chapterId,
            lessonId: lessonId,
            knowledge_id: knowledge_id,

            // THAY ĐỔI Ở ĐÂY: Mặc định là chuỗi rỗng "" để input trống
            recognition: "",
            understanding: "",
            application: "",
            multiple_choice: "",
            essay: "",
            true_false: "",
            fill_in_blank: "",
            total_points: ""
        };

        return [...prev, newItem];
      }
    });
  };

  // THAY ĐỔI Ở ĐÂY: Xử lý input rỗng
  const handleUpdateMatrixItem = (id, field, value) => {
    // Nếu người dùng xóa hết, set về ""
    if (value === "") {
      setSelectedMatrixItems(prev => prev.map(item => 
        item.id === id ? { ...item, [field]: "" } : item
      ));
      return;
    }

    // Nếu nhập số, parse sang số nguyên
    let numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setSelectedMatrixItems(prev => prev.map(item => 
        item.id === id ? { ...item, [field]: numValue } : item
      ));
    }
  };

  const handleSave = () => {
    console.log("Dữ liệu lưu:", selectedMatrixItems);
    alert("Đã lưu! Kiểm tra Console (F12).");
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6 bg-bg-light min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-medium font-roboto text-text-primary">
          Xây dựng Ma trận Đề thi
        </h1>
      </div>

      <FilterSection 
        data={rawKnowledgeData} 
        onFilterChange={handleFilterChange} 
      />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 mt-6">
        <div className="w-full lg:w-1/3 xl:w-1/4 transition-all duration-300">
           <KnowledgeTree 
              data={displayTreeData} 
              selectedItems={selectedMatrixItems}
              onItemToggle={handleTreeItemToggle}
           />
        </div>

        <div className="w-full lg:w-2/3 xl:w-3/4">
           <MatrixTable 
              data={selectedMatrixItems} 
              onUpdateItem={handleUpdateMatrixItem}
              onSave={handleSave}
           />
        </div>
      </div>
    </div>
  );
}
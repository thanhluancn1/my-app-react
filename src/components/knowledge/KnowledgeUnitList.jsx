// src/components/knowledge/KnowledgeUnitList.jsx
import React from "react";

export default function KnowledgeUnitList({ units = [], onUnitsChange }) {
  
  // Thêm dòng mới
  const handleAdd = () => {
    const newUnit = {
      knowledge_id: Date.now(), // ID tạm
      content: "",
      knowledge_type: "Concept" // Mặc định
    };
    onUnitsChange([...units, newUnit]);
  };

  // Xóa dòng
  const handleDelete = (indexToDelete) => {
    const newUnits = units.filter((_, index) => index !== indexToDelete);
    onUnitsChange(newUnits);
  };

  // Cập nhật nội dung dòng (Content hoặc Type)
  const handleItemChange = (index, field, value) => {
    const newUnits = [...units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    onUnitsChange(newUnits);
  };

  return (
    <div className="bg-white rounded-xl border border-border-light flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-light flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm uppercase">
          <img src="https://unpkg.com/lucide-static/icons/layers.svg" className="w-4 h-4 text-text-secondary" alt="" />
          Đơn vị kiến thức (Knowledge Units)
        </h3>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-primary text-primary rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
        >
          <img src="https://unpkg.com/lucide-static/icons/plus.svg" className="w-3 h-3" alt="" /> 
          Thêm mới
        </button>
      </div>

      {/* List Content */}
      <div className="divide-y divide-gray-100">
        {units.length === 0 ? (
          <div className="p-8 text-center text-text-secondary italic text-sm">
            Chưa có đơn vị kiến thức nào. Bấm "Thêm mới" để bắt đầu.
          </div>
        ) : (
          units.map((unit, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex gap-3 items-start">
                {/* Drag Icon (Placeholder) */}
                <div className="mt-2 text-text-muted cursor-move" title="Sắp xếp">
                   <img src="https://unpkg.com/lucide-static/icons/grip-vertical.svg" className="w-4 h-4" alt="" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    {/* Select Type */}
                    <select
                      value={unit.knowledge_type || "Concept"}
                      onChange={(e) => handleItemChange(index, 'knowledge_type', e.target.value)}
                      className="p-2 border border-border-medium rounded text-xs font-medium bg-white focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                    >
                      <option value="Concept">Khái niệm (Concept)</option>
                      <option value="Skill">Kỹ năng (Skill)</option>
                    </select>

                    {/* Input Content */}
                    <input
                      type="text"
                      value={unit.content || ""}
                      onChange={(e) => handleItemChange(index, 'content', e.target.value)}
                      placeholder="Nhập nội dung kiến thức..."
                      className="flex-1 p-2 border border-border-medium rounded text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-text-primary"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(index)}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Xóa"
                >
                  <img src="https://unpkg.com/lucide-static/icons/trash-2.svg" className="w-4 h-4" alt="" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
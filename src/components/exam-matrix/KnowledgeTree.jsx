// src/components/KnowledgeTree.jsx
import { useState } from "react";

const TreeNode = ({ label, children, isLeaf, isChecked, onCheck }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isLeaf) setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-2">
      <div
        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 select-none 
        ${isLeaf ? 'ml-6 py-1' : 'bg-gray-50 hover:bg-gray-100 border border-border-medium'}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheck(e.target.checked)}
            onClick={(e) => e.stopPropagation()} 
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <span className={`text-sm ${isChecked ? "text-green-700 font-semibold" : "text-text-primary"}`}>
            {label}
          </span>
        </div>

        {!isLeaf && (
          <div className="p-1">
             <img src="https://unpkg.com/lucide-static/icons/chevron-down.svg" className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} alt="v" />
          </div>
        )}
      </div>

      {isExpanded && !isLeaf && (
        <div className="ml-3 mt-2 border-l-2 border-border-light pl-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default function KnowledgeTree({ data, selectedItems, onItemToggle }) {
  // LOGIC MỚI: Kiểm tra item đã chọn dựa trên quy tắc tạo ID
  const isSelected = (rawId, type) => {
    const checkId = `${type}-${rawId}`;
    return selectedItems.some(item => item.id === checkId);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-light h-full min-h-[500px] flex items-center justify-center p-6 text-text-secondary italic">
        Vui lòng chọn đầy đủ thông tin bộ lọc.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border-light h-full min-h-[600px] flex flex-col shadow-sm">
      <div className="p-4 border-b border-border-light bg-gray-50 rounded-t-xl">
        <h3 className="font-bold text-text-primary uppercase text-sm">Nội dung kiến thức</h3>
      </div>
      <div className="p-4 overflow-y-auto flex-1 max-h-[calc(100vh-250px)] custom-scrollbar">
        {data.map((chapter) => (
          <TreeNode
            key={`chap-${chapter.chapter_id}`}
            label={chapter.chapter_name}
            isLeaf={false}
            isChecked={isSelected(chapter.chapter_id, "chapter")}
            onCheck={() => onItemToggle(chapter, "chapter")}
          >
            {chapter.lessons?.map((lesson) => (
              <TreeNode
                key={`less-${lesson.lesson_id}`}
                label={lesson.lesson_name}
                isLeaf={false}
                isChecked={isSelected(lesson.lesson_id, "lesson")}
                onCheck={() => onItemToggle(lesson, "lesson", { chapterId: chapter.chapter_id })}
              >
                {lesson.knowledge_units?.map((unit) => (
                  <TreeNode
                    key={`unit-${unit.knowledge_id}`}
                    label={unit.content}
                    isLeaf={true}
                    isChecked={isSelected(unit.knowledge_id, "knowledge")}
                    onCheck={() => onItemToggle(unit, "knowledge", { chapterId: chapter.chapter_id, lessonId: lesson.lesson_id })}
                  />
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </div>
    </div>
  );
}
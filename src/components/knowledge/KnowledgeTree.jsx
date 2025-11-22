// src/components/knowledge/KnowledgeTree.jsx
import { useState, useRef, useEffect } from "react";

// Component hiển thị từng Node trong cây
const TreeNode = ({ 
  label, 
  icon, 
  children, 
  isSelected, 
  onClick, 
  onRename, 
  onAdd,
  addPlaceholder = "Nhập tên...", // <--- Prop MỚI: Placeholder tùy chỉnh
  onDelete, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(label);
  const renameInputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newChildValue, setNewChildValue] = useState("");
  const addInputRef = useRef(null);

  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (isAdding && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [isAdding]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren || isAdding) {
      setIsExpanded(!isExpanded);
    } else if (onClick) {
      onClick();
    }
  };

  const startRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setRenameValue(label);
  };

  const submitRename = () => {
    if (renameValue.trim() !== "" && renameValue !== label) {
      onRename(renameValue);
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') submitRename();
    if (e.key === 'Escape') {
      setRenameValue(label);
      setIsRenaming(false);
    }
  };

  const startAdd = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    setIsExpanded(true);
    setNewChildValue("");
  };

  const submitAdd = () => {
    if (newChildValue.trim() !== "") {
      onAdd(newChildValue);
    }
    setIsAdding(false);
    setNewChildValue("");
  };

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') submitAdd();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewChildValue("");
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div className="select-none">
      <div
        onClick={handleToggle}
        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 
          ${isSelected 
            ? "bg-blue-100 text-blue-700 border border-blue-200" 
            : "hover:bg-gray-100 text-text-secondary border border-transparent"
          }
        `}
      >
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {(hasChildren || isAdding) ? (
            <img
              src="https://unpkg.com/lucide-static/icons/chevron-down.svg"
              className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
              alt="toggle"
            />
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        <img 
          src={icon} 
          className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-text-secondary opacity-70"}`} 
          alt="icon" 
        />

        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={submitRename}
              onKeyDown={handleRenameKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-1 py-0.5 text-sm border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-text-primary"
            />
          ) : (
            <span className={`font-medium text-sm truncate block ${isSelected ? "font-bold" : ""}`}>
              {label}
            </span>
          )}
        </div>

        {!isRenaming && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAdd && (
              <button 
                onClick={startAdd}
                className="p-1 hover:bg-white rounded text-blue-600 hover:text-blue-800"
                title="Thêm mới cấp con"
              >
                <img src="https://unpkg.com/lucide-static/icons/plus.svg" className="w-3 h-3" alt="Add" />
              </button>
            )}
            <button 
              onClick={startRename}
              className="p-1 hover:bg-white rounded text-text-secondary hover:text-text-primary"
              title="Đổi tên"
            >
              <img src="https://unpkg.com/lucide-static/icons/edit-2.svg" className="w-3 h-3" alt="Edit" />
            </button>
            
            {onDelete && (
              <button 
                onClick={handleDelete}
                className="p-1 hover:bg-white rounded text-red-500 hover:text-red-700"
                title="Xóa"
              >
                <img src="https://unpkg.com/lucide-static/icons/trash-2.svg" className="w-3 h-3" alt="Delete" />
              </button>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="ml-4 border-l border-border-light pl-2 mt-1 space-y-1">
          {children}
          {isAdding && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200 border-dashed animate-fade-in">
              <div className="w-4 h-4" /> 
              <div className="w-4 h-4 flex-shrink-0">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mx-auto"></div>
              </div>
              <input
                ref={addInputRef}
                type="text"
                value={newChildValue}
                onChange={(e) => setNewChildValue(e.target.value)}
                onBlur={submitAdd}
                onKeyDown={handleAddKeyDown}
                // SỬ DỤNG PROP ADD PLACEHOLDER TẠI ĐÂY
                placeholder={addPlaceholder} 
                className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-text-primary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function KnowledgeTree({ 
  data, 
  selectedId, 
  onSelect, 
  onRenameNode,     
  onAddNode,
  onDeleteNode
}) {
  const [isAddingRoot, setIsAddingRoot] = useState(false);
  const [newRootName, setNewRootName] = useState("");
  const rootInputRef = useRef(null);

  useEffect(() => {
    if (isAddingRoot && rootInputRef.current) {
      rootInputRef.current.focus();
    }
  }, [isAddingRoot]);

  const handleSubmitRoot = () => {
    if (newRootName.trim() !== "") {
      onAddNode(null, 'root', newRootName);
    }
    setIsAddingRoot(false);
    setNewRootName("");
  };

  const handleRootKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmitRoot();
    if (e.key === 'Escape') {
      setIsAddingRoot(false);
      setNewRootName("");
    }
  };

  if (!data || !data.education_data) {
    return (
      <div className="w-[30%] min-w-[300px] bg-white border-r border-border-light flex flex-col h-full">
        <div className="p-4 border-b border-border-light bg-gray-50">
          <h3 className="font-bold text-text-primary text-sm uppercase">Cây thư mục</h3>
        </div>
        <div className="p-4 text-text-secondary italic text-sm">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <div className="w-[30%] min-w-[300px] bg-white border rounded-xl border-border-light flex flex-col h-full">
      {/* Header */}
      <div className="p-4 rounded-t-xl border-b border-border-light bg-gray-50 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-text-primary text-sm uppercase">Cây thư mục</h3>
        
        {/* Nút Thêm Khối Mới */}
        <button 
          onClick={() => setIsAddingRoot(true)}
          className="p-1.5 hover:bg-gray-200 rounded-md text-text-secondary transition-colors" 
          title="Thêm Khối mới"
        >
          <img src="https://unpkg.com/lucide-static/icons/plus.svg" className="w-4 h-4" alt="Add" />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
        
        {/* Level 1: Khối */}
        {data.education_data.map((grade) => (
          <TreeNode
            key={`grade-${grade.grade_level_id}`}
            label={grade.grade_level_name}
            icon="https://unpkg.com/lucide-static/icons/folder.svg"
            defaultExpanded={true}
            onRename={(newName) => onRenameNode(grade.grade_level_id, 'grade', newName)}
            onAdd={(childName) => onAddNode(grade.grade_level_id, 'grade', childName)}
            // TRUYỀN PLACEHOLDER CHO CẤP CON (MÔN HỌC)
            addPlaceholder="Nhập tên môn học..."
            onDelete={() => onDeleteNode(grade.grade_level_id, 'grade')} 
          >
            {/* Level 2: Môn học */}
            {grade.subjects?.map((subject) => (
              <TreeNode
                key={`subj-${subject.subject_id}`}
                label={subject.subject_name}
                icon="https://unpkg.com/lucide-static/icons/book.svg"
                onRename={(newName) => onRenameNode(subject.subject_id, 'subject', newName)}
                onAdd={(childName) => onAddNode(subject.subject_id, 'subject', childName)}
                // TRUYỀN PLACEHOLDER CHO CẤP CON (SÁCH)
                addPlaceholder="Nhập tên sách..."
                onDelete={() => onDeleteNode(subject.subject_id, 'subject')}
              >
                {/* Level 3: Sách */}
                {subject.books?.map((book) => (
                  <TreeNode
                    key={`book-${book.book_id}`}
                    label={book.book_name}
                    icon="https://unpkg.com/lucide-static/icons/book-open.svg"
                    onRename={(newName) => onRenameNode(book.book_id, 'book', newName)}
                    onAdd={(childName) => onAddNode(book.book_id, 'book', childName)}
                    // TRUYỀN PLACEHOLDER CHO CẤP CON (CHƯƠNG)
                    addPlaceholder="Nhập tên chương..."
                    onDelete={() => onDeleteNode(book.book_id, 'book')}
                  >
                    {/* Level 4: Chương */}
                    {book.chapters?.map((chapter) => (
                      <TreeNode
                        key={`chap-${chapter.chapter_id}`}
                        label={chapter.chapter_name}
                        icon="https://unpkg.com/lucide-static/icons/bookmark.svg"
                        onRename={(newName) => onRenameNode(chapter.chapter_id, 'chapter', newName)}
                        onAdd={(childName) => onAddNode(chapter.chapter_id, 'chapter', childName)}
                        // TRUYỀN PLACEHOLDER CHO CẤP CON (BÀI HỌC)
                        addPlaceholder="Nhập tên bài học..."
                        onDelete={() => onDeleteNode(chapter.chapter_id, 'chapter')}
                      >
                        {/* Level 5: Bài học (Lá) */}
                        {chapter.lessons?.map((lesson) => (
                          <TreeNode
                            key={`less-${lesson.lesson_id}`}
                            label={lesson.lesson_name}
                            icon="https://unpkg.com/lucide-static/icons/file-text.svg"
                            isSelected={selectedId === lesson.lesson_id}
                            onClick={() => onSelect(lesson.lesson_id, 'lesson')}
                            onRename={(newName) => onRenameNode(lesson.lesson_id, 'lesson', newName)}
                            onAdd={null} 
                            onDelete={() => onDeleteNode(lesson.lesson_id, 'lesson')}
                          />
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}

        {/* Inline Input cho Khối Mới (Root) */}
        {isAddingRoot && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200 border-dashed animate-fade-in mt-2">
            <img 
              src="https://unpkg.com/lucide-static/icons/folder.svg" 
              className="w-4 h-4 text-blue-500 opacity-70" 
              alt="icon" 
            />
            <input
              ref={rootInputRef}
              type="text"
              value={newRootName}
              onChange={(e) => setNewRootName(e.target.value)}
              onBlur={handleSubmitRoot}
              onKeyDown={handleRootKeyDown}
              placeholder="Nhập tên Khối mới..."
              className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-text-primary"
            />
          </div>
        )}

      </div>
    </div>
  );
}
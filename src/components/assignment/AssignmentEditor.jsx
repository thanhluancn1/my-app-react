// src/components/AssignmentEditor.jsx
import AssignmentEditorItem from "./AssignmentEditorItem";

export default function AssignmentEditor({ assignments, onUpdate, onDelete, onAdd }) {
  return (
    <div className="bg-gray-100 h-full flex flex-col rounded-l-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
            <p>Chưa có câu hỏi nào.</p>
            <button onClick={onAdd} className="mt-2 text-primary hover:underline">Thêm câu hỏi đầu tiên</button>
          </div>
        ) : (
          assignments.map((item, index) => (
            <AssignmentEditorItem
              key={item.assignment_id}
              index={index}
              item={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
        
        {/* Nút thêm câu hỏi cuối danh sách */}
        {assignments.length > 0 && (
            <button 
                onClick={onAdd}
                className="w-full py-4 mt-2 border-2 border-dashed border-border-medium rounded-xl text-text-secondary font-medium hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
                <span className="text-xl font-bold">+</span> Thêm câu hỏi mới
            </button>
        )}
      </div>
    </div>
  );
}
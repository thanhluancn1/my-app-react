// src/components/assignment-detail/AssignmentEditor.jsx
import AssignmentEditorItem from "./AssignmentEditorItem";

// Thêm props: batchInfo, onInfoChange
export default function AssignmentEditor({ 
  assignments, 
  batchInfo, 
  onUpdate, 
  onDelete, 
  onAdd, 
  onInfoChange 
}) {
  return (
    <div className="bg-gray-100 h-full flex flex-col rounded-l-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- 1. KHỐI CHỈNH SỬA THÔNG TIN CHUNG (MỚI) --- */}
        {batchInfo && (
            <div className="bg-white p-4 m-2 rounded-lg border border-border-medium animate-fade-in">
                <h3 className="font-bold text-text-primary mb-3 uppercase text-sm border-b border-border-light pb-2">
                    Thông tin đề thi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ô nhập Tên Đề Thi (Chiếm 2 cột) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Tên bài tập</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-border-medium rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-text-primary"
                            value={batchInfo.batch_name || ""}
                            onChange={(e) => onInfoChange("batch_name", e.target.value)}
                            placeholder="Nhập tên bài tập..."
                        />
                    </div>
                    
                    {/* Ô nhập Thời gian (Chiếm 1 cột) */}
                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Thời gian (phút)</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full p-2.5 border border-border-medium rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-center"
                            value={batchInfo.duration || ""}
                            onChange={(e) => onInfoChange("duration", e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* --- 2. DANH SÁCH CÂU HỎI (GIỮ NGUYÊN) --- */}
        <div className="p-2">
            {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
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
    </div>
  );
}
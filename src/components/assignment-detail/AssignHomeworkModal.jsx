import { useState, useEffect } from "react";

export default function AssignHomeworkModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableClasses = [],
}) {
  // --- State Form ---
  const [formData, setFormData] = useState({
    start_date: "",
    due_date: "",
    target_classes: [],
    target_students: [],
    allowViewScore: "submit_done", // Mặc định
    allowViewSolution: "submit_done", // Mặc định
    minScoreToViewSolution: "",
  });

  // Danh sách đối tượng học sinh cố định
  const STUDENT_GROUPS = [
    "Học sinh cả lớp",
    "Học sinh giỏi",
    "Học sinh khá",
    "Học sinh trung bình",
  ];

  // --- Effect: Load dữ liệu ban đầu ---
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        start_date: initialData.start_date ? formatDateTime(initialData.start_date) : "",
        due_date: initialData.due_date ? formatDateTime(initialData.due_date) : "",
        target_classes: initialData.target_classes || [],
        target_students: initialData.target_students || [],
        allowViewScore: initialData.allowViewScore || "submit_done",
        allowViewSolution: initialData.allowViewSolution || "submit_done",
        minScoreToViewSolution: initialData.minScoreToViewSolution || 0,
      });
    }
  }, [isOpen, initialData]);

  // Helper: Format ISO string sang YYYY-MM-DDThh:mm cho input datetime-local
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Cắt bỏ phần giây và múi giờ để khớp với input type="datetime-local"
    return date.toISOString().slice(0, 16);
  };

  // --- Handlers ---
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Checkbox Logic (Classes & Students)
  const handleCheckboxChange = (field, itemValue, isChecked) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (isChecked) {
        return { ...prev, [field]: [...currentList, itemValue] };
      } else {
        return { ...prev, [field]: currentList.filter((i) => i !== itemValue) };
      }
    });
  };

  // Logic "Chọn tất cả"
  const toggleAll = (field, allItems, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: isChecked ? allItems : [],
    }));
  };

  const handleSave = () => {
    // Convert lại date sang ISO string nếu cần thiết trước khi save
    const dataToSave = {
        ...formData,
        // Convert về dạng ISO đầy đủ nếu backend cần
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
    };
    onSave(dataToSave);
  };

  if (!isOpen) return null;

  // Kiểm tra trạng thái check all
  const isAllClassesChecked = availableClasses.length > 0 && formData.target_classes.length === availableClasses.length;
  const isAllStudentsChecked = formData.target_students.length === STUDENT_GROUPS.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-border-light animate-fade-in">
        
        {/* Header */}
        <div className="border-b border-border-light px-6 py-5">
          <h1 className="text-2xl font-semibold text-text-primary">Giao Bài Tập</h1>
          <p className="text-text-secondary text-sm mt-1">Cấu hình và gửi bài tập này cho các lớp của bạn.</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* 1. Chọn Lớp */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Giao cho Lớp</label>
            <div className="border border-border-light rounded-lg max-h-48 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-border-checkbox text-primary focus:ring-primary"
                  checked={isAllClassesChecked}
                  onChange={(e) => toggleAll('target_classes', availableClasses.map(c => c.class_name), e.target.checked)}
                />
                <label className="ml-3 text-sm font-medium text-text-primary">Tất cả các lớp</label>
              </div>
              <hr className="border-border-light" />
              {availableClasses.map((cls) => (
                <div key={cls.class_id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-border-checkbox text-primary focus:ring-primary"
                    checked={formData.target_classes.includes(cls.class_name)}
                    onChange={(e) => handleCheckboxChange('target_classes', cls.class_name, e.target.checked)}
                  />
                  <label className="ml-3 text-sm text-text-secondary">{cls.class_name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Chọn Đối tượng */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Đối tượng học sinh</label>
            <div className="border border-border-light rounded-lg p-4 space-y-3">
               <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-border-checkbox text-primary focus:ring-primary"
                  checked={isAllStudentsChecked}
                  onChange={(e) => toggleAll('target_students', STUDENT_GROUPS, e.target.checked)}
                />
                <label className="ml-3 text-sm text-text-secondary">Tất cả đối tượng</label>
              </div>
              {STUDENT_GROUPS.slice(1).map((studentType) => ( // Skip "Học sinh cả lớp" if handle separately or map specifically
                 <div key={studentType} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-border-checkbox text-primary focus:ring-primary"
                    checked={formData.target_students.includes(studentType)}
                    onChange={(e) => handleCheckboxChange('target_students', studentType, e.target.checked)}
                  />
                  <label className="ml-3 text-sm text-text-secondary">{studentType}</label>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Thời gian bắt đầu</label>
                <input 
                    type="datetime-local" 
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Thời gian kết thúc</label>
                <input 
                    type="datetime-local" 
                    value={formData.due_date}
                    onChange={(e) => handleChange('due_date', e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
          </div>

          {/* 4. Cấu hình xem điểm/đáp án */}
          <div className="pt-4 border-t border-border-light">
             <h4 className="text-sm font-semibold text-text-primary mb-4">Điểm và đáp án khi làm xong</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Xem điểm */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-text-primary">Cho xem điểm</label>
                    {['none:Không', 'submit_done:Khi làm bài xong', 'all_done:Khi tất cả thi xong'].map(opt => {
                        const [val, label] = opt.split(':');
                        return (
                            <div key={val} className="flex items-center">
                                <input 
                                    type="radio" 
                                    name="score-visibility"
                                    checked={formData.allowViewScore === val}
                                    onChange={() => handleChange('allowViewScore', val)}
                                    className="h-4 w-4 text-primary focus:ring-primary"
                                />
                                <label className="ml-2 text-sm text-text-secondary">{label}</label>
                            </div>
                        )
                    })}
                </div>

                {/* Xem đáp án */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-text-primary">Cho xem đề và đáp án</label>
                    {['none:Không', 'submit_done:Khi làm bài xong', 'all_done:Khi tất cả thi xong', 'threshold:Khi đạt số điểm nhất định'].map(opt => {
                        const [val, label] = opt.split(':');
                        return (
                            <div key={val} className="flex flex-col">
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="answer-visibility"
                                        checked={formData.allowViewSolution === val}
                                        onChange={() => handleChange('allowViewSolution', val)}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <label className="ml-2 text-sm text-text-secondary">{label}</label>
                                </div>
                                {/* Input điểm điều kiện */}
                                {val === 'threshold' && formData.allowViewSolution === 'threshold' && (
                                    <div className="ml-6 mt-2">
                                        <input 
                                            type="number" 
                                            placeholder="Nhập điểm"
                                            value={formData.minScoreToViewSolution}
                                            onChange={(e) => handleChange('minScoreToViewSolution', e.target.value)}
                                            className="w-32 h-9 px-3 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-border-light px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <button onClick={onClose} className="bg-white border border-border-light text-text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Hủy
            </button>
            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <img src="https://unpkg.com/lucide-static/icons/send.svg" className="w-4 h-4" style={{filter: 'invert(1)'}} alt="" />
                Giao Bài
            </button>
        </div>

      </div>
    </div>
  );
}
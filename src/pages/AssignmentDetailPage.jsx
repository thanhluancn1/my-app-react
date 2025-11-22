// src/pages/AssignmentDetailPage.jsx
import { useState, useEffect, useRef } from "react"; // Thêm useRef
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print"; // <--- IMPORT MỚI

import { fetchAssignmentsByBatchId } from "../api/examApi";
import AssignmentEditor from "../components/assignment/AssignmentEditor";
import AssignmentPreview from "../components/assignment/AssignmentPreview";
import AssignmentToolbar from "../components/assignment/AssignmentToolbar";
import CropImageModal from "../components/common/CropImageModal";

export default function AssignmentDetailPage() {
  const { batchId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref tham chiếu đến vùng cần in (Cột trái)
  const componentRef = useRef(null); // <--- REF MỚI

  const [viewSettings, setViewSettings] = useState({
    hideAnswers: false,
    hideSolutions: false
  });

  const [cropState, setCropState] = useState({
    isOpen: false,
    imageSrc: null,
    assignmentId: null,
    imageKey: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAssignmentsByBatchId(batchId);
        setAssignments(data);
      } catch (error) {
        console.error("Lỗi tải bài tập:", error);
      } finally {
        setLoading(false);
      }
    };
    if (batchId) loadData();
  }, [batchId]);

  // ... (Giữ nguyên các hàm handleUpdateAssignment, handleDeleteAssignment, handleAddAssignment, handleSplitScore, handleSaveExam) ...
  // (Để ngắn gọn, tôi ẩn các hàm logic cũ không đổi, bạn giữ nguyên chúng nhé)
  const handleUpdateAssignment = (id, field, value) => {
      setAssignments(prev => prev.map(item => item.assignment_id === id ? { ...item, [field]: value } : item));
  };
  const handleDeleteAssignment = (id) => {
      if (window.confirm("Xóa câu này?")) setAssignments(prev => prev.filter(i => i.assignment_id !== id));
  };
  const handleAddAssignment = () => {
      setAssignments(prev => [...prev, { assignment_id: Date.now(), question: "", score: 1, type: "Trắc nghiệm", images: {} }]);
  };
  const handleSplitScore = () => {
      if(assignments.length > 0) setAssignments(prev => prev.map(item => ({ ...item, score: parseFloat((10/assignments.length).toFixed(2)) })));
  };
  const handleSaveExam = () => alert("Đã lưu!");

  // --- HÀM IN MỚI (Thay thế handleDownloadPDF cũ) ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Tham chiếu đến ref cần in
    documentTitle: `De_thi_Batch_${batchId}`,
    // Tùy chọn: Ẩn/Hiện header/footer mặc định của trình duyệt
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  // ... (Giữ nguyên handlePreviewImageClick, handleSaveCrop) ...
  const handlePreviewImageClick = (e) => {
      if (e.target.tagName === 'IMG') {
          const img = e.target;
          const key = img.getAttribute('alt');
          const foundAssign = assignments.find(a => a.images && a.images[key]);
          if (foundAssign && key) {
              setCropState({ isOpen: true, imageSrc: img.src, assignmentId: foundAssign.assignment_id, imageKey: key });
          }
      }
  };
  const handleSaveCrop = (newBase64) => {
      if (cropState.assignmentId && cropState.imageKey) {
          setAssignments(prev => prev.map(item => {
              if (item.assignment_id === cropState.assignmentId) {
                  return { ...item, images: { ...item.images, [cropState.imageKey]: newBase64 } };
              }
              return item;
          }));
      }
      setCropState({ ...cropState, isOpen: false });
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="h-screen flex flex-col bg-bg-light overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-border-light z-10 shadow-sm">
          <div className="h-12 px-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">Đề thi</span>
                <span className="text-gray-400">/</span>
                <span className="font-bold text-text-primary">Chi tiết (Batch {batchId})</span>
             </div>
          </div>
          
          {/* Toolbar */}
          <AssignmentToolbar 
            viewSettings={viewSettings}
            onToggleSetting={(key, val) => setViewSettings(prev => ({...prev, [key]: val}))}
            onSplitScore={handleSplitScore}
            onDownload={handlePrint} // <--- Gắn hàm in mới vào nút Tải xuống
            onSave={handleSaveExam}
          />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Cột Trái: Preview */}
        <div 
            className="w-1/2 bg-white border-r border-border-light relative"
            onClick={handlePreviewImageClick} 
        >
            {/* Gắn REF vào thẻ div bao ngoài nội dung Preview */}
            <div ref={componentRef} className="h-full">
                <AssignmentPreview 
                    assignments={assignments}
                    viewSettings={viewSettings}
                />
            </div>
        </div>

        {/* Cột Phải: Editor */}
        <div className="w-1/2 bg-gray-50">
            <AssignmentEditor 
                assignments={assignments}
                onUpdate={handleUpdateAssignment}
                onDelete={handleDeleteAssignment}
                onAdd={handleAddAssignment}
            />
        </div>
      </div>

      {/* Modal Crop Ảnh */}
      <CropImageModal 
        isOpen={cropState.isOpen}
        imageSrc={cropState.imageSrc}
        onCancel={() => setCropState({ ...cropState, isOpen: false })}
        onSave={handleSaveCrop}
      />

    </div>
  );
}
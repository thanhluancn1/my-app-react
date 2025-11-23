// src/pages/AssignmentDetailPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { fetchAssignmentsByBatchId } from "../api/examApi";
// --- IMPORT MỚI ---
import { fetchSchoolData } from "../api/schoolApi";
import AssignHomeworkModal from "../components/assignment-detail/AssignHomeworkModal";
// -----------------

import AssignmentEditor from "../components/assignment-detail/AssignmentEditor";
import AssignmentPreview from "../components/assignment-detail/AssignmentPreview";
import AssignmentToolbar from "../components/assignment-detail/AssignmentToolbar";
import CropImageModal from "../components/common/CropImageModal";

export default function AssignmentDetailPage() {
  const { batchId } = useParams();
  
  const [assignments, setAssignments] = useState([]);
  const [batchInfo, setBatchInfo] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  const [viewSettings, setViewSettings] = useState({
    hideAnswers: false,
    hideSolutions: false
  });

  const [cropState, setCropState] = useState({
    isOpen: false, imageSrc: null, assignmentId: null, imageKey: null
  });

  // --- STATE MỚI ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [schoolClasses, setSchoolClasses] = useState([]);
  // -----------------

  // Load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load thông tin bài tập (Giữ nguyên logic cũ)
        const data = await fetchAssignmentsByBatchId(batchId);
        if (data) {
          const { assignments: loadedAssignments, ...info } = data;
          setAssignments(loadedAssignments);
          setBatchInfo(info);
        }

        // --- LOGIC MỚI: Load danh sách lớp học ---
        const classesData = await fetchSchoolData();
        setSchoolClasses(classesData);
        // -------------------------------------

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    if (batchId) loadData();
  }, [batchId]);

  const handleInfoChange = (field, value) => {
    setBatchInfo(prev => ({
        ...prev,
        [field]: value
    }));
  };

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
  
  // --- HÀM MỚI: Xử lý lưu cấu hình từ Modal giao bài ---
  const handleAssignSave = (assignedData) => {
    setBatchInfo(prev => ({
        ...prev,
        ...assignedData
    }));
    setIsAssignModalOpen(false);
    alert("Đã cập nhật thông tin giao bài! Hãy bấm 'Lưu đề' để ghi nhận vào hệ thống.");
  };
  // ----------------------------------------------------

  const handleSaveExam = () => {
    if (!batchInfo) return;
    
    let stats = {
        total_questions: assignments.length,
        total_points: 0,
        multiple_choice: 0, essay: 0, true_false: 0, fill_in_blank: 0,
    };
    assignments.forEach(q => {
        stats.total_points += (parseFloat(q.score) || 0);
        if (q.type === "Trắc nghiệm") stats.multiple_choice++;
        else if (q.type === "Tự luận") stats.essay++;
        else if (q.type === "Đúng/Sai") stats.true_false++;
        else stats.fill_in_blank++;
    });

    const finalData = {
        ...batchInfo, // Thông tin này đã bao gồm start_date, target_classes cập nhật từ modal
        ...stats,
        assignments: assignments
    };

    console.log(">>> DỮ LIỆU SAVE:", JSON.stringify(finalData, null, 2));
    alert("Đã lưu! Kiểm tra Console.");
  };

  const handlePrint = useReactToPrint({ contentRef: componentRef });
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
      <div className="bg-white border-b border-border-light z-10">
          <div className="h-12 px-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">Đề thi</span>
                <span className="text-text-muted">/</span>
                <span className="font-bold text-text-primary">
                    {batchInfo ? batchInfo.batch_name : `Batch ${batchId}`}
                </span>
             </div>
          </div>
          
          <AssignmentToolbar 
            viewSettings={viewSettings}
            onToggleSetting={(key, val) => setViewSettings(prev => ({...prev, [key]: val}))}
            onSplitScore={handleSplitScore}
            onDownload={handlePrint}
            onSave={handleSaveExam}
            // --- CẬP NHẬT: Truyền hàm mở modal ---
            onOpenAssign={() => setIsAssignModalOpen(true)}
          />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 bg-white border-r border-border-light relative" onClick={handlePreviewImageClick}>
            <div ref={componentRef} className="h-full">
                <AssignmentPreview 
                    assignments={assignments} 
                    viewSettings={viewSettings}
                    batchInfo={batchInfo} 
                />
            </div>
        </div>

        <div className="w-1/2 bg-gray-50">
            <AssignmentEditor 
                assignments={assignments}
                batchInfo={batchInfo}
                onInfoChange={handleInfoChange}
                onUpdate={handleUpdateAssignment}
                onDelete={handleDeleteAssignment}
                onAdd={handleAddAssignment}
            />
        </div>
      </div>

      <CropImageModal 
        isOpen={cropState.isOpen} 
        imageSrc={cropState.imageSrc} 
        onCancel={() => setCropState({ ...cropState, isOpen: false })} 
        onSave={handleSaveCrop} 
      />

      {/* --- MODAL GIAO BÀI (MỚI) --- */}
      <AssignHomeworkModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSave={handleAssignSave}
        initialData={batchInfo}
        availableClasses={schoolClasses}
      />
    </div>
  );
}
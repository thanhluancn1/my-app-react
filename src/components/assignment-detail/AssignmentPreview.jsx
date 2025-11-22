// src/components/assignment-detail/AssignmentPreview.jsx
import { useEffect, useRef } from "react";
import { marked } from "marked";

// Thêm prop 'batchInfo' vào đây
export default function AssignmentPreview({ assignments, viewSettings, batchInfo }) {
  const containerRef = useRef(null);

  // --- Effect: Kích hoạt MathJax ---
  useEffect(() => {
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]).catch((err) =>
        console.error("MathJax error:", err)
      );
    }
  }, [assignments, viewSettings, batchInfo]); // Thêm batchInfo vào dependency để render lại khi đổi tên đề

  // --- Helper: Xử lý nội dung ---
  const processContent = (assign, index) => {
    let raw = assign.question || "";

    // 1. Xử lý ảnh
    if (assign.images) {
      raw = raw.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        const cleanKey = key.trim();
        if (assign.images[cleanKey]) {
          return `<img src="${assign.images[cleanKey]}" alt="${cleanKey}" class="max-w-xs rounded shadow my-2 block mx-auto" />`;
        }
        return match;
      });
    }

    // 2. Tách Câu hỏi và Đáp án
    let questionPart = raw;
    let optionsPart = "";
    const optionsStartIndex = raw.search(/(?:^|\s)(A\.\s+)/);

    if (optionsStartIndex !== -1 && assign.type === "Trắc nghiệm") {
        questionPart = raw.substring(0, optionsStartIndex);
        optionsPart = raw.substring(optionsStartIndex);
    }

    // 3. Render Câu hỏi
    let html = `
      <div class="mb-2">
        <strong class="mr-1">Câu ${index + 1}</strong> 
        <span class="text-sm text-text-secondary font-normal">(${assign.score} điểm)</span> 
        <span class="inline-block">${marked.parse(questionPart)}</span>
      </div>
    `;

    // 4. Render Đáp án
    if (optionsPart && assign.type === "Trắc nghiệm") {
        const correctAnswers = (assign.answer || "").split(",").map(s => s.trim().toUpperCase());
        const showResult = !viewSettings.hideAnswers;
        const lines = optionsPart.split('\n');
        let optionsHtml = `<div class="space-y-3 mt-2">`;

        lines.forEach(line => {
            if (!line.trim()) return;
            const parts = line.split(/(?:^|\s|\t)([A-D]\.\s+)/).filter(Boolean);
            const rowOptions = [];
            for (let i = 0; i < parts.length; i += 2) {
                if (parts[i+1]) {
                    rowOptions.push({
                        label: parts[i].trim().replace('.', ''),
                        content: parts[i+1].trim()
                    });
                }
            }

            if (rowOptions.length > 0) {
                let gridClass = "grid-cols-1";
                if (rowOptions.length === 2) gridClass = "grid-cols-1 sm:grid-cols-2";
                if (rowOptions.length === 3) gridClass = "grid-cols-1 sm:grid-cols-3";
                if (rowOptions.length >= 4) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

                optionsHtml += `<div class="grid ${gridClass} gap-4">`;
                rowOptions.forEach(opt => {
                    const isCorrect = correctAnswers.includes(opt.label);
                    let containerStyle = "flex items-start gap-2";
                    let labelStyle = "font-bold text-text-primary min-w-[24px]";
                    
                    if (showResult && isCorrect) {
                        containerStyle = "flex items-start gap-2";
                        labelStyle = "border-2 border-gray-700 rounded-full font-bold text-text-primary min-w-[24px]";
                    }
                    const contentHtml = marked.parseInline(opt.content);
                    optionsHtml += `
                        <div class="${containerStyle}">
                            <span class="${labelStyle}">${opt.label}.</span>
                            <span class="text-text-primary leading-snug flex-1">${contentHtml}</span>
                        </div>
                    `;
                });
                optionsHtml += `</div>`;
            }
        });
        optionsHtml += `</div>`;
        html += optionsHtml;
    }
    return html;
  };

  return (
    <div ref={containerRef} className="h-full overflow-y-auto p-8 bg-white print:p-0" id="preview-content">
      {assignments.length === 0 ? (
        <div className="text-center text-text-muted italic mt-10">
          Chưa có câu hỏi nào để xem trước.
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* --- HEADER ĐỘNG: Lấy từ batchInfo --- */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-text-primary">
                    {batchInfo?.batch_name || "Đề thi tham khảo"}
                </h2>
                <div className="flex justify-center gap-8 mt-2 text-sm text-text-secondary font-medium">
                    <span>Môn: {batchInfo?.subject_name || "..."}</span>
                    <span>Thời gian: {batchInfo?.duration || 0} phút</span>
                </div>
            </div>

            {/* Body */}
            {assignments.map((assign, index) => (
                <div key={assign.assignment_id} className="preview-item text-text-primary text-base leading-relaxed break-inside-avoid">
                    {/* Nội dung */}
                    <div 
                        className="question-block [&>p]:inline [&>p]:m-0"
                        dangerouslySetInnerHTML={{ __html: processContent(assign, index) }} 
                    />

                    {/* Đáp án (cho Tự luận) */}
                    {!viewSettings.hideAnswers && assign.type !== "Trắc nghiệm" && assign.answer && (
                         <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded border border-blue-100">
                            Đáp án: {assign.answer}
                         </div>
                    )}

                    {/* Hướng dẫn giải */}
                    {!viewSettings.hideSolutions && assign.solution_guide && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 text-sm text-text-primary animate-fade-in">
                            <strong className="text-green-700 block mb-2 uppercase text-xs tracking-wider">Hướng dẫn giải:</strong>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(assign.solution_guide) }} />
                        </div>
                    )}

                </div>
            ))}
            
            <div className="text-center text-text-muted text-sm border-t border-gray-200 mt-12 pt-6">
                --- HẾT ---
            </div>
        </div>
      )}
    </div>
  );
}
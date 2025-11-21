// src/components/AssignmentPreview.jsx
import { useEffect, useRef } from "react";
import { marked } from "marked";

export default function AssignmentPreview({ assignments, viewSettings }) {
  const containerRef = useRef(null);

  // --- Effect: Kích hoạt MathJax ---
  useEffect(() => {
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]).catch((err) =>
        console.error("MathJax error:", err)
      );
    }
  }, [assignments, viewSettings]);

  // --- Helper: Xử lý nội dung ---
  const processContent = (assign, index) => {
    let raw = assign.question || "";

    // 1. Xử lý ảnh: Thay thế {{key}} bằng thẻ <img>
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
    
    // Tìm vị trí bắt đầu của "A. " (đứng đầu dòng hoặc sau khoảng trắng)
    const optionsStartIndex = raw.search(/(?:^|\s)(A\.\s+)/);

    if (optionsStartIndex !== -1 && assign.type === "Trắc nghiệm") {
        questionPart = raw.substring(0, optionsStartIndex);
        optionsPart = raw.substring(optionsStartIndex);
    }

    // 3. Render Câu hỏi (Markdown)
    let html = `
      <div class="mb-2">
        <strong class="mr-1">Câu ${index + 1}</strong> 
        <span class="text-sm text-gray-500 font-normal">(${assign.score} điểm)</span> 
        <span class="inline-block">${marked.parse(questionPart)}</span>
      </div>
    `;

    // 4. Render Đáp án (Logic Mới: Xử lý theo từng dòng)
    if (optionsPart && assign.type === "Trắc nghiệm") {
        // Lấy đáp án đúng để highlight
        const correctAnswers = (assign.answer || "").split(",").map(s => s.trim().toUpperCase());
        const showResult = !viewSettings.hideAnswers;

        // Tách các dòng dựa trên ký tự xuống dòng (\n)
        const lines = optionsPart.split('\n');

        let optionsHtml = `<div class="space-y-3 mt-2">`; // Container bao ngoài

        lines.forEach(line => {
            if (!line.trim()) return; // Bỏ qua dòng trống

            // Tách các lựa chọn trong dòng này (A., B., C., D.)
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
                // Xác định số cột dựa trên số lượng đáp án tìm thấy trong dòng này
                let gridClass = "grid-cols-1"; // Mặc định 1 cột (1 đáp án/dòng)
                if (rowOptions.length === 2) gridClass = "grid-cols-1 sm:grid-cols-2";
                if (rowOptions.length === 3) gridClass = "grid-cols-1 sm:grid-cols-3";
                if (rowOptions.length >= 4) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

                optionsHtml += `<div class="grid ${gridClass} gap-4">`;

                rowOptions.forEach(opt => {
                    const isCorrect = correctAnswers.includes(opt.label);
                    
                    let containerStyle = "rounded-lg flex items-start gap-2 hover:bg-gray-50 transition-colors";
                    let labelStyle = "font-bold text-gray-700 min-w-[24px]";
                    
                    if (showResult && isCorrect) {
                        containerStyle = "border-2 border-primary bg-blue-50 p-3 rounded-lg flex items-start gap-2 shadow-sm";
                        labelStyle = "font-bold text-primary min-w-[24px]";
                    }

                    // Render nội dung đáp án (có hỗ trợ Markdown/MathJax bên trong)
                    const contentHtml = marked.parseInline(opt.content);

                    optionsHtml += `
                        <div class="${containerStyle}">
                            <span class="${labelStyle}">${opt.label}.</span>
                            <span class="text-text-primary leading-snug flex-1">${contentHtml}</span>
                        </div>
                    `;
                });

                optionsHtml += `</div>`; // Đóng grid dòng này
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
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Đề thi tham khảo</h2>
                <div className="flex justify-center gap-8 mt-2 text-sm text-gray-600 font-medium">
                    <span>Môn: Toán học</span>
                    <span>Thời gian: 45 phút</span>
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
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 text-sm text-gray-800 animate-fade-in">
                            <strong className="text-green-700 block mb-2 uppercase text-xs tracking-wider">Hướng dẫn giải:</strong>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(assign.solution_guide) }} />
                        </div>
                    )}

                </div>
            ))}
            
            <div className="text-center text-gray-400 text-sm border-t border-gray-200 mt-12 pt-6">
                --- HẾT ---
            </div>
        </div>
      )}
    </div>
  );
}
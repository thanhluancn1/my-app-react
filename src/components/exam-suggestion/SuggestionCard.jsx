// src/components/exam-suggestion/SuggestionCard.jsx
import React from "react";

export default function SuggestionCard({ title, batch, onClick }) {
  const hasBatch = Boolean(batch);
  const cardClasses = hasBatch
    ? "bg-white border border-border-medium rounded-xl p-4 cursor-pointer"
    : "bg-white border border-border-medium rounded-xl p-4 opacity-60 cursor-default";

  const handleClick = () => {
    // SỬA: batch.batch_id -> batch.exam_batch_id
    if (hasBatch && onClick) {
      onClick(batch.exam_batch_id);
    }
  };

  const recognition = batch?.recognition || 0;
  const understanding = batch?.understanding || 0;
  const application = batch?.application || 0;

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* ... (Phần UI giữ nguyên) */}
      <div className="flex flex-col gap-3 items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-base text-text-primary capitalize">{title}</h3>
        </div>
        <div className="w-full h-px bg-border-light"></div>
        <p className="font-medium text-sm text-text-secondary">Số lượng bài tập</p>
        <div className="w-full space-y-1">
          <div className="flex justify-between items-start w-full text-base">
            <span className="font-normal text-text-secondary">Nhận biết:</span>
            <span className="font-medium text-text-primary">{recognition} bài</span>
          </div>
          <div className="flex justify-between items-start w-full text-base">
            <span className="font-normal text-text-secondary">Thông hiểu:</span>
            <span className="font-medium text-text-primary">{understanding} bài</span>
          </div>
          <div className="flex justify-between items-start w-full text-base">
            <span className="font-normal text-text-secondary">Vận dụng:</span>
            <span className="font-medium text-text-primary">{application} bài</span>
          </div>
        </div>
      </div>
    </div>
  );
}
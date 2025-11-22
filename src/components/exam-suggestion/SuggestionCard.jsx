// src/components/SuggestionCard.jsx
import React from "react";

export default function SuggestionCard({ title, batch, onClick }) {
  const hasBatch = Boolean(batch);

  // Style động: Nếu có batch thì sáng, không thì mờ và không click được
  const cardClasses = hasBatch
    ? "bg-white border border-border-medium rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md"
    : "bg-white border border-border-medium rounded-xl p-4 opacity-60 cursor-default";

  const handleClick = () => {
    if (hasBatch && onClick) {
      onClick(batch.batch_id);
    }
  };

  // Lấy số liệu (hoặc 0 nếu không có batch)
  const recognition = batch?.recognition || 0;
  const understanding = batch?.understanding || 0;
  const application = batch?.application || 0;

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="flex flex-col gap-3 items-start">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-base text-text-primary capitalize">
            {title}
          </h3>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-light"></div>

        {/* Subtitle */}
        <p className="font-medium text-sm text-text-secondary">
          Số lượng bài tập
        </p>

        {/* Stats List */}
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
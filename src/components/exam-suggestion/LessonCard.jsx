// src/components/LessonCard.jsx
import SuggestionCard from "./SuggestionCard";

export default function LessonCard({ lesson, onCardClick }) {
  // Danh sách các đối tượng học sinh cần hiển thị (Hard-code theo giao diện cũ)
  const studentTypes = [
    'Học sinh cả lớp', 
    'Học sinh giỏi',
    'Học sinh khá', 
    'Học sinh trung bình'
  ];

  return (
    <div className="bg-white border border-border-medium rounded-xl p-6 w-full mb-6 shadow-sm">
      <div className="flex flex-col gap-4 items-start w-full">
        
        {/* Lesson Title */}
        <div className="flex font-medium gap-2 items-center text-lg text-text-primary w-full">
          <span>{lesson.lesson_name}</span>
        </div>

        {/* Grid of Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {studentTypes.map((type) => {
            // Tìm batch tương ứng với đối tượng học sinh (So sánh chữ thường để chính xác)
            const matchingBatch = lesson.assignment_batches.find(batch => 
              batch.target_student.toLowerCase() === type.toLowerCase()
            );

            return (
              <SuggestionCard 
                key={type} 
                title={type} 
                batch={matchingBatch} 
                onClick={onCardClick} // Truyền hàm xử lý click xuống
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}
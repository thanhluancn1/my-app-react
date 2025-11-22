// src/components/ClassAssignmentGroup.jsx
import AssignmentCard from "./AssignmentCard";

export default function ClassAssignmentGroup({ classData }) {
  const { class_name, assignment_batches } = classData;

  return (
    <div className="w-full bg-white border border-border-light rounded-xl p-6">
      {/* Header: Tên lớp */}
      <div className="mb-6 border-border-light">
        <h3 className="text-xl font-semibold text-text-primary">
          {class_name}
        </h3>
        <span className="text-sm text-text-secondary">
            Sĩ số: {classData.student_count} học sinh
        </span>
      </div>

      {/* Grid: Danh sách bài tập */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assignment_batches && assignment_batches.length > 0 ? (
          assignment_batches.map((batch) => (
            <AssignmentCard key={batch.batch_id} batch={batch} />
          ))
        ) : (
          <div className="col-span-full py-8 flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border-light rounded-lg">
            <p className="italic">Chưa có bài tập nào được giao cho lớp này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
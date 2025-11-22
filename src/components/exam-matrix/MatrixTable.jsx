// src/components/MatrixTable.jsx
import { useMemo } from "react";

export default function MatrixTable({ data, onUpdateItem, onSave }) {
  // THAY ĐỔI Ở ĐÂY: Tính tổng an toàn với chuỗi rỗng
  const totals = useMemo(() => {
    const parse = (val) => Number(val) || 0; // Helper: chuyển "" thành 0

    return data.reduce((acc, item) => ({
      recognition: acc.recognition + parse(item.recognition),
      understanding: acc.understanding + parse(item.understanding),
      application: acc.application + parse(item.application),
      multiple_choice: acc.multiple_choice + parse(item.multiple_choice),
      essay: acc.essay + parse(item.essay),
      true_false: acc.true_false + parse(item.true_false),
      fill_in_blank: acc.fill_in_blank + parse(item.fill_in_blank),
      total_points: acc.total_points + parse(item.total_points),
    }), { 
      recognition: 0, understanding: 0, application: 0, 
      multiple_choice: 0, essay: 0, true_false: 0, fill_in_blank: 0, 
      total_points: 0 
    });
  }, [data]);

  const renderInput = (item, field) => (
    <input
      type="number"
      min="0"
      // Giá trị có thể là số hoặc chuỗi rỗng
      value={item[field]}
      onChange={(e) => onUpdateItem(item.id, field, e.target.value)}
      // Thêm placeholder nếu muốn gợi ý (tuỳ chọn)
      // placeholder="0" 
      className="w-12 text-center border border-border-medium rounded px-1 py-1 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    />
  );

  return (
    <div className="bg-white rounded-xl border border-border-light shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-border-light">
         <h3 className="font-bold text-text-primary uppercase text-sm">Bảng Đề Xuất Đề Thi</h3>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse">
          <thead className="bg-bg-light sticky top-0 z-10">
            <tr>
              <th rowSpan="2" className="px-4 py-3 text-left text-xs font-semibold text-text-secondary border-r border-b border-border-light uppercase">STT</th>
              <th rowSpan="2" className="px-4 py-3 text-left text-xs font-semibold text-text-secondary border-r border-b border-border-light uppercase w-1/3">Nội dung</th>
              <th colSpan="3" className="px-2 py-2 text-center text-xs font-semibold text-text-secondary border-r border-b border-border-light uppercase bg-blue-50">Mức độ nhận thức</th>
              <th colSpan="4" className="px-2 py-2 text-center text-xs font-semibold text-text-secondary border-r border-b border-border-light uppercase bg-green-50">Số câu hỏi</th>
              <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-text-secondary border-b border-border-light uppercase">Điểm</th>
            </tr>
            <tr>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-blue-50">NB</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-blue-50">TH</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-blue-50">VD</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-green-50">TN</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-green-50">TL</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-green-50">ĐS</th>
              <th className="px-2 py-2 text-center text-[10px] font-medium text-text-secondary border-r border-b border-border-light bg-green-50">Điền</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="11" className="text-center py-8 text-text-muted italic">Chưa có nội dung nào được chọn.</td></tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b border-border-light hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-sm text-text-secondary">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{item.content}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'recognition')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'understanding')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'application')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'multiple_choice')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'essay')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'true_false')}</td>
                  <td className="px-2 py-2 text-center">{renderInput(item, 'fill_in_blank')}</td>
                  <td className="px-2 py-2 text-center font-bold text-primary">{renderInput(item, 'total_points')}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-50 font-bold text-text-primary sticky bottom-0">
            <tr>
              <td colSpan="2" className="px-4 py-3 text-right uppercase text-xs">Tổng cộng</td>
              <td className="text-center px-2">{totals.recognition}</td>
              <td className="text-center px-2">{totals.understanding}</td>
              <td className="text-center px-2">{totals.application}</td>
              <td className="text-center px-2">{totals.multiple_choice}</td>
              <td className="text-center px-2">{totals.essay}</td>
              <td className="text-center px-2">{totals.true_false}</td>
              <td className="text-center px-2">{totals.fill_in_blank}</td>
              <td className="text-center px-2 text-primary">{totals.total_points}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="p-4 border-t border-border-light flex justify-end gap-3 bg-white rounded-b-xl">
        <button className="px-4 py-2 border border-border-medium rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">
          Hủy
        </button>
        <button onClick={onSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
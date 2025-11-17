// src/pages/Student.jsx
import { useState, useEffect } from "react";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api/studentApi";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await fetchStudents();
    setStudents(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newName || !newAge) return;
    const student = await addStudent({ name: newName, age: parseInt(newAge) });
    setStudents([...students, student]);
    setNewName("");
    setNewAge("");
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Tên mới:");
    const newAge = prompt("Tuổi mới:");
    if (!newName || !newAge) return;
    await updateStudent(id, { name: newName, age: parseInt(newAge) });
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      await deleteStudent(id);
      loadStudents();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Danh sách học sinh</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Tên"
          className="border p-2 rounded"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tuổi"
          className="border p-2 rounded"
          value={newAge}
          onChange={(e) => setNewAge(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={handleAdd}
        >
          Thêm
        </button>
      </div>

      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center p-4 border rounded shadow"
          >
            <div>
              <p className="font-semibold">{s.name}</p>
              <p>Tuổi: {s.age}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-400 text-white px-3 rounded"
                onClick={() => handleUpdate(s.id)}
              >
                Sửa
              </button>
              <button
                className="bg-red-500 text-white px-3 rounded"
                onClick={() => handleDelete(s.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

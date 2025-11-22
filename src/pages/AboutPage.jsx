// src/pages/About.jsx
import { useEffect, useState } from "react";
import { fetchAboutData } from "../api/aboutData";

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">{data.title}</h1>
      <p className="text-text-secondary">{data.description}</p>

      <h2 className="text-2xl font-semibold mt-4">Team Members</h2>
      <ul className="space-y-2">
        {data.team.map((member) => (
          <li
            key={member.id}
            className="p-3 border rounded shadow hover:bg-gray-50 flex justify-between"
          >
            <span className="font-medium">{member.name}</span>
            <span className="text-text-secondary">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

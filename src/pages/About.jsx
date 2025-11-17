// src/pages/About.jsx
import { useEffect, useState } from "react";
import { fetchAboutData } from "../api/sampleApi";

export default function About() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">About Page</h1>
      <p className="text-gray-600 text-lg">
        Dữ liệu được load từ mock API.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-xl shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

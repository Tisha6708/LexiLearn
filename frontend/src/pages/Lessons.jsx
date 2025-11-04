import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await API.get("/lessons/");
        setLessons(res.data.lessons);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading lessons...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">
        Available Lessons 📚
      </h2>

      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons available.</p>
      ) : (
        lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white shadow p-4 mb-4 rounded-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {lesson.title}
            </h3>
            <p className="text-gray-600 mb-2">
              {lesson.content.slice(0, 100)}...
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Level: {lesson.reading_level}
            </p>
            <button
              onClick={() => navigate(`/student/practice?lessonId=${lesson.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Start Practice
            </button>
          </div>
        ))
      )}
    </div>
  );
}

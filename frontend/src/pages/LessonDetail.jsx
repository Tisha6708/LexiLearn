import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await API.get(`/lessons/${id}`);
        setLesson(res.data.lesson);
      } catch (err) {
        console.error("Error fetching lesson details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading lesson...</p>
      </div>
    );

  if (!lesson)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Lesson not found!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-3xl w-full border border-gray-100"
      >
        {/* Lesson Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">
            {lesson.title}
          </h1>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              lesson.reading_level === "basic"
                ? "bg-blue-100 text-blue-700"
                : lesson.reading_level === "intermediate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {lesson.reading_level.toUpperCase()}
          </span>
        </div>

        {/* Lesson Content */}
        <div className="text-left text-gray-800 leading-relaxed space-y-4 text-lg font-[OpenDyslexic, sans-serif]">
          {lesson.content.split("\n").map((para, i) => (
            <p key={i} className="tracking-wide">
              {para}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex justify-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate(`/student/practice?lessonId=${lesson.id}`)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Start Practice →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

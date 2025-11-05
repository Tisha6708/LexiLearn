import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import API from "../services/api";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLessonUnlocked, setNewLessonUnlocked] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const res = await API.get("/lessons/");
        const allLessons = res.data.lessons || [];
        setLessons(allLessons);

        // detect newly added lesson
        const prevCount = parseInt(localStorage.getItem("lastLessonCount") || "0");
        if (allLessons.length > prevCount && prevCount !== 0) {
          const newLesson = allLessons[allLessons.length - 1];
          triggerLevelUnlock(newLesson);
        }
        localStorage.setItem("lastLessonCount", allLessons.length);

        // fetch user session progress
        const token = localStorage.getItem("lexi_token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub;
        const sessionRes = await API.get(`/sessions/user/${userId}`);
        const completedIds = (sessionRes.data.sessions || []).map((s) => s.lesson_id);
        setCompletedLessons(completedIds);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonsAndProgress();
  }, []);

  const triggerLevelUnlock = (lesson) => {
    setNewLessonUnlocked(lesson);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#16a34a", "#facc15", "#f97316"],
    });
    setTimeout(() => setNewLessonUnlocked(null), 3000);
  };

  const getColor = (level) => {
    switch (level?.toLowerCase()) {
      case "basic":
        return "from-blue-400 to-blue-600";
      case "intermediate":
        return "from-orange-400 to-orange-600";
      case "advanced":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading your learning path...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 relative">
      {/* 🎉 New Lesson Unlocked Banner */}
      <AnimatePresence>
        {newLessonUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-lg z-50"
          >
            <h3 className="text-lg font-semibold tracking-wide">
              🎉 New Level Unlocked: {newLessonUnlocked.title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-3">
          Your Learning Journey 🚀
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Progress through interactive reading lessons designed to strengthen your focus and fluency.
        </p>
      </div>

      {/* Lesson Path */}
      <div className="relative flex flex-col items-center space-y-10">
        {/* Connecting Line */}
        <div className="absolute w-1 bg-gradient-to-b from-blue-300 to-blue-600 h-full left-1/2 transform -translate-x-1/2 z-0 rounded-full opacity-30"></div>

        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isUnlocked =
            isCompleted ||
            completedLessons.includes(lessons[index - 1]?.id) ||
            index === 0;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
              className={`relative z-10 w-full md:w-2/3 bg-white rounded-3xl p-6 border transition-all duration-300 ${isUnlocked
                  ? "border-blue-400 hover:shadow-xl shadow-md"
                  : "border-gray-200 opacity-60"
                }`}
            >
              {/* Timeline Node */}
              <div
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 w-6 h-6 rounded-full border-4 ${isCompleted
                    ? "bg-green-500 border-green-200"
                    : isUnlocked
                      ? "bg-blue-400 border-blue-100 animate-pulse"
                      : "bg-gray-300 border-gray-200"
                  }`}
              ></div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Level {index + 1}: {lesson.title}
              </h3>

              <span
                className={`inline-block text-sm mb-3 bg-gradient-to-r ${getColor(
                  lesson.reading_level
                )} text-white px-3 py-1 rounded-full shadow-sm`}
              >
                {lesson.reading_level.charAt(0).toUpperCase() +
                  lesson.reading_level.slice(1)}
              </span>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {lesson.content.slice(0, 120)}...
              </p>

              <div className="flex justify-between items-center">
                {isUnlocked || isCompleted ? (
                  <button
                    onClick={() =>
                      navigate(`/student/practice?lessonId=${lesson.id}`)
                    }
                    className={`px-5 py-2 rounded-lg font-semibold transition ${isCompleted
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    {isCompleted ? "Review Lesson" : "Start Lesson"}
                  </button>
                ) : (
                  <span className="text-gray-400 italic flex items-center gap-1">
                    🔒 Locked
                  </span>
                )}

                {isUnlocked && !isCompleted && (
                  <span className="text-xs text-blue-600 italic">
                    Tip: Read clearly and confidently to level up!
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full md:w-2/3 bg-gradient-to-r from-gray-100 to-gray-200 border border-dashed border-gray-400 rounded-3xl p-6 text-center shadow-inner mt-8"
        >
          <div className="animate-pulse">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              🌟 New Levels Coming Soon!
            </h3>
            <p className="text-gray-600">
              Our teachers are preparing your next set of reading adventures.
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce mx-1"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce mx-1 [animation-delay:.15s]"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce mx-1 [animation-delay:.3s]"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

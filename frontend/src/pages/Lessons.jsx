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
  const [speakingLesson, setSpeakingLesson] = useState(null);
  const [spokenIndex, setSpokenIndex] = useState(-1);
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const res = await API.get("/lessons/");
        const allLessons = res.data.lessons || [];
        setLessons(allLessons);

        const prevIds = JSON.parse(localStorage.getItem("seenLessons") || "[]");
        const newLessons = allLessons.filter((l) => !prevIds.includes(l.id));
        if (newLessons.length > 0 && prevIds.length > 0) {
          triggerLevelUnlock(newLessons[0]);
        }

        localStorage.setItem(
          "seenLessons",
          JSON.stringify(allLessons.map((l) => l.id))
        );

        const token = localStorage.getItem("lexi_token");
        if (!token) return;
        const payload = decodeJWT(token);
        const userId = payload?.sub || payload?.user_id || payload?.id;

        const sessionRes = await API.get(`/sessions/user/${userId}`);
        const completedIds = (sessionRes.data.sessions || []).map(
          (s) => s.lesson_id
        );

        setCompletedLessons(completedIds);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
    return () => window.speechSynthesis.cancel();
  }, []);

  const triggerLevelUnlock = (lesson) => {
    setNewLessonUnlocked(lesson);
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
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

  const handleReadAloud = (lesson) => {
    window.speechSynthesis.cancel();

    if (speakingLesson === lesson.id) {
      setSpeakingLesson(null);
      setSpokenIndex(-1);
      return;
    }

    setSpeakingLesson(lesson.id);
    setSpokenIndex(-1);

    const text = `${lesson.title}. ${lesson.content.slice(0, 120)}...`;
    const words = text.split(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;

    let wordIndex = 0;
    utterance.onboundary = () => setSpokenIndex(wordIndex++);
    utterance.onend = () => {
      setSpeakingLesson(null);
      setSpokenIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading your learning path...
      </div>
    );

  const highestCompletedIndex = lessons.findIndex(
    (l) => l.id === completedLessons[completedLessons.length - 1]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 relative">

      <AnimatePresence>
        {newLessonUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-xl z-50"
          >
            🎉 New Level Unlocked: {newLessonUnlocked.title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto text-center mb-12 pt-12">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-3">
          Your Learning Journey 🚀
        </h2>
        <p className="text-gray-600 text-lg">
          Complete each level to unlock the next challenge.
        </p>
      </div>

      <div className="relative flex flex-col items-center space-y-12">
        <div className="absolute w-1 bg-gradient-to-b from-blue-300 to-blue-700 h-full left-1/2 transform -translate-x-1/2 z-0 rounded-full opacity-30"></div>

        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isUnlocked = index === 0 || index <= highestCompletedIndex + 1;

          const words = lesson.content.split(" ");

          return (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.03 }}
              style={{ overflow: "hidden" }}
              className={`relative z-10 w-full md:w-2/3 bg-white shadow-xl rounded-3xl p-6 border transition ${
                isUnlocked
                  ? "border-blue-400 hover:shadow-2xl"
                  : "border-gray-200 opacity-60"
              }`}
            >
              <div
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-7 w-7 h-7 rounded-full border-4 ${
                  isCompleted
                    ? "bg-green-500 border-green-200"
                    : isUnlocked
                    ? "bg-blue-500 border-blue-200 animate-pulse"
                    : "bg-gray-300 border-gray-200"
                }`}
              />

              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Level {index + 1}: {lesson.title}
              </h3>

              <span
                className={`inline-block text-sm mb-3 bg-gradient-to-r ${getColor(
                  lesson.reading_level
                )} text-white px-4 py-1 rounded-full shadow`}
              >
                {lesson.reading_level.toUpperCase()}
              </span>

              {/* ✅ CLEAN PREVIEW WITH GUARANTEED VISIBLE DOTS */}
              <div className="relative mb-4">
                <p className="text-gray-700 leading-relaxed max-h-24 overflow-hidden pr-6">
                  {words.slice(0, 35).map((word, i) => (
                    <span
                      key={i}
                      className={`mr-1 ${
                        speakingLesson === lesson.id && i === spokenIndex
                          ? "bg-yellow-300 rounded px-1"
                          : ""
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </p>

                {/* ✅ FADE + DOTS (ALWAYS VISIBLE) */}
                {words.length > 35 && (
                  <div className="absolute bottom-0 right-0 bg-white pl-2 text-gray-400 font-bold">
                    ...
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                {isUnlocked ? (
                  <button
                    onClick={() =>
                      navigate(`/student/practice?lessonId=${lesson.id}`)
                    }
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      isCompleted
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isCompleted ? "Review Level ✅" : "Start Level ▶"}
                  </button>
                ) : (
                  <span className="text-gray-400 italic">🔒 Locked</span>
                )}

                <button
                  onClick={() => handleReadAloud(lesson)}
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border"
                >
                  🔊 {speakingLesson === lesson.id ? "Stop" : "Preview"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

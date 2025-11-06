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

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const res = await API.get("/lessons/");
        const allLessons = res.data.lessons || [];
        setLessons(allLessons);

        // 🎯 Detect new lesson unlock
        const prevCount = parseInt(localStorage.getItem("lastLessonCount") || "0");
        if (allLessons.length > prevCount && prevCount !== 0) {
          const newLesson = allLessons[allLessons.length - 1];
          triggerLevelUnlock(newLesson);
        }
        localStorage.setItem("lastLessonCount", allLessons.length);

        // ✅ Fetch user sessions for progress
        const token = localStorage.getItem("lexi_token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.user_id || payload.id;

        const sessionRes = await API.get(`/sessions/user/${userId}`);
        const completedIds = (sessionRes.data.sessions || []).map(
          (s) => s.lesson_id || s.lessonId
        );
        setCompletedLessons(completedIds);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
    return () => window.speechSynthesis.cancel(); // stop reading on unmount
  }, []);

  const triggerLevelUnlock = (lesson) => {
    setNewLessonUnlocked(lesson);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#22c55e", "#facc15", "#ef4444"],
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

  // 🔊 Read Aloud + Highlight
  const handleReadAloud = (lesson) => {
    window.speechSynthesis.cancel(); // stop ongoing speech

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
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onboundary = (event) => {
      if (event.name === "word" || event.charIndex >= 0) {
        const idx = words.findIndex((_, i) => event.charIndex <= text.indexOf(words[i]));
        setSpokenIndex(idx);
      }
    };

    utterance.onend = () => {
      setSpeakingLesson(null);
      setSpokenIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading your learning path...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-6 relative transition-all duration-300">
      {/* 🎉 Unlock Banner */}
      <AnimatePresence>
        {newLessonUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-xl z-50"
          >
            <h3 className="text-lg font-semibold">
              🎉 New Level Unlocked: {newLessonUnlocked.title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-4xl pt-12 font-extrabold text-blue-700 mb-3">
          Your Learning Journey 🚀
        </h2>
        <p className="text-gray-600 text-lg">
          Advance through each level and master your reading skills, one lesson at a time.
        </p>
      </div>

      {/* 🧩 Lesson Levels */}
      <div className="relative flex flex-col items-center space-y-10">
        <div className="absolute w-1 bg-gradient-to-b from-blue-300 to-blue-600 h-full left-1/2 transform -translate-x-1/2 z-0 rounded-full opacity-30"></div>

        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isUnlocked =
            isCompleted ||
            completedLessons.includes(lessons[index - 1]?.id) ||
            index === 0;

          const text = `${lesson.title}. ${lesson.content.slice(0, 120)}...`;
          const words = text.split(" ");

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative z-10 w-full md:w-2/3 bg-white shadow-xl rounded-3xl p-6 border transition-all duration-300 ${
                isUnlocked
                  ? "border-blue-400 hover:shadow-2xl"
                  : "border-gray-200 opacity-60"
              }`}
            >
              {/* Progress node */}
              <div
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 w-6 h-6 rounded-full border-4 ${
                  isCompleted
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
                )} text-white px-3 py-1 rounded-full shadow`}
              >
                {lesson.reading_level.charAt(0).toUpperCase() +
                  lesson.reading_level.slice(1)}
              </span>

              {/* 👁️ Dyslexia-friendly text display */}
              <p className="text-gray-700 mb-4 leading-relaxed lesson-text">
                {words.map((word, i) => (
                  <span
                    key={i}
                    className={`mr-1 ${
                      speakingLesson === lesson.id && i === spokenIndex
                        ? "spoken-highlight"
                        : ""
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </p>

              <div className="flex justify-between items-center">
                {isUnlocked || isCompleted ? (
                  <button
                    onClick={() =>
                      navigate(`/student/practice?lessonId=${lesson.id}`)
                    }
                    className={`px-5 py-2 rounded-lg font-semibold transition ${
                      isCompleted
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
              </div>
            </motion.div>
          );
        })}

        {/* 🚧 Coming Soon Section */}
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

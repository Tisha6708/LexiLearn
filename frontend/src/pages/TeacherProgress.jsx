import { useEffect, useState } from "react";
import API from "../services/api";

export default function TeacherProgress() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/sessions/");
      setStats(res.data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch student progress", error);
      setStats([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-blue-700 mb-8">
        Student Progress 📊
      </h2>

      {stats.length === 0 ? (
        <p className="text-gray-500">No student reading data available yet.</p>
      ) : (
        Object.values(
          stats.reduce((acc, session) => {
            // ✅ Group by Student
            if (!acc[session.user_id]) {
              acc[session.user_id] = {
                user_id: session.user_id,
                lessons: {},
              };
            }

            // ✅ Group by Lesson under each Student
            if (!acc[session.user_id].lessons[session.lesson_id]) {
              acc[session.user_id].lessons[session.lesson_id] = [];
            }

            acc[session.user_id].lessons[session.lesson_id].push(session);
            return acc;
          }, {})
        ).map((student) => (
          <div
            key={student.user_id}
            className="bg-white shadow-xl rounded-2xl p-6 mb-8"
          >
            {/* ===== STUDENT HEADER ===== */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Student ID: {student.user_id}
            </h3>

            {/* ===== LESSON GROUPS ===== */}
            <div className="space-y-4">
              {Object.entries(student.lessons).map(
                ([lessonId, attempts]) => {
                  const avgAccuracy = Math.round(
                    attempts.reduce((a, s) => a + s.accuracy, 0) /
                      attempts.length
                  );

                  const avgWpm = Math.round(
                    attempts.reduce((a, s) => a + s.wpm, 0) /
                      attempts.length
                  );

                  return (
                    <div
                      key={lessonId}
                      className="bg-gray-50 rounded-xl p-4 border"
                    >
                      {/* ===== LESSON HEADER ===== */}
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-blue-700">
                          Lesson ID: {lessonId}
                        </h4>
                        <span className="text-sm text-gray-500">
                          Attempts: {attempts.length}
                        </span>
                      </div>

                      {/* ===== AVERAGE STATS ===== */}
                      <div className="flex gap-6 text-sm mb-3">
                        <span className="text-green-600 font-semibold">
                          Avg Accuracy: {avgAccuracy}%
                        </span>
                        <span className="text-blue-600 font-semibold">
                          Avg WPM: {avgWpm}
                        </span>
                      </div>

                      {/* ===== INDIVIDUAL ATTEMPTS ===== */}
                      <div className="space-y-1 text-sm">
                        {attempts.map((a) => (
                          <div
                            key={a.id}
                            className="flex justify-between border-b last:border-none pb-1"
                          >
                            <span>WPM: {a.wpm}</span>
                            <span>Accuracy: {a.accuracy}%</span>
                            <span className="text-gray-500">
                              {new Date(
                                a.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

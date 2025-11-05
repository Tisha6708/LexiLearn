import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lexi_token");
    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (e) {
      console.error("Invalid token:", e);
      window.location.href = "/login";
      return;
    }

    const userId = payload.sub;
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await API.get(`/sessions/user/${userId}`);
        setSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg text-gray-600">Loading your progress...</p>;

  const avgAccuracy = sessions.length
    ? (sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length).toFixed(1)
    : 0;
  const avgWPM = sessions.length
    ? (sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-extrabold text-blue-700 mb-2">
            Welcome back, {user?.name || "Learner"} 👋
          </h2>
          <p className="text-lg text-gray-600">
            Let’s see how you’ve been improving today!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              label: "Total Sessions",
              value: sessions.length,
              color: "from-blue-500 to-blue-700",
              icon: "📘",
            },
            {
              label: "Average Accuracy",
              value: `${avgAccuracy}%`,
              color: "from-green-500 to-green-700",
              icon: "🎯",
            },
            {
              label: "Average WPM",
              value: avgWPM,
              color: "from-yellow-500 to-orange-600",
              icon: "⚡",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition`}
            >
              <span className="text-4xl mb-2">{stat.icon}</span>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-600">
              Accuracy Trend (%)
            </h4>
            {sessions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lesson_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No session data available yet.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
          >
            <h4 className="text-lg font-semibold mb-4 text-green-600">
              Words Per Minute (WPM)
            </h4>
            {sessions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lesson_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wpm" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No session data available yet.</p>
            )}
          </motion.div>
        </div>

        {/* Motivation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          {avgAccuracy > 80 ? (
            <p className="text-xl text-green-600 font-semibold">
              🌟 Great job! You’re mastering your lessons!
            </p>
          ) : avgAccuracy > 50 ? (
            <p className="text-xl text-yellow-600 font-semibold">
              Keep going! Each session improves your fluency. 💪
            </p>
          ) : (
            <p className="text-xl text-blue-600 font-semibold">
              Don’t worry! Practice makes perfect — you’re on your way. 🚀
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

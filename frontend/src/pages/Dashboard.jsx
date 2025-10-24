import { useEffect, useState } from "react";
import API from "../services/api";
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);

    const fetchSessions = async () => {
      try {
        const res = await API.get(`/sessions/user/${payload.user_id}`);
        setSessions(res.data.sessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your progress...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2 text-blue-600">
        Welcome back, {user?.sub || "Learner"} 👋
      </h2>
      <p className="text-gray-600 mb-8">Here’s your learning progress so far:</p>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Sessions</h3>
          <p className="text-3xl font-bold">{sessions.length}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Average Accuracy</h3>
          <p className="text-3xl font-bold">
            {sessions.length
              ? (
                  sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm">Avg WPM</h3>
          <p className="text-3xl font-bold">
            {sessions.length
              ? (
                  sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length
                ).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-blue-600">
            Accuracy Trend (%)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lesson_id" label={{ value: "Lesson", position: "insideBottomRight", offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-green-600">
            Words Per Minute (WPM)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lesson_id" label={{ value: "Lesson", position: "insideBottomRight", offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="wpm" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

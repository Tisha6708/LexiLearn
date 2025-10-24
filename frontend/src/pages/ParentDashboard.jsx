import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ParentDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progress, setProgress] = useState(null);

  const parentId = 1; // later: use JWT token decoding for actual ID

  useEffect(() => {
    API.get(`/parents/${parentId}/students`)
      .then((res) => setStudents(res.data.students))
      .catch(() => alert("No students linked yet"));
  }, []);

  const fetchProgress = async (studentId) => {
    try {
      const res = await API.get(`/parents/${studentId}/progress`);
      setProgress(res.data);
      setSelectedStudent(studentId);
    } catch {
      alert("No progress found for this student.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">
        👨‍👩‍👧 Parent Dashboard
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Linked Students:</h3>
        <div className="flex gap-3">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => fetchProgress(s.id)}
              className={`px-4 py-2 rounded-lg border ${
                selectedStudent === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {s.name || s.email}
            </button>
          ))}
        </div>
      </div>

      {progress && (
        <div className="bg-white shadow p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-blue-600 mb-4">
            Progress Overview
          </h4>
          <p>Average Accuracy: {progress.avg_accuracy.toFixed(1)}%</p>
          <p>Average WPM: {progress.avg_wpm.toFixed(1)}</p>

          <div className="mt-6">
            <h5 className="font-semibold text-gray-700 mb-2">Session Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress.sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lesson_id" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#2563eb"
                  name="Accuracy (%)"
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#16a34a"
                  name="WPM"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

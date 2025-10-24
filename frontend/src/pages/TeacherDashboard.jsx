import { useEffect, useState } from "react";
import API from "../services/api";

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", reading_level: "basic" });
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchStats();
  }, []);

  const fetchLessons = async () => {
    const res = await API.get("/lessons/");
    setLessons(res.data.lessons);
  };

  const fetchStats = async () => {
    const res = await API.get("/sessions/user/1").catch(() => ({ data: { sessions: [] } }));
    setStats(res.data.sessions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/lessons/${editingId}`, form);
      setEditingId(null);
    } else {
      await API.post("/lessons/", form);
    }
    setForm({ title: "", content: "", reading_level: "basic" });
    fetchLessons();
  };

  const handleEdit = (lesson) => {
    setForm({ title: lesson.title, content: lesson.content, reading_level: lesson.reading_level });
    setEditingId(lesson.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      await API.delete(`/lessons/${id}`);
      fetchLessons();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Teacher Dashboard 🎓</h2>

      {/* Add / Edit Lesson */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {editingId ? "Edit Lesson" : "Create New Lesson"}
        </h3>
        <input
          type="text"
          placeholder="Lesson Title"
          className="border p-2 w-full mb-3 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Lesson Content"
          className="border p-2 w-full mb-3 rounded"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        ></textarea>
        <select
          value={form.reading_level}
          onChange={(e) => setForm({ ...form, reading_level: e.target.value })}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Lesson" : "Add Lesson"}
        </button>
      </form>

      {/* Lesson List */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-3">All Lessons</h3>
        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons created yet.</p>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                <p className="text-gray-600 text-sm">
                  Level: {lesson.reading_level}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(lesson)}
                  className="bg-yellow-400 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Student Progress Summary */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Sample Student Progress</h3>
        {stats.length === 0 ? (
          <p className="text-gray-500">No reading sessions recorded yet.</p>
        ) : (
          stats.map((s) => (
            <div
              key={s.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <p>
                Lesson ID: {s.lesson_id} | WPM: {s.wpm} | Accuracy: {s.accuracy}%
              </p>
              <p className="text-sm text-gray-500">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

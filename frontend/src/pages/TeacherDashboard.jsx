import { useEffect, useState } from "react";
import API from "../services/api";

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    reading_level: "basic",
  });
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchStats();
  }, []);

  const fetchLessons = async () => {
    const res = await API.get("/lessons/");
    setLessons(res.data.lessons || []);
  };

  // const fetchStats = async () => {
  //   const res = await API
  //     .get("/sessions/user/1")
  //     .catch(() => ({ data: { sessions: [] } }));
  //   setStats(res.data.sessions || []);
  // };

const fetchStats = async () => {
  try {
    const res = await API.get("/sessions/");
    setStats(res.data.sessions || []);
  } catch (err) {
    console.error("Failed to fetch sessions", err);
    setStats([]);
  }
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
    setForm({
      title: lesson.title,
      content: lesson.content,
      reading_level: lesson.reading_level,
    });
    setEditingId(lesson.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      await API.delete(`/lessons/${id}`);
      fetchLessons();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-blue-700 mb-8">
        Teacher Dashboard 🎓
      </h2>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h4 className="text-gray-500">Total Lessons</h4>
          <p className="text-3xl font-bold text-blue-700">{lessons.length}</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h4 className="text-gray-500">Total Sessions</h4>
          <p className="text-3xl font-bold text-green-600">{stats.length}</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h4 className="text-gray-500">Avg Accuracy</h4>
          <p className="text-3xl font-bold text-purple-600">
            {stats.length
              ? Math.round(
                  stats.reduce((acc, s) => acc + s.accuracy, 0) / stats.length
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* ==================== CREATE / EDIT LESSON ==================== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-xl rounded-2xl mb-10"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "✏️ Edit Lesson" : "➕ Create New Lesson"}
        </h3>

        <input
          type="text"
          placeholder="Lesson Title"
          className="border p-3 w-full mb-4 rounded-lg"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Lesson Content"
          className="border p-3 w-full mb-4 rounded-lg"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <select
          value={form.reading_level}
          onChange={(e) =>
            setForm({ ...form, reading_level: e.target.value })
          }
          className="border p-3 w-full mb-4 rounded-lg"
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg">
          {editingId ? "Update Lesson" : "Add Lesson"}
        </button>
      </form>

      {/* ==================== LESSON LIST ==================== */}
      <div className="bg-white shadow-xl p-6 rounded-2xl mb-10">
        <h3 className="text-xl font-semibold mb-4">📚 All Lessons</h3>

        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons created yet.</p>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border rounded-lg p-4 mb-3 flex justify-between items-center hover:shadow-md transition"
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
                  className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      

    </div>
  );
}

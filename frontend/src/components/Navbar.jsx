import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">LexiLearn</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/teacher">Teacher</Link>
        <Link to="/parent-dashboard">Parent</Link>
        <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded">
          Login
        </Link>
      </div>
    </nav>
  );
}

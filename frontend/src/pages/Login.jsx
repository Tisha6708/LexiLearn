import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login({ email, password });

      if (!user || !user.role) {
        setError("Login failed: role missing in response");
        return;
      }

      // ✅ Role-based redirect
      if (user.role === "student") navigate("/student-dashboard");
      else if (user.role === "teacher") navigate("/teacher-dashboard");
      else if (user.role === "parent") navigate("/parent-dashboard");
      else navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-blue-700 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-96 relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-sm">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue your learning journey
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition-all hover:shadow-xl"
          >
            Log In
          </button>

          {error && (
            <div className="text-red-600 text-center mt-3 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 text-center flex items-center justify-center">
          <span className="h-px bg-gray-300 w-1/3"></span>
          <span className="text-gray-500 text-sm mx-2">or</span>
          <span className="h-px bg-gray-300 w-1/3"></span>
        </div>

        {/* Signup Redirect */}
        <div className="text-center text-gray-700">
          New to{" "}
          <span className="font-semibold text-blue-700">LexiLearn</span>?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            Create an account
          </Link>
        </div>
      </motion.form>
    </div>
  );
}

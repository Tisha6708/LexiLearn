import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const user = await signup({
        email,
        password,
        full_name: fullName,
        role,
      });

      if (user?.role === "student") navigate("/student/dashboard");
      else if (user?.role === "teacher") navigate("/teacher");
      else if (user?.role === "parent") navigate("/parent");
      else navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">

      {/* ================= LEFT SIGNUP CARD ================= */}
      <div className="flex justify-center items-center px-6">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-xl p-10 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
            Create Your Account ✨
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Join LexiLearn and start your journey today
          </p>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                I am a:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-200"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition"
            >
              Create Account
            </motion.button>
          </div>

          {/* Divider */}
          <div className="my-6 text-center flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/3"></span>
            <span className="text-gray-500 text-sm mx-2">or</span>
            <span className="h-px bg-gray-300 w-1/3"></span>
          </div>

          {/* Login Redirect */}
          <div className="text-center text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        </motion.form>
      </div>

      {/* ================= RIGHT BRAND PANEL ================= */}
      <div className="hidden md:flex flex-col justify-center items-center px-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold text-blue-900 mb-6"
        >
          LexiLearn
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-blue-900 max-w-md"
        >
          AI-powered reading support for dyslexic learners.  
          Build confidence. Track progress. Learn smarter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-xl"
        >
          <p className="text-blue-900 font-semibold">
            ✔ Personalized AI Feedback  
            <br />✔ Student & Teacher Dashboards  
            <br />✔ Real-time Reading Analytics
          </p>
        </motion.div>
      </div>

    </div>
  );
}

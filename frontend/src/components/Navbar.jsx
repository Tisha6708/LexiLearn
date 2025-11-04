import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Dynamically determine base path per role
  const roleBasePath =
    user?.role === "student"
      ? "/student"
      : user?.role === "teacher"
      ? "/teacher"
      : user?.role === "parent"
      ? "/parent"
      : "";

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight hover:text-blue-800 transition"
        >
          LexiLearn
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Home
          </Link>

          {/* Student Links */}
          {user?.role === "student" && (
            <>
              <Link
                to={`${roleBasePath}/lessons`}
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Lessons
              </Link>
              <Link
                to={`${roleBasePath}/practice`}
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Practice
              </Link>
              <Link
                to={`${roleBasePath}/dashboard`}
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Dashboard
              </Link>
            </>
          )}

          {/* Teacher Link */}
          {user?.role === "teacher" && (
            <Link
              to={`${roleBasePath}`}
              className="text-gray-700 hover:text-blue-700 font-medium transition"
            >
              Teacher Dashboard
            </Link>
          )}

          {/* Parent Link */}
          {user?.role === "parent" && (
            <Link
              to={`${roleBasePath}`}
              className="text-gray-700 hover:text-blue-700 font-medium transition"
            >
              Parent Dashboard
            </Link>
          )}
        </div>

        {/* Right Side: Auth Buttons or Profile */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 transition-all"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Avatar Button */}
              <button
                onClick={toggleMenu}
                className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 font-bold shadow-inner hover:bg-blue-200 transition"
              >
                {user.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </button>

              {/* Animated Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                    onMouseLeave={closeMenu}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-800">
                        {user.full_name || user.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Role: {user.role}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Link
                        to={`${roleBasePath}/dashboard`}
                        onClick={closeMenu}
                        className="px-4 py-2 text-sm hover:bg-blue-50 text-blue-700 transition"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

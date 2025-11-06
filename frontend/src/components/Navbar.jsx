import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  // 🧠 Load & Apply Dyslexia Mode
  useEffect(() => {
    const saved = localStorage.getItem("dyslexiaMode") === "true";
    setDyslexiaMode(saved);
    document.body.classList.toggle("dyslexia-mode", saved);
  }, []);

  const toggleDyslexiaMode = () => {
    const newMode = !dyslexiaMode;
    setDyslexiaMode(newMode);
    document.body.classList.toggle("dyslexia-mode", newMode);
    localStorage.setItem("dyslexiaMode", newMode);
  };

  // 🌈 Role-based dashboard root
  const roleBasePath =
    user?.role === "student"
      ? "/student"
      : user?.role === "teacher"
        ? "/teacher"
        : user?.role === "parent"
          ? "/parent"
          : "";

  // 🎯 Dynamic navigation links based on role
  const getNavLinks = () => {
    if (!user) {
      return [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
      ];
    }

    switch (user.role) {
      case "student":
        return [
          { to: `${roleBasePath}/lessons`, label: "Lessons" },
          { to: `${roleBasePath}/practice`, label: "Practice" },
          { to: `${roleBasePath}/dashboard`, label: "Dashboard" },
        ];
      case "teacher":
        return [
          { to: `${roleBasePath}/students`, label: "Students" },
          { to: `${roleBasePath}/lessons`, label: "Lessons" },
          { to: `${roleBasePath}/dashboard`, label: "Dashboard" },
        ];
      case "parent":
        return [
          { to: `${roleBasePath}/progress`, label: "Child Progress" },
          { to: `${roleBasePath}/reports`, label: "Reports" },
          { to: `${roleBasePath}/dashboard`, label: "Dashboard" },
        ];
      default:
        return [{ to: "/", label: "Home" }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight hover:text-blue-800 transition"
        >
          LexiLearn
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 hover:text-blue-700 font-medium transition"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-4">
          {/* 🧠 Dyslexia Mode Toggle */}
          <button
            onClick={toggleDyslexiaMode}
            className={`px-3 py-1 rounded-lg font-medium shadow-sm transition ${dyslexiaMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {dyslexiaMode ? "Reading Mode On" : "Reading Mode"}
          </button>

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
              <button
                onClick={toggleMenu}
                className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 font-bold shadow-inner hover:bg-blue-200 transition"
              >
                {user.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </button>

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

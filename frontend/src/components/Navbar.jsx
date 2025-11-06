import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Role-based theme accent
  const roleAccent =
    user?.role === "teacher"
      ? "from-green-500 to-green-700"
      : user?.role === "parent"
      ? "from-purple-500 to-purple-700"
      : "from-blue-500 to-blue-700";

  // Base path based on role
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

  const links = [
    { to: "/", label: "Home" },
    ...(user?.role === "student"
      ? [
          { to: `${roleBasePath}/lessons`, label: "Lessons" },
          { to: `${roleBasePath}/practice`, label: "Practice" },
          { to: `${roleBasePath}/dashboard`, label: "Dashboard" },
        ]
      : []),
    ...(user?.role === "teacher"
      ? [{ to: `${roleBasePath}`, label: "Teacher Dashboard" }]
      : []),
    ...(user?.role === "parent"
      ? [{ to: `${roleBasePath}`, label: "Parent Dashboard" }]
      : []),
  ];

  return (
    <nav className="top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${roleAccent} tracking-tight transition`}
        >
          LexiLearn
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`relative text-gray-700 font-medium hover:text-blue-700 transition ${
                location.pathname === to ? "text-blue-700" : ""
              }`}
            >
              {label}
              {location.pathname === to && (
                <motion.div
                  layoutId="activeLink"
                  className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r ${roleAccent} bottom-[-3px]`}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section: Auth or Profile */}
        <div className="hidden md:flex items-center gap-4">
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
                className={`rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r ${roleAccent} text-white font-bold shadow-md transition`}
              >
                {user.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-blue-700"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-inner border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className="text-gray-700 font-medium hover:text-blue-700"
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium hover:text-red-700 text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

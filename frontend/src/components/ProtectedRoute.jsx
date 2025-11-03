import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length && !roles.includes(user.role)) {
    // unauthorized for this role
    return <Navigate to="/" replace />;
  }
  return children;
}

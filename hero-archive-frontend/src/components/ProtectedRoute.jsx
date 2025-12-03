// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if role is required and matches
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated (and authorized if role was required)
  return children;
}

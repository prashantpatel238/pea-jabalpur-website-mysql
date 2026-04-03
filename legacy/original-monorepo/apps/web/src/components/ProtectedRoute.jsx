
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PendingApprovalMessage from '@/components/PendingApprovalMessage.jsx';

const ProtectedRoute = ({ children, requireAdmin = false, requireApproved = false }) => {
  const { currentUser, isAdmin, isMemberManager, isApproved, isPending } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin && !isMemberManager) {
    return <Navigate to="/dashboard" replace />;
  }

  const allowedPendingRoutes = ['/login', '/register', '/admin/approvals'];
  const isAllowedRoute = allowedPendingRoutes.some(route => location.pathname.startsWith(route));

  if (isPending && !isAdmin && !isMemberManager && !isAllowedRoute) {
    return <PendingApprovalMessage />;
  }

  if (requireApproved && !isApproved && !isAdmin && !isMemberManager) {
    return <PendingApprovalMessage />;
  }

  return children;
};

export default ProtectedRoute;

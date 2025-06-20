import React from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />;
}; 
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { BookList } from '../components/BookList';
import { ProfilePage } from '../components/ProfilePage';
import { PrivateRoute } from '../components/auth/PrivateRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UserManagement } from '../components/admin/UserManagement';
import { BookManagement } from '../components/admin/BookManagement';
import { RentalManagement } from '../components/admin/RentalManagement';
import { Reports } from '../components/admin/Reports';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      
      {/* Regular user routes */}
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout>
            <BookList />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <PrivateRoute requireAdmin>
          <AdminLayout>
            <AdminDashboard onClose={() => {}} />
          </AdminLayout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/users" element={
        <PrivateRoute requireAdmin>
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/books" element={
        <PrivateRoute requireAdmin>
          <AdminLayout>
            <BookManagement />
          </AdminLayout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/rentals" element={
        <PrivateRoute requireAdmin>
          <AdminLayout>
            <RentalManagement />
          </AdminLayout>
        </PrivateRoute>
      } />
      
      <Route path="/admin/reports" element={
        <PrivateRoute requireAdmin>
          <AdminLayout>
            <Reports />
          </AdminLayout>
        </PrivateRoute>
      } />

      {/* Redirect to home for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 
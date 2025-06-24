import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { BookList } from "../components/BookList";
import { BookDetail } from "../components/BookDetail";
import { CategoryPage } from "../components/CategoryPage";
import { ProfilePage } from "../components/ProfilePage";
import { MyBooks } from "../components/MyBooks";
import { PrivateRoute } from "../components/auth/PrivateRoute";
import { CartPage } from "../components/CartPage";
import { RecommendationPage } from "../components/RecommendationPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <BookList />
          </PrivateRoute>
        }
      />

      <Route
        path="/book/:id"
        element={
          <PrivateRoute>
            <BookDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/category/:categoryId"
        element={
          <PrivateRoute>
            <CategoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-books"
        element={
          <PrivateRoute>
            <MyBooks />
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/recommendations"
        element={
          <PrivateRoute>
            <RecommendationPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

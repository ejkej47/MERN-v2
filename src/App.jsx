// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Layout i QoL
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/QoL/LoadingSpinner";
import ScrollToTop from "./components/QoL/ScrollToTop";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursePage from "./pages/CoursePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import ModulePage from "./pages/ModulePage"; 
import LessonPage from "./pages/LessonPage";
import ProfilePage from "./pages/ProfilePage";
import OnamaPage from "./pages/ONamaPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Components & Auth Helpers
import MyCourses from "./components/Course/MyCourses";
import ForgotPassword from "./components/Forms/ForgotPassword";
{/*import LoginSuccess from "./components/Success/LoginSuccess";
import GoogleSuccess from "./components/Success/GoogleSuccess";*/}

function App() {
  const { loading, user } = useAuth();

  // Dok se Supabase Auth inicijalizuje, prikazujemo spinner
  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <>
      <ScrollToTop />
      {/* Key pomaže React-u da resetuje rute pri promeni auth stanja */}
      <Routes key={user ? "auth" : "guest"}>
        
        {/* Auth Callback rute (van Layout-a) 
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/login-success" element={<LoginSuccess />} />*/}

        {/* Glavna aplikacija unutar Layout-a (Navbar, Footer...) */}
        <Route path="/" element={<Layout />}>
          
          {/* JAVNE RUTE */}
          <Route index element={<LandingPage />} />
          <Route path="about" element={<OnamaPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="courses" element={<AllCoursesPage />} />
          <Route path="course/:slug" element={<CoursePage />} />
          
          {/* AUTH RUTE (Gost) */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

          {/* Nova, bolja ruta: */}
          <Route path="course/:courseSlug/module/:moduleSlug" element={<ModulePage />} />

          {/* I za lekcije prilagodi da prati istu logiku: */}
          <Route path="course/:courseSlug/module/:moduleSlug/lesson/:lessonSlug" element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          } />

          {/* ZAŠTIĆENE KORISNIČKE RUTE */}
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="my-courses" element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          } />

          {/* Redirekcija za nepostojeće rute */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      
      {/* Obaveštenja za korisnika (Dark tema) */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'dark:bg-surface dark:text-text border border-borderSoft',
        }}
      />
    </>
  );
}

export default App;
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Importuj stranice
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
/* Komentarisano da ne pravi greške dok ne sredimo fajlove:
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursePage from "./pages/CoursePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import ProtectedRoute from "./components/ProtectedRoute";
*/
import ScrollToTop from "./components/QoL/ScrollToTop";

function App() {
  const { loading } = useAuth();

  // Dok Supabase proverava sesiju
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background text-text">
      Učitavanje...
    </div>
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Samo LandingPage je aktivan */}
          <Route index element={<LandingPage />} />
          
          {/* Ostale rute su pod komentarom
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="courses" element={<AllCoursesPage />} />
          <Route path="course/:slug" element={<CoursePage />} />
          <Route path="profile" element={<ProtectedRoute><div className="p-10 text-white">Profil</div></ProtectedRoute>} />
          */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
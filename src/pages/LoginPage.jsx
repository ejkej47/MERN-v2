import React from "react";
import LoginForm from "../components/Forms/LoginForm";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/QoL/LoadingSpinner";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/my-courses";

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (user) return <Navigate to={from} replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-borderSoft bg-surface shadow-2xl md:flex-row">
        {/* Leva strana: Login */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="mb-2 text-3xl font-bold text-text">Prijava</h2>
          <p className="mb-8 text-sm text-mutedSoft">
            Prijavi se da nastaviš sa svojim lekcijama.
          </p>
          <LoginForm redirectPath={from} />
          <div className="mt-6 text-center text-sm">
            <Link to="/forgot-password" className="text-accent hover:underline">
              Zaboravljena lozinka?
            </Link>
          </div>
        </div>

        {/* Desna strana: Tvoj Info Panel */}
        <div className="w-full bg-background/40 p-10 md:w-1/2 border-l border-borderSoft flex flex-col justify-center">
          <h3 className="mb-4 text-xl font-semibold text-text">
            Novi polaznik?
          </h3>
          <p className="mb-6 text-sm text-mutedSoft leading-relaxed">
            Postani deo zajednice koja radi na sebi. Otključaj premium sadržaje i prati svoj napredak kroz emocionalnu pismenost.
          </p>
          <ul className="mb-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2"><span className="text-accent">✔</span> Pristup svim modulima</li>
            <li className="flex items-center gap-2"><span className="text-accent">✔</span> Doživotni materijali</li>
            <li className="flex items-center gap-2"><span className="text-accent">✔</span> Lični profil i progres</li>
          </ul>
          <Link
            to="/register"
            className="block w-full rounded-xl border border-accent py-3 text-center font-semibold text-accent transition hover:bg-accent hover:text-black"
          >
            Registruj se
          </Link>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import RegisterForm from "../components/Forms/RegisterForm";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/my-courses" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-borderSoft bg-surface shadow-2xl md:flex-row">
        {/* Leva strana: Register */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="mb-2 text-3xl font-bold text-text">Napravi nalog</h2>
          <p className="mb-8 text-sm text-mutedSoft">
            Započni svoje putovanje već danas.
          </p>
          <RegisterForm />
          <div className="mt-8 text-center text-sm text-muted">
            Već imaš nalog?{" "}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Uloguj se
            </Link>
          </div>
        </div>

        {/* Desna strana: Info */}
        <div className="w-full bg-primary/5 p-10 md:w-1/2 border-l border-borderSoft flex flex-col justify-center">
          <h3 className="mb-4 text-xl font-semibold text-text">Zašto se pridružiti?</h3>
          <p className="mb-6 text-sm text-mutedSoft">
            Svi naši kursevi su dizajnirani da ti pruže praktične alate za svakodnevni život.
          </p>
          <div className="space-y-4">
            <div className="rounded-xl bg-surface p-4 border border-borderSoft">
              <h4 className="text-sm font-bold text-accent">Kvalitetni sadržaji</h4>
              <p className="text-xs text-muted">Stručno vođeni programi i vežbe.</p>
            </div>
            <div className="rounded-xl bg-surface p-4 border border-borderSoft">
              <h4 className="text-sm font-bold text-accent">Zajednica</h4>
              <p className="text-xs text-muted">Podrška ljudi koji dele tvoje vrednosti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
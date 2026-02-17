import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginForm({ redirectPath = "/my-courses" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Uspešno ste prijavljeni!");
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Greška pri prijavi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) toast.error("Greška pri Google prijavi.");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text focus:border-accent outline-none"
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text focus:border-accent outline-none"
      />
      <button
        disabled={loading}
        className="w-full rounded bg-accent py-2 font-semibold text-black hover:bg-accent-hover transition"
      >
        {loading ? "Prijava..." : "Uloguj se"}
      </button>

      {/* Razdelnik */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-borderSoft"></div>
        <span className="flex- Castro px-4 text-xs text-muted uppercase">Ili nastavi putem</span>
        <div className="flex-grow border-t border-borderSoft"></div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-borderSoft py-2 text-text hover:bg-surface"
      >
        <img src="https://developers.google.com/identity/images/g-logo.png" className="h-5 w-5" alt="G" />
        Prijavi se preko Google-a
      </button>
    </form>
  );
}
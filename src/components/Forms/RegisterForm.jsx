// src/components/Forms/RegisterForm.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Registracija uspešna! Proverite email za potvrdu.");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.message || "Greška pri registraciji.");
    } finally {
      setLoading(false);
    }
  };

  // Dodata ista funkcija kao u LoginForm
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast.error("Greška pri Google registraciji.");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-borderSoft rounded bg-background text-text focus:ring-2 focus:ring-primary outline-none"
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-borderSoft rounded bg-background text-text focus:ring-2 focus:ring-primary outline-none"
        />
        <button
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition font-semibold"
        >
          {loading ? "Kreiranje naloga..." : "Registruj se"}
        </button>
      </form>

      {/* Razdelnik */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-borderSoft"></div>
        <span className="flex- Castro px-4 text-xs text-muted uppercase">Ili nastavi putem</span>
        <div className="flex-grow border-t border-borderSoft"></div>
      </div>

      {/* Google Dugme */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-borderSoft py-2.5 text-text hover:bg-surface transition"
      >
        <img 
          src="https://developers.google.com/identity/images/g-logo.png" 
          className="h-5 w-5" 
          alt="Google" 
        />
        <span className="font-medium">Registruj se preko Google-a</span>
      </button>
    </div>
  );
}
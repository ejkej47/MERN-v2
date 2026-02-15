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

  return (
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
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
      >
        {loading ? "Kreiranje naloga..." : "Registruj se"}
      </button>
    </form>
  );
}
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginForm({ redirectPath }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth(); // Koristimo funkciju iz našeg novog konteksta

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Uspešno ste se prijavili!");
    } catch (err) {
      toast.error(err.message || "Greška pri prijavi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-text">Email adresa</label>
        <input
          type="email"
          className="w-full rounded border border-borderSoft bg-background p-2 text-text focus:border-accent outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-text">Lozinka</label>
        <input
          type="password"
          className="w-full rounded border border-borderSoft bg-background p-2 text-text focus:border-accent outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-primary py-2 font-bold text-white transition hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? "Prijava..." : "Prijavi se"}
      </button>
    </form>
  );
}
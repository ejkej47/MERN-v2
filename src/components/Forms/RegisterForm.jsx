import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Lozinke se ne podudaraju!");
    }

    setIsSubmitting(true);
    try {
      await register(email, password);
      toast.success("Uspešna registracija! Proveri email za potvrdu.");
    } catch (err) {
      toast.error(err.message || "Greška pri registraciji");
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
          className="w-full rounded border border-borderSoft bg-background p-2 text-text outline-none focus:border-accent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-text">Lozinka</label>
        <input
          type="password"
          className="w-full rounded border border-borderSoft bg-background p-2 text-text outline-none focus:border-accent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-text">Potvrdi lozinku</label>
        <input
          type="password"
          className="w-full rounded border border-borderSoft bg-background p-2 text-text outline-none focus:border-accent"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-primary py-2 font-bold text-white transition hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? "Pravljenje naloga..." : "Napravi nalog"}
      </button>
    </form>
  );
}
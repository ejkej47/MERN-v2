import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Link za resetovanje je poslat na vaš email.");
      setSent(true);
    }
  };

  return (
    <div className="p-5 bg-surface rounded-2xl border border-borderSoft">
      <h2 className="text-xl font-semibold mb-4 text-text">Zaboravljena Lozinka</h2>
      {!sent ? (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Unesi email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text outline-none"
            required
          />
          <button className="w-full rounded-xl bg-primary py-2 font-semibold text-white">
            Pošalji link za reset
          </button>
        </form>
      ) : (
        <p className="text-accent">Proverite svoj inbox za dalje korake.</p>
      )}
    </div>
  );
}
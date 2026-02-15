// src/components/Forms/LoginWithGoogle.jsx
import React from "react";
import { supabase } from "../lib/supabaseClient"; // Proveri putanju do klijenta

const LoginWithGoogle = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Supabase će automatski vratiti korisnika na tvoj sajt
        redirectTo: window.location.origin 
      }
    });

    if (error) {
      console.error("Greška pri Google prijavi:", error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-borderSoft bg-surface px-4 py-2 shadow-sm transition hover:bg-background w-full"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="h-5 w-5"
      />
      <span className="text-sm font-medium text-text">Prijavi se preko Google-a</span>
    </button>
  );
};

export default LoginWithGoogle;
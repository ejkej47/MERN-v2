import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Funkcija za dohvatanje profila
  const fetchProfile = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      console.log("Profil učitan:", data); // 👈 Dodaj ovo da vidiš šta stiže iz baze
      setProfile(data);
    } catch (err) {
      console.error("Greška pri dohvatanju profila:", err.message);
    }
  };

  useEffect(() => {
    // 1. Inicijalna provera sesije
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error("Session init error:", err);
      } finally {
        setLoading(false); // Osiguravamo da loading prestane
      }
    };

    initSession();

    // 2. Slušanje promena stanja
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      
      setUser(currentUser);
      
      if (currentUser) {
        // Ne blokiramo UI dok se profil učitava
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    navigate("/my-courses");
  };

  const register = async (email, password) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {/* Ako je loading predugo true, ovde nastaje beli ekran */}
      {!loading ? children : <div className="bg-background min-h-screen"></div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
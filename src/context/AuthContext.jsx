// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // carregar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bloprime_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.rpc("manual_login", {
        p_email: email,
        p_password: password,
      });
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Credenciais inválidas ou e-mail não confirmado.");
      }
      const u = data[0]; // { id, email, nome, role }
      localStorage.setItem("bloprime_user", JSON.stringify(u));
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const signup = async (email, password, nome) => {
    try {
      const { data, error } = await supabase.rpc("manual_register", {
        p_email: email,
        p_password: password,
        p_nome: nome || null,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("bloprime_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("bloprime_user");
    return stored ? JSON.parse(stored) : null;
  });

  // sincroniza alterações no localStorage em tempo real
  useEffect(() => {
    if (user) {
      localStorage.setItem("bloprime_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bloprime_user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.rpc("manual_login", {
        p_email: email,
        p_password: password,
      });
      if (error) throw error;

      const u = data?.[0];
      if (!u) throw new Error("Credenciais inválidas ou e-mail não confirmado.");

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

      const newUser = data?.[0];
      if (newUser) setUser(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

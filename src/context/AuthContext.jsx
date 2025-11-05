import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // carrega do localStorage ao arrancar
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("bloprime_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // persiste sempre que mudar
  useEffect(() => {
    if (user) localStorage.setItem("bloprime_user", JSON.stringify(user));
    else localStorage.removeItem("bloprime_user");
  }, [user]);

  // mantém sessões em múltiplos separadores alinhadas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "bloprime_user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.rpc("manual_login", {
        p_email: email,
        p_password: password,
      });
      if (error) throw new Error(error.message);

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error("Credenciais inválidas ou e-mail não confirmado.");

      // normaliza o shape esperado pelo resto da app
      const u = {
        id: row.id,
        email: row.email,
        nome: row.nome,
        role: row.role || null,
        email_confirmed: !!row.email_confirmed,
      };

      setUser(u);
      return { success: true, user: u };
    } catch (err) {
      return { success: false, message: err.message || "Falha no login." };
    }
  };

  const signup = async (email, password, nome) => {
    try {
      const { data, error } = await supabase.rpc("manual_register", {
        p_email: email,
        p_password: password,
        p_nome: nome || null,
      });
      if (error) throw new Error(error.message);

      const row = Array.isArray(data) ? data[0] : data;
      // não guardamos o utilizador aqui; ele ainda precisa confirmar e-mail
      return { success: true, pending: true, raw: row };
    } catch (err) {
      return { success: false, message: err.message || "Falha no registo." };
    }
  };

  const logout = () => setUser(null);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

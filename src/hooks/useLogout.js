// src/hooks/useLogout.js
import { useCallback } from "react";

export default function useLogout() {
  const logout = useCallback(() => {
    try {
      // 🔹 1. Remove dados da sessão manual (BloPrime)
      localStorage.removeItem("bloprime_user");

      // 🔹 2. Limpa qualquer resquício antigo (por precaução)
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("supabase.auth");
      localStorage.removeItem("supabase.auth.refresh_token");

      // 🔹 3. Redireciona para o login
      window.location.replace("/login");
    } catch (err) {
      console.error("Erro ao terminar sessão:", err.message);
      alert("❌ Ocorreu um erro ao terminar sessão.");
    }
  }, []);

  return logout;
}

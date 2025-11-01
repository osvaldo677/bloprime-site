// src/hooks/useAuthGuard.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/**
 * Hook de segurança usado para verificar o estado de autenticação manual.
 * Lê as informações do utilizador guardadas no localStorage.
 *
 * Retorna:
 *  - user: dados completos do utilizador logado
 *  - isAuthenticated: boolean
 *  - loading: boolean enquanto verifica
 */
export default function useAuthGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bloprime_user");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (err) {
        console.error("Erro ao ler dados de sessão:", err);
        localStorage.removeItem("bloprime_user");
      }
    }

    setLoading(false);
  }, []);

  // 🔹 Assim que o user for definido, verificar se tem perfil
  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, profile_type")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao verificar perfil:", error.message);
          return;
        }

        // 🔸 Se não existir perfil, redirecionar para /app/choose-role
        if (!data) {
          console.warn("Perfil não encontrado, redirecionando...");
          navigate("/app/choose-role");
        }
      } catch (err) {
        console.error("Erro ao consultar perfil:", err.message);
      }
    }

    checkProfile();
  }, [user, navigate]);

  const isAuthenticated = !!user;

  return { user, isAuthenticated, loading };
}

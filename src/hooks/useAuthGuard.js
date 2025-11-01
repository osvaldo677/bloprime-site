// src/hooks/useAuthGuard.js
import { useState, useEffect } from "react";

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

  const isAuthenticated = !!user;

  return { user, isAuthenticated, loading };
}

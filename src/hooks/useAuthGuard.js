// src/hooks/useAuthGuard.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function useAuthGuard() {
  const { session, loading: authLoading } = useAuth(); // já vem do AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role, created_at, updated_at")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar perfil:", error.message);
      }

      setProfile(data || null);
      setLoading(false);
    };

    // Só carrega perfil quando a auth já terminou de verificar
    if (!authLoading) {
      carregarPerfil();
    }
  }, [session, authLoading]);

  // Enquanto a AuthContext ainda está a carregar ou perfil a ser carregado
  return { session, profile, loading: authLoading || loading };
}

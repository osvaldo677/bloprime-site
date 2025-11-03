// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuthGuard();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkProfile() {
      console.log("🔎 Verificando perfil do utilizador:", user?.id);

      if (!user?.id) {
        console.warn("⚠️ Nenhum utilizador encontrado");
        setCheckingProfile(false);
        setHasProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, profile_type, user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("❌ Erro Supabase:", error.message);
          setHasProfile(false);
        } else if (!data) {
          console.warn("⚠️ Nenhum perfil encontrado para:", user.id);
          setHasProfile(false);
        } else if (!data.profile_type || data.profile_type === "") {
          console.warn("⚠️ Perfil sem tipo definido:", data);
          setHasProfile(false);
        } else {
          console.log("✅ Perfil válido encontrado:", data.profile_type);
          setHasProfile(true);
        }
      } catch (err) {
        console.error("💥 Erro inesperado:", err);
        setHasProfile(false);
      } finally {
        setCheckingProfile(false);
      }
    }

    if (isAuthenticated) checkProfile();
  }, [user, isAuthenticated]);

  if (loading || checkingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">A carregar...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn("🚫 Utilizador não autenticado. Redirecionando para /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasProfile && location.pathname !== "/app/choose-role") {
    console.log("➡️ Sem perfil definido, redirecionando para /app/choose-role");
    return <Navigate to="/app/choose-role" replace />;
  }

  console.log("✅ Acesso concedido:", location.pathname);
  return children ? children : <Outlet />;
}

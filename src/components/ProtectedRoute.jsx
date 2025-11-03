// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuthGuard();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkProfile() {
      if (!user?.id) {
        setCheckingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, profile_type")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        console.log("🔎 Perfil encontrado:", data);

        // Se não existir perfil_type definido → precisa escolher
        setHasProfile(!!(data && data.profile_type));
      } catch (err) {
        console.error("Erro ao verificar perfil:", err.message);
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasProfile && location.pathname !== "/app/choose-role") {
    console.log("➡️ Sem perfil definido, redirecionando para /app/choose-role");
    return <Navigate to="/app/choose-role" replace />;
  }

  return children ? children : <Outlet />;
}

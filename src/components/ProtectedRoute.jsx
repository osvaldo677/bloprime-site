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
      if (!user) {
        setCheckingProfile(false);
        return;
      }

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

        setHasProfile(!!data);
      } catch (err) {
        console.error("Erro na verificação de perfil:", err.message);
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

  // 🔸 Se não estiver autenticado → para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔸 Evita redirecionar de páginas públicas (login, signup, confirm-email)
  const publicPaths = ["/login", "/signup", "/confirm-email", "/"];
  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  // 🔸 Se não tem perfil → vai escolher o tipo
  if (!hasProfile && location.pathname !== "/app/choose-role") {
    return <Navigate to="/app/choose-role" replace />;
  }

  // 🔸 Tudo certo → deixa entrar
  return children ? children : <Outlet />;
}

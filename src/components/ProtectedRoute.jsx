// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuthGuard();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

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
        } else {
          setHasProfile(!!data);
        }
      } catch (err) {
        console.error("Erro na verificação de perfil:", err.message);
      } finally {
        setCheckingProfile(false);
      }
    }

    if (isAuthenticated) checkProfile();
  }, [user, isAuthenticated]);

  if (loading || checkingProfile) {
    return <p className="text-center mt-10 text-gray-600">A carregar...</p>;
  }

  // 🚪 Se não estiver autenticado, volta para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚧 Se não tiver perfil, vai escolher o tipo
  if (!hasProfile) {
    return <Navigate to="/app/choose-role" replace />;
  }

  // ✅ Caso contrário, deixa seguir normalmente
  return children ? children : <Outlet />;
}

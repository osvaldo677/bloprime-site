// src/components/RoleGuard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ allow = [], children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) {
        setOk(false);
        return setLoading(false);
      }

      const { data: prof, error } = await supabase
        .from("profiles")
        .select("profile_type")
        .eq("user_id", auth.session.user.id)
        .single();

      if (error) {
        console.error("Erro ao obter perfil:", error.message);
        setOk(false);
      } else {
        setOk(allow.includes(prof?.profile_type));
      }

      setLoading(false);
    };
    run();
  }, [allow]);

  if (loading) return <p>⏳ A validar permissão...</p>;
  if (!ok) return <Navigate to="/app/dashboard" replace />;

  return children;
}

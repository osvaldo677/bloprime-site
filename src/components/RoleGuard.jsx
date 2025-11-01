import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ allow = [], children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return setOk(false), setLoading(false);

      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.session.user.id)
        .single();

      if (!prof?.role) return setOk(false), setLoading(false);
      setOk(allow.includes(prof.role));
      setLoading(false);
    };
    run();
  }, [allow]);

  if (loading) return <p>⏳ A validar permissão…</p>;
  if (!ok) return <Navigate to="/app/dashboard" replace />;

  return children;
}

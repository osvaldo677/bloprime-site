import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";

export default function OneProfileGuard({ table, children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return setAllowed(false), setLoading(false);

      const { data } = await supabase
        .from(table)
        .select("id")
        .eq("user_id", auth.session.user.id)
        .limit(1);

      // se já tem 1, bloqueia criação
      setAllowed(!(data && data.length > 0));
      setLoading(false);
    };
    run();
  }, [table]);

  if (loading) return <p>⏳ A validar…</p>;
  if (!allowed) return <Navigate to="/app/dashboard" replace />;

  return children;
}

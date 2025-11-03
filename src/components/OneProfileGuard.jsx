// src/components/OneProfileGuard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OneProfileGuard({ table, children }) {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return setLoading(false);

      const { data } = await supabase
        .from(table)
        .select("id")
        .eq("user_id", auth.session.user.id)
        .limit(1);

      setExists(data && data.length > 0);
      setLoading(false);
    };
    run();
  }, [table]);

  if (loading) return <p>⏳ A verificar perfil existente...</p>;

  // 👉 Permite o acesso mesmo que já exista (para edição)
  return children;
}

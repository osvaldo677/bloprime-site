import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import ChooseRole from "./ChooseRole";

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkProfile() {
      try {
        if (!user?.id) {
          console.warn("⚠️ Nenhum utilizador ativo no contexto Auth.");
          return setLoading(false);
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, profile_type")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.profile_type) {
          console.log("✅ Perfil já definido:", data.profile_type);
          // 👉 Vai direto ao registo correspondente
          navigate(`/app/registos/${data.profile_type}`);
        } else {
          console.log("🆕 Nenhum perfil definido, aguardar escolha...");
        }
      } catch (err) {
        console.error("Erro ao verificar perfil:", err);
        setError("❌ Ocorreu um erro ao carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, [user, navigate]);

  const handleSelect = async (role) => {
    if (!user?.id) {
      setError("⚠️ Sessão inválida. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_type: role })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      navigate(`/app/registos/${role}`);
    } catch (err) {
      console.error("Erro ao atualizar tipo de perfil:", err);
      setError("❌ Ocorreu um erro ao definir o tipo de perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">A carregar...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Atualizar tipo de perfil
        </h1>
        <p className="text-gray-500 mb-6">
          Pode atualizar o tipo de perfil associado à sua conta.
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <ChooseRole handleSelect={handleSelect} />
      </div>
    </div>
  );
}

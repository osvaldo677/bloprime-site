// src/pages/ChooseRolePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import ChooseRole from "./ChooseRole";

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    async function checkExistingProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, profile_type")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar perfil:", error.message);
        return;
      }

      if (data) setProfileExists(true);
    }

    checkExistingProfile();
  }, [user]);

  const handleSelect = async (role) => {
    if (!user) return setError("⚠️ Sessão inválida. Faça login novamente.");

    setError("");
    setLoading(true);

    try {
      // 🔹 Verifica se já existe perfil
      const { data: existing, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        // Atualiza perfil existente
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_type: role })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      } else {
        // Cria novo perfil
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ user_id: user.id, profile_type: role }]);
        if (insertError) throw insertError;
      }

      // 🔹 Atualiza role em users
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", user.id);
      if (userUpdateError) throw userUpdateError;

      // 🔹 Atualiza localStorage
      const updatedUser = { ...user, role };
      localStorage.setItem("bloprime_user", JSON.stringify(updatedUser));

      // 🔹 Redireciona conforme o tipo escolhido
      switch (role) {
        case "athlete":
          navigate("/app/registos/atleta");
          break;
        case "coach":
          navigate("/app/registos/treinador");
          break;
        case "club":
          navigate("/app/registos/clube");
          break;
        case "federation":
          navigate("/app/registos/federacao");
          break;
        default:
          navigate("/app/dashboard");
      }
    } catch (err) {
      console.error("Erro ao definir tipo de perfil:", err.message);
      setError("❌ Ocorreu um erro ao definir o tipo de perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {profileExists ? "Atualizar o seu tipo de perfil" : "Escolha o seu tipo de perfil"}
        </h1>
        <p className="text-gray-500 mb-6">
          {profileExists
            ? "Já existe um perfil associado, mas pode atualizá-lo se desejar."
            : "Selecione abaixo o tipo de conta que pretende criar na plataforma."}
        </p>

        <ChooseRole handleSelect={handleSelect} />

        {loading && <p className="text-sm text-gray-400 mt-4">A carregar...</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

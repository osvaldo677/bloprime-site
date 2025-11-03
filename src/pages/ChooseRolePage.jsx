// src/pages/ChooseRolePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import ChooseRole from "./ChooseRole";

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    async function checkExistingProfile() {
      if (!user?.id) return;
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

  const handleSelect = async (profile_type) => {
    if (!user) return setError("⚠️ Sessão inválida. Faça login novamente.");

    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ profile_type })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Perfil atualizado:", data);

      // Atualiza localStorage e AuthContext
      const updatedUser = { ...user, profile_type };
      localStorage.setItem("bloprime_user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);

      // Redireciona conforme o tipo
      switch (profile_type) {
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
          {profileExists ? "Atualizar tipo de perfil" : "Escolha o seu tipo de perfil"}
        </h1>
        <p className="text-gray-500 mb-6">
          {profileExists
            ? "Pode atualizar o tipo de perfil associado à sua conta."
            : "Selecione o tipo de conta que pretende criar na plataforma."}
        </p>

        <ChooseRole handleSelect={handleSelect} />

        {loading && <p className="text-sm text-gray-400 mt-4">A guardar...</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

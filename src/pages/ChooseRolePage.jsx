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
  const [profileType, setProfileType] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_type")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao obter perfil:", error.message);
        return;
      }

      if (data?.profile_type) {
        setProfileType(data.profile_type);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSelect = async (type) => {
    if (!user?.id) return setError("⚠️ Sessão inválida. Faça login novamente.");

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ profile_type: type })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Perfil atualizado com sucesso:", data);

      // Atualiza o contexto e o localStorage
      const updatedUser = { ...user, profile_type: type };
      localStorage.setItem("bloprime_user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      setProfileType(type);

      // 🔁 Redireciona para o formulário correspondente
      setTimeout(() => {
        switch (type) {
          case "athlete":
            navigate("/app/registos/atleta", { replace: true });
            break;
          case "coach":
            navigate("/app/registos/treinador", { replace: true });
            break;
          case "club":
            navigate("/app/registos/clube", { replace: true });
            break;
          case "federation":
            navigate("/app/registos/federacao", { replace: true });
            break;
          default:
            navigate("/app/dashboard", { replace: true });
        }
      }, 600);
    } catch (err) {
      console.error("❌ Erro ao definir tipo de perfil:", err.message);
      setError("Ocorreu um erro ao definir o tipo de perfil.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Se já tem perfil, vai direto
  useEffect(() => {
    if (profileType) {
      switch (profileType) {
        case "athlete":
          navigate("/app/registos/atleta", { replace: true });
          break;
        case "coach":
          navigate("/app/registos/treinador", { replace: true });
          break;
        case "club":
          navigate("/app/registos/clube", { replace: true });
          break;
        case "federation":
          navigate("/app/registos/federacao", { replace: true });
          break;
        default:
          navigate("/app/dashboard", { replace: true });
      }
    }
  }, [profileType]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {profileType
            ? "Atualizar tipo de perfil"
            : "Escolha o seu tipo de perfil"}
        </h1>

        <p className="text-gray-500 mb-6">
          {profileType
            ? "Pode atualizar o tipo de perfil associado à sua conta."
            : "Selecione abaixo o tipo de conta que pretende criar."}
        </p>

        <ChooseRole handleSelect={handleSelect} />

        {loading && (
          <p className="text-gray-400 text-sm mt-4">
            A processar e a redirecionar...
          </p>
        )}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

// src/pages/ChooseRolePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import ChooseRole from "./ChooseRole";

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (role) => {
    if (!user) return setError("⚠️ Sessão inválida. Faça login novamente.");

    setError("");
    setLoading(true);
    try {
      // Atualiza o campo role no perfil
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Redireciona conforme o tipo escolhido
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
      console.error(err);
      setError("❌ Ocorreu um erro ao definir o tipo de perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Escolha o seu tipo de perfil
        </h1>
        <p className="text-gray-500 mb-6">
          Selecione abaixo o tipo de conta que pretende criar na plataforma.
        </p>

        <ChooseRole handleSelect={handleSelect} />

        {loading && <p className="text-sm text-gray-400 mt-4">A carregar...</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

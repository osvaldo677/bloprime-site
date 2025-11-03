// src/pages/PlayerForm.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PlayerForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    nacionalidade: "",
    altura: "",
    peso: "",
    modalidade: "",
    posicao: "",
    numero_camisola: "",
    agente_representante: "",
    escalao: "",
    clube_atual: "",
    telefone: "",
    internacionalizacoes: "",
    conquistas: "",
    observacoes: "",
    consentimento: false,
    consentimento_visibilidade: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return setError("⚠️ Sessão expirada. Faça login novamente.");
    if (!formData.consentimento)
      return setError("⚠️ É necessário aceitar a Política de Privacidade.");
    if (!formData.consentimento_visibilidade)
      return setError("⚠️ Confirme que compreende a visibilidade do perfil.");

    setError("");
    setMessage("");
    setLoading(true);

    try {
      // 1️⃣ Inserir atleta
      const { data, error } = await supabase
        .from("athletes")
        .insert([{ ...formData, user_id: user.id, visibility: "private" }])
        .select()
        .single();

      if (error) throw error;

      // 2️⃣ Atualizar tabela profiles
      await supabase
        .from("profiles")
        .update({
          profile_type: "athlete",
          profile_ref: data.id,
        })
        .eq("user_id", user.id);

      setMessage("✅ Registo de atleta concluído com sucesso!");
      setTimeout(() => navigate("/app/dashboard", { replace: true }), 2000);
    } catch (err) {
      console.error("❌ Erro ao guardar:", err.message);
      setError("❌ Erro ao guardar o registo. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Registo de Atleta
      </h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {message && <p className="text-green-600 mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nome" placeholder="Nome completo" onChange={handleChange} className="border p-2 rounded" />
        <input name="data_nascimento" type="date" onChange={handleChange} className="border p-2 rounded" />
        <input name="nacionalidade" placeholder="Nacionalidade" onChange={handleChange} className="border p-2 rounded" />
        <input name="altura" placeholder="Altura (cm)" onChange={handleChange} className="border p-2 rounded" />
        <input name="peso" placeholder="Peso (kg)" onChange={handleChange} className="border p-2 rounded" />
        <input name="modalidade" placeholder="Modalidade" onChange={handleChange} className="border p-2 rounded" />
        <input name="posicao" placeholder="Posição" onChange={handleChange} className="border p-2 rounded" />
        <input name="numero_camisola" placeholder="Número da camisola" onChange={handleChange} className="border p-2 rounded" />
        <input name="agente_representante" placeholder="Agente / Representante" onChange={handleChange} className="border p-2 rounded" />
        <input name="clube_atual" placeholder="Clube atual" onChange={handleChange} className="border p-2 rounded" />

        {/* ⚠️ Informação sobre visibilidade */}
        <div className="col-span-2">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4 text-sm text-gray-700">
            <h3 className="font-semibold text-blue-800 mb-2">
              ⚠️ Sobre a visibilidade do seu perfil
            </h3>
            <p className="mb-2">
              Após o registo, o seu perfil será inicialmente <strong>Privado</strong>.
            </p>
            <p className="mb-2">
              Posteriormente, poderá optar por <strong>Restrito</strong> ou <strong>Público</strong>.
            </p>
            <p className="text-xs text-gray-600">
              Esta decisão terá consentimento adicional e pode ser alterada depois.
            </p>
          </div>

          <label className="flex items-start gap-2 mt-2 text-sm">
            <input
              type="checkbox"
              name="consentimento_visibilidade"
              checked={formData.consentimento_visibilidade}
              onChange={handleChange}
            />
            <span>
              Compreendo e aceito que o meu perfil poderá ser tornado visível conforme os níveis definidos.
            </span>
          </label>
        </div>

        {/* 📜 Política de Privacidade */}
        <div className="col-span-2">
          <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700 mt-4">
            <h3 className="font-semibold mb-2">BloPrime — Política de Privacidade (resumo)</h3>
            <p className="mb-2">
              Os dados aqui fornecidos serão utilizados para gestão desportiva, representação e contacto.
            </p>
            <p>
              Consulte a{" "}
              <a
                href="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                política completa
              </a>{" "}
              (abre em nova aba).
            </p>
          </div>

          <label className="flex items-start gap-2 mt-3 text-sm">
            <input
              type="checkbox"
              name="consentimento"
              checked={formData.consentimento}
              onChange={handleChange}
            />
            <span>Declaro que li e aceito a Política de Privacidade</span>
          </label>
        </div>

        {/* Botão */}
        <div className="col-span-2 text-right mt-4">
          <button
            type="submit"
            disabled={!formData.consentimento || !formData.consentimento_visibilidade || loading}
            className={`px-4 py-2 rounded text-white ${
              formData.consentimento && formData.consentimento_visibilidade
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "A guardar..." : "Guardar Atleta"}
          </button>
        </div>
      </form>
    </div>
  );
}

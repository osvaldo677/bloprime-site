import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CoachEdit() {
  const { session, loading } = useAuthGuard();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) fetchCoach();
  }, [session]);

  const fetchCoach = async () => {
    const { data, error } = await supabase
      .from("coaches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) setError("Erro ao carregar treinador: " + error.message);
    else setFormData(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consentimento) {
      setError("⚠️ É necessário aceitar a Política de Privacidade.");
      return;
    }

    const { error } = await supabase
      .from("coaches")
      .update({
        ...formData,
        data_nascimento: formData.data_nascimento || null, // ✅ evita erro de data
      })
      .eq("id", id);

    if (error) setError("Erro ao atualizar: " + error.message);
    else {
      setMessage("✅ Treinador atualizado com sucesso!");
      setTimeout(() => navigate("/coaches"), 1500);
    }
  };

  if (loading) return <p>⏳ A carregar...</p>;
  if (!session) return <p>⚠️ Precisa de iniciar sessão.</p>;
  if (!formData) return <p>⏳ A carregar dados...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Editar Treinador</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome + Data de Nascimento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Nome completo</span>
            <input
              type="text"
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nome completo"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Data de nascimento</span>
            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>

        {/* Nacionalidade + Experiência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Nacionalidade</span>
            <input
              type="text"
              name="nacionalidade"
              value={formData.nacionalidade || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Angola"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Anos de experiência</span>
            <input
              type="text"
              name="experiencia"
              value={formData.experiencia || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: 10 anos"
            />
          </label>
        </div>

        {/* Modalidade + Equipa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Modalidade</span>
            <input
              type="text"
              name="modalidade"
              value={formData.modalidade || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Basquetebol"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Equipa atual</span>
            <input
              type="text"
              name="equipa_atual"
              value={formData.equipa_atual || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nome da equipa"
            />
          </label>
        </div>

        {/* Escalão */}
        <label className="block">
          <span className="text-sm text-gray-600">Escalão</span>
          <input
            type="text"
            name="escalao"
            value={formData.escalao || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: Sub-21"
          />
        </label>

        {/* Contactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="exemplo@email.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Telefone</span>
            <PhoneInput
              country={"ao"}
              value={formData.telefone?.replace("+", "") || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, telefone: "+" + value }))
              }
              inputClass="!w-full !p-2 !border !rounded"
              placeholder="Digite o número de telefone"
            />
          </label>
        </div>

        {/* Conquistas */}
        <label className="block">
          <span className="text-sm text-gray-600">Conquistas</span>
          <textarea
            name="conquistas"
            value={formData.conquistas || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Máx. 400 caracteres"
            maxLength={400}
          />
        </label>

        {/* Observações */}
        <label className="block">
          <span className="text-sm text-gray-600">Observações</span>
          <textarea
            name="observacoes"
            value={formData.observacoes || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Máx. 400 caracteres"
            maxLength={400}
          />
        </label>

        {/* Política de Privacidade */}
        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">
            BloPrime — Política de Privacidade (resumo)
          </h3>
          <p className="mb-2">
            Os dados aqui fornecidos serão utilizados para gestão desportiva,
            representação e contacto institucional. Ao aceitar autoriza o
            tratamento conforme a lei aplicável.
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

        {/* Consentimento */}
        <label className="flex items-start gap-2 mt-3">
          <input
            type="checkbox"
            name="consentimento"
            checked={formData.consentimento || false}
            onChange={handleChange}
          />
          <span>Declaro que li e aceito a Política de Privacidade</span>
        </label>

        <button
          type="submit"
          disabled={!formData.consentimento}
          className={`px-4 py-2 rounded text-white ${
            formData.consentimento
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Guardar Alterações
        </button>
      </form>
    </div>
  );
}

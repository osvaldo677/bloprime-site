import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ClubEdit() {
  const { session, loading } = useAuthGuard();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
    modalidade_principal: "",
    fundacao: "",
    email: "",
    telefone: "",
    observacoes: "",
    consentimento: false,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) fetchClub();
  }, [session]);

  const fetchClub = async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) setError(error.message);
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
      .from("clubs")
      .update(formData)
      .eq("id", id);

    if (error) setError("⚠️ Erro ao atualizar: " + error.message);
    else {
      setMessage("✅ Clube atualizado com sucesso!");
      setError(null);
      setTimeout(() => navigate("/clubs"), 1200);
    }
  };

  if (loading) return <p className="text-center">⏳ A carregar...</p>;
  if (!session) return <p className="text-center">⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Clube</h1>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <span className="text-sm text-gray-600">Nome do Clube</span>
            <input
              type="text"
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Sport Luanda e Benfica"
              required
            />
          </label>

          <label>
            <span className="text-sm text-gray-600">Localização</span>
            <input
              type="text"
              name="localizacao"
              value={formData.localizacao || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Cidade / Província"
            />
          </label>

          <label>
            <span className="text-sm text-gray-600">Modalidade Principal</span>
            <input
              type="text"
              name="modalidade_principal"
              value={formData.modalidade_principal || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Futebol"
            />
          </label>

          <label>
            <span className="text-sm text-gray-600">Data de Fundação</span>
            <input
              type="date"
              name="fundacao"
              value={formData.fundacao || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>

        {/* Contactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <span className="text-sm text-gray-600">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="email@exemplo.com"
              required
            />
          </label>

          <label>
            <span className="text-sm text-gray-600">Telefone</span>
            <PhoneInput
              country={"ao"}
              value={formData.telefone || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, telefone: "+" + value }))
              }
              inputClass="!w-full !p-2 !border !rounded"
              placeholder="Digite o número de telefone"
            />
          </label>
        </div>

        {/* Observações */}
        <label>
          <span className="text-sm text-gray-600">Observações</span>
          <textarea
            name="observacoes"
            value={formData.observacoes || ""}
            onChange={handleChange}
            maxLength={400}
            className="w-full p-2 border rounded"
            placeholder="Informações adicionais (máx. 400 caracteres)"
          />
        </label>
        <p className="text-sm text-gray-500">
          Caracteres restantes: {400 - (formData.observacoes?.length || 0)}
        </p>

        {/* Política de Privacidade */}
        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">BloPrime — Política de Privacidade (resumo)</h3>
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

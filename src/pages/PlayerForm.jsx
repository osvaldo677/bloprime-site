import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PlayerForm() {
  const { session, loading } = useAuthGuard();

  const initialForm = {
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
    contrato_valido: false,
    contrato_ate: "",
    email: "",
    telefone: "",
    internacionalizacoes: "",
    conquistas: "",
    observacoes: "",
    consentimento: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("⚠️ Precisa de iniciar sessão para registar um atleta.");
      return;
    }

    if (!formData.consentimento) {
      setError("⚠️ É necessário aceitar a Política de Privacidade.");
      return;
    }

    // 🔧 Não enviar datas vazias
    const dataToInsert = {
      ...formData,
      user_id: session.user.id,
      data_nascimento: formData.data_nascimento || null,
      contrato_ate: formData.contrato_valido ? formData.contrato_ate || null : null,
    };

    const { error } = await supabase.from("athletes").insert([dataToInsert]);

    if (error) {
      setError("❌ Erro ao guardar o atleta: " + error.message);
      setMessage(null);
    } else {
      setMessage("✅ Atleta registado com sucesso!");
      setError(null);
      setFormData(initialForm); // 🔄 limpa todos os campos
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ A carregar...</p>;
  if (!session) return <p className="text-center mt-10">⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Registo de Atleta</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Nome completo</span>
            <input type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} className="w-full p-2 border rounded" required />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Data de nascimento</span>
            <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Nacionalidade</span>
            <input type="text" name="nacionalidade" placeholder="Ex: Angola" value={formData.nacionalidade} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Altura</span>
            <input type="text" name="altura" placeholder="Ex: 1.80" value={formData.altura} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Peso</span>
            <input type="text" name="peso" placeholder="Ex: 75kg" value={formData.peso} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Modalidade</span>
            <input type="text" name="modalidade" placeholder="Ex: Futebol" value={formData.modalidade} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Posição</span>
            <input type="text" name="posicao" placeholder="Ex: Avançado" value={formData.posicao} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Número da camisola</span>
            <input type="number" name="numero_camisola" placeholder="Ex: 10" value={formData.numero_camisola} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Agente / Representante</span>
            <input type="text" name="agente_representante" placeholder="Nome do agente" value={formData.agente_representante} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Escalão</span>
            <input type="text" name="escalao" placeholder="Ex: Sub-20" value={formData.escalao} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Clube atual</span>
            <input type="text" name="clube_atual" placeholder="Nome do clube" value={formData.clube_atual} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          {/* ✅ Aqui estava o erro: o atributo name estava incompleto */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="contrato_valido"
              checked={formData.contrato_valido}
              onChange={handleChange}
            />
            <span>Tem contrato válido?</span>
          </label>

          {formData.contrato_valido && (
            <label className="block">
              <span className="text-sm text-gray-600">Contrato até</span>
              <input type="date" name="contrato_ate" value={formData.contrato_ate} onChange={handleChange} className="w-full p-2 border rounded" />
            </label>
          )}
        </div>

        {/* Contactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <input type="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Telefone</span>
            <PhoneInput
              country={"ao"}
              value={formData.telefone}
              onChange={(value) => setFormData((prev) => ({ ...prev, telefone: "+" + value }))}
              inputClass="!w-full !p-2 !border !rounded"
              placeholder="Digite o número de telefone"
            />
          </label>
        </div>

        {/* Internacionalizações */}
        <label className="block">
          <span className="text-sm text-gray-600">Internacionalizações</span>
          <input type="number" name="internacionalizacoes" placeholder="Ex: 5" value={formData.internacionalizacoes} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        {/* Conquistas */}
        <label className="block">
          <span className="text-sm text-gray-600">Conquistas</span>
          <textarea name="conquistas" placeholder="Máx. 400 caracteres" value={formData.conquistas} onChange={handleChange} maxLength={400} className="w-full p-2 border rounded" />
          <p className="text-sm text-gray-500">Caracteres restantes: {400 - formData.conquistas.length}</p>
        </label>

        {/* Observações */}
        <label className="block">
          <span className="text-sm text-gray-600">Observações adicionais</span>
          <textarea name="observacoes" placeholder="Máx. 400 caracteres" value={formData.observacoes} onChange={handleChange} maxLength={400} className="w-full p-2 border rounded" />
          <p className="text-sm text-gray-500">Caracteres restantes: {400 - formData.observacoes.length}</p>
        </label>

        {/* Política de Privacidade */}
        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">BloPrime — Política de Privacidade (resumo)</h3>
          <p className="mb-2">
            Os dados aqui fornecidos serão utilizados para gestão desportiva, representação e contacto institucional.
            Ao aceitar autoriza o tratamento conforme a lei aplicável.
          </p>
          <p>
            Consulte a{" "}
            <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              política completa
            </a>{" "}
            (abre em nova aba).
          </p>
        </div>

        <label className="flex items-start gap-2 mt-3">
          <input type="checkbox" name="consentimento" checked={formData.consentimento} onChange={handleChange} />
          <span>Declaro que li e aceito a Política de Privacidade</span>
        </label>

        <button
          type="submit"
          disabled={!formData.consentimento}
          className={`px-4 py-2 rounded text-white ${
            formData.consentimento ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Guardar Atleta
        </button>
      </form>
    </div>
  );
}

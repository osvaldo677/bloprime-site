import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CountrySelect from "../components/CountrySelect";

export default function CoachForm() {
  const { session, loading } = useAuthGuard();

  const initialForm = {
    nome: "",
    data_nascimento: "",
    nacionalidade: "",
    experiencia: "",
    modalidade: "",
    equipa_atual: "",
    escalao: "",
    tem_contrato_valido: false,
    contrato_ate: "",
    conquistas: "",
    email: "",
    telefone: "",
    observacoes: "",
    consentimento: false,
    consentimento_visibilidade: false,
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

    if (!session) return setError("⚠️ Precisa de iniciar sessão.");
    if (!formData.consentimento)
      return setError("⚠️ É necessário aceitar a Política de Privacidade.");
    if (!formData.consentimento_visibilidade)
      return setError("⚠️ Confirme que compreende como o perfil poderá ser exibido.");

    const dataToInsert = {
      ...formData,
      user_id: session.user.id,
      visibilidade: "privado",
      data_nascimento: formData.data_nascimento || null,
      contrato_ate: formData.tem_contrato_valido
        ? formData.contrato_ate || null
        : null,
    };

    const { error } = await supabase.from("coaches").insert([dataToInsert]);
    if (error) setError("❌ Erro ao guardar: " + error.message);
    else {
      setMessage("✅ Treinador registado com sucesso!");
      setError(null);
      setFormData(initialForm);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ A carregar...</p>;
  if (!session)
    return <p className="text-center mt-10">⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🧑‍🏫 Registo de Treinador
      </h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados Pessoais */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Nome completo</span>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Ex: João Pedro"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Data de nascimento</span>
            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">País / Nacionalidade</span>
            <CountrySelect
              name="nacionalidade"
              value={formData.nacionalidade}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Anos de experiência</span>
            <input
              type="text"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              placeholder="Ex: 10 anos"
              className="w-full p-2 border rounded"
            />
          </label>
        </div>

        {/* Modalidade + Equipa */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Modalidade</span>
            <select
              name="modalidade"
              value={formData.modalidade}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione...</option>
              <option value="Futebol">Futebol</option>
              <option value="Futsal">Futsal</option>
              <option value="Basquetebol">Basquetebol</option>
              <option value="Andebol">Andebol</option>
              <option value="Voleibol">Voleibol</option>
              <option value="Hóquei">Hóquei</option>
              <option value="Outra">Outra</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Equipa atual</span>
            <input
              type="text"
              name="equipa_atual"
              value={formData.equipa_atual}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Petro de Luanda"
            />
          </label>
        </div>

        {/* Escalão e Contrato */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Escalão</span>
            <input
              type="text"
              name="escalao"
              value={formData.escalao}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Sub-21"
            />
          </label>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                name="tem_contrato_valido"
                checked={formData.tem_contrato_valido}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-600">
                Tem contrato válido?
              </span>
            </div>

            {formData.tem_contrato_valido && (
              <label className="block">
                <span className="text-sm text-gray-600">
                  Contrato válido até
                </span>
                <input
                  type="date"
                  name="contrato_ate"
                  value={formData.contrato_ate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </label>
            )}
          </div>
        </div>

        {/* Contactos */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="exemplo@email.com"
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Telefone</span>
            <PhoneInput
              country={"ao"}
              value={formData.telefone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, telefone: "+" + value }))
              }
              inputClass="!w-full !p-2 !border !rounded"
              placeholder="Ex: +244 900 000 000"
            />
          </label>
        </div>

        {/* Conquistas e Observações */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Conquistas</span>
            <textarea
              name="conquistas"
              value={formData.conquistas}
              onChange={handleChange}
              className="w-full p-2 border rounded min-h-[80px]"
              placeholder="Títulos, prémios..."
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Observações</span>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full p-2 border rounded min-h-[80px]"
            />
          </label>
        </div>

        {/* ⚠️ Visibilidade */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4 text-sm text-gray-700">
          <h3 className="font-semibold text-blue-800 mb-2">
            ⚠️ Sobre a visibilidade do seu perfil
          </h3>
          <p className="mb-2">
            Após o registo, o seu perfil será inicialmente{" "}
            <strong>Privado</strong>, visível apenas para si e para os
            administradores da BloPrime.
          </p>
          <p className="mb-2">
            Posteriormente, poderá optar (ou ser convidado) a torná-lo{" "}
            <strong>Restrito</strong> (visível a treinadores e clubes) ou{" "}
            <strong>Público</strong> (visível a todos os visitantes do site).
          </p>
          <p className="text-xs text-gray-600">
            Esta decisão será sempre acompanhada de consentimento adicional e
            poderá ser alterada mais tarde na área de edição do treinador.
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
            Compreendo e aceito que o meu perfil poderá ser tornado visível
            conforme os níveis definidos pela BloPrime.
          </span>
        </label>

        {/* 📜 Política de Privacidade */}
        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700 mt-4">
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

        <label className="flex items-start gap-2 mt-3 text-sm">
          <input
            type="checkbox"
            name="consentimento"
            checked={formData.consentimento}
            onChange={handleChange}
          />
          <span>Declaro que li e aceito a Política de Privacidade</span>
        </label>

        <button
          type="submit"
          disabled={!formData.consentimento || !formData.consentimento_visibilidade}
          className={`px-4 py-2 rounded text-white ${
            formData.consentimento && formData.consentimento_visibilidade
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Guardar Treinador
        </button>
      </form>
    </div>
  );
}

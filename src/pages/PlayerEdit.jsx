import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PlayerEdit() {
  const { session, loading } = useAuthGuard();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) fetchPlayer();
  }, [session]);

  const fetchPlayer = async () => {
    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) setError("Erro ao carregar atleta: " + error.message);
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
    const { error } = await supabase.from("athletes").update(formData).eq("id", id);

    if (error) setError("Erro ao atualizar: " + error.message);
    else {
      setMessage("✅ Atleta atualizado com sucesso!");
      setTimeout(() => navigate("/players"), 1500);
    }
  };

  if (loading) return <p>⏳ A carregar...</p>;
  if (!session) return <p>⚠️ Precisa de iniciar sessão.</p>;
  if (!formData) return <p>⏳ A carregar dados...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Editar Atleta</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Dados Pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Nome completo</span>
            <input type="text" name="nome" value={formData.nome || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Nome completo" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Data de nascimento</span>
            <input type="date" name="data_nascimento" value={formData.data_nascimento || ""} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Nacionalidade</span>
            <input type="text" name="nacionalidade" value={formData.nacionalidade || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: Angola" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Altura</span>
            <input type="text" name="altura" value={formData.altura || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: 1.80" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Peso</span>
            <input type="text" name="peso" value={formData.peso || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: 75kg" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Modalidade</span>
            <input type="text" name="modalidade" value={formData.modalidade || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: Futebol" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Posição</span>
            <input type="text" name="posicao" value={formData.posicao || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: Avançado" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Número da camisola</span>
            <input type="number" name="numero_camisola" value={formData.numero_camisola || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: 10" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Agente / Representante</span>
            <input type="text" name="agente_representante" value={formData.agente_representante || ""} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Escalão</span>
            <input type="text" name="escalao" value={formData.escalao || ""} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Clube atual</span>
            <input type="text" name="clube_atual" value={formData.clube_atual || ""} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="contrato_valido" checked={formData.contrato_valido || false} onChange={handleChange} />
            <span>Tem contrato válido?</span>
          </label>

          {formData.contrato_valido && (
            <label className="block">
              <span className="text-sm text-gray-600">Contrato até</span>
              <input type="date" name="contrato_ate" value={formData.contrato_ate || ""} onChange={handleChange} className="w-full p-2 border rounded" />
            </label>
          )}
        </div>

        {/* Contactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="exemplo@email.com" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Telefone</span>
            <PhoneInput country={"ao"} value={formData.telefone?.replace("+", "") || ""} onChange={(value) => setFormData((prev) => ({ ...prev, telefone: "+" + value }))} inputClass="!w-full !p-2 !border !rounded" />
          </label>
        </div>

        {/* Internacionalizações */}
        <label className="block">
          <span className="text-sm text-gray-600">Internacionalizações</span>
          <input type="number" name="internacionalizacoes" value={formData.internacionalizacoes || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        {/* Conquistas */}
        <label className="block">
          <span className="text-sm text-gray-600">Conquistas</span>
          <textarea name="conquistas" value={formData.conquistas || ""} onChange={handleChange} maxLength={400} className="w-full p-2 border rounded" placeholder="Máx. 400 caracteres" />
        </label>

        {/* Observações */}
        <label className="block">
          <span className="text-sm text-gray-600">Observações adicionais</span>
          <textarea name="observacoes" value={formData.observacoes || ""} onChange={handleChange} maxLength={400} className="w-full p-2 border rounded" placeholder="Máx. 400 caracteres" />
        </label>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Guardar Alterações
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import CountrySelect from "../components/CountrySelect";
import MediaUploader from "../components/MediaUploader";
import RequestRepresentationButton from "../components/RequestRepresentationButton";
import { useSession } from "@supabase/auth-helpers-react";

export default function PlayerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  async function fetchPlayer() {
    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) setError("Erro ao carregar atleta: " + error.message);
    else setFormData(data);
  }

  // 🔹 Conversor numérico seguro
  const numeric = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
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
    setSaving(true);
    setError(null);
    setMessage(null);

    const updatedData = {
      ...formData,
      contrato_ate: formData.contrato_valido
        ? formData.contrato_ate || null
        : null,
      data_nascimento: formData.data_nascimento || null,
      numero_camisola: numeric(formData.numero_camisola),
      internacionalizacoes: numeric(formData.internacionalizacoes),
    };

    const { error } = await supabase
      .from("athletes")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      setError("❌ Erro ao atualizar: " + error.message);
    } else {
      setMessage("✅ Dados do atleta atualizados com sucesso!");
      setTimeout(() => navigate("/app/players"), 1500);
    }

    setSaving(false);
  };

  if (!formData) return <p className="text-center mt-10">⏳ A carregar...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">✏️ Editar Atleta</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Dados pessoais */}
        <label className="block">
          <span className="text-sm text-gray-600">Nome completo</span>
          <input
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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

        <label className="block">
          <span className="text-sm text-gray-600">Nacionalidade</span>
          <CountrySelect
            name="nacionalidade"
            value={formData.nacionalidade}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Modalidade</span>
          <select
            name="modalidade"
            value={formData.modalidade || ""}
            onChange={handleChange}
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

        {/* Contrato */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              name="contrato_valido"
              checked={formData.contrato_valido || false}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-600">Tem contrato válido?</span>
          </div>

          {formData.contrato_valido && (
            <label className="block">
              <span className="text-sm text-gray-600">Contrato válido até</span>
              <input
                type="date"
                name="contrato_ate"
                value={formData.contrato_ate || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
          )}
        </div>

        {/* Altura / Peso */}
        <label className="block">
          <span className="text-sm text-gray-600">Altura</span>
          <input
            type="text"
            name="altura"
            value={formData.altura || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Peso</span>
          <input
            type="text"
            name="peso"
            value={formData.peso || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        {/* 📸 Mídia */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📸 Fotografias e Vídeo
          </h2>

          <MediaUploader
            label="Fotografias"
            bucket="fotos"
            path={`athletes/${id}`}
            urls={formData.foto_url ? formData.foto_url.split(",") : []}
            recordId={id}
            onUploadComplete={(urls) =>
              setFormData((prev) => ({ ...prev, foto_url: urls.join(",") }))
            }
          />

          <MediaUploader
            label="Vídeo de apresentação"
            bucket="videos"
            path={`athletes/${id}`}
            urls={formData.video_url ? [formData.video_url] : []}
            recordId={id}
            onUploadComplete={(urls) =>
              setFormData((prev) => ({ ...prev, video_url: urls[0] }))
            }
          />
        </div>

        {/* Botões */}
        <div className="md:col-span-2 flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/app/players")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "A guardar..." : "💾 Guardar alterações"}
          </button>
        </div>

        {/* 🔹 Botão de pedido de representação */}
        {session && (
          <div className="md:col-span-2 mt-4 text-center border-t pt-4">
            <RequestRepresentationButton
              userId={session.user.id}
              userType="athlete"
              contratoAtivo={formData.contrato_valido}
              dataContratoAte={formData.contrato_ate}
            />
          </div>
        )}
      </form>
    </div>
  );
}

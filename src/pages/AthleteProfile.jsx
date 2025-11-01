import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ReactCountryFlag from "react-country-flag";
import { Helmet } from "react-helmet-async";
import RequestRepresentationButton from "../components/RequestRepresentationButton";
import { useSession } from "@supabase/auth-helpers-react";

export default function AthleteProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAthlete();
  }, [id]);

  async function fetchAthlete() {
    setLoading(true);
    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", id)
      // deixa a RLS decidir, mas só carrega se existir
      .in("visibilidade", ["publico", "restrito", "privado"])
      .single();

    if (error || !data) {
      setError("❌ Atleta não encontrado ou perfil inacessível.");
    } else {
      setAthlete(data);
    }
    setLoading(false);
  }

  if (loading) return <p className="text-center mt-10">⏳ A carregar atleta...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!athlete) return null;

  const fotos = athlete.foto_url ? athlete.foto_url.split(",") : [];
  const temVideo = athlete.video_url && athlete.video_url.trim() !== "";
  const contratoAtivo =
    athlete.tem_contrato_valido && new Date(athlete.contrato_ate) > new Date();

  const handleLoginPrompt = () => {
    alert("É necessário iniciar sessão para efetuar esta ação.");
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>{athlete.nome} — Perfil BloPrime</title>
        <meta
          name="description"
          content={`Perfil desportivo de ${athlete.nome}, atleta de ${athlete.modalidade}.`}
        />
      </Helmet>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 📸 Foto principal */}
          <div className="flex-shrink-0 md:w-1/3">
            {fotos.length > 0 ? (
              <img
                src={fotos[0]}
                alt={athlete.nome}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
                Sem foto disponível
              </div>
            )}
          </div>

          {/* 🧾 Dados principais */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {athlete.nome}
            </h1>
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              {athlete.nacionalidade && (
                <ReactCountryFlag
                  countryCode={(athlete.nacionalidade_code || "").slice(0, 2)}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
              )}
              <span>{athlete.nacionalidade}</span>
            </div>

            <p className="text-gray-600 mb-1">
              <strong>Modalidade:</strong> {athlete.modalidade || "—"}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Altura:</strong>{" "}
              {athlete.altura ? `${athlete.altura} cm` : "—"}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Peso:</strong>{" "}
              {athlete.peso ? `${athlete.peso} kg` : "—"}
            </p>

            {athlete.tem_contrato_valido && (
              <p className="text-gray-600 mt-2">
                🔒 Contrato válido até{" "}
                {athlete.contrato_ate
                  ? new Date(athlete.contrato_ate).toLocaleDateString("pt-PT")
                  : "(data não indicada)"}
              </p>
            )}
          </div>
        </div>

        {/* 📸 Galeria de fotos */}
        {fotos.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              📸 Galeria
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fotos.slice(1).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`foto-${idx}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* 🎥 Vídeo */}
        {temVideo && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              🎥 Vídeo de Apresentação
            </h3>
            <video
              src={athlete.video_url}
              controls
              className="w-full rounded-lg shadow"
            />
          </div>
        )}

        {/* 📝 Observações */}
        {athlete.observacoes && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              📝 Biografia / Observações
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {athlete.observacoes}
            </p>
          </div>
        )}

        {/* 🤝 Pedido de Representação / Interesse */}
        <div className="mt-8 text-center border-t pt-4">
          {session ? (
            <RequestRepresentationButton
              userId={session.user.id}
              userType="club_or_federation"
              contratoAtivo={contratoAtivo}
              dataContratoAte={athlete.contrato_ate}
            />
          ) : (
            <button
              onClick={handleLoginPrompt}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔒 Iniciar sessão para manifestar interesse
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

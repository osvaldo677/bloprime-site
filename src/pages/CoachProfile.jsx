import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Helmet } from "react-helmet-async";
import ReactCountryFlag from "react-country-flag";
import { useSession } from "@supabase/auth-helpers-react";
import RequestRepresentationButton from "../components/RequestRepresentationButton";

export default function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();

  const [coach, setCoach] = useState(null);
  const [role, setRole] = useState("public");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessionAndCoach();
  }, [id]);

  async function fetchSessionAndCoach() {
    // 🔐 obtem sessão e role do utilizador
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();
      setRole(profile?.role || "user");
    } else setRole("public");

    const { data: coachData, error } = await supabase
      .from("coaches")
      .select("*")
      .eq("id", id)
      .in("visibilidade", ["publico", "restrito", "privado"])
      .single();

    if (error || !coachData) setError("❌ Treinador não encontrado ou inacessível.");
    else setCoach(coachData);
    setLoading(false);
  }

  if (loading) return <p className="text-center mt-10">⏳ A carregar treinador...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!coach) return null;

  // 🔒 regras de visibilidade
  if (coach.visibilidade === "privado" && role !== "admin")
    return <p className="text-center mt-10 text-gray-600">⚠️ Este perfil é privado.</p>;

  if (
    coach.visibilidade === "restrito" &&
    !["admin", "club", "federation"].includes(role)
  )
    return (
      <p className="text-center mt-10 text-gray-600">
        ⚠️ Este perfil é restrito a clubes e federações registadas.
      </p>
    );

  const fotos = coach.foto_url ? coach.foto_url.split(",") : [];
  const temVideo = coach.video_url && coach.video_url.trim() !== "";
  const contratoAtivo =
    coach.tem_contrato_valido && new Date(coach.contrato_ate) > new Date();

  const handleLoginPrompt = () => {
    alert("É necessário iniciar sessão para efetuar esta ação.");
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>{coach.nome} — Treinador BloPrime</title>
        <meta
          name="description"
          content={`Perfil de ${coach.nome}, treinador de ${coach.modalidade} na plataforma BloPrime.`}
        />
      </Helmet>

      <div className="bg-white rounded-lg shadow p-6">
        {/* 🧾 Cabeçalho */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {fotos.length > 0 ? (
              <img
                src={fotos[0]}
                alt={coach.nome}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
                Sem foto disponível
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {coach.nome}
            </h1>

            <div className="flex items-center gap-2 mb-2 text-gray-700">
              {coach.nacionalidade && (
                <ReactCountryFlag
                  countryCode={(coach.nacionalidade_code || "").slice(0, 2)}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
              )}
              <span>{coach.nacionalidade}</span>
            </div>

            <p className="text-gray-600">
              <strong>Modalidade:</strong> {coach.modalidade || "—"}
            </p>
            <p className="text-gray-600">
              <strong>Nível:</strong> {coach.nivel || "—"}
            </p>
            <p className="text-gray-600">
              <strong>Clube atual:</strong> {coach.clube_atual || "Sem clube"}
            </p>

            {coach.tem_contrato_valido && (
              <p className="text-sm mt-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 inline-block">
                ⚠️ Contrato ativo até{" "}
                {new Date(coach.contrato_ate).toLocaleDateString("pt-PT")}
              </p>
            )}
          </div>
        </div>

        {/* 📸 Galeria */}
        {fotos.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📸 Galeria</h3>
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
              src={coach.video_url}
              controls
              className="w-full rounded-lg shadow"
            />
          </div>
        )}

        {/* 🏆 Conquistas */}
        {coach.conquistas && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              🏆 Experiência e Conquistas
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {coach.conquistas}
            </p>
          </div>
        )}

        {/* 📝 Observações */}
        {coach.observacoes && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              📝 Observações
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {coach.observacoes}
            </p>
          </div>
        )}

        {/* 🤝 Pedidos de Representação / Interesse */}
        <div className="mt-8 text-center border-t pt-4">
          {session ? (
            <RequestRepresentationButton
              userId={session.user.id}
              userType="club_or_federation"
              contratoAtivo={contratoAtivo}
              dataContratoAte={coach.contrato_ate}
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

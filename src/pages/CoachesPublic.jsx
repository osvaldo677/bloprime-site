import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Helmet } from "react-helmet-async";
import ReactCountryFlag from "react-country-flag";

export default function CoachesPublic() {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [role, setRole] = useState("public"); // public | club | federation | admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUserAndCoaches();
  }, []);

  const fetchUserAndCoaches = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let userRole = "public";

      if (sessionData.session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single();
        userRole = profile?.role || "public";
      }

      setRole(userRole);
      await fetchCoaches(userRole);
    } catch (err) {
      setError("Erro ao carregar treinadores: " + err.message);
      setLoading(false);
    }
  };

  const fetchCoaches = async (userRole) => {
    setLoading(true);
    let query = supabase
      .from("coaches")
      .select(
        "id, nome, nacionalidade, nacionalidade_code, modalidade, nivel, clube_atual, visibilidade, foto_url, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(48);

    if (userRole === "public") {
      query = query.eq("visibilidade", "publico");
    } else if (["club", "federation"].includes(userRole)) {
      query = query.in("visibilidade", ["restrito", "publico"]);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setCoaches(data || []);
    setLoading(false);
  };

  const filtered = coaches.filter((c) =>
    [c.nome, c.modalidade, c.nacionalidade]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 animate-pulse">
        ⏳ A carregar treinadores...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10">
        ⚠️ Ocorreu um erro: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Treinadores BloPrime — Representação Desportiva</title>
        <meta
          name="description"
          content="Descubra os treinadores da plataforma BloPrime — talentos e profissionais disponíveis para representação ou interesse de clubes e federações."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-6">
          👨‍🏫 Treinadores BloPrime
        </h1>

        {/* 🔍 Pesquisa */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, modalidade ou país..."
            className="w-full sm:w-2/3 md:w-1/2 p-2 border rounded shadow-sm"
          />
        </div>

        {/* 📋 Lista */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum treinador encontrado para a sua pesquisa ou nível de acesso.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((c) => {
              const fotos = c.foto_url ? c.foto_url.split(",") : [];
              const img =
                fotos.length > 0
                  ? fotos[0]
                  : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={img}
                    alt={c.nome}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {c.nome}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {c.modalidade} • {c.nivel || "—"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Clube:</strong> {c.clube_atual || "Sem clube"}
                    </p>

                    {/* País com bandeira */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      {c.nacionalidade_code && (
                        <ReactCountryFlag
                          countryCode={c.nacionalidade_code.slice(0, 2)}
                          svg
                          style={{ width: "1em", height: "1em" }}
                        />
                      )}
                      <span>{c.nacionalidade}</span>
                    </div>

                    {/* Tag visibilidade */}
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          c.visibilidade === "publico"
                            ? "bg-green-100 text-green-700"
                            : c.visibilidade === "restrito"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.visibilidade.charAt(0).toUpperCase() +
                          c.visibilidade.slice(1)}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/coach/${c.id}`)}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition"
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🔑 Dica para login */}
        <div className="text-center mt-10">
          {role === "public" && (
            <p className="text-gray-600 text-sm">
              Deseja ver mais treinadores?{" "}
              <a
                href="/login"
                className="text-red-600 hover:underline font-medium"
              >
                Inicie sessão
              </a>{" "}
              como clube ou federação.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/**
 * Página pública adaptativa da listagem de atletas
 * - Mostra atletas conforme o nível de visibilidade (privado/restrito/público)
 * - Público: apenas visibilidade = 'publico'
 * - Coach/Club: visibilidade = ['restrito', 'publico']
 * - Admin: vê todos
 */

export default function AthletesPublic() {
  const [athletes, setAthletes] = useState([]);
  const [role, setRole] = useState("public"); // public | coach | club | admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        // Utilizador público
        await fetchAthletes("public");
        setRole("public");
        return;
      }

      // Obter perfil e determinar role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const userRole = profile?.role || "public";
      setRole(userRole);

      await fetchAthletes(userRole);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar utilizador");
    } finally {
      setLoading(false);
    }
  };

  const fetchAthletes = async (userRole) => {
    let query = supabase
      .from("athletes")
      .select(
        "id, nome, nacionalidade, modalidade, posicao, escalao, clube_atual, foto_url, visibilidade, created_at"
      )
      .order("created_at", { ascending: false });

    if (userRole === "public") query = query.eq("visibilidade", "publico");
    else if (["coach", "club"].includes(userRole))
      query = query.in("visibilidade", ["restrito", "publico"]);
    // admin vê tudo

    const { data, error } = await query;
    if (error) setError(error.message);
    else setAthletes(data || []);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">⏳ A carregar atletas...</p>
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
        <title>Atletas BloPrime — Talentos Desportivos</title>
        <meta
          name="description"
          content="Conheça os atletas representados pela BloPrime — talentos em diferentes modalidades desportivas."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          🏅 Atletas BloPrime
        </h1>

        {athletes.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum atleta disponível para o seu nível de acesso.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {athletes.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    a.foto_url ||
                    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  }
                  alt={a.nome}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {a.nome}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {a.modalidade} • {a.posicao || "—"} • {a.escalao || "—"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Clube:</strong> {a.clube_atual || "Sem clube"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Nacionalidade: {a.nacionalidade || "—"}
                  </p>

                  {/* Tag de visibilidade */}
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        a.visibilidade === "publico"
                          ? "bg-green-100 text-green-700"
                          : a.visibilidade === "restrito"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.visibilidade.charAt(0).toUpperCase() +
                        a.visibilidade.slice(1)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/athlete/${a.id}`)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          {role === "public" && (
            <p className="text-gray-600 text-sm">
              Deseja ver mais atletas?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Inicie sessão
              </a>{" "}
              como treinador ou clube.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

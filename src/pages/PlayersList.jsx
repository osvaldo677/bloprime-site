import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";

export default function PlayerList() {
  const { session, profile, loading } = useAuthGuard();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Carrega lista de atletas após autenticação
  useEffect(() => {
    if (session && profile) fetchPlayers();
  }, [session, profile]);

  const fetchPlayers = async () => {
    try {
      let query = supabase
        .from("athletes")
        .select("id, nome, email, telefone, modalidade, escalao, criado_em, user_id")
        .order("criado_em", { ascending: false }); // 🔄 corrigido

      // 🔒 Se não for admin, mostra apenas os próprios atletas
      if (profile.role !== "admin") query = query.eq("user_id", session.user.id);

      const { data, error } = await query;

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      console.error("Erro ao carregar atletas:", err.message);
      setError("❌ Erro ao carregar atletas: " + err.message);
    }
  };

  // 🔹 Eliminar atleta via RPC
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este atleta?")) return;

    // ⚙️ Ajusta o bucket conforme os ficheiros reais
    const { error } = await supabase.rpc("delete_row_with_media", {
      p_table: "athletes",
      p_id: id,
      p_bucket: "fotos", // ou "athletes" se o bucket for assim chamado
    });

    if (error) {
      console.error("Erro RPC:", error.message);
      alert("❌ Erro ao eliminar atleta: " + error.message);
    } else {
      alert("✅ Atleta eliminado com sucesso!");
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ A carregar...</p>;
  if (!session) return <p className="text-center mt-10">⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👟 Lista de Atletas</h1>
        <button
          onClick={() => navigate("/app/registos/atleta")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          ➕ Novo
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {players.length === 0 ? (
        <p className="text-gray-600">Nenhum atleta registado ainda.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full border border-gray-200 bg-white text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="border px-3 py-2 text-left">Nome</th>
                <th className="border px-3 py-2 text-left">Email</th>
                <th className="border px-3 py-2 text-left">Telefone</th>
                <th className="border px-3 py-2 text-left">Modalidade</th>
                <th className="border px-3 py-2 text-left">Escalão</th>
                <th className="border px-3 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.nome}</td>
                  <td className="border px-3 py-2">{p.email}</td>
                  <td className="border px-3 py-2">{p.telefone}</td>
                  <td className="border px-3 py-2">{p.modalidade}</td>
                  <td className="border px-3 py-2">{p.escalao}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/app/players/edit/${p.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

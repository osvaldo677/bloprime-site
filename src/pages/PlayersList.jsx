import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";

export default function PlayersList() {
  const { session, profile, loading } = useAuthGuard();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (session && profile) fetchPlayers();
  }, [session, profile]);

  const fetchPlayers = async () => {
    let query = supabase.from("athletes").select("*").order("created_at", { ascending: false });
    if (profile.role !== "admin") query = query.eq("user_id", session.user.id);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setPlayers(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este atleta?")) return;
    const { error } = await supabase.from("athletes").delete().eq("id", id);
    if (error) alert("Erro ao eliminar: " + error.message);
    else setPlayers(players.filter((p) => p.id !== id));
  };

  if (loading) return <p>⏳ A carregar...</p>;
  if (!session) return <p>⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lista de Atletas</h1>
        <button
          onClick={() => navigate("/app/registos/atleta")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          ➕ Novo
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">Erro: {error}</p>}

      {players.length === 0 ? (
        <p className="text-gray-600">Nenhum atleta registado ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-sm text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
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

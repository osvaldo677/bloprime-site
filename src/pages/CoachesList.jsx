import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";

export default function CoachesList() {
  const { session, profile, loading } = useAuthGuard();
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (session && profile) fetchCoaches();
  }, [session, profile]);

  const fetchCoaches = async () => {
    let query = supabase.from("coaches").select("*").order("created_at", { ascending: false });
    if (profile.role !== "admin") query = query.eq("user_id", session.user.id);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setCoaches(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este treinador?")) return;
    const { error } = await supabase.from("coaches").delete().eq("id", id);
    if (error) alert("Erro ao eliminar: " + error.message);
    else setCoaches(coaches.filter((c) => c.id !== id));
  };

  if (loading) return <p>⏳ A carregar...</p>;
  if (!session) return <p>⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lista de Treinadores</h1>
        <button
          onClick={() => navigate("/app/registos/treinador")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          ➕ Novo
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">Erro: {error}</p>}

      {coaches.length === 0 ? (
        <p className="text-gray-600">Nenhum treinador registado ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-sm text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="border px-3 py-2 text-left">Nome</th>
                <th className="border px-3 py-2 text-left">Email</th>
                <th className="border px-3 py-2 text-left">Telefone</th>
                <th className="border px-3 py-2 text-left">Modalidade</th>
                <th className="border px-3 py-2 text-left">Nível</th>
                <th className="border px-3 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{c.nome}</td>
                  <td className="border px-3 py-2">{c.email}</td>
                  <td className="border px-3 py-2">{c.telefone}</td>
                  <td className="border px-3 py-2">{c.modalidade}</td>
                  <td className="border px-3 py-2">{c.nivel}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/app/coaches/edit/${c.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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

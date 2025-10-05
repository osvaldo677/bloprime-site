import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";

export default function FederationsList() {
  const { session, profile, loading } = useAuthGuard();
  const [federations, setFederations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (session && profile) fetchFederations();
  }, [session, profile]);

  const fetchFederations = async () => {
    let query = supabase.from("federations").select("*").order("created_at", { ascending: false });
    if (profile.role !== "admin") query = query.eq("user_id", session.user.id);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setFederations(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta federação?")) return;
    const { error } = await supabase.from("federations").delete().eq("id", id);
    if (error) alert("Erro ao eliminar: " + error.message);
    else setFederations(federations.filter((f) => f.id !== id));
  };

  if (loading) return <p>⏳ A carregar...</p>;
  if (!session) return <p>⚠️ Precisa de iniciar sessão.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Federações</h1>
      {error && <p className="text-red-600 mb-4">Erro: {error}</p>}

      {federations.length === 0 ? (
        <p className="text-gray-600">Nenhuma federação registada ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-sm text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="border px-3 py-2 text-left">Nome</th>
                <th className="border px-3 py-2 text-left">Modalidade</th>
                <th className="border px-3 py-2 text-left">Localização</th>
                <th className="border px-3 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {federations.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{f.nome}</td>
                  <td className="border px-3 py-2">{f.modalidade}</td>
                  <td className="border px-3 py-2">{f.localizacao}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/app/federations/edit/${f.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
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

import { useEffect, useState } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import { supabase } from "../lib/supabaseClient";
import { Eye, Trash2, Settings2 } from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";

export default function AdminPage() {
  const { session, profile, loading } = useAuthGuard();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (profile?.role === "admin") carregarUtilizadores();
  }, [profile]);

  async function carregarUtilizadores() {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setMensagem("❌ Erro ao carregar utilizadores: " + err.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function eliminarUtilizador(id) {
    if (!window.confirm("Deseja eliminar este utilizador e respetivos registos?")) return;
    const { error } = await supabase.rpc("admin_delete_user", { target_user_id: id });
    if (error) setMensagem("❌ Erro ao eliminar: " + error.message);
    else {
      setMensagem("🗑️ Utilizador eliminado com sucesso.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  if (loading)
    return <p className="text-center mt-10">⏳ A verificar sessão...</p>;

  if (!profile || profile.role !== "admin")
    return <p className="text-center text-red-600 mt-10">
      ❌ Acesso restrito a administradores.
    </p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Settings2 className="text-red-600" /> Administração BloPrime
      </h1>
      {mensagem && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
          {mensagem}
        </div>
      )}

      {/* Tabela refinada */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loadingUsers ? (
          <p className="text-center p-6">⏳ A carregar utilizadores...</p>
        ) : (
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600">Nome</th>
                <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                <th className="p-3 text-left font-semibold text-gray-600">Papel</th>
                <th className="p-3 text-center font-semibold text-gray-600">Pedidos</th>
                <th className="p-3 text-center font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} className={`border-b ${i % 2 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-3">{u.full_name || "—"}</td>
                    <td className="p-3">{u.email || "—"}</td>
                    <td className="p-3 capitalize">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : u.role === "coach"
                            ? "bg-blue-100 text-blue-700"
                            : u.role === "athlete"
                            ? "bg-green-100 text-green-700"
                            : u.role === "club"
                            ? "bg-gray-100 text-gray-700"
                            : u.role === "federation"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {u.role || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-center">{u.requests || 0}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button
                        title="Ver detalhes"
                        onClick={() => setSelectedUser(u)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => eliminarUtilizador(u.id)}
                        title="Eliminar"
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

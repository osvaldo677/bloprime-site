import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminRepresentationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("representation_requests")
      .select(`
        id,
        requester_id,
        tipo,
        mensagem,
        contrato_ativo,
        data_contrato_ate,
        status,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) setMessage("❌ Erro ao carregar pedidos: " + error.message);
    else setRequests(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("representation_requests")
      .update({ status })
      .eq("id", id);

    if (error) setMessage("❌ Erro ao atualizar: " + error.message);
    else {
      setMessage("✅ Pedido atualizado com sucesso!");
      fetchRequests();
    }
  }

  async function deleteRequest(id) {
    const { error } = await supabase
      .from("representation_requests")
      .delete()
      .eq("id", id);

    if (error) setMessage("❌ Erro ao eliminar: " + error.message);
    else {
      setMessage("🗑️ Pedido eliminado.");
      fetchRequests();
    }
  }

  if (loading) return <p className="text-center mt-10">⏳ A carregar pedidos...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ⚖️ Pedidos de Representação BloPrime
      </h2>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">Nenhum pedido encontrado.</p>
      ) : (
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Mensagem</th>
              <th className="p-2 border">Contrato ativo</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Data</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-2 border">{r.tipo}</td>
                <td className="p-2 border">{r.mensagem}</td>
                <td className="p-2 border">
                  {r.contrato_ativo
                    ? `✅ até ${r.data_contrato_ate || "-"}`
                    : "❌"}
                </td>
                <td className="p-2 border font-semibold">{r.status}</td>
                <td className="p-2 border">
                  {new Date(r.created_at).toLocaleDateString("pt-PT")}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "aprovado")}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "rejeitado")}
                    className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => deleteRequest(r.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UserDetailsModal({ user, onClose }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchRequests();
  }, [user]);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("representation_requests")
      .select("id, tipo, status, created_at")
      .eq("requester_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!error) setRequests(data || []);
    setLoading(false);
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          👤 Detalhes do Utilizador
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Nome:</strong> {user.full_name || "—"}</p>
          <p><strong>Email:</strong> {user.email || "—"}</p>
          <p><strong>Telefone:</strong> {user.phone || "—"}</p>
          <p>
            <strong>Papel:</strong>{" "}
            <span className="capitalize">{user.role || "—"}</span>
          </p>
          <hr className="my-3" />
          <p><strong>Atletas:</strong> {user.athletes || 0}</p>
          <p><strong>Treinadores:</strong> {user.coaches || 0}</p>
          <p><strong>Clubes:</strong> {user.clubs || 0}</p>
          <p><strong>Federações:</strong> {user.federations || 0}</p>
          <p><strong>Pedidos de Representação:</strong> {user.requests || 0}</p>
        </div>

        <hr className="my-4" />
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Últimos Pedidos de Representação
        </h3>
        {loading ? (
          <p className="text-gray-500 text-sm">⏳ A carregar pedidos...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">Sem pedidos registados.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex justify-between border-b py-1 last:border-0"
              >
                <span>{r.tipo}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    r.status === "aprovado"
                      ? "bg-green-100 text-green-700"
                      : r.status === "pendente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

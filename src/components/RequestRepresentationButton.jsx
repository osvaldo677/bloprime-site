// src/components/RequestRepresentationButton.jsx
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function RequestRepresentationButton({ userId, userType, contratoAtivo, dataContratoAte }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setSending(true);
    setError(null);
    setMessage(null);

    const status = contratoAtivo ? "aguardar_termino" : "pendente";

    const { error } = await supabase.from("representation_requests").insert([
      {
        requester_id: userId,
        target_id: null, // opcional: pode ser id do admin BloPrime
        tipo: "representacao",
        contrato_ativo: contratoAtivo,
        data_contrato_ate: dataContratoAte || null,
        status,
        mensagem: "Gostaria de ser representado pela BloPrime.",
      },
    ]);

    if (error) setError("❌ Erro ao enviar pedido: " + error.message);
    else setMessage("✅ Pedido enviado com sucesso!");

    setSending(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={sending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? "A enviar..." : "🤝 Pedir Representação BloPrime"}
      </button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

// src/components/ConfirmEmailSentModal.jsx
import { Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ConfirmEmailSentModal({ email, onConfirmed }) {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState(null);

  async function handleResend() {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.rpc("resend_confirmation", { p_email: email });
      if (error) throw error;
      setResent(true);
    } catch (err) {
      console.error("Erro ao reenviar e-mail:", err.message);
      setError("❌ Não foi possível reenviar o e-mail. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Mail className="mx-auto text-blue-600 w-12 h-12 mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmação de e-mail</h2>

        <p className="text-gray-600 mb-4">
          Enviámos um e-mail de confirmação para{" "}
          <strong>{email}</strong>.
          <br />
          Clique no link recebido e depois pressione o botão abaixo para continuar.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          📬 Se não o encontrar, verifique também as pastas{" "}
          <strong>Spam</strong> ou <strong>Lixo Eletrónico</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirmed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-all duration-200"
          >
            Já confirmei o e-mail
          </button>

          <button
            onClick={handleResend}
            disabled={loading || resent}
            className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg py-2 font-medium hover:bg-blue-50 transition-all duration-200 disabled:opacity-60"
          >
            <RefreshCw size={18} />
            {resent ? "E-mail reenviado com sucesso!" : loading ? "A reenviar..." : "Não recebi o e-mail"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}

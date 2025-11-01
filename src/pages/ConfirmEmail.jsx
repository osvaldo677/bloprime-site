// src/pages/ConfirmEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Helmet } from "react-helmet-async";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState(null); // "ok" | "error" | "resend" | null
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(location?.state?.email || "");

  // 🔹 se existir token na URL (vindo do e-mail), confirma imediatamente
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) confirmEmail(token);
  }, [location.search]);

  async function confirmEmail(token) {
    try {
      setLoading(true);
	  //setTimeout(() => navigate("/login"), 2000);
      const { data, error } = await supabase.rpc("confirm_email", { p_token: token });
      if (error) throw error;
      if (data) {
        setStatus("ok");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Erro ao confirmar e-mail:", err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(e) {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("resend_confirmation", { p_email: email });
      if (error) throw error;
      setStatus("resend");
    } catch (err) {
      console.error("Erro ao reenviar:", err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>Confirmar e-mail – BloPrime</title>
      </Helmet>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Verificação de E-mail
        </h1>

        {status === null && (
          <>
            <p className="text-gray-700">
              Enviámos um e-mail de confirmação para <strong>{email || "o seu endereço"}</strong>.
              <br /> Clique no link recebido para ativar a sua conta.
            </p>
            <form onSubmit={handleResend} className="mt-6 space-y-3">
              <input
                type="email"
                required
                placeholder="o.seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-60"
              >
                {loading ? "A reenviar..." : "Reenviar e-mail de confirmação"}
              </button>
            </form>
          </>
        )}

        {status === "ok" && (
          <p className="text-green-600 mt-4">
            ✅ E-mail confirmado com sucesso! Pode agora iniciar sessão.
          </p>
        )}

        {status === "resend" && (
          <p className="text-green-600 mt-4">
            📧 Novo e-mail de confirmação enviado. Verifique a sua caixa de entrada.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 mt-4">
            ⚠️ Ocorreu um erro ao confirmar o e-mail. O token pode estar expirado.
          </p>
        )}

        <div className="mt-8">
          <Link
            to="/login"
            className="block bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

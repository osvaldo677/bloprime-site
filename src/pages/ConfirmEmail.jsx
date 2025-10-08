// src/pages/ConfirmEmail.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // email passado via navigate(..., { state: { email } })
  const initialEmail = useMemo(() => location?.state?.email || "", [location]);
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(null); // "ok" | "error" | null
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      setStatus("ok");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>Verifique o seu e-mail - BloPrime</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600">
          ✅ Verifique o seu e-mail
        </h1>
        <p className="text-gray-700 mt-3">
          Enviámos um e-mail de confirmação para{" "}
          <strong>{email || "o seu endereço"}</strong>.
          <br />
          Abra o seu correio e clique no link para ativar a conta antes de continuar.
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Se não encontrar, verifique as pastas{" "}
          <strong>Spam</strong> e <strong>Promoções</strong>.
        </p>

        {/* 🔁 Reenvio */}
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

        {status === "ok" && (
          <p className="mt-3 text-green-600 text-sm">
            ✔️ E-mail reenviado. Verifique novamente a sua caixa de entrada.
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-red-600 text-sm">
            ⚠️ Ocorreu um erro ao reenviar. Tente novamente dentro de instantes.
          </p>
        )}

        {/* ✅ O utilizador decide quando prosseguir */}
        <div className="mt-8">
          <p className="text-gray-600 text-sm mb-2">
            Já confirmou o seu e-mail?
          </p>
          <button
            onClick={handleGoToLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
          >
            Sim, já confirmei. Ir para o login
          </button>
        </div>

        <div className="mt-6">
          <Link to="/login" className="text-blue-600 hover:underline">
            Voltar ao login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Pode deixar esta página aberta enquanto confirma o e-mail.
        </p>
      </div>
    </div>
  );
}

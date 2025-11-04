// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const traduzErro = (errorMsg) => {
    const lower = errorMsg?.toLowerCase() || "";
    if (lower.includes("email not confirmed"))
      return "⚠️ O seu email ainda não foi confirmado. Verifique a caixa de entrada.";
    if (lower.includes("invalid login credentials"))
      return "⚠️ Credenciais inválidas. Verifique o email e a palavra-passe.";
    return "⚠️ " + errorMsg;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg("");
  setLoading(true);

  try {
    const { data, error } = await supabase.rpc("manual_login", {
      p_email: email,
      p_password: password,
    });

    if (error) throw error;

    const result = data && data[0];
    if (!result) {
      throw new Error("Erro inesperado ao processar o login.");
    }

    if (!result.ok) {
      setMsg("⚠️ " + result.message);
      setLoading(false);
      return;
    }

    console.log("✅ Login bem-sucedido:", result);

    // Armazena sessão manualmente
    localStorage.setItem("bloprime_user", JSON.stringify(result));

    // Redireciona
    setMsg("✅ Login efetuado com sucesso!");
    navigate("/app/choose-role", { replace: true });
  } catch (err) {
    console.error("Erro no login:", err);
    setMsg("❌ " + (err.message || "Erro inesperado."));
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Entrar
        </h1>

        {msg && <p className="mb-4 text-center text-red-600">{msg}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />

        <button
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔑 A entrar..." : "Entrar"}
        </button>

        <p
          onClick={() => navigate("/signup")}
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline"
        >
          Ainda não tem conta? Criar conta
        </p>

        <Link
          to="/forgot-password"
          className="block mt-2 text-center text-sm text-blue-600 hover:underline"
        >
          Esqueceu a palavra-passe?
        </Link>
      </form>
    </div>
  );
}

// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await login(email, password);

    setLoading(false);

    if (!res.success) {
      const t = (res.message || "").toLowerCase();
      if (t.includes("não foi confirmado") || t.includes("email") && t.includes("confirm"))
        return setMsg("⚠️ O seu e-mail ainda não foi confirmado. Verifique a caixa de entrada.");
      if (t.includes("credenciais") || t.includes("password") || t.includes("palavra"))
        return setMsg("⚠️ Credenciais inválidas. Verifique e-mail e palavra-passe.");
      return setMsg("❌ " + (res.message || "Erro inesperado."));
    }

    // sucesso: deixa o ProtectedRoute/guards decidirem
    // – se não tem perfil/role vai para /app/choose-role
    // – caso contrário vai ao dashboard ou ao formulário correto via menu
    navigate("/app", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Entrar</h1>

        {msg && <p className="mb-4 text-center text-red-600 whitespace-pre-line">{msg}</p>}

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

        <p onClick={() => navigate("/signup")} className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline">
          Ainda não tem conta? Criar conta
        </p>

        <Link to="/forgot-password" className="block mt-2 text-center text-sm text-blue-600 hover:underline">
          Esqueceu a palavra-passe?
        </Link>
      </form>
    </div>
  );
}

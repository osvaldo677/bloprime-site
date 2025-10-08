// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ contexto de autenticação

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const traduzErro = (errorMsg) => {
    const lower = errorMsg.toLowerCase();
    if (lower.includes("user already registered"))
      return "⚠️ Este email já está registado. Faça login.";
    if (lower.includes("weak password"))
      return "⚠️ A palavra-passe é fraca. Use uma mais segura.";
    return "⚠️ " + errorMsg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirmPassword) {
      setMsg("⚠️ As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);
    const { success, message } = await signup(email, password);

    if (!success) {
      setMsg(traduzErro(message));
      setLoading(false);
      return;
    }

    // ✅ Signup bem-sucedido
    setMsg("✅ Conta criada! Confirme o seu e-mail para ativar o acesso.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    // 👉 Redireciona para a página de confirmação de e-mail
    setTimeout(() => navigate("/confirm-email", { state: { email } }), 1000);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
          Criar Conta
        </h1>

        {msg && (
          <p
            className={`mb-4 text-center ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

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
        <input
          type="password"
          placeholder="Confirmar palavra-passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />

        <button
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "📝 A criar conta..." : "Registar"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline"
        >
          Já tem conta? Entrar
        </p>
      </form>
    </div>
  );
}

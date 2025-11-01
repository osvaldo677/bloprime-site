import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nome, setNome] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("⚠️ As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);
    const { success, message } = await signup(email, password, nome);
    setLoading(false);

    if (success) {
      navigate("/confirm-email", { state: { email } });
    } else {
      setMsg("⚠️ " + message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Criar Conta
        </h1>

        {msg && <p className="mb-4 text-center text-red-600">{msg}</p>}

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
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
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-3 border rounded mb-6"
        />

        <button
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🕓 A criar..." : "Criar conta"}
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

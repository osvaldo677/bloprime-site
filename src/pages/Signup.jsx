// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.nome || !form.email || !form.password || !form.confirm) {
      return setError("⚠️ Preencha todos os campos obrigatórios.");
    }
    if (form.password !== form.confirm) {
      return setError("⚠️ As palavras-passe não coincidem.");
    }

    setLoading(true);
    try {
      // 🔹 Chama o RPC manual_register diretamente
      const { data, error } = await supabase.rpc("manual_register", {
        p_nome: form.nome,
        p_email: form.email,
        p_password: form.password,
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Erro desconhecido");

      // 🔹 Redireciona para a página de confirmação
      setMessage("✅ Conta criada! Enviámos um e-mail de confirmação.");
      setTimeout(() => navigate("/confirm-email-sent"), 1500);
    } catch (err) {
      console.error("Erro ao criar conta:", err.message);
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Criar Conta BloPrime
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            name="nome"
            type="text"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-2 focus:ring-red-500 focus:border-red-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-2 focus:ring-red-500 focus:border-red-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Palavra-passe"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-2 focus:ring-red-500 focus:border-red-500"
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirmar palavra-passe"
            value={form.confirm}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-xl hover:bg-red-700 transition"
        >
          {loading ? "A criar conta..." : "Criar conta"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{" "}
          <span
            className="text-red-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Iniciar sessão
          </span>
        </p>
      </form>
    </div>
  );
}

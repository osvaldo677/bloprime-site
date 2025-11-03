// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ConfirmEmailSentModal from "../components/ConfirmEmailSentModal";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.nome || !form.email || !form.password || !form.confirm)
      return setError("⚠️ Preencha todos os campos obrigatórios.");

    if (form.password !== form.confirm)
      return setError("⚠️ As palavras-passe não coincidem.");

    setLoading(true);

    try {
      // 🔹 1. Criação do utilizador via função manual_register
      const { data, error } = await supabase.rpc("manual_register", {
        p_nome: form.nome,
        p_email: form.email,
        p_password: form.password,
      });

      console.log("📤 Resultado manual_register:", { data, error });

      if (error) {
        console.error("❌ Erro Supabase:", error);
        throw new Error(error.message || "Erro ao registar utilizador.");
      }

      if (!data || data.length === 0) {
        throw new Error("❌ O servidor não retornou dados. Verifique a função manual_register.");
      }

      const result = Array.isArray(data) ? data[0] : data;
      console.log("✅ Novo utilizador criado:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      // 🔹 2. Envia e-mail de confirmação via Edge Function (Mailgun)
      // 🔹 2. Envia e-mail de confirmação via Edge Function (Mailgun)
try {
  console.log("📧 A enviar e-mail de confirmação via Edge Function...");
  const mailResponse = await fetch(
    "https://ptmprgtvhmdsdccveigt.functions.supabase.co/send-confirmation-email",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        nome: form.nome,
        token: result.confirmation_token, // ✅ agora usa o token real do Supabase
      }),
    }
  );

  const mailResult = await mailResponse.json();
  console.log("📨 Resultado do envio de e-mail:", mailResult);

  if (!mailResult.ok) {
    console.warn("⚠️ Falha no envio do e-mail:", mailResult.error || mailResult.response);
  }
} catch (mailErr) {
  console.error("⚠️ Erro ao enviar e-mail de confirmação:", mailErr);
}


      // 🔹 3. Exibe modal de confirmação
      setMessage("✅ Conta criada! Enviámos um e-mail de confirmação.");
      setShowModal(true);
    } catch (err) {
      console.error("⚠️ Erro ao criar conta:", err);

      let msg = "❌ Ocorreu um erro desconhecido ao criar a conta.";

      if (typeof err.message === "string") {
        if (err.message.includes("duplicate key")) {
          msg = "⚠️ Já existe uma conta registada com este e-mail.";
        } else if (err.message.includes("permission denied")) {
          msg = "⚠️ Permissão negada. Verifique as políticas de segurança no Supabase.";
        } else if (err.message.includes("function manual_register")) {
          msg = "⚠️ Função manual_register não encontrada no Supabase.";
        } else if (err.message.toLowerCase().includes("mailgun")) {
          msg = "⚠️ Erro ao enviar o e-mail de confirmação. Verifique a chave ou domínio Mailgun.";
        } else {
          msg = "❌ " + err.message;
        }
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    setShowModal(false);
    navigate("/app/choose-role");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
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

        {error && <p className="text-red-600 text-sm mt-4 whitespace-pre-line">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
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

      {showModal && (
        <ConfirmEmailSentModal
          email={form.email}
          onConfirmed={handleProceed}
        />
      )}
    </div>
  );
}

// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthGuard from "../hooks/useAuthGuard";

export default function Perfil() {
  const { session, profile, loading } = useAuthGuard();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (loading) return <p className="text-center">⏳ A carregar...</p>;
  if (!session) return <p className="text-center">⚠️ Precisa de iniciar sessão.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date(),
      })
      .eq("id", session.user.id);

    if (error) {
      setError("❌ Erro ao atualizar perfil: " + error.message);
    } else {
      setMessage("✅ Perfil atualizado com sucesso!");
      setError(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("⚠️ A nova palavra-passe não pode estar vazia.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError("❌ Erro ao alterar a palavra-passe: " + error.message);
    } else {
      setMessage("✅ Palavra-passe alterada com sucesso!");
      setPassword("");
      setError(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">👤 Meu Perfil</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* Formulário de Perfil */}
      <form onSubmit={handleSaveProfile} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm text-gray-600">Nome Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="O seu nome"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Telefone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="+244 900 000 000"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar Perfil
        </button>
      </form>

      {/* Alteração de Palavra-passe */}
      <form onSubmit={handleChangePassword} className="space-y-4 bg-white p-4 rounded shadow mt-6">
        <div>
          <label className="block text-sm text-gray-600">Nova Palavra-passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Alterar Palavra-passe
        </button>
      </form>
    </div>
  );
}

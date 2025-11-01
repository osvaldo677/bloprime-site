// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setError("");
    setMessage("");
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, observacoes")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (err) {
      setError("⚠️ Não foi possível carregar o perfil.");
      console.error(err.message);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          observacoes: profile.observacoes,
          updated_at: new Date(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setMessage("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      setError("❌ Erro ao atualizar o perfil.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="bg-white max-w-4xl mx-auto rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              rows={3}
              value={profile.observacoes}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
              placeholder="Notas ou informações adicionais..."
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-red-700 transition"
            >
              {loading ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

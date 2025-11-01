// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Perfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", phone: "", observacoes: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, observacoes")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err.message);
      setMsg("⚠️ Não foi possível carregar o perfil.");
    }
  };

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...profile, updated_at: new Date() })
        .eq("user_id", user.id);
      if (error) throw error;
      setMsg("✅ Alterações guardadas com sucesso!");
    } catch (err) {
      console.error("Erro ao guardar perfil:", err.message);
      setMsg("❌ Falha ao guardar alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Perfil do Utilizador</h2>
      {msg && <p className="mb-4 text-sm text-gray-600">{msg}</p>}

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-gray-700 text-sm">Nome Completo</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name || ""}
            onChange={handleChange}
            className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 text-sm">Telefone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold text-gray-700 text-sm">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={profile.observacoes || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-xl p-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
            placeholder="Notas ou informações adicionais..."
          />
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 font-semibold transition"
          >
            {loading ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

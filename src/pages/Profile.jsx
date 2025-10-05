import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Profile() {
  const { session, logout } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", phone: "", role: "" });
  const [loading, setLoading] = useState(true);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🔹 Carregar perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, role")
        .eq("id", session.user.id)
        .single();
      if (error) console.error("Erro ao carregar perfil:", error.message);
      else setProfile(data || {});
      setLoading(false);
    };
    fetchProfile();
  }, [session]);

  // 🔹 Atualizar perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!session?.user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          updated_at: new Date(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
      alert("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      alert("❌ Erro ao atualizar perfil: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Alterar palavra-passe
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!session?.user) return;

    if (newPassword !== confirmPassword) {
      alert("❌ As novas palavras-passe não coincidem!");
      return;
    }

    setUpdating(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (loginError) {
        alert("❌ Palavra-passe atual incorreta!");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert("✅ Palavra-passe alterada com sucesso. Faça login novamente.");
      logout();
    } catch (err) {
      alert("❌ Erro ao atualizar palavra-passe: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">⏳ A carregar perfil...</p>;

  const passwordFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">👤 Meu Perfil</h1>

      {/* Formulário Perfil */}
      <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Nome completo</label>
          <input
            type="text"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            placeholder="Digite o seu nome"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Telefone</label>
          <PhoneInput
            country={"ao"}
            enableAreaCodes={true}
            countryCodeEditable={false}
            preferredCountries={["ao", "pt"]}
            placeholder="Insira o número de telefone"
            value={profile.phone || ""}
            onChange={(phone) => setProfile({ ...profile, phone })}
            inputStyle={{
              width: "100%",
              height: "42px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              paddingLeft: "48px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? "🔄 A atualizar..." : "💾 Guardar Alterações"}
        </button>
      </form>

      {/* Alterar Palavra-passe */}
      <h2 className="text-xl font-semibold mb-4">🔑 Alterar Palavra-passe</h2>
      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Palavra-passe atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Digite a sua palavra-passe atual"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nova palavra-passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Digite a nova palavra-passe"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Confirmar nova palavra-passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Confirme a nova palavra-passe"
          />
        </div>
        <button
          type="submit"
          disabled={!passwordFormValid || updating}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {updating ? "🔄 A alterar..." : "🔑 Alterar Palavra-passe"}
        </button>
      </form>
    </div>
  );
}

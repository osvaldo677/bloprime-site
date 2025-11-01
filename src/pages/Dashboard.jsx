import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChooseRoleModal from "../components/ChooseRoleModal";

export default function Dashboard() {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    athletes: 0,
    coaches: 0,
    clubs: 0,
    federations: 0,
  });

  const user = session?.user;

  useEffect(() => {
    if (authLoading) return; // Esperar até saber se há sessão
    if (!user) {
      navigate("/"); // Se não há utilizador autenticado
      return;
    }

    const loadProfile = async () => {
      // 1️⃣ Tenta buscar o perfil
      let { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, email")
        .eq("id", user.id)
        .single();

      // 2️⃣ Se não existe, cria-o (garantia contra atraso do trigger)
      if (!data && !error) {
        const { data: created, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            role: "user",
            full_name: "",
          })
          .select()
          .single();

        if (!insertError) data = created;
      }

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar perfil:", error.message);
      }

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [user, authLoading, navigate]);

  // 🔹 Estatísticas (igual)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [athletes, coaches, clubs, federations] = await Promise.all([
          supabase.from("athletes").select("*", { count: "exact", head: true }),
          supabase.from("coaches").select("*", { count: "exact", head: true }),
          supabase.from("clubs").select("*", { count: "exact", head: true }),
          supabase
            .from("federations")
            .select("*", { count: "exact", head: true }),
        ]);

        setStats({
          athletes: athletes.count || 0,
          coaches: coaches.count || 0,
          clubs: clubs.count || 0,
          federations: federations.count || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error.message);
      }
    };

    loadStats();
  }, []);

  // 🔹 Se ainda está a carregar
  if (loading || authLoading) {
    return <p className="text-center mt-10">⏳ A carregar dados...</p>;
  }

  // 🔹 Se o perfil ainda não definiu papel (ou está como 'user'), mostrar modal
  if (!profile?.role || profile.role.trim() === "" || profile.role === "user") {
    return <ChooseRoleModal onContinue={() => navigate("/app/choose-role")} />;
  }

  // 🔹 Dashboard principal
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Bem-vindo(a), {profile?.full_name || "Utilizador"} 👋
      </h1>
      <p className="text-gray-600">
        Este é o teu painel principal BloPrime — gestão e estatísticas
        desportivas.
      </p>

      {/* 🔹 Cartões */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Atletas</h2>
          <p className="text-2xl font-bold text-red-600">{stats.athletes}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Treinadores</h2>
          <p className="text-2xl font-bold text-red-600">{stats.coaches}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Clubes</h2>
          <p className="text-2xl font-bold text-red-600">{stats.clubs}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Federações</h2>
          <p className="text-2xl font-bold text-red-600">
            {stats.federations}
          </p>
        </div>
      </div>
    </div>
  );
}

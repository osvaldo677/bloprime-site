// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";

// 🔗 Rotas centralizadas (opcional)
export const APP_ROUTES = {
  PLAYERS: "/app/players",
  COACHES: "/app/coaches",
  CLUBS: "/app/clubs",
  FEDERATIONS: "/app/federations",
  REG_ATLETA: "/app/registos/atleta",
  REG_TREINADOR: "/app/registos/treinador",
  REG_CLUBE: "/app/registos/clube",
  REG_FEDERACAO: "/app/registos/federacao",
};

export default function Dashboard() {
  const { session, profile, loading } = useAuthGuard();
  const [counts, setCounts] = useState({
    athletes: 0,
    coaches: 0,
    clubs: 0,
    federations: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (session && profile) fetchCounts();
  }, [session, profile]);

  const fetchCounts = async () => {
    let queries = [
      supabase.from("athletes").select("*", { count: "exact", head: true }),
      supabase.from("coaches").select("*", { count: "exact", head: true }),
      supabase.from("clubs").select("*", { count: "exact", head: true }),
      supabase.from("federations").select("*", { count: "exact", head: true }),
    ];

    if (profile?.role !== "admin") {
      queries = queries.map((q) => q.eq("user_id", session.user.id));
    }

    const [
      { count: athletes },
      { count: coaches },
      { count: clubs },
      { count: federations },
    ] = await Promise.all(queries);

    setCounts({
      athletes: athletes || 0,
      coaches: coaches || 0,
      clubs: clubs || 0,
      federations: federations || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <p className="p-6">⏳ A carregar dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Dashboard
      </h1>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to={APP_ROUTES.PLAYERS} className="bg-red-100 p-4 rounded text-center hover:bg-red-200 transition">
          <p className="font-semibold text-gray-800">Atletas</p>
          <p className="text-2xl text-red-600 font-bold">{counts.athletes}</p>
        </Link>

        <Link to={APP_ROUTES.COACHES} className="bg-blue-100 p-4 rounded text-center hover:bg-blue-200 transition">
          <p className="font-semibold text-gray-800">Treinadores</p>
          <p className="text-2xl text-blue-600 font-bold">{counts.coaches}</p>
        </Link>

        <Link to={APP_ROUTES.CLUBS} className="bg-green-100 p-4 rounded text-center hover:bg-green-200 transition">
          <p className="font-semibold text-gray-800">Clubes</p>
          <p className="text-2xl text-green-600 font-bold">{counts.clubs}</p>
        </Link>

        <Link to={APP_ROUTES.FEDERATIONS} className="bg-purple-100 p-4 rounded text-center hover:bg-purple-200 transition">
          <p className="font-semibold text-gray-800">Federações</p>
          <p className="text-2xl text-purple-600 font-bold">{counts.federations}</p>
        </Link>
      </div>

      {/* Atalhos para registos */}
      <h2 className="text-xl font-semibold mb-4">➕ Registar</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to={APP_ROUTES.REG_ATLETA} className="bg-red-600 text-white p-3 rounded text-center hover:bg-red-700 transition">
          🏃‍♂️ Atleta
        </Link>
        <Link to={APP_ROUTES.REG_TREINADOR} className="bg-blue-600 text-white p-3 rounded text-center hover:bg-blue-700 transition">
          🧑‍🏫 Treinador
        </Link>
        <Link to={APP_ROUTES.REG_CLUBE} className="bg-green-600 text-white p-3 rounded text-center hover:bg-green-700 transition">
          🏟️ Clube
        </Link>
        <Link to={APP_ROUTES.REG_FEDERACAO} className="bg-purple-600 text-white p-3 rounded text-center hover:bg-purple-700 transition">
          🏆 Federação
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
      >
        🚪 Sair
      </button>
    </div>
  );
}

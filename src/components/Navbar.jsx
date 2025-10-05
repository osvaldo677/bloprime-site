// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";   // sessão
import useAuthGuard from "../hooks/useAuthGuard";   // perfil (role, etc.)
import useLogout from "../hooks/useLogout";         // logout com redirect

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session } = useAuth();
  const { profile } = useAuthGuard();
  const { logout } = useLogout();

  const user = session?.user || null;
  const role = profile?.role || "user";

  // Só mostra "Olá, ..." se existir nome completo válido
  const showGreeting = profile?.full_name && profile.full_name.trim() !== "";

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-red-500">
          BloPrime
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-red-400">Home</Link>

          {!user ? (
            <Link to="/login" className="hover:text-red-400">Login</Link>
          ) : (
            <>
              {/* 👋 Saudação */}
              {showGreeting && (
                <span className="text-sm text-gray-300">
                  👋 Olá, {profile.full_name.split(" ")[0]}
                </span>
              )}

              {/* ✅ Meu Perfil */}
              <Link
                to="/app/profile"
                className="flex items-center gap-1 hover:text-red-400"
              >
                <FaUser /> Meu Perfil
              </Link>

              {/* Menu Registar */}
              <div className="relative group">
                <span className="hover:text-red-400 cursor-pointer">Registar ▾</span>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
                  <Link to="/app/registos/atleta" className="block px-4 py-2 hover:bg-gray-100">Atleta</Link>
                  <Link to="/app/registos/treinador" className="block px-4 py-2 hover:bg-gray-100">Treinador</Link>
                  <Link to="/app/registos/clube" className="block px-4 py-2 hover:bg-gray-100">Clube</Link>
                  <Link to="/app/registos/federacao" className="block px-4 py-2 hover:bg-gray-100">Federação</Link>
                </div>
              </div>

              {/* Apenas admin */}
              {role === "admin" && (
                <Link to="/app/admin" className="hover:text-red-400 font-semibold">
                  Painel Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* BOTÃO MOBILE */}
        <button
          className="md:hidden focus:outline-none text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 px-4 pb-4 space-y-2">
          <Link to="/" className="block hover:text-red-400">Home</Link>

          {!user ? (
            <Link to="/login" className="block hover:text-red-400">Login</Link>
          ) : (
            <>
              {/* 👋 Saudação mobile */}
              {showGreeting && (
                <p className="text-sm text-gray-300 mb-2">
                  👋 Olá, {profile.full_name.split(" ")[0]}
                </p>
              )}

              <Link
                to="/app/profile"
                className="flex items-center gap-1 hover:text-red-400"
              >
                <FaUser /> Meu Perfil
              </Link>

              <div>
                <span className="block font-semibold">Registar</span>
                <div className="pl-4 mt-1 space-y-1">
                  <Link to="/app/registos/atleta" className="block hover:text-red-400">Atleta</Link>
                  <Link to="/app/registos/treinador" className="block hover:text-red-400">Treinador</Link>
                  <Link to="/app/registos/clube" className="block hover:text-red-400">Clube</Link>
                  <Link to="/app/registos/federacao" className="block hover:text-red-400">Federação</Link>
                </div>
              </div>

              {role === "admin" && (
                <Link to="/app/admin" className="block hover:text-red-400 font-semibold mt-2">
                  Painel Admin
                </Link>
              )}

              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block hover:text-red-400 mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

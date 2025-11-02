// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/"); // volta para Home
  };

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-red-500">
          BloPrime
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-red-400">
            Home
          </Link>
          <Link to="/services" className="hover:text-red-400">
            Serviços
          </Link>
          <Link to="/about" className="hover:text-red-400">
            Sobre
          </Link>
          <Link to="/contact" className="hover:text-red-400">
            Contacto
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-red-400">
                Entrar
              </Link>
              <Link
                to="/signup"
                className="bg-red-600 px-3 py-1.5 rounded hover:bg-red-700"
              >
                Criar Conta
              </Link>
            </>
          ) : (
            <>
              {/* Saudação */}
              {user?.nome && (
                <span className="text-sm text-gray-300">
                  👋 Olá, {user.nome.split(" ")[0]}
                </span>
              )}

              {/* Perfil */}
				  {/*
              <Link
                to="/app/profile"
                className="flex items-center gap-1 hover:text-red-400"
              >
                <FaUser /> Meu Perfil
				  </Link>*/}

              {/* Registos */}
              <div className="relative group">
                <span className="hover:text-red-400 cursor-pointer">
                  Registar ▾
                </span>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
                  <Link
                    to="/app/registos/atleta"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Atleta
                  </Link>
                  <Link
                    to="/app/registos/treinador"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Treinador
                  </Link>
                  <Link
                    to="/app/registos/clube"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Clube
                  </Link>
                  <Link
                    to="/app/registos/federacao"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Federação
                  </Link>
                </div>
              </div>

              {/* Admin */}
              {user?.role === "admin" && (
                <Link
                  to="/app/admin"
                  className="hover:text-red-400 font-semibold"
                >
                  Painel Admin
                </Link>
              )}

              {/* Logout */}
              <button onClick={handleLogout} className="hover:text-red-400">
                Terminar Sessão
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
          <Link to="/" className="block hover:text-red-400">
            Home
          </Link>

{/* 👇 ADIÇÃO: links públicos no mobile */}
    <Link to="/services" className="block hover:text-red-400" onClick={() => setMobileOpen(false)}>
      Serviços
    </Link>
    <Link to="/about" className="block hover:text-red-400" onClick={() => setMobileOpen(false)}>
      Sobre
    </Link>
    <Link to="/contact" className="block hover:text-red-400" onClick={() => setMobileOpen(false)}>
      Contacto
    </Link>
    {/* 👆 FIM DA ADIÇÃO */}

          {!user ? (
            <>
              <Link to="/login" className="block hover:text-red-400">
                Entrar
              </Link>
              <Link
                to="/signup"
                className="block hover:text-red-400 font-semibold"
              >
                Criar Conta
              </Link>
            </>
          ) : (
            <>
              {user?.nome && (
                <p className="text-sm text-gray-300 mb-2">
                  👋 Olá, {user.nome.split(" ")[0]}
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
                  <Link
                    to="/registos/atleta"
                    className="block hover:text-red-400"
                  >
                    Atleta
                  </Link>
                  <Link
                    to="registos/treinador"
                    className="block hover:text-red-400"
                  >
                    Treinador
                  </Link>
                  <Link
                    to="/app/registos/clube"
                    className="block hover:text-red-400"
                  >
                    Clube
                  </Link>
                  <Link
                    to="/app/registos/federacao"
                    className="block hover:text-red-400"
                  >
                    Federação
                  </Link>
                </div>
              </div>

              {user?.role === "admin" && (
                <Link
                  to="/app/admin"
                  className="block hover:text-red-400 font-semibold mt-2"
                >
                  Painel Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="block hover:text-red-400 mt-2"
              >
                Terminar Sessão
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

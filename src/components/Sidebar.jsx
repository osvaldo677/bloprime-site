// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUser } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const role = user?.role || "user";
  const userName = user?.nome || "";

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const linkClass = (path) =>
    `flex items-center gap-2 px-2 py-1 rounded ${
      location.pathname === path
        ? "bg-red-600 text-white font-semibold"
        : "hover:text-red-400"
    }`;

  const avatar = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <>
      {/* Botão para abrir menu em mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl text-white bg-gray-800 p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`fixed md:static top-0 left-0 min-h-screen bg-gray-900 text-white w-64 p-6 z-40
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-red-500">BloPrime</h2>
          <Link to="/app/dashboard" onClick={() => setOpen(false)}>
            <FaHome className="text-white text-xl hover:text-red-400" />
          </Link>
        </div>

        {/* Perfil do utilizador */}
        {user && (
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md">
              {avatar}
            </div>
            <p className="text-sm text-gray-300 leading-tight">
              👋 <span className="font-semibold text-white">{userName}</span>
              <br />
              <span className="text-gray-400 text-xs capitalize">{role}</span>
            </p>
          </div>
        )}

        {/* Navegação */}
        <nav className="flex flex-col space-y-3">
          <Link
            to="/app/dashboard"
            className={linkClass("/app/dashboard")}
            onClick={() => setOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/app/profile"
            className={linkClass("/app/profile")}
            onClick={() => setOpen(false)}
          >
            <FaUser /> Meu Perfil
          </Link>

          <button
            onClick={() => toggleSection("registos")}
            className="w-full flex justify-between items-center px-2 py-1 rounded hover:text-red-400"
          >
            <span>📝 Registos</span>
            {openSection === "registos" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {openSection === "registos" && (
            <div className="ml-5 space-y-1 text-sm">
              {role === "athlete" && (
                <Link
                  to="/app/registos/atleta"
                  className={linkClass("/app/registos/atleta")}
                  onClick={() => setOpen(false)}
                >
                  🏃‍♂️ Atleta
                </Link>
              )}
              {role === "coach" && (
                <Link
                  to="/app/registos/treinador"
                  className={linkClass("/app/registos/treinador")}
                  onClick={() => setOpen(false)}
                >
                  🧑‍🏫 Treinador
                </Link>
              )}
              {role === "club" && (
                <Link
                  to="/app/registos/clube"
                  className={linkClass("/app/registos/clube")}
                  onClick={() => setOpen(false)}
                >
                  🏟️ Clube
                </Link>
              )}
              {role === "federation" && (
                <Link
                  to="/app/registos/federacao"
                  className={linkClass("/app/registos/federacao")}
                  onClick={() => setOpen(false)}
                >
                  🏆 Federação
                </Link>
              )}
            </div>
          )}

          {role === "admin" && (
            <Link
              to="/app/admin"
              className={linkClass("/app/admin")}
              onClick={() => setOpen(false)}
            >
              ⚙️ Painel Admin
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="text-left hover:text-red-400 mt-4"
          >
            🚪 Terminar Sessão
          </button>
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

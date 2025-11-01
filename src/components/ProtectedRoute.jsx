// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useAuth();

  // 🔹 Se não houver utilizador autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Se a rota requer papéis específicos e o utilizador não está autorizado
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          🚫 Acesso negado
        </h1>
        <p className="text-gray-600 mb-4">
          Não tem permissão para aceder a esta secção.
        </p>
        <a
          href="/app/dashboard"
          className="text-blue-600 hover:underline font-medium"
        >
          Voltar ao painel
        </a>
      </div>
    );
  }

  // 🔹 Caso tudo OK → renderiza o conteúdo da rota interna
  return <Outlet />;
}

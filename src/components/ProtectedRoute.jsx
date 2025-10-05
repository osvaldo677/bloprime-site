import { Navigate, Outlet } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";

export default function ProtectedRoute({ roles, children }) {
  const { session, profile, loading } = useAuthGuard();

  if (loading) {
    return <p className="p-6 text-center">⏳ A verificar permissões...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    return (
      <p className="p-6 text-center text-red-600">
        ❌ Sem acesso. Permissão insuficiente.
      </p>
    );
  }

  // 👉 Se existir children explícito (ex: SidebarLayout), usa-o; senão, Outlet
  return children ? children : <Outlet />;
}

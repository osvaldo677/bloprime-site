import useAuthGuard from "../hooks/useAuthGuard";

export default function AdminPage() {
  const { session, profile, loading } = useAuthGuard();

  if (loading) {
    return <p className="text-center">⏳ A carregar...</p>;
  }

  if (!profile) {
    return <p className="text-center text-yellow-600">⚠️ Perfil ainda não carregado.</p>;
  }

  if (profile.role !== "admin") {
    return <p className="text-center text-red-600">❌ Sem acesso. Apenas administradores.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
      <p className="text-gray-700">
        Bem-vindo, {profile.full_name || session.user.email}. Tens privilégios de administrador.
      </p>
    </div>
  );
}

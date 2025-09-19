import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-red-400">BloPrime</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/players" className="hover:text-gray-300">Jogadores</Link>
        <Link to="/coaches" className="hover:text-gray-300">Treinadores</Link>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded mt-6"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

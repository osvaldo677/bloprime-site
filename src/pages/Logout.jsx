import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // limpa a sessão
    navigate("/"); // redireciona para Home
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-xl font-semibold text-gray-700">A terminar sessão...</h1>
    </div>
  );
}

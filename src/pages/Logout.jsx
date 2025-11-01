// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

export default function Logout() {
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // aguarda o término completo
      navigate("/login");
    };
    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-xl font-semibold text-gray-700">
        A terminar sessão...
      </h1>
    </div>
  );
}

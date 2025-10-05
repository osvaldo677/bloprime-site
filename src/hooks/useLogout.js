// src/hooks/useLogout.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const { logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await contextLogout(); // encerra sessão no supabase
    } catch (err) {
      console.error("Erro no logout:", err.message);
    } finally {
      navigate("/login", { replace: true }); // redireciona com segurança
    }
  };

  return { logout };
}

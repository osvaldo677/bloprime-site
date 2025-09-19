import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate("/dashboard");
    } else {
      setErr("Credenciais inválidas (usuário: admin / senha: 1234)");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {err && <div className="text-red-500 mb-3">{err}</div>}
        <input className="w-full p-2 border rounded mb-3" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded mb-4" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}

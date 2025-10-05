import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Criar Conta</h1>
        <p className="mb-8 text-gray-600">
          Escolha o tipo de registo para continuar:
        </p>
        <div className="grid gap-4">
          <Link
            to="/register-athlete"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Sou Atleta
          </Link>
          <Link
            to="/register-coach"
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            Sou Treinador
          </Link>
          <Link
            to="/register-club"
            className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600"
          >
            Sou Clube
          </Link>
          <Link
            to="/register-federation"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
          >
            Sou Federação
          </Link>
        </div>
      </div>
    </div>
  );
}

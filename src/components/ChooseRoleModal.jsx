// src/components/ChooseRoleModal.jsx
import { Mail, UserCheck } from "lucide-react";

export default function ChooseRoleModal({
  title = "Escolher tipo de perfil",
  description = "Selecione o tipo de perfil que pretende criar para continuar o registo.",
  buttonText = "Continuar",
  onConfirm,
  variant = "role", // "role" | "email"
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {variant === "email" ? (
          <Mail className="mx-auto text-blue-600 w-12 h-12 mb-3" />
        ) : (
          <UserCheck className="mx-auto text-blue-600 w-12 h-12 mb-3" />
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        <button
          onClick={onConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-all duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

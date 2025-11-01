export default function ChooseRoleModal({ onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          👋 Bem-vindo à BloPrime
        </h2>

        <p className="text-gray-600 mb-6">
          Antes de continuar, precisamos saber como pretende usar o sistema.
          <br />
          Escolha o seu tipo de perfil: Jogador, Treinador, Clube ou Federação.
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm"
        >
          Definir o meu perfil
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Poderá alterar este perfil mais tarde com apoio do administrador.
        </p>
      </div>
    </div>
  );
}

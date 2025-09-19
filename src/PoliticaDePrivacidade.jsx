export default function PoliticaDePrivacidade() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>

      <p className="mb-4 text-gray-700">
        A BloPrime valoriza a privacidade. Esta política descreve como tratamos os dados pessoais recolhidos.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Dados recolhidos</h2>
      <p className="text-gray-700 mb-3">
        Recolhemos nome, data de nascimento, contactos, nacionalidade, informações desportivas e documentos necessários.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Finalidades</h2>
      <p className="text-gray-700 mb-3">
        Gestão de carreira, negociações contratuais, contactos com clubes e patrocinadores, e cumprimento de obrigações legais.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Base legal</h2>
      <p className="text-gray-700 mb-3">
        Tratamos dados com base no consentimento do titular e para cumprimento de obrigações contratuais e legais.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Direitos</h2>
      <p className="text-gray-700 mb-3">
        O titular tem direito de aceder, retificar, eliminar e opor-se ao tratamento, além de retirar consentimento.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Segurança</h2>
      <p className="text-gray-700 mb-3">
        Adotamos medidas técnicas e organizacionais adequadas para proteger os dados.
      </p>

      <p className="mt-6 text-gray-700">
        Contacto: <a href="mailto:privacidade@bloprime.com" className="underline text-blue-600">privacidade@bloprime.com</a>
      </p>

      <div className="mt-6">
        <button onClick={() => window.close()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Fechar</button>
      </div>
    </div>
  );
}

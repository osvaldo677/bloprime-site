export default function PoliticaDePrivacidade() {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>

      <p className="mb-4 text-gray-700">
        A <strong>BloPrime</strong> valoriza e respeita a privacidade dos seus
        utilizadores, atletas e treinadores. Esta Política descreve como recolhemos,
        utilizamos e protegemos os dados pessoais.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Dados recolhidos</h2>
      <p className="mb-4 text-gray-700">
        Recolhemos informações fornecidas através de formulários de registo, incluindo
        nome, idade, nacionalidade, contactos, experiência desportiva e documentos
        necessários para a gestão contratual.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Finalidade do tratamento</h2>
      <p className="mb-4 text-gray-700">
        Os dados recolhidos são utilizados para fins de representação desportiva,
        contacto institucional, gestão de contratos e promoção de carreira.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Partilha de dados</h2>
      <p className="mb-4 text-gray-700">
        Os dados não serão vendidos ou partilhados com terceiros sem o seu consentimento,
        exceto quando exigido por lei ou por autoridades competentes.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Direitos do utilizador</h2>
      <p className="mb-4 text-gray-700">
        O utilizador tem o direito de aceder, corrigir ou eliminar os seus dados pessoais,
        bem como retirar o consentimento previamente dado, contactando a BloPrime através
        dos canais oficiais.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Segurança</h2>
      <p className="mb-4 text-gray-700">
        Implementamos medidas técnicas e organizacionais adequadas para proteger os dados
        pessoais contra acesso não autorizado, perda ou alteração.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Contactos</h2>
      <p className="mb-4 text-gray-700">
        Para qualquer questão relativa à proteção de dados, pode contactar-nos através de{" "}
        <a href="mailto:privacidade@bloprime.com" className="text-blue-600 underline">
          privacidade@bloprime.com
        </a>.
      </p>

      <div className="mt-6">
        <button
          onClick={() => window.close()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

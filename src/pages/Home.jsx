import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      {/* Navbar no topo */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">BloPrime</h1>
        <p className="text-xl max-w-2xl mx-auto">
          A sua agência de representação desportiva e gestão de talentos.
        </p>
      </section>

      {/* Sobre Nós */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Sobre Nós</h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Somos uma empresa dedicada à promoção, gestão e acompanhamento de
          jogadores e treinadores. Trabalhamos para criar oportunidades no
          mercado desportivo, apoiando carreiras com profissionalismo e visão de
          futuro.
        </p>
      </section>

      {/* Serviços */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-10">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-3">Gestão de Carreiras</h3>
            <p className="text-gray-600">
              Planeamento e acompanhamento da evolução profissional de jogadores
              e treinadores.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-3">Consultoria Jurídica</h3>
            <p className="text-gray-600">
              Apoio especializado em contratos, negociações e regulamentações
              desportivas.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-3">Promoção e Scouting</h3>
            <p className="text-gray-600">
              Divulgação de atletas e identificação de novos talentos no mercado.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-3">
              Clubes e Patrocinadores
            </h3>
            <p className="text-gray-600">
              Conexão com clubes nacionais e internacionais, e gestão de
              parcerias estratégicas.
            </p>
          </div>
        </div>
      </section>

      {/* Contactos */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Contactos</h2>
        <p className="text-lg text-gray-700">📧 Email: contacto@bloprime.com</p>
        <p className="text-lg text-gray-700">📞 Telefone: +351 912 345 678</p>
        <p className="text-lg text-gray-700">📍 Lisboa, Portugal</p>
      </section>

      {/* Footer simples */}
      <footer className="bg-blue-700 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} BloPrime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

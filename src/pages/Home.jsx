import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>BloPrime - Agência Desportiva</title>
        <meta
          name="description"
          content="BloPrime - Agência de gestão e representação desportiva. Conectamos atletas e treinadores a oportunidades em diferentes modalidades desportivas, coletivas e individuais."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Bem-vindo à BloPrime</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Agência de gestão e representação desportiva que conecta atletas e
          treinadores às melhores oportunidades em diferentes modalidades
          desportivas, coletivas e individuais.
        </p>
      </section>

      {/* Sobre Nós */}
      <section id="sobre-nos" className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Sobre Nós</h2>
        <p className="text-lg leading-relaxed">
          A BloPrime é uma agência especializada em representação desportiva. 
          Apoiamos atletas, treinadores, clubes e federações no desenvolvimento de carreiras 
          e na criação de parcerias estratégicas dentro e fora de Angola.
        </p>
      </section>

      {/* Serviços */}
      <section id="servicos" className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Os Nossos Serviços</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/images/futebol.jpg"
              alt="Desportos coletivos"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Gestão de Carreira</h3>
              <p className="text-gray-600">
                Representação profissional de atletas e treinadores com foco em
                diferentes modalidades desportivas, coletivas e individuais.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/images/basquete.jpg"
              alt="Scouting e Patrocínios"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Scouting & Patrocínios</h3>
              <p className="text-gray-600">
                Identificação de talentos e ligação com marcas e investidores desportivos.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/images/andebol.jpg"
              alt="Consultoria e Eventos"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Consultoria & Eventos</h3>
              <p className="text-gray-600">
                Organização de torneios, formações e consultoria desportiva estratégica
                em várias modalidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contactos */}
      <section id="contactos" className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contactos</h2>
        <p className="text-lg mb-4">📍 Luanda, Angola</p>
        <p className="text-lg mb-2">
          📧 <a href="mailto:bloprime@bloprime.com" className="text-blue-600 hover:underline">
            bloprime@bloprime.com
          </a>
        </p>
        <p className="text-lg">
          📞 <a href="tel:+244926190444" className="text-blue-600 hover:underline">
            +244 926 190 444
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} BloPrime. Todos os direitos reservados.</p>
        <p className="mt-1 text-gray-400">
          Desenvolvido por{" "}
          <a
            href="https://www.bloprime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-semibold"
          >
            BloPrime
          </a>
        </p>
      </footer>
    </div>
  );
}

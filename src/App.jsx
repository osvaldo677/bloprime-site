import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          BloPrime
        </motion.h1>
        <p className="text-lg md:text-2xl mb-8">
          Gestão de Talento, Construção de Carreiras
        </p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-2xl text-lg">
          Conheça os nossos serviços
        </button>
      </section>

      {/* Sobre Nós */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Sobre Nós</h2>
        <p className="text-lg leading-relaxed text-center">
          A BloPrime é uma agência de representação desportiva dedicada a apoiar
          atletas, treinadores, clubes e federações no desenvolvimento de carreiras sólidas e
          sustentáveis. A nossa missão é valorizar o talento, criar oportunidades e
          estabelecer parcerias estratégicas dentro e fora de Angola.
        </p>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Os Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Representação de Atletas/Treinadores",
              desc: "Gestão de contratos, transferências e carreiras profissionais.",
            },
            {
              title: "Consultoria de Carreira",
              desc: "Planeamento estratégico para atletas e treinadores.",
            },
            {
              title: "Marketing e Patrocínios",
              desc: "Ligação entre atletas/treinadores, marcas e investidores.",
            },
            {
              title: "Eventos Desportivos",
              desc: "Organização de torneios, estágios e formações.",
            },
          ].map((service, i) => (
            <div
              key={i}
              className="rounded-2xl shadow-md p-6 text-center bg-white"
            >
              <h3 className="font-bold text-xl mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contacto</h2>
        <p className="mb-6 text-lg">
          Entre em contacto connosco para parcerias e representação.
        </p>
        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Nome"
            className="p-3 border rounded-xl"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-xl"
          />
          <textarea
            placeholder="Mensagem"
            className="p-3 border rounded-xl h-32"
          ></textarea>
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl text-lg">
            Enviar
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6 mt-10">
        <p>© {new Date().getFullYear()} BloPrime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

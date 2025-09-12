import { motion } from "framer-motion";

export default function Home() {
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
          Bloprime
        </motion.h1>
        <p className="text-lg md:text-2xl mb-8">
          A sua parceira estratégica no desporto e negócios.
        </p>
        <a
          href="#servicos"
          className="bg-red-600 text-white px-6 py-3 rounded-2xl text-lg"
        >
          Conheça os nossos serviços
        </a>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Os Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Gestão de Talentos", desc: "Representação de atletas e treinadores." },
            { title: "Consultoria Estratégica", desc: "Planeamento de carreira e negócios." },
            { title: "Eventos e Networking", desc: "Organização de eventos e parcerias." },
          ].map((service, i) => (
            <div key={i} className="rounded-2xl shadow-md bg-white p-6 text-center">
              <h3 className="font-bold text-xl mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contacto</h2>
        <form className="grid gap-4">
          <input type="text" placeholder="Nome" className="p-3 border rounded-xl" />
          <input type="email" placeholder="Email" className="p-3 border rounded-xl" />
          <textarea placeholder="Mensagem" className="p-3 border rounded-xl h-32"></textarea>
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl text-lg">
            Enviar
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6 mt-10">
        <p>© {new Date().getFullYear()} Bloprime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
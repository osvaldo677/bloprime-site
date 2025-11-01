import { motion } from "framer-motion";
import { Trophy, Users, Briefcase, Calendar } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Trophy className="w-8 h-8 text-blue-600" />,
      title: "Gestão e Representação de Atletas",
      desc: "Acompanhamos a carreira do atleta em todas as etapas, com foco em crescimento profissional e oportunidades internacionais."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Intermediação de Treinadores",
      desc: "Ligamos treinadores e clubes, promovendo parcerias de sucesso e desenvolvimento desportivo sustentável."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: "Consultoria a Clubes e Federações",
      desc: "Prestamos apoio estratégico, administrativo e jurídico às instituições desportivas."
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Organização de Eventos Desportivos",
      desc: "Planeamento e execução de torneios, captações e conferências especializadas no desporto."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Nossos Serviços
      </motion.h1>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="mb-4 flex justify-center">{s.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">{s.title}</h2>
            <p className="text-gray-600 text-center text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

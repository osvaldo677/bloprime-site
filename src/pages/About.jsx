import { motion } from "framer-motion";
import { Globe, HeartHandshake, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Sobre a BloPrime
        </motion.h1>

        <motion.p
          className="text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          A <strong>BloPrime</strong> é uma agência desportiva e tecnológica que conecta atletas,
          treinadores, clubes e federações, oferecendo soluções integradas de gestão, consultoria
          e inovação digital para o desporto.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: <Globe className="w-10 h-10 text-blue-600 mx-auto mb-4" />,
              title: "Presença Global",
              desc: "Conectamos talentos e oportunidades em diferentes países."
            },
            {
              icon: <HeartHandshake className="w-10 h-10 text-blue-600 mx-auto mb-4" />,
              title: "Parcerias Éticas",
              desc: "Trabalhamos com transparência e respeito aos valores desportivos."
            },
            {
              icon: <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />,
              title: "Foco no Futuro",
              desc: "Usamos tecnologia para transformar carreiras e organizações."
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {item.icon}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

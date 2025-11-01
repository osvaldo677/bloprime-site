import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Contacte-nos
      </motion.h1>

      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-blue-600" />
          <p className="text-gray-700">bloprime@bloprime.com</p>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-6 h-6 text-blue-600" />
          <p className="text-gray-700">+244 926 190 444</p>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <p className="text-gray-700">Luanda, Angola</p>
        </div>

        <div className="text-center pt-4">
          <a
            href="mailto:bloprime@bloprime.com"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Enviar Mensagem
          </a>
        </div>
      </motion.div>
    </div>
  );
}

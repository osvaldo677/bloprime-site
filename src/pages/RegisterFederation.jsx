import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RegisterFederation() {
  const [fed, setFed] = useState({
    name: "",
    sport: "",
    country: "",
    contact_email: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setFed({ ...fed, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("federations").insert([fed]);
    if (error) setMsg("❌ " + error.message);
    else setMsg("✅ Federação registada com sucesso!");
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Registo de Federação</h1>
        {msg && <p className="mb-4 text-center text-blue-600">{msg}</p>}

        <input className="w-full p-3 border rounded mb-3" name="name" placeholder="Nome da Federação" onChange={handleChange} required />
        <input className="w-full p-3 border rounded mb-3" name="sport" placeholder="Modalidade" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="country" placeholder="País" onChange={handleChange} />
        <input type="email" className="w-full p-3 border rounded mb-3" name="contact_email" placeholder="Email de contacto" onChange={handleChange} required />

        <button className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700">Registar Federação</button>
      </form>
    </div>
  );
}

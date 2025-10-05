import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RegisterClub() {
  const [club, setClub] = useState({
    name: "",
    country: "",
    founded_year: "",
    contact_email: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setClub({ ...club, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("clubs").insert([club]);
    if (error) setMsg("❌ " + error.message);
    else setMsg("✅ Clube registado com sucesso!");
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Registo de Clube</h1>
        {msg && <p className="mb-4 text-center text-blue-600">{msg}</p>}

        <input className="w-full p-3 border rounded mb-3" name="name" placeholder="Nome do Clube" onChange={handleChange} required />
        <input className="w-full p-3 border rounded mb-3" name="country" placeholder="País" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="founded_year" placeholder="Ano de fundação" onChange={handleChange} />
        <input type="email" className="w-full p-3 border rounded mb-3" name="contact_email" placeholder="Email de contacto" onChange={handleChange} required />

        <button className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600">Registar Clube</button>
      </form>
    </div>
  );
}

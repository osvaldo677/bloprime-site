import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RegisterCoach() {
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    country: "",
    city: "",
    sport: "",
    club: "",
    license_level: "",
    experience_years: "",
    achievements: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("A criar conta...");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) return setMsg("❌ " + error.message);

    const userId = data.user?.id;
    if (!userId) return;

    const { error: profileErr } = await supabase.from("profiles").insert([{
      id: userId,
      full_name: form.full_name,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      phone: form.phone,
      country: form.country,
      city: form.city,
      sport: form.sport,
      club: form.club,
    }]);
    if (profileErr) return setMsg("⚠️ Perfil não guardado: " + profileErr.message);

    const { error: coachErr } = await supabase.from("coaches").insert([{
      id: userId,
      license_level: form.license_level,
      experience_years: form.experience_years,
      achievements: form.achievements,
    }]);
    if (coachErr) return setMsg("⚠️ Dados de treinador não guardados: " + coachErr.message);

    setMsg("✅ Registo concluído! Verifique o seu email para confirmar a conta.");
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Registo de Treinador</h1>
        {msg && <p className="mb-4 text-center text-blue-600">{msg}</p>}

        <input className="w-full p-3 border rounded mb-3" name="full_name" placeholder="Nome completo" onChange={handleChange} required />
        <input type="date" className="w-full p-3 border rounded mb-3" name="date_of_birth" onChange={handleChange} />
        <select className="w-full p-3 border rounded mb-3" name="gender" onChange={handleChange}>
          <option value="">Género</option>
          <option>Masculino</option>
          <option>Feminino</option>
          <option>Outro</option>
        </select>
        <input className="w-full p-3 border rounded mb-3" name="phone" placeholder="Telefone" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="country" placeholder="País" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="city" placeholder="Cidade" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="sport" placeholder="Modalidade" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="club" placeholder="Clube" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="license_level" placeholder="Licença/Certificação" onChange={handleChange} />
        <input className="w-full p-3 border rounded mb-3" name="experience_years" placeholder="Anos de experiência" onChange={handleChange} />
        <textarea className="w-full p-3 border rounded mb-3" name="achievements" placeholder="Conquistas" onChange={handleChange}></textarea>

        <input type="email" className="w-full p-3 border rounded mb-3" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" className="w-full p-3 border rounded mb-3" name="password" placeholder="Palavra-passe" onChange={handleChange} required />

        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">Registar</button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RegisterAthlete() {
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    country: "",
    city: "",
    sport: "",
    club: "",
    position: "",
    height: "",
    weight: "",
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

    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;
    if (!userId) return setMsg("⚠️ Sessão não confirmada. Faça login e tente novamente.");

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

    const { error: athleteErr } = await supabase.from("athletes").insert([{
      id: userId,
      position: form.position,
      height: form.height,
      weight: form.weight,
      achievements: form.achievements,
    }]);
    if (athleteErr) return setMsg("⚠️ Dados de atleta não guardados: " + athleteErr.message);

    setMsg("✅ Registo concluído! Verifique o seu email para confirmar a conta.");
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Registo de Atleta</h1>
        {msg && <p className="mb-4 text-center text-blue-600">{msg}</p>}

        <input
          className="w-full p-3 border rounded mb-3"
          name="full_name"
          placeholder="Nome completo"
          onChange={handleChange}
          required
        />
        <label className="text-sm text-gray-500">Data de nascimento</label>
        <input
          type="date"
          className="w-full p-3 border rounded mb-3"
          name="date_of_birth"
          onChange={handleChange}
        />
        <select className="w-full p-3 border rounded mb-3" name="gender" onChange={handleChange}>
          <option value="">Género</option>
          <option>Masculino</option>
          <option>Feminino</option>
          <option>Outro</option>
        </select>
        <input
          className="w-full p-3 border rounded mb-3"
          name="phone"
          placeholder="Telefone (Ex: +244 923 456 789)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="country"
          placeholder="País"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="city"
          placeholder="Cidade"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="sport"
          placeholder="Modalidade (Ex: Futebol, Basquetebol, Andebol)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="club"
          placeholder="Clube atual (se aplicável)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="position"
          placeholder="Posição (Ex: Avançado, Guarda-redes)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="height"
          placeholder="Altura (Ex: 1.75)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 border rounded mb-3"
          name="weight"
          placeholder="Peso (Ex: 70)"
          onChange={handleChange}
        />
        <textarea
          className="w-full p-3 border rounded mb-3"
          name="achievements"
          placeholder="Conquistas (Ex: Campeão Nacional Sub-20, Melhor marcador 2023)"
          onChange={handleChange}
        ></textarea>

        <input
          type="email"
          className="w-full p-3 border rounded mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="w-full p-3 border rounded mb-3"
          name="password"
          placeholder="Palavra-passe (mínimo 6 caracteres)"
          onChange={handleChange}
          required
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Registar
        </button>
      </form>
    </div>
  );
}

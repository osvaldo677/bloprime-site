import { useState } from "react";

export default function PlayerForm() {
  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    nacionalidade: "",
    posicao: "",
    altura: "",
    peso: "",
    clubeAtual: "",
    numeroCamisola: "",
    contacto: "",
    email: "",
    agente: "",
    observacoes: "",
    hasReadPolicies: false,
    acceptedPolicies: false,
  });

  const toggleRead = () => setForm(f => ({ ...f, hasReadPolicies: !f.hasReadPolicies }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hasReadPolicies || !form.acceptedPolicies) {
      alert("Por favor leia e aceite a Política de Privacidade antes de guardar.");
      return;
    }
    console.log("Jogador:", form);
    alert("Jogador registado (console).");
    // reset opcional
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Registar Jogador</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="p-2 border rounded" />
        <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} className="p-2 border rounded" />
        <input name="nacionalidade" placeholder="Nacionalidade" value={form.nacionalidade} onChange={handleChange} className="p-2 border rounded" />
        <input name="posicao" placeholder="Posição" value={form.posicao} onChange={handleChange} className="p-2 border rounded" />
        <input name="altura" type="number" placeholder="Altura (cm)" value={form.altura} onChange={handleChange} className="p-2 border rounded" />
        <input name="peso" type="number" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} className="p-2 border rounded" />
        <input name="clubeAtual" placeholder="Clube Atual" value={form.clubeAtual} onChange={handleChange} className="p-2 border rounded" />
        <input name="numeroCamisola" placeholder="Número da camisola" value={form.numeroCamisola} onChange={handleChange} className="p-2 border rounded" />
        <input name="contacto" placeholder="Telefone" value={form.contacto} onChange={handleChange} className="p-2 border rounded" />
        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="p-2 border rounded" />
        <input name="agente" placeholder="Agente/Representante" value={form.agente} onChange={handleChange} className="p-2 border rounded" />
        <textarea name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} className="p-2 border rounded md:col-span-2"></textarea>

        <div className="md:col-span-2 border p-3 rounded bg-gray-50">
          <button type="button" onClick={toggleRead} className="text-blue-600 underline text-sm">
            {form.hasReadPolicies ? "Esconder Política de Privacidade" : "Ler Política de Privacidade"}
          </button>

          {form.hasReadPolicies && (
            <div className="mt-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
              <p><strong>BloPrime — Política de Privacidade (resumo)</strong></p>
              <p>Os dados aqui fornecidos serão utilizados para gestão desportiva, representação e contacto institucional. Ao aceitar autoriza o tratamento conforme a lei aplicável.</p>
              <p className="mt-2">Consulte a política completa (abre em nova aba).</p>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <input id="acceptedPolicies" name="acceptedPolicies" type="checkbox" checked={form.acceptedPolicies} onChange={handleChange} />
          <label htmlFor="acceptedPolicies" className="text-sm">Li e aceito a <a href="/politica-de-privacidade" target="_blank" rel="noreferrer" className="underline text-blue-600">Política de Privacidade</a> e autorizo o tratamento dos meus dados pela BloPrime.</label>
        </div>

        <button type="submit" disabled={!form.hasReadPolicies || !form.acceptedPolicies} className={`md:col-span-2 py-2 rounded text-white ${form.hasReadPolicies && form.acceptedPolicies ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}>Salvar</button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router-dom";

export default function PublicAthletes() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      // RLS já permite leitura pública de 'publico'
      const { data, error } = await supabase
        .from("athletes")
        .select("id, nome, modalidade, nacionalidade, foto_url")
        .eq("visibilidade", "publico")
        .order("updated_at", { ascending: false })
        .limit(48);

      if (!error) setList(data || []);
      setLoading(false);
    };
    run();
  }, []);

  const filtered = list.filter((a) =>
    [a.nome, a.modalidade, a.nacionalidade].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Atletas — Perfil Público</h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pesquisar por nome, modalidade ou país…"
        className="w-full md:w-1/2 p-2 border rounded mb-4"
      />

      {loading ? (
        <p>⏳ A carregar…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600">Sem resultados.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const cover = a.foto_url ? a.foto_url.split(",")[0] : null;
            return (
              <div key={a.id} className="border rounded overflow-hidden bg-white">
                {cover ? (
                  <img src={cover} alt={a.nome} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                    Sem foto
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{a.nome}</h3>
                    {a.nacionalidade && (
                      <ReactCountryFlag
                        countryCode={(a.nacionalidade_code || "").slice(0,2) || ""}
                        svg
                        style={{ width: "1.25em", height: "1.25em" }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{a.modalidade || "—"}</p>
                  {/* Se quiseres detalhes, podes ter uma rota pública /athletes/:id read-only */}
                  <Link
                    to={`/athletes/${a.id}`}
                    className="text-red-600 text-sm underline mt-2 inline-block"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

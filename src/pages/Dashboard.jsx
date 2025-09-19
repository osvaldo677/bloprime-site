export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">Gerir Jogadores</div>
        <div className="bg-white p-6 rounded shadow">Gerir Treinadores</div>
      </div>
    </div>
  );
}

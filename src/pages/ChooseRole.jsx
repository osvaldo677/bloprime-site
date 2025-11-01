// src/pages/ChooseRole.jsx
import { FaRunning, FaUserTie, FaBuilding, FaFlag } from "react-icons/fa";

export default function ChooseRole({ handleSelect }) {
  const roles = [
    { id: "athlete", label: "Atleta", icon: <FaRunning size={30} /> },
    { id: "coach", label: "Treinador", icon: <FaUserTie size={30} /> },
    { id: "club", label: "Clube", icon: <FaBuilding size={30} /> },
    { id: "federation", label: "Federação", icon: <FaFlag size={30} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      {roles.map((r) => (
        <div
          key={r.id}
          onClick={() => handleSelect(r.id)}
          className="flex flex-col items-center justify-center border border-gray-200 rounded-2xl p-8 cursor-pointer hover:bg-red-600 hover:text-white transition"
        >
          {r.icon}
          <p className="mt-3 font-semibold text-lg">{r.label}</p>
        </div>
      ))}
    </div>
  );
}

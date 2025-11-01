import { FaRunning, FaUserTie, FaBuilding, FaFlag } from "react-icons/fa";
import { useState } from "react";

export default function ChooseRole({ handleSelect }) {
  const [selected, setSelected] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const roles = [
    { id: "athlete", label: "Atleta", icon: <FaRunning size={30} /> },
    { id: "coach", label: "Treinador", icon: <FaUserTie size={30} /> },
    { id: "club", label: "Clube", icon: <FaBuilding size={30} /> },
    { id: "federation", label: "Federação", icon: <FaFlag size={30} /> },
  ];

  const handleClick = async (roleId) => {
    if (disabled) return;
    setSelected(roleId);
    setDisabled(true);
    try {
      await handleSelect(roleId);
    } catch (err) {
      console.error("Erro ao selecionar role:", err.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      {roles.map((r) => {
        const isSelected = selected === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleClick(r.id)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center border-2 rounded-2xl p-8 cursor-pointer transition-all duration-200 ${
              isSelected
                ? "bg-red-600 text-white border-red-600 scale-105"
                : "border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600"
            } disabled:opacity-60`}
          >
            {r.icon}
            <p className="mt-3 font-semibold text-lg">{r.label}</p>
          </button>
        );
      })}
    </div>
  );
}

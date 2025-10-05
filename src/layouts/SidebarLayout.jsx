import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SidebarLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar fixo */}
      <Sidebar />

      {/* Área principal com scroll independente */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Rodapé institucional */}
        <footer className="bg-gray-900 text-white py-3 text-center text-xs">
          <p>© {new Date().getFullYear()} BloPrime. Todos os direitos reservados.</p>
          <p className="mt-1 text-gray-400">
            Desenvolvido por{" "}
            <a
              href="https://www.bloprime.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              BloPrime
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

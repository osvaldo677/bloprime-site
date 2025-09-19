import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">BLOPRIME</h1>
      <ul className="flex gap-6">
        <li><Link to="/">Início</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

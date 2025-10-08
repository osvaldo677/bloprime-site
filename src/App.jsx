// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarLayout from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// páginas públicas
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmEmail from "./pages/ConfirmEmail"; // ✅ nova importação
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// páginas privadas
import Dashboard from "./pages/Dashboard";
import PlayerForm from "./pages/PlayerForm";
import CoachForm from "./pages/CoachForm";
import ClubForm from "./pages/ClubForm";
import FederationForm from "./pages/FederationForm";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";

// páginas de listagem
import PlayersList from "./pages/PlayersList";
import CoachesList from "./pages/CoachesList";
import ClubsList from "./pages/ClubsList";
import FederationsList from "./pages/FederationsList";

// páginas de edição
import PlayerEdit from "./pages/PlayerEdit";
import CoachEdit from "./pages/CoachEdit";
import ClubEdit from "./pages/ClubEdit";
import FederationEdit from "./pages/FederationEdit";

// página admin
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      {/* 🔓 Rotas públicas */}
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/services" element={<><Navbar /><Services /></>} />
      <Route path="/about" element={<><Navbar /><About /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /></>} />
      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/signup" element={<><Navbar /><Signup /></>} />
      <Route path="/confirm-email" element={<ConfirmEmail />} /> {/* ✅ nova rota */}
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔐 Rotas privadas (com SidebarLayout) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard & Perfil */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Listas */}
        <Route path="players" element={<PlayersList />} />
        <Route path="coaches" element={<CoachesList />} />
        <Route path="clubs" element={<ClubsList />} />
        <Route path="federations" element={<FederationsList />} />

        {/* Formulários */}
        <Route path="registos/atleta" element={<PlayerForm />} />
        <Route path="registos/treinador" element={<CoachForm />} />
        <Route path="registos/clube" element={<ClubForm />} />
        <Route path="registos/federacao" element={<FederationForm />} />

        {/* Edição */}
        <Route path="players/edit/:id" element={<PlayerEdit />} />
        <Route path="coaches/edit/:id" element={<CoachEdit />} />
        <Route path="clubs/edit/:id" element={<ClubEdit />} />
        <Route path="federations/edit/:id" element={<FederationEdit />} />

        {/* Logout */}
        <Route path="logout" element={<Logout />} />

        {/* Apenas Admin */}
        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

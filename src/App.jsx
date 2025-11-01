// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarLayout from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ novos guards
import RoleGuard from "./components/RoleGuard";
import OneProfileGuard from "./components/OneProfileGuard";

// páginas públicas
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmEmail from "./pages/ConfirmEmail";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// páginas públicas novas
import AthletesPublic from "./pages/AthletesPublic";
import AthleteProfile from "./pages/AthleteProfile";
import CoachesPublic from "./pages/CoachesPublic";
import CoachProfile from "./pages/CoachProfile";

// ✅ nova página de escolha de papel
// import ChooseRole from "./pages/ChooseRole";
// ✅ nova página de escolha de papel
import ChooseRolePage from "./pages/ChooseRolePage";


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
import AdminRepresentationRequests from "./pages/AdminRepresentationRequests"; // ✅ nova (gestão de pedidos)

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
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 👇 páginas públicas visíveis por todos */}
      <Route path="/athletes" element={<AthletesPublic />} />
      <Route path="/athlete/:id" element={<AthleteProfile />} />
      <Route path="/coaches" element={<CoachesPublic />} />
      <Route path="/coach/:id" element={<CoachProfile />} />

      {/* 🔐 Rotas privadas protegidas */}
      <Route
        path="/app"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard e Perfil */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* ✅ nova rota: escolher papel no 1º login */}
		<Route path="choose-role" element={<ChooseRolePage />} />


        {/* ✅ Formulários controlados por guards */}
        <Route
          path="registos/atleta"
          element={
            <RoleGuard allow={["athlete"]}>
              <OneProfileGuard table="athletes">
                <PlayerForm />
              </OneProfileGuard>
            </RoleGuard>
          }
        />
        <Route
          path="registos/treinador"
          element={
            <RoleGuard allow={["coach"]}>
              <OneProfileGuard table="coaches">
                <CoachForm />
              </OneProfileGuard>
            </RoleGuard>
          }
        />
        <Route
          path="registos/clube"
          element={
            <RoleGuard allow={["club"]}>
              <OneProfileGuard table="clubs">
                <ClubForm />
              </OneProfileGuard>
            </RoleGuard>
          }
        />
        <Route
          path="registos/federacao"
          element={
            <RoleGuard allow={["federation"]}>
              <OneProfileGuard table="federations">
                <FederationForm />
              </OneProfileGuard>
            </RoleGuard>
          }
        />

        {/* Edição */}
        <Route path="players/edit/:id" element={<PlayerEdit />} />
        <Route path="coaches/edit/:id" element={<CoachEdit />} />
        <Route path="clubs/edit/:id" element={<ClubEdit />} />
        <Route path="federations/edit/:id" element={<FederationEdit />} />

        {/* Listas */}
        <Route path="players" element={<PlayersList />} />
        <Route path="coaches" element={<CoachesList />} />
        <Route path="clubs" element={<ClubsList />} />
        <Route path="federations" element={<FederationsList />} />

        {/* Logout */}
        <Route path="logout" element={<Logout />} />

        {/* Admin */}
        <Route path="admin" element={<AdminPage />} />
        <Route path="representation-requests" element={<AdminRepresentationRequests />} />
      </Route>
    </Routes>
  );
}

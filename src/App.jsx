import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlayerForm from "./pages/PlayerForm";
import CoachForm from "./pages/CoachForm";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import SidebarLayout from "./layouts/SidebarLayout";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />

      {/* protegidas (têm SidebarLayout) */}
      <Route
        element={
          <PrivateRoute>
            <SidebarLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/players" element={<PlayerForm />} />
        <Route path="/coaches" element={<CoachForm />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

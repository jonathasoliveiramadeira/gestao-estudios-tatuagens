import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardTatuador from "./pages/DashboardTatuador";
import GoogleSuccess from "./pages/GoogleSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<RecuperarSenha />} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        {/* ROTA PROTEGIDA */}
        <Route path="/dashboard-tatuador" element={<PrivateRoute tipo="TATUADOR"><DashboardTatuador /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<RecuperarSenha />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;

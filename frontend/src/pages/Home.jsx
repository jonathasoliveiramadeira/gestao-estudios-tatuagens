import "../styles/Home.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  // =========================
  // Verificar usuário logado
  // =========================
  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <nav className="menu">
          <a href="#">INICIO</a>
          <a href="#">SOBRE NÓS</a>
          <a href="#">PORTFÓLIOS</a>
          <a href="#">SOU TATUADOR</a>
        </nav>

        {/* =========================
            USUÁRIO / LOGIN
        ========================= */}
        {usuario ? (
          <div className="user-area">
            <span className="user-email">
              {usuario.email}
            </span>

            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="login-btn"
          >
            Login
          </button>
        )}
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>
          Sua próxima tatuagem,<br />
          começa aqui
        </h1>

        <p>
          Encontre o tatuador ideal, agende com facilidade e transforme ideias em arte permanente.
        </p>

        <button className="cta-btn">
          Agendar agora
        </button>
      </section>

    </div>
  );
}
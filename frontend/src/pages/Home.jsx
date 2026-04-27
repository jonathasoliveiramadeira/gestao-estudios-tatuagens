import "../styles/Home.css";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import axios from "axios";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // 🔐 Buscar usuário logado
  useEffect(() => {
    axios.get("http://localhost:8000/api/me/", {
      withCredentials: true
    })
      .then(res => {
        setUsuario(res.data);
        localStorage.setItem("usuario", JSON.stringify(res.data));
      })
      .catch(() => {
        setUsuario(null);
      });
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/logout/", {}, {
        withCredentials: true
      });

      setUsuario(null);
      localStorage.removeItem("usuario");

    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
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
          <a href="#sobre">SOBRE NÓS</a>
          <a href="#">PORTFÓLIOS</a>
          <a href="#">SOU TATUADOR</a>
        </nav>

        {usuario ? (
          <div className="user-area">
            <span className="user-name">
              Olá, {usuario.first_name || usuario.email.split("@")[0]}
            </span>

            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        ) : (
          <button onClick={() => setModalOpen(true)} className="login-btn">
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

        <button className="cta-btn">Agendar agora</button>
      </section>

      {/* SOBRE NÓS */}
      <section id="sobre" className="sobre">
        <div className="sobre-container">
          
          <h2>Sobre Nós</h2>

          <p className="sobre-intro">
            Conectamos pessoas a artistas incríveis para transformar ideias em arte permanente.
          </p>

          <div className="sobre-cards">

            <div className="card">
              <h3>Nossa Missão</h3>
              <p>
                Facilitar o encontro entre clientes e tatuadores, tornando o processo de agendamento simples, rápido e confiável.
              </p>
            </div>

            <div className="card">
              <h3>Nossa Visão</h3>
              <p>
                Ser a principal plataforma de conexão entre arte e pessoas, valorizando o talento dos tatuadores.
              </p>
            </div>

            <div className="card">
              <h3>Nosso Propósito</h3>
              <p>
                Acreditamos que cada tatuagem conta uma história. Estamos aqui para ajudar você a encontrar quem vai eternizá-la.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* MODAL */}
      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLogin={(user) => setUsuario(user)}
      />

    </div>
  );
}
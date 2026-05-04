import "../styles/Home.css";
import logo from "../assets/logo.png";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, login } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();

  // =========================
  // Sincronizar com AuthContext
  // =========================
  useEffect(() => {
    setUsuario(user);
  }, [user]);

  // =========================
  // Buscar usuário via JWT
  // =========================
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("code") || url.searchParams.get("state")) {
      window.history.replaceState({}, document.title, "/");
    }

    const token = localStorage.getItem("token");

    if (!token) return;

    axios.get("http://localhost:8000/api/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setUsuario(res.data);
        localStorage.setItem("usuario", JSON.stringify(res.data));
      })
      .catch(() => {
        setUsuario(null);
      });

  }, []);

  // =========================
  // BUSCAR PORTFÓLIOS
  // =========================
  useEffect(() => {
    axios.get("http://localhost:8000/api/portfolios/")
      .then(res => {
        setPortfolios(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar portfólios:", err);
      });
  }, []);

  // =========================
  const irParaPerfil = () => {
    navigate("/perfil");
  };

  const irParaDashboard = () => {
    navigate("/dashboard-tatuador");
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
          <a href="#portfolio">PORTFÓLIOS</a>
          <a href="#">SOU TATUADOR</a>
        </nav>

        {usuario ? (
          <div className="user-info">

            <span className="user-name">
              Olá,{" "}
              {usuario.first_name
                ? usuario.first_name
                : usuario.email.split("@")[0]}
            </span>

            {/* 🔥 BOTÃO DO TATUADOR */}
            {usuario.tipo_usuario === "TATUADOR" && (
              <button
                onClick={irParaDashboard}
                className="tatuador-btn"
              >
                Meu Estúdio
              </button>
            )}

            {/* Avatar */}
            <div className="avatar" onClick={irParaPerfil}>
              {usuario.foto ? (
                <img src={usuario.foto} alt="Perfil" />
              ) : (
                (usuario.first_name || usuario.email)
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
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

        <button className="cta-btn">Agendar agora</button>
      </section>

      {/* SOBRE */}
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

      {/* PORTFÓLIO */}
      <section id="portfolio" className="portfolio">
        <div className="portfolio-container">
          <h2>Portfólios em destaque</h2>

          <div className="portfolio-cards">

            {portfolios.length > 0 ? (
              portfolios.map((item) => (
                <div key={item.id} className="portfolio-card">

                  <img
                    src={
                      item.imagem
                        ? item.imagem.startsWith("http")
                          ? item.imagem
                          : `http://localhost:8000${item.imagem}`
                        : "https://via.placeholder.com/400x300"
                    }
                    alt={item.titulo}
                  />

                  <h3>{item.tatuador_nome || "Tatuador"}</h3>

                  <p>{item.estilo || "Estilo não informado"}</p>

                </div>
              ))
            ) : (
              <p>Carregando portfólios...</p>
            )}

          </div>
        </div>
      </section>

      {/* MODAL */}
      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLogin={login}
      />

    </div>
  );
}
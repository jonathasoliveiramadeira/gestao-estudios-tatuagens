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
  const [tatuadores, setTatuadores] = useState([]);

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
  // BUSCAR TATUADORES
  // =========================
  useEffect(() => {
    axios.get("http://localhost:8000/api/tatuadores/")
      .then(res => {
        setTatuadores(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar tatuadores:", err);
      });
  }, []);

  // =========================
  const irParaPerfil = () => {
    navigate("/perfil");
  };

  const irParaDashboard = () => {
    navigate("/dashboard-tatuador");
  };

  const irParaTatuador = (id) => {
    navigate(`/tatuador/${id}`);
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
          <a href="#portfolio">ESTÚDIOS</a>

          {usuario?.tipo_usuario?.toLowerCase() === "tatuador" && (
            <>
              <a
                href="/dashboard-tatuador"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard-tatuador");
                }}
              >
                MINHAS ARTES
              </a>

              <a
                href="/editar-estudio"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/editar-estudio");
                }}
              >
                MEU ESTÚDIO
              </a>
            </>
          )}
        </nav>

        {usuario ? (
          <div className="user-info">

            <span className="user-name">
              Olá,{" "}
              {usuario.first_name
                ? usuario.first_name
                : usuario.email.split("@")[0]}
            </span>

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

      {/* PORTFÓLIOS (ESTÚDIOS) */}
      <section id="portfolio" className="portfolio">
        <div className="portfolio-container">
          <h2>Estúdios em destaque</h2>

          <div className="studio-cards">

            {tatuadores.length > 0 ? (
              tatuadores.map((studio) => (
                <div
                  key={studio.id}
                  className="studio-card"
                  onClick={() => irParaTatuador(studio.id)}
                >

                  {/* HEADER */}
                  <div className="studio-header">
                    <h3>{studio.nome_estudio || "Estúdio"}</h3>

                    {studio.logo && (
                      <img
                        src={
                          studio.logo.startsWith("http")
                            ? studio.logo
                            : `http://localhost:8000${studio.logo}`
                        }
                        alt="logo"
                        className="studio-logo"
                      />
                    )}
                  </div>

                  {/* DESCRIÇÃO */}
                  <p className="studio-desc">
                    {studio.descricao || "Sem descrição"}
                  </p>

                  {/* GALERIA */}
                  <div className="studio-gallery">
                    {studio.portfolios && studio.portfolios.length > 0 ? (
                      studio.portfolios.slice(0, 6).map((p) => (
                        <img
                          key={p.id}
                          src={
                            p.imagem.startsWith("http")
                              ? p.imagem
                              : `http://localhost:8000${p.imagem}`
                          }
                          alt={p.titulo}
                        />
                      ))
                    ) : (
                      <span style={{ color: "#777" }}>
                        Sem artes ainda
                      </span>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <p>Carregando estúdios...</p>
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
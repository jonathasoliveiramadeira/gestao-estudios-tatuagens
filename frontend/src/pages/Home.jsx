import "../styles/Home.css";
import logo from "../assets/logo.png";

export default function Home() {
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

        <button className="login-btn">Login</button>
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

    </div>
  );
}
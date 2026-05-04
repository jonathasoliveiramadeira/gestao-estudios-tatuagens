import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ HOOKS SEMPRE NO TOPO
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // 🚨 AGORA SIM pode fazer o return condicional
  if (!isOpen) return null;

  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!form.email || !form.password) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          email: form.email,
          password: form.password
        }
      );

      const { access, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("usuario", JSON.stringify(user));

      if (onLogin) onLogin({ access, user });

      onClose();

    } catch (err) {
      console.error("Erro login:", err.response || err);

      if (err.response?.status === 400) {
        setErro("Email ou senha inválidos");
      } else {
        setErro("Erro ao conectar com o servidor");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Entrar</h2>

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="divider">
          <span>ou</span>
        </div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Entrar com Google
        </button>

        <p className="criar-conta">
          Não tem conta? <a href="/login">Criar conta</a>
        </p>

      </div>
    </div>
  );
}
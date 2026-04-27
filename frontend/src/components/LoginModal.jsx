import { useState } from "react";
import axios from "axios";
import "../styles/LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        form
      );

      localStorage.setItem("usuario", JSON.stringify(response.data));

      onLogin(response.data);
      onClose();

    } catch (err) {
      setErro("Email ou senha inválidos");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://127.0.0.1:8000/accounts/google/login/";
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/", {}, {
        withCredentials: true
      });

      // limpa usuário
      setUsuario(null);
      localStorage.removeItem("usuario");

    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button className="close-btn" onClick={onClose}>X</button>

        <h2>Entrar</h2>

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            onChange={handleChange}
          />

          <button type="submit">Entrar</button>
        </form>

        <div className="divider">
          <span>ou</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Entrar com Google
        </button>

        <p className="criar-conta">
          Não tem conta? <a href="/login">Criar conta</a>
        </p>

      </div>
    </div>
  );
}
import { useState, useContext } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [modoLogin, setModoLogin] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    tipo_usuario: ""
  });

  const [alerta, setAlerta] = useState({
    mensagem: "",
    tipo: ""
  });

  const [loading, setLoading] = useState(false);

  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  const showAlert = (mensagem, tipo) => {
    setAlerta({ mensagem, tipo });

    setTimeout(() => {
      setAlerta({ mensagem: "", tipo: "" });
    }, 3000);
  };

  // =========================
  const validar = () => {
    if (!form.email || !form.password || (!modoLogin && !form.tipo_usuario)) {
      showAlert("Preencha todos os campos!", "error");
      return false;
    }

    if (!form.email.includes("@")) {
      showAlert("Email inválido!", "error");
      return false;
    }

    if (form.password.length < 6) {
      showAlert("Senha deve ter pelo menos 6 caracteres", "error");
      return false;
    }

    return true;
  };

  // =========================
  // 🚀 SUBMIT (LOGIN OU CADASTRO)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setLoading(true);

    try {
      if (modoLogin) {
        // 🔐 LOGIN COM JWT
        const response = await axios.post(
          "http://localhost:8000/api/login/",
          {
            email: form.email,
            password: form.password
          }
        );

        const { access, user } = response.data;

        // salvar token
        localStorage.setItem("token", access);
        localStorage.setItem("usuario", JSON.stringify(user));

        // atualizar contexto
        login({ access, user });

        showAlert("Login realizado com sucesso! 🚀", "success");

        // 🎯 REDIRECT AUTOMÁTICO
        setTimeout(() => {
          if (user.tipo_usuario === "TATUADOR") {
            navigate("/dashboard-tatuador");
          } else {
            navigate("/");
          }
        }, 1000);

      } else {
        // 🧾 CADASTRO
        await axios.post(
          "http://localhost:8000/api/usuarios/",
          form
        );

        showAlert("Conta criada! Agora faça login 😉", "success");

        setModoLogin(true);
      }

    } catch (err) {
      console.error(err);

      if (modoLogin) {
        showAlert("Email ou senha inválidos!", "error");
      } else if (err.response?.data?.email) {
        showAlert("Email já cadastrado!", "error");
      } else {
        showAlert("Erro. Tente novamente.", "error");
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="login-container">
      <h2>{modoLogin ? "Entrar" : "Criar Conta"}</h2>

      {/* ALERTA */}
      {alerta.mensagem && (
        <div className={`alerta ${alerta.tipo}`}>
          {alerta.mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        {!modoLogin && (
          <select
            name="tipo_usuario"
            value={form.tipo_usuario}
            onChange={handleChange}
          >
            <option value="">Selecione o tipo</option>
            <option value="CLIENTE">Cliente</option>
            <option value="TATUADOR">Tatuador</option>
          </select>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? modoLogin ? "Entrando..." : "Criando..."
            : modoLogin ? "Entrar" : "Criar conta"}
        </button>
      </form>

      {/* TROCAR MODO */}
      <p className="toggle-mode">
        {modoLogin ? "Não tem conta?" : "Já tem conta?"}
        <span onClick={() => setModoLogin(!modoLogin)}>
          {modoLogin ? " Criar conta" : " Entrar"}
        </span>
      </p>

      {/* ESQUECI SENHA */}
      <p className="forgot-password">
        <span onClick={() => navigate("/recuperar")}>
          Esqueceu a senha?
        </span>
      </p>

      <div className="divider">
        <span>ou</span>
      </div>

      <button onClick={handleGoogleLogin} className="google-btn">
        Entrar com Google
      </button>
    </div>
  );
}

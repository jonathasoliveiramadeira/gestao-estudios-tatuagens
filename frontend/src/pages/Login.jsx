import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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
  // Atualiza campos
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // Validação
  // =========================
  const validar = () => {
    if (!form.email || !form.password || !form.tipo_usuario) {
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
  // Função de alerta
  // =========================
  const showAlert = (mensagem, tipo) => {
    setAlerta({ mensagem, tipo });

    setTimeout(() => {
      setAlerta({ mensagem: "", tipo: "" });
    }, 3000);
  };

  // =========================
  // Criar conta
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/usuarios/",
        form
      );

      localStorage.setItem("usuario", JSON.stringify(response.data));

      showAlert("Conta criada com sucesso! 🎉", "success");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.email) {
        showAlert(
          "Este email já está cadastrado. Deseja fazer login ou recuperar a senha?",
          "error"
        );
      } else {
        showAlert("Erro ao criar conta. Tente novamente.", "error");
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Login Google
  // =========================
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="login-container">
      <h2>Criar Conta</h2>

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

        <select
          name="tipo_usuario"
          value={form.tipo_usuario}
          onChange={handleChange}
        >
          <option value="">Selecione o tipo</option>
          <option value="CLIENTE">Cliente</option>
          <option value="TATUADOR">Tatuador</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

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
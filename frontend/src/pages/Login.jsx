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

  const [erro, setErro] = useState("");
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
      setErro("Preencha todos os campos!");
      return false;
    }

    if (!form.email.includes("@")) {
      setErro("Email inválido!");
      return false;
    }

    if (form.password.length < 6) {
      setErro("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    setErro("");
    return true;
  };

  // =========================
  // Criar conta
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setLoading(true);

    try {
      // 👇 AGORA pegamos a resposta
      const response = await axios.post(
        "http://127.0.0.1:8000/api/usuarios/",
        form
      );

      // 👇 SALVA no localStorage
      localStorage.setItem("usuario", JSON.stringify(response.data));

      alert("Conta criada com sucesso! 🎉");

      // redireciona para home
      navigate("/");

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        setErro("Erro: " + JSON.stringify(err.response.data));
      } else {
        setErro("Erro ao criar conta. Tente novamente.");
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Login com Google
  // =========================
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  return (
    <div className="login-container">
      <h2>Criar Conta</h2>

      {erro && <p className="erro">{erro}</p>}

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

      <div className="divider">
        <span>ou</span>
      </div>

      <button onClick={handleGoogleLogin} className="google-btn">
        Entrar com Google
      </button>
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../styles/Perfil.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);

  const { logout: logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  // =========================
  // 🔐 Buscar usuário via JWT
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:8000/api/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setUsuario(res.data);
        setForm(res.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  const handleFotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));

      setForm({
        ...form,
        foto: file
      });
    }
  };

  // =========================
  // 💾 SALVAR (JWT)
  // =========================
  const salvar = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("tipo_usuario", form.tipo_usuario);

      if (form.foto instanceof File) {
        formData.append("foto", form.foto);
      }

      const res = await axios.put(
        "http://localhost:8000/api/usuario/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario(res.data);
      setForm(res.data);
      setPreview(null);
      setEditando(false);

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar perfil");
    }
  };

  // =========================
  // 🚪 LOGOUT (JWT)
  // =========================
  const logout = () => {
    logoutContext(); // limpa contexto
    navigate("/", { replace: true });
  };

  // =========================
  // ❌ EXCLUIR CONTA
  // =========================
  const excluirConta = async () => {
    if (!window.confirm("Tem certeza que deseja excluir sua conta?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:8000/api/usuario/delete/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      logoutContext();
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Erro ao excluir conta");
    }
  };

  if (!usuario) return <div>Carregando...</div>;

  return (
    <div className="perfil-container">

      <div className="perfil-header">
        <button onClick={() => navigate("/")} className="back-btn">
          ← Voltar
        </button>
      </div>

      <h1>Meu Perfil</h1>

      <div className="perfil-card">

        {/* FOTO */}
        <label className="foto">
          <img
            src={
              preview ||
              usuario.foto ||
              "https://via.placeholder.com/150"
            }
            alt="Perfil"
          />

          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              hidden
            />
          )}
        </label>

        {/* DADOS */}
        <div className="dados">
          <label>Email</label>
          <input
            name="email"
            value={form.email || ""}
            disabled
          />

          <label>Tipo de Usuário</label>
          <select
            name="tipo_usuario"
            value={form.tipo_usuario || ""}
            onChange={handleChange}
            disabled={!editando}
          >
            <option value="CLIENTE">Cliente</option>
            <option value="TATUADOR">Tatuador</option>
          </select>
        </div>

        {/* AÇÕES */}
        <div className="acoes">

          {editando ? (
            <button onClick={salvar} className="salvar">
              Salvar
            </button>
          ) : (
            <button onClick={() => setEditando(true)} className="editar">
              Editar
            </button>
          )}

          <button onClick={logout} className="logout">
            Logout
          </button>

          <button onClick={excluirConta} className="delete">
            Excluir Conta
          </button>

        </div>

      </div>
    </div>
  );
}
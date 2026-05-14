import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardTatuador.css";

export default function EditarEstudio() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_estudio: "",
    descricao: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  // =========================
  // BUSCAR DADOS DO ESTÚDIO
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8000/api/tatuadores/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForm({
          nome_estudio: res.data.nome_estudio || "",
          descricao: res.data.descricao || "",
          logo: null,
        });

        setPreview(res.data.logo);
        setId(res.data.id);

      } catch (err) {
        console.error("Erro ao carregar estúdio:", err);
        alert("Erro ao carregar dados do estúdio");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // INPUTS
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGO
  // =========================
  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({ ...form, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // SALVAR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nome_estudio", form.nome_estudio);
      formData.append("descricao", form.descricao);

      if (form.logo) {
        formData.append("logo", form.logo);
      }

      await axios.put(
        `http://localhost:8000/api/tatuadores/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Estúdio atualizado com sucesso!");
      navigate("/");

    } catch (err) {
      console.error("Erro:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  if (loading) return <div className="dashboard">Carregando...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">

        {/* 🔙 VOLTAR */}
        <div className="dashboard-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>

        <h2>Editar Estúdio</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="nome_estudio"
            placeholder="Nome do estúdio"
            value={form.nome_estudio}
            onChange={handleChange}
          />

          <textarea
            name="descricao"
            placeholder="Descrição do estúdio"
            value={form.descricao}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogo}
          />

          {/* PREVIEW */}
          {preview && (
            <div className="preview">
              <img
                src={
                  preview.startsWith("http")
                    ? preview
                    : `http://localhost:8000${preview}`
                }
                alt="Logo"
              />
            </div>
          )}

          <button type="submit">Salvar</button>

        </form>

      </div>
    </div>
  );
}
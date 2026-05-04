import { useState } from "react";
import axios from "axios";
import "../styles/DashboardTatuador.css";
import { useNavigate } from "react-router-dom"; // ✅ ADICIONADO

export default function DashboardTatuador() {
  const navigate = useNavigate(); // ✅ ADICIONADO

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    estilo: "",
    imagem: null,
  });

  const [preview, setPreview] = useState(null);

  // =========================
  // Atualiza inputs
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Upload imagem
  // =========================
  const handleImagem = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({ ...form, imagem: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // Enviar
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);
      formData.append("estilo", form.estilo);
      formData.append("imagem", form.imagem);

      await axios.post(
        "http://localhost:8000/api/portfolios/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Portfólio criado com sucesso! 🎉");

      setForm({
        titulo: "",
        descricao: "",
        estilo: "",
        imagem: null,
      });

      setPreview(null);

    } catch (err) {
      console.error("ERRO BACKEND:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
      alert("Erro ao criar portfólio");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">

        <h2>Adicionar nova arte</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
          />

          <input
            name="estilo"
            placeholder="Estilo (ex: Realismo)"
            value={form.estilo}
            onChange={handleChange}
          />

          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImagem}
          />

          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit">Salvar</button>

        </form>

        {/* 🔙 BOTÃO FUNCIONANDO */}
        <div className="dashboard-header">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Voltar para Home
          </button>
        </div>

      </div>
    </div>
  );
}
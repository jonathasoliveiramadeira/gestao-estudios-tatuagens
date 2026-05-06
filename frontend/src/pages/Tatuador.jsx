import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Tatuador.css";

export default function Tatuador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studio, setStudio] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/tatuadores/${id}/`)
      .then(res => {
        setStudio(res.data);
      })
      .catch(err => {
        console.error("Erro ao carregar tatuador:", err);
      });
  }, [id]);

  if (!studio) return <div className="loading">Carregando...</div>;

  return (
    <div className="tatuador-page">

      {/* BOTÃO VOLTAR */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Voltar
      </button>

      <div className="tatuador-container">

        {/* HEADER */}
        <div className="tatuador-header">

          <h1>{studio.nome_estudio || "Estúdio"}</h1>

          {studio.logo && (
            <img
              src={
                studio.logo.startsWith("http")
                  ? studio.logo
                  : `http://localhost:8000${studio.logo}`
              }
              alt="logo"
              className="tatuador-logo"
            />
          )}
        </div>

        {/* DESCRIÇÃO */}
        <p className="tatuador-desc">
          {studio.descricao || "Sem descrição disponível."}
        </p>

        {/* GALERIA */}
        <div className="tatuador-gallery">
          {studio.portfolios && studio.portfolios.length > 0 ? (
            studio.portfolios.map((p) => (
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
            <p>Nenhuma arte cadastrada ainda.</p>
          )}
        </div>

      </div>
    </div>
  );
}
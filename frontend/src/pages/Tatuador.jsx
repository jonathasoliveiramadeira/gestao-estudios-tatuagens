import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Tatuador.css";

export default function Tatuador() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [studio, setStudio] = useState(null);

  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FORMULÁRIO
  // ==========================================
  const [formData, setFormData] = useState({
    servico: "",
    data: "",
    horario: "",
    observacoes: ""
  });

  // ==========================================
  // CARREGAR TATUADOR
  // ==========================================
  useEffect(() => {

    axios.get(`http://localhost:8000/api/tatuadores/${id}/`)
      .then(res => {
        setStudio(res.data);
      })
      .catch(err => {
        console.error("Erro ao carregar tatuador:", err);
      });

  }, [id]);

  // ==========================================
  // CARREGAR SERVIÇOS
  // ==========================================
  useEffect(() => {

    axios.get(`http://localhost:8000/api/servicos/?tatuador=${id}`)
      .then(res => {
        setServicos(res.data);
      })
      .catch(err => {
        console.error("Erro ao carregar serviços:", err);
      });

  }, [id]);

  // ==========================================
  // CARREGAR HORÁRIOS DISPONÍVEIS
  // ==========================================
  useEffect(() => {

    if (!formData.data) {
      setHorarios([]);
      return;
    }

    async function carregarHorarios() {

      try {

        const response = await axios.get(
          `http://localhost:8000/api/agendamentos/horarios-disponiveis/`,
          {
            params: {
              tatuador: id,
              data: formData.data
            }
          }
        );

        setHorarios(response.data);

      } catch (err) {

        console.error(
          "Erro ao carregar horários:",
          err.response?.data || err
        );

        setHorarios([]);

      }
    }

    carregarHorarios();

  }, [formData.data, id]);

  // ==========================================
  // ALTERAR FORMULÁRIO
  // ==========================================
  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  }

  // ==========================================
  // ENVIAR AGENDAMENTO
  // ==========================================
  async function handleSubmit(e) {

    e.preventDefault();

    if (!token) {
      setMensagem("Faça login para agendar.");
      return;
    }

    try {

      const dataCompleta = `${formData.data}T${formData.horario}:00`;

      await axios.post(
        "http://localhost:8000/api/agendamentos/",
        {
          tatuador: id,
          servico: formData.servico,
          data: dataCompleta,
          observacoes: formData.observacoes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMensagem("Agendamento realizado com sucesso!");

      setFormData({
        servico: "",
        data: "",
        horario: "",
        observacoes: ""
      });

      setHorarios([]);

    } catch (err) {

      console.error(err);

      setMensagem(
        err.response?.data?.detail ||
        "Erro ao realizar agendamento."
      );
    }
  }

  // ==========================================
  // LOADING
  // ==========================================
  if (!studio) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="tatuador-page">

      {/* BOTÃO VOLTAR */}
      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
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

        {/* ========================================== */}
        {/* AGENDAMENTO */}
        {/* ========================================== */}
        <div className="agendamento-container">

          <h2>Agendar Horário</h2>

          {!token ? (

            <p className="login-warning">
              Faça login para realizar um agendamento.
            </p>

          ) : (

            <form
              className="agendamento-form"
              onSubmit={handleSubmit}
            >

              {/* SERVIÇO */}
              <select
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecione um serviço
                </option>

                {servicos.map(servico => (
                  <option
                    key={servico.id}
                    value={servico.id}
                  >
                    {servico.nome} - R$ {servico.preco}
                  </option>
                ))}

              </select>

              {/* DATA */}
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />

              {/* HORÁRIOS */}
              <select
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecione um horário
                </option>

                {horarios.map((horario, index) => (
                  <option
                    key={index}
                    value={horario}
                  >
                    {horario}
                  </option>
                ))}

              </select>

              {/* OBSERVAÇÕES */}
              <textarea
                name="observacoes"
                placeholder="Descreva como deseja seu serviço..."
                value={formData.observacoes}
                onChange={handleChange}
              />

              {/* BOTÃO */}
              <button type="submit">
                Agendar
              </button>

            </form>

          )}

          {/* MENSAGEM */}
          {mensagem && (
            <p className="mensagem-agendamento">
              {mensagem}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}
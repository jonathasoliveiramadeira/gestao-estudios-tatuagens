import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DashboardTatuador.css";
import { useNavigate } from "react-router-dom";

export default function DashboardTatuador() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================================
  // PORTFÓLIO
  // ==========================================
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    estilo: "",
    imagem: null,
  });

  const [preview, setPreview] = useState(null);
  const [portfolios, setPortfolios] = useState([]);

  // ==========================================
  // SERVIÇOS
  // ==========================================
  const [servicos, setServicos] = useState([]);

  const [servicoForm, setServicoForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao_minutos: "",
  });

  // ==========================================
  // AGENDAMENTOS
  // ==========================================
  const [agendamentos, setAgendamentos] = useState([]);

  // ==========================================
  // INIT
  // ==========================================
  useEffect(() => {

    carregarAgendamentos();
    carregarServicos();
    carregarPortfolios();

  }, []);

  // ==========================================
  // CARREGAR PORTFÓLIOS
  // ==========================================
  async function carregarPortfolios() {

    try {

      const tatuadorResponse = await axios.get(
        "http://localhost:8000/api/tatuadores/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const tatuadorId = tatuadorResponse.data.id;

      const response = await axios.get(
        `http://localhost:8000/api/portfolios/?tatuador=${tatuadorId}`
      );

      setPortfolios(response.data);

    } catch (err) {

      console.error("Erro ao carregar portfólios:", err);

    }
  }

  // ==========================================
  // EXCLUIR PORTFÓLIO
  // ==========================================
  async function excluirPortfolio(id) {

    const confirmar = window.confirm(
      "Deseja realmente excluir esta arte?"
    );

    if (!confirmar) return;

    try {

      await axios.delete(
        `http://localhost:8000/api/portfolios/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      carregarPortfolios();

    } catch (err) {

      console.error("Erro ao excluir arte:", err);

    }
  }

  // ==========================================
  // CARREGAR SERVIÇOS
  // ==========================================
  async function carregarServicos() {

    try {

      const response = await axios.get(
        "http://localhost:8000/api/servicos/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setServicos(response.data);

    } catch (err) {

      console.error("Erro ao carregar serviços:", err);

    }
  }

  // ==========================================
  // CRIAR SERVIÇO
  // ==========================================
  async function criarServico(e) {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:8000/api/servicos/",
        servicoForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Serviço criado com sucesso!");

      setServicoForm({
        nome: "",
        descricao: "",
        preco: "",
        duracao_minutos: "",
      });

      carregarServicos();

    } catch (err) {

      console.error("Erro ao criar serviço:", err.response?.data);

      alert("Erro ao criar serviço");

    }
  }

  // ==========================================
  // EXCLUIR SERVIÇO
  // ==========================================
  async function excluirServico(id) {

    const confirmar = window.confirm(
      "Deseja realmente excluir este serviço?"
    );

    if (!confirmar) return;

    try {

      await axios.delete(
        `http://localhost:8000/api/servicos/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      carregarServicos();

    } catch (err) {

      console.error("Erro ao excluir serviço:", err);

    }
  }

  // ==========================================
  // CARREGAR AGENDAMENTOS
  // ==========================================
  async function carregarAgendamentos() {

    try {

      const response = await axios.get(
        "http://localhost:8000/api/agendamentos/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAgendamentos(response.data);

    } catch (err) {

      console.error("Erro ao carregar agendamentos:", err);

    }
  }

  // ==========================================
  // ALTERAR STATUS
  // ==========================================
  async function atualizarStatus(id, status) {

    try {

      await axios.patch(
        `http://localhost:8000/api/agendamentos/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      carregarAgendamentos();

    } catch (err) {

      console.error("Erro ao atualizar status:", err);

    }
  }

  // ==========================================
  // INPUTS PORTFÓLIO
  // ==========================================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // ==========================================
  // INPUTS SERVIÇOS
  // ==========================================
  const handleServicoChange = (e) => {

    setServicoForm({
      ...servicoForm,
      [e.target.name]: e.target.value,
    });

  };

  // ==========================================
  // IMAGEM
  // ==========================================
  const handleImagem = (e) => {

    const file = e.target.files[0];

    if (file) {

      setForm({
        ...form,
        imagem: file
      });

      setPreview(URL.createObjectURL(file));

    }
  };

  // ==========================================
  // SALVAR PORTFÓLIO
  // ==========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

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

      alert("Portfólio criado com sucesso!");

      setForm({
        titulo: "",
        descricao: "",
        estilo: "",
        imagem: null,
      });

      setPreview(null);

    } catch (err) {

      console.error("ERRO BACKEND:", err.response?.data);

      alert("Erro ao criar portfólio");

    }
  };

  // ==========================================
  // FORMATAR DATA
  // ==========================================
  function formatarData(data) {

    return new Date(data).toLocaleString("pt-BR");

  }

  return (

    <div className="dashboard">

      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header-top">

          <h1>Painel do Tatuador</h1>

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Voltar para Home
          </button>

        </div>

        {/* ========================================== */}
        {/* SERVIÇOS */}
        {/* ========================================== */}
        <div className="dashboard-section">

          <h2>Meus Serviços</h2>

          <form onSubmit={criarServico}>

            <input
              name="nome"
              placeholder="Nome do serviço"
              value={servicoForm.nome}
              onChange={handleServicoChange}
              required
            />

            <textarea
              name="descricao"
              placeholder="Descrição do serviço"
              value={servicoForm.descricao}
              onChange={handleServicoChange}
              required
            />

            <input
              type="number"
              name="preco"
              placeholder="Preço"
              value={servicoForm.preco}
              onChange={handleServicoChange}
              required
            />

            <input
              type="number"
              name="duracao_minutos"
              placeholder="Duração em minutos"
              value={servicoForm.duracao_minutos}
              onChange={handleServicoChange}
              required
            />

            <button type="submit">
              Criar Serviço
            </button>

          </form>

          <div className="servicos-grid">

            {servicos.map((servico) => (

              <div
                className="servico-card"
                key={servico.id}
              >

                <h3>{servico.nome}</h3>

                <p>{servico.descricao}</p>

                <p>
                  <strong>Preço:</strong>
                  {" "}R$ {servico.preco}
                </p>

                <p>
                  <strong>Duração:</strong>
                  {" "}{servico.duracao_minutos} min
                </p>

                <button
                  className="delete-btn"
                  onClick={() => excluirServico(servico.id)}
                >
                  Excluir
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ========================================== */}
        {/* NOVA ARTE */}
        {/* ========================================== */}
        <div className="dashboard-section">

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

            <button type="submit">
              Salvar Portfólio
            </button>

          </form>

          {/* ========================================== */}
          {/* LISTA DE ARTES */}
          {/* ========================================== */}
          <div className="portfolio-grid">

            {portfolios.length === 0 ? (

              <p>Nenhuma arte cadastrada.</p>

            ) : (

              portfolios.map((portfolio) => (

                <div
                  className="portfolio-card"
                  key={portfolio.id}
                >

                  <img
                    src={
                      portfolio.imagem.startsWith("http")
                        ? portfolio.imagem
                        : `http://localhost:8000${portfolio.imagem}`
                    }
                    alt={portfolio.titulo}
                  />

                  <div className="portfolio-info">

                    <h3>{portfolio.titulo}</h3>

                    <p>{portfolio.estilo}</p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        excluirPortfolio(portfolio.id)
                      }
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          </div>        

        {/* ========================================== */}
        {/* AGENDAMENTOS */}
        {/* ========================================== */}
        <div className="dashboard-section">

          <h2>Agendamentos</h2>

          {agendamentos.length === 0 ? (

            <p className="sem-agendamentos">
              Nenhum agendamento encontrado.
            </p>

          ) : (

            <div className="agendamentos-grid">

              {agendamentos.map((agendamento) => (

                <div
                  className="agendamento-card"
                  key={agendamento.id}
                >

                  <h3>
                    {agendamento.servico_nome || "Serviço"}
                  </h3>

                  <p>
                    <strong>Cliente:</strong>{" "}
                    {agendamento.cliente_nome || "Cliente"}
                  </p>

                  <p>
                    <strong>Data:</strong>{" "}
                    {formatarData(agendamento.data)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${agendamento.status}`}>
                      {agendamento.status}
                    </span>
                  </p>

                  {agendamento.observacoes && (
                    <p>
                      <strong>Obs:</strong>{" "}
                      {agendamento.observacoes}
                    </p>
                  )}

                  <div className="acoes-agendamento">

                    <button
                      className="confirmar-btn"
                      onClick={() =>
                        atualizarStatus(
                          agendamento.id,
                          "confirmado"
                        )
                      }
                    >
                      Confirmar
                    </button>

                    <button
                      className="cancelar-btn"
                      onClick={() =>
                        atualizarStatus(
                          agendamento.id,
                          "cancelado"
                        )
                      }
                    >
                      Cancelar
                    </button>

                    <button
                      className="concluir-btn"
                      onClick={() =>
                        atualizarStatus(
                          agendamento.id,
                          "concluido"
                        )
                      }
                    >
                      Concluir
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
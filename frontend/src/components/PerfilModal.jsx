import "../styles/PerfilModal.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaTrash,
  FaEnvelope,
  FaTimes,
  FaStore,
  FaEdit,
} from "react-icons/fa";

export default function PerfilModal({
  isOpen,
  onClose,
  usuario,
}) {
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState("perfil");
  const [editando, setEditando] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(usuario?.tipo_usuario || "cliente");

  if (!isOpen || !usuario) return null;

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.reload();
  };

  // =========================
  // EXCLUIR CONTA
  // =========================
  const handleExcluirConta = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta?"
    );

    if (!confirmar) return;

    alert("Função de exclusão será implementada.");
  };

  // =========================
  // DASHBOARD
  // =========================
  const irParaDashboard = () => {
    navigate("/dashboard-tatuador");
    onClose();
  };

  // =========================
  // EDITAR ESTÚDIO
  // =========================
  const irParaEstudio = () => {
    navigate("/editar-estudio");
    onClose();
  };

  const salvarAlteracoes = async () => {
    try {

        const token = localStorage.getItem("token");

        await fetch("http://localhost:8000/api/atualizar_usuario/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tipo_usuario: tipoUsuario,
        }),
        });

        alert("Perfil atualizado!");

        window.location.reload();

    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar perfil.");
    }
  };

  return (
    <div className="perfil-overlay">

      {/* FECHAR AO CLICAR FORA */}
      <div
        className="perfil-backdrop"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="perfil-modal">

        {/* HEADER */}
        <div className="perfil-header">

          <div className="perfil-user">

            <div className="perfil-avatar">
              {usuario.foto ? (
                <img
                  src={
                    usuario.foto.startsWith("http")
                      ? usuario.foto
                      : `http://localhost:8000${usuario.foto}`
                  }
                  alt="Perfil"
                />
              ) : (
                (usuario.first_name || usuario.email)
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div className="perfil-info">
              <h2>
                {usuario.first_name || "Usuário"}
              </h2>

              <p>{usuario.email}</p>

              <span>
                {usuario.tipo_usuario}
              </span>
            </div>

          </div>

          {/* FECHAR */}
          <button
            className="fechar-modal"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* MENU */}
        <div className="perfil-menu">

          <button
            className={abaAtiva === "perfil" ? "ativo" : ""}
            onClick={() => setAbaAtiva("perfil")}
          >
            <FaUser />
            Perfil
          </button>

          <button
            className={abaAtiva === "notificacoes" ? "ativo" : ""}
            onClick={() => setAbaAtiva("notificacoes")}
          >
            <FaBell />
            Notificações
          </button>

          <button
            className={abaAtiva === "mensagens" ? "ativo" : ""}
            onClick={() => setAbaAtiva("mensagens")}
          >
            <FaEnvelope />
            Mensagens
          </button>

        </div>

        {/* CONTEÚDO */}
        <div className="perfil-content">

          {/* PERFIL */}
          {abaAtiva === "perfil" && (
            <div className="perfil-section">

              <div className="perfil-card">
                <h3>Informações da Conta</h3>

                <p>
                  <strong>Nome:</strong>{" "}
                  {usuario.first_name || "Não informado"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {usuario.email}
                </p>

                <p>
                  <strong>Tipo:</strong>{" "}
                  {usuario.tipo_usuario}
                </p>
              </div>

              {editando && (
                <div className="perfil-card">

                    <h3>Editar Perfil</h3>

                    <div className="editar-form">

                    <label>
                        Tipo de usuário
                    </label>

                    <select
                        value={tipoUsuario}
                        onChange={(e) =>
                        setTipoUsuario(e.target.value)
                        }
                    >
                        <option value="cliente">
                        Cliente
                        </option>

                        <option value="tatuador">
                        Tatuador
                        </option>
                    </select>

                    <button
                        className="btn-salvar"
                        onClick={salvarAlteracoes}
                    >
                        Salvar Alterações
                    </button>

                    </div>

                </div>
                )}

              {/* AÇÕES */}
              <div className="perfil-actions">

                {usuario?.tipo_usuario?.toLowerCase() === "tatuador" && (
                  <>
                    <button onClick={irParaDashboard}>
                      <FaUser />
                      Minhas Artes
                    </button>

                    <button onClick={irParaEstudio}>
                      <FaStore />
                      Meu Estúdio
                    </button>
                  </>
                )}

                <button onClick={() => setEditando(!editando)}>
                  <FaEdit />
                  {editando ? "Cancelar Edição" : "Editar Perfil"}
                </button>

                <button onClick={handleLogout}>
                  <FaSignOutAlt />
                  Sair da Conta
                </button>

              </div>

            </div>
          )}

          {/* NOTIFICAÇÕES */}
          {abaAtiva === "notificacoes" && (
            <div className="perfil-section">

              <h3>Notificações</h3>

              <div className="notificacao-item">
                <FaBell />
                <p>
                  Nenhuma notificação no momento.
                </p>
              </div>

            </div>
          )}

          {/* MENSAGENS */}
          {abaAtiva === "mensagens" && (
            <div className="perfil-section">

              <h3>Mensagens</h3>

              <div className="mensagem-item">
                <FaEnvelope />
                <p>
                  Nenhuma mensagem disponível.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="perfil-footer">

          <button
            className="btn-excluir"
            onClick={handleExcluirConta}
          >
            <FaTrash />
            Excluir Conta
          </button>

        </div>

      </div>

    </div>
  );
}
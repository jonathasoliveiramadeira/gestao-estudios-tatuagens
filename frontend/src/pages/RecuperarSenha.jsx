import { useState } from "react";
import axios from "axios";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/api/password_reset/",
        { email }
      );

      setMsg("Email de recuperação enviado!");
    } catch {
      setMsg("Erro ao enviar email.");
    }
  };

  return (
    <div>
      <h2>Recuperar senha</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
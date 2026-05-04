import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // buscar usuário
      fetch("http://localhost:8000/api/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem("usuario", JSON.stringify(user));

          // redirect baseado no tipo
          if (user.tipo_usuario === "TATUADOR") {
            navigate("/dashboard-tatuador");
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"));

    } else {
      navigate("/");
    }
  }, [navigate]);

  return <div>Entrando com Google...</div>;
}
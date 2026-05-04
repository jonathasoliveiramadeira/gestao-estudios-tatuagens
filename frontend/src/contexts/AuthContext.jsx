import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Carregar usuário ao iniciar
  // =========================
  useEffect(() => {
    const carregarUsuario = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);

      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = ({ access, user }) => {
    localStorage.setItem("token", access);
    localStorage.setItem("usuario", JSON.stringify(user));
    setUser(user);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

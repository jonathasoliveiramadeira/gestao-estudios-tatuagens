import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({ children, tipo }) {
  const { user, loading } = useContext(AuthContext);

  // Enquanto carrega usuário
  if (loading) return <div>Carregando...</div>;

  // Não logado
  if (!user) return <Navigate to="/" replace />;

  // Tipo incorreto (normalizando pra evitar erro de case)
  if (
    tipo &&
    user.tipo_usuario?.toUpperCase() !== tipo.toUpperCase()
  ) {
    return <Navigate to="/" replace />;
  }

  // Liberado
  return children;
}
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({ children, tipo }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/" />;

  if (tipo && user.tipo_usuario !== tipo) {
    return <Navigate to="/" />;
  }

  return children;
}
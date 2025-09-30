import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("user,",user)
  return user ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
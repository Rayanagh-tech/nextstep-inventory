// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useStore } from '@/store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useStore((s) => s.user);
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

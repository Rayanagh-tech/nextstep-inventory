// ✅ RoleProtectedRoute.tsx (recommended)
import { Navigate } from 'react-router-dom';
import { useStore } from '@/store';

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const user = useStore((state) => state.user);

  if (!user) {
    console.log('🔐 No user');
    return <Navigate to="/login" />;
  } 
  if (!allowedRoles.includes(user.role)) {
    console.log(`⛔ User role ${user.role} not allowed`);
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default RoleProtectedRoute;

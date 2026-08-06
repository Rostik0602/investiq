import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  return accessToken ? <Outlet /> : <Navigate to={ROUTES.AUTH} replace />;
};

export const RedirectIfAuthed = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  return accessToken ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
};
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage/AuthPage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { AddTransactionPage } from '../pages/AddTransactionPage/AddTransactionPage';
import { CalculationsPage } from '../pages/CalculationsPage/CalculationsPage';
import { ProtectedRoute, RedirectIfAuthed } from './ProtectedRoute';
import { ROUTES } from './routes';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthed />}>
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<DashboardPage />} />
          <Route path={ROUTES.ADD_TRANSACTION} element={<AddTransactionPage />} />
          <Route path={ROUTES.CALCULATIONS} element={<CalculationsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, RedirectIfAuthed } from "./ProtectedRoute";
import { ROUTES } from "./routes";

const AuthPage = lazy(() =>
  import("../pages/AuthPage/AuthPage").then((m) => ({ default: m.AuthPage })),
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const AddTransactionPage = lazy(() =>
  import("../pages/AddTransactionPage/AddTransactionPage").then((m) => ({
    default: m.AddTransactionPage,
  })),
);
const CalculationsPage = lazy(() =>
  import("../pages/CalculationsPage/CalculationsPage").then((m) => ({
    default: m.CalculationsPage,
  })),
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.HOME} element={<DashboardPage />} />
            <Route
              path={ROUTES.ADD_TRANSACTION}
              element={<AddTransactionPage />}
            />
            <Route
              path={ROUTES.CALCULATIONS}
              element={<CalculationsPage />}
            />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./shared/i18n/i18n";
import { AppRouter } from "./routes/AppRouter";
import { NotificationRenderer } from "./features/notification/components/NotificationRenderer/NotificationRenderer";
import "./shared/styles/global.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
      <NotificationRenderer />
    </Provider>
  </StrictMode>,
);

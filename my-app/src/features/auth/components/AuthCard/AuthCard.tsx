import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleAuthButton } from "../GoogleAuthButton/GoogleAuthButton";
import { AuthForm } from "../AuthForm/AuthForm";
import { useLoginMutation, useRegisterMutation } from "../../authApi";
import { useAppDispatch } from "../../../../app/hooks";
import { setCredentials } from "../../authSlice";
import { showNotification } from "../../../notification/notificationSlice";
import { ROUTES } from "../../../../routes/routes";
import styles from "./AuthCard.module.scss";

const getServerErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message) return message;
      if (Array.isArray(message) && message.length > 0)
        return message.join(", ");
    }
  }
  return fallback;
};

export const AuthCard = () => {
  const { t } = useTranslation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      navigate(ROUTES.HOME);
    } catch (err) {
      const message = getServerErrorMessage(err, t("auth.invalidCredentials"));
      dispatch(showNotification({ message, type: "error" }));
    }
  };

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      const name = values.email.split("@")[0];

      const result = await register({ ...values, name }).unwrap();
      dispatch(setCredentials(result));
      navigate(ROUTES.HOME);
    } catch (err) {
      const message = getServerErrorMessage(err, t("auth.registerFailed"));
      dispatch(showNotification({ message, type: "error" }));
    }
  };

  const handleGoogleAuth = () => {};

  return (
    <div className={styles.card}>
      <p className={styles.hint}>{t("auth.googleHint")}</p>

      <GoogleAuthButton onClick={handleGoogleAuth} />

      <p className={styles.hint}>{t("auth.emailHint")}</p>

      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoginLoading={isLoginLoading}
        isRegisterLoading={isRegisterLoading}
      />
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header/Header";
import { AuthCard } from "../../features/auth/components/AuthCard/AuthCard";
import styles from "./AuthPage.module.scss";

export const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <div className={styles.branding}>
          <h1 className={styles.title}>InvestIQ</h1>
          <p className={styles.subtitle}>{t("auth.subtitle")}</p>
        </div>

        <AuthCard />
      </main>
    </div>
  );
};

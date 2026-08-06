import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Notification.module.scss";
import clsx from "clsx";

type NotificationType = "info" | "success" | "error";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
  duration?: number;
}

export const Notification = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: NotificationProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={clsx(styles.notification, styles[type])}>
      <span>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label={t("notification.closeAria")}
      >
        ×
      </button>
    </div>
  );
};

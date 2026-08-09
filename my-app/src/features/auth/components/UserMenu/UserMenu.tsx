import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useLogoutMutation } from "../../authApi";
import { logout as logoutAction } from "../../authSlice";
import { showNotification } from "../../../notification/notificationSlice";
import { Avatar } from "../../../../shared/ui/Avatar/Avatar";
import { ConfirmModal } from "../../../../shared/ui/ConfirmModal/ConfirmModal";
import { ROUTES } from "../../../../routes/routes";
import styles from "./UserMenu.module.scss";

export const UserMenu = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest, { isLoading }] = useLogoutMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
    } finally {
      setIsConfirmOpen(false);
      dispatch(logoutAction());
      dispatch(
        showNotification({
          message: t("notifications.loggedOut"),
          type: "info",
        }),
      );
      navigate(ROUTES.AUTH);
    }
  };

  const displayName = user?.name ?? user?.email ?? t("userMenu.defaultName");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.userMenu}>
      <Avatar initial={initial} />
      <span className={styles.name}>{displayName}</span>
      <button
        type="button"
        className={styles.logoutBtn}
        onClick={() => setIsConfirmOpen(true)}
      >
        {t("userMenu.logout")}
      </button>
      <button
        type="button"
        className={styles.logoutIconBtn}
        onClick={() => setIsConfirmOpen(true)}
        aria-label={t("userMenu.logoutAria")}
      >
        <LogOut size={20} strokeWidth={1.8} />
      </button>

      {isConfirmOpen && (
        <ConfirmModal
          title={t("userMenu.logoutConfirmTitle")}
          confirmLabel={t("userMenu.logoutConfirmYes")}
          cancelLabel={t("userMenu.logoutConfirmNo")}
          closeAriaLabel={t("userMenu.logoutConfirmCloseAria")}
          isConfirming={isLoading}
          onConfirm={handleLogout}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
};

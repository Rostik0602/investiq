import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useLogoutMutation } from '../../authApi';
import { logout as logoutAction } from '../../authSlice';
import { showNotification } from '../../../notification/notificationSlice';
import { Avatar } from '../../../../shared/ui/Avatar/Avatar';
import { ROUTES } from '../../../../routes/routes';
import styles from './UserMenu.module.scss';

export const UserMenu = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // Сервер не відповів (протух токен, немає мережі) — все одно
      // розлогінюємо локально, щоб юзер не застряг у стані "начебто увійшов".
    } finally {
      dispatch(logoutAction());
      dispatch(showNotification({ message: t('notifications.loggedOut'), type: 'info' }));
      navigate(ROUTES.AUTH);
    }
  };

  const displayName = user?.name ?? user?.email ?? t('userMenu.defaultName');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.userMenu}>
      <Avatar initial={initial} />
      <span className={styles.name}>{displayName}</span>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        {t('userMenu.logout')}
      </button>
      <button
        type="button"
        className={styles.logoutIconBtn}
        onClick={handleLogout}
        aria-label={t('userMenu.logoutAria')}
      >
        <LogOut size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
};

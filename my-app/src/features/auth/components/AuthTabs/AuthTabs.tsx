import { useTranslation } from 'react-i18next';
import { Button } from '../../../../shared/ui/Button/Button';
import styles from './AuthTabs.module.scss';

interface AuthTabsProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoginLoading?: boolean;
  isRegisterLoading?: boolean;
}

export const AuthTabs = ({
  onLoginClick,
  onRegisterClick,
  isLoginLoading,
  isRegisterLoading,
}: AuthTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.actions}>
      <Button
        type="button"
        variant="primary"
        onClick={onLoginClick}
        isLoading={isLoginLoading}
      >
        {t('auth.login')}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onRegisterClick}
        isLoading={isRegisterLoading}
      >
        {t('auth.register')}
      </Button>
    </div>
  );
};
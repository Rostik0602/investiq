import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BalanceBar } from '../../../balance/components/BalanceBar/BalanceBar';
import { PeriodSwitcher } from '../PeriodSwitcher/PeriodSwitcher';
import { ROUTES } from '../../../../routes/routes';
import styles from './TopBar.module.scss';

export const TopBar = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.topBar}>
      <Link to={ROUTES.HOME} className={styles.backLink}>
        <ArrowLeft size={16} />
        <span className={styles.backLinkText}>{t('calculations.backToHome')}</span>
      </Link>

      <div className={styles.balance}>
        <BalanceBar bare hideOnboardingHint compact />
      </div>

      <div className={styles.period}>
        <PeriodSwitcher />
      </div>
    </div>
  );
};

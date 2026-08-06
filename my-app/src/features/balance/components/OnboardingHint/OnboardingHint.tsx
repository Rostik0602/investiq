import { useTranslation } from 'react-i18next';
import styles from './OnboardingHint.module.scss';

export const OnboardingHint = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.hint}>
      <p>{t('onboarding.title')}</p>
      <p className={styles.secondary}>{t('onboarding.subtitle')}</p>
    </div>
  );
};
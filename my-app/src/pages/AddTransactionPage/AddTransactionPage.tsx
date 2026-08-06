import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/Header/Header';
import { UserMenu } from '../../features/auth/components/UserMenu/UserMenu';
import { ExpenseForm } from '../../features/expenses/components/ExpenseForm/ExpenseForm';
import { IncomeForm } from '../../features/income/components/IncomeForm/IncomeForm';
import { ROUTES } from '../../routes/routes';
import styles from './AddTransactionPage.module.scss';

export const AddTransactionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') === 'income' ? 'income' : 'expenses';

  const goBack = () => navigate(ROUTES.HOME);

  return (
    <div className={styles.page}>
      <Header rightSlot={<UserMenu />} />

      <div className={styles.hero}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={goBack}
          aria-label={t('addTransactionPage.backAria')}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {type === 'expenses' ? (
          <ExpenseForm standalone onDone={goBack} />
        ) : (
          <IncomeForm standalone onDone={goBack} />
        )}
      </div>
    </div>
  );
};

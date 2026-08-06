import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../app/hooks';
import { useGetMonthlyQuery } from '../../../statistics/statisticsApi';
import { selectCalcPeriod } from '../../selectors';
import { formatAmount } from '../../../../shared/utils/formatAmount';
import { toDisplayAmount } from '../../../../shared/utils/currency';
import styles from './SummaryBar.module.scss';

export const SummaryBar = () => {
  const { t, i18n } = useTranslation();
  const { month, year } = useAppSelector(selectCalcPeriod);
  const { data, isLoading, isError } = useGetMonthlyQuery({ year });

  const current = data?.find((entry) => entry.month === month);
  const expenseTotal = current?.totalExpenses ?? 0;
  const incomeTotal = current?.totalIncome ?? 0;

  if (isError) {
    return (
      <div className={styles.bar}>
        <p className={styles.errorState}>{t('calculations.summaryBar.error')}</p>
      </div>
    );
  }

  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <span className={styles.label}>{t('calculations.summaryBar.expenses')}</span>
        <span className={styles.expense}>
          {isLoading
            ? '…'
            : `- ${formatAmount(toDisplayAmount(expenseTotal, i18n.language))} ${t('common.currency')}`}
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.item}>
        <span className={styles.label}>{t('calculations.summaryBar.income')}</span>
        <span className={styles.income}>
          {isLoading
            ? '…'
            : `+ ${formatAmount(toDisplayAmount(incomeTotal, i18n.language))} ${t('common.currency')}`}
        </span>
      </div>
    </div>
  );
};

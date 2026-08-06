import { useTranslation } from 'react-i18next';
import { formatAmount } from '../../utils/formatAmount';
import { toDisplayAmount } from '../../utils/currency';
import styles from './Table.module.scss';

export interface TableRow {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface TableProps {
  rows: TableRow[];
  onDelete: (id: string) => void;
  variant?: 'expense' | 'income';
  /** Показати рядок-повідомлення замість даних (завантаження або помилка). */
  message?: string;
}

const MIN_VISIBLE_ROWS = 8;

export const Table = ({ rows, onDelete, variant = 'expense', message }: TableProps) => {
  const { t, i18n } = useTranslation();
  const showMessage = Boolean(message);
  const fillerCount = Math.max(0, MIN_VISIBLE_ROWS - rows.length - (showMessage ? 1 : 0));
  const sign = variant === 'expense' ? '-' : '+';

  return (
    <>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('table.date')}</th>
              <th>{t('table.description')}</th>
              <th>{t('table.category')}</th>
              <th>{t('table.amount')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {showMessage && (
              <tr>
                <td colSpan={5} className={styles.messageCell}>
                  {message}
                </td>
              </tr>
            )}

            {!showMessage &&
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.description}</td>
                  <td>{row.category}</td>
                  <td className={variant === 'expense' ? styles.amountExpense : styles.amountIncome}>
                    {sign} {formatAmount(toDisplayAmount(row.amount, i18n.language))} {t('common.currency')}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onDelete(row.id)}
                      aria-label={t('table.deleteAria')}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                        <path
                          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

            {Array.from({ length: fillerCount }).map((_, index) => (
              <tr key={`filler-${index}`} className={styles.fillerRow}>
                <td colSpan={5}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className={styles.cardList}>
        {showMessage && <li className={styles.cardMessage}>{message}</li>}

        {!showMessage &&
          rows.map((row) => (
            <li key={row.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{row.description}</span>
                <div className={styles.cardRight}>
                  <span
                    className={variant === 'expense' ? styles.cardAmountExpense : styles.cardAmountIncome}
                  >
                    {sign} {formatAmount(toDisplayAmount(row.amount, i18n.language))} {t('common.currency')}
                  </span>
                  <button
                    type="button"
                    className={styles.cardDeleteBtn}
                    onClick={() => onDelete(row.id)}
                    aria-label={t('table.deleteAria')}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                      <path
                        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.cardMeta}>
                <span>{row.date}</span>
                <span>{row.category}</span>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

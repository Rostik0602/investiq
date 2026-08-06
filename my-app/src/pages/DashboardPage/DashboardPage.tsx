import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/Header/Header';
import { UserMenu } from '../../features/auth/components/UserMenu/UserMenu';
import { BalanceBar } from '../../features/balance/components/BalanceBar/BalanceBar';
import { Tabs } from '../../shared/ui/Tabs/Tabs';
import { ExpenseForm } from '../../features/expenses/components/ExpenseForm/ExpenseForm';
import { ExpenseTable } from '../../features/expenses/components/ExpenseTable/ExpenseTable';
import { IncomeForm } from '../../features/income/components/IncomeForm/IncomeForm';
import { IncomeTable } from '../../features/income/components/IncomeTable/IncomeTable';
import { SummaryPanel } from '../../features/summary/components/SummaryPanel/SummaryPanel';
import { ROUTES } from '../../routes/routes';
import styles from './DashboardPage.module.scss';

type EntryTab = 'expenses' | 'income';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<EntryTab>('expenses');

  const TABS = [
    { id: 'expenses', label: t('dashboard.tabs.expenses') },
    { id: 'income', label: t('dashboard.tabs.income') },
  ];

  return (
    <div className={styles.page}>
      <Header rightSlot={<UserMenu />} />

      <main className={styles.content}>
        <BalanceBar
          activeTab={activeTab}
          mobileAction={
            <Link
              to={`${ROUTES.ADD_TRANSACTION}?type=${activeTab}`}
              className={styles.addTransactionBtn}
              aria-label={t('dashboard.addTransactionAria')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          }
        />

        <Tabs items={TABS} activeId={activeTab} onChange={(id) => setActiveTab(id as EntryTab)} />

        <div className={styles.panelCard}>
          <div className={styles.tableColumn}>
            {activeTab === 'expenses' ? (
              <>
                <ExpenseForm />
                <ExpenseTable />
              </>
            ) : (
              <>
                <IncomeForm />
                <IncomeTable />
              </>
            )}
          </div>

          <SummaryPanel activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
};
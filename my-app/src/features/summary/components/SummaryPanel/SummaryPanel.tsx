import { useTranslation } from "react-i18next";
import { useGetMonthlyQuery } from "../../../statistics/statisticsApi";
import { formatAmount } from "../../../../shared/utils/formatAmount";
import { toDisplayAmount } from "../../../../shared/utils/currency";
import styles from "./SummaryPanel.module.scss";

interface SummaryPanelProps {
  activeTab: "expenses" | "income";
}

export const SummaryPanel = ({ activeTab }: SummaryPanelProps) => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { data, isLoading, isError } = useGetMonthlyQuery({
    year: currentYear,
  });

  const rows = (data ?? [])
    .map((entry) => ({
      month: entry.month,
      value: activeTab === "expenses" ? entry.totalExpenses : entry.totalIncome,
    }))
    .filter((entry) => entry.value > 0);

  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>{t("summaryPanel.title")}</h3>

      {isLoading && <p className={styles.empty}>{t("summaryPanel.loading")}</p>}
      {isError && <p className={styles.empty}>{t("summaryPanel.error")}</p>}

      {!isLoading && !isError && (
        <>
          {rows.length > 0 ? (
            <ul className={styles.list}>
              {rows.map(({ month, value }) => (
                <li key={month} className={styles.row}>
                  <span className={styles.month}>{t(`months.${month}`)}</span>
                  <span className={styles.value}>
                    {formatAmount(toDisplayAmount(value, i18n.language))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{t("summaryPanel.empty")}</p>
          )}
        </>
      )}
    </aside>
  );
};

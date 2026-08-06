import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setType } from "../../calculationsSlice";
import { selectCalcPeriod, selectCalcType } from "../../selectors";
import { useGetCategoriesQuery } from "../../../statistics/statisticsApi";
import { getCategoryIcon } from "../../categoryIcons";
import { formatAmount } from "../../../../shared/utils/formatAmount";
import { toDisplayAmount } from "../../../../shared/utils/currency";
import {
  translateExpenseCategory,
  translateIncomeCategory,
} from "../../../../shared/i18n/categories";
import styles from "./CategoryGrid.module.scss";

export const CategoryGrid = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const type = useAppSelector(selectCalcType);
  const { month, year } = useAppSelector(selectCalcPeriod);
  const {
    data: totals,
    isLoading,
    isError,
  } = useGetCategoriesQuery({ month, year, type });

  const toggleType = () => {
    dispatch(setType(type === "expenses" ? "income" : "expenses"));
  };

  const topCategory =
    totals && totals[0] && totals[0].amount > 0 ? totals[0].category : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.arrow}
          onClick={toggleType}
          aria-label={t("calculations.categoryGrid.toggleAria")}
        >
          <ChevronLeft size={18} />
        </button>
        <span className={styles.title}>
          {t(`calculations.categoryGrid.type.${type}`)}
        </span>
        <button
          type="button"
          className={styles.arrow}
          onClick={toggleType}
          aria-label={t("calculations.categoryGrid.toggleAria")}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {isLoading && (
        <p className={styles.state}>{t("calculations.categoryGrid.loading")}</p>
      )}
      {isError && (
        <p className={styles.state}>{t("calculations.categoryGrid.error")}</p>
      )}

      {!isLoading && !isError && (
        <div className={styles.grid}>
          {(totals ?? []).map(({ category, amount }) => {
            const Icon = getCategoryIcon(category);
            const isTop = category === topCategory;
            const categoryLabel =
              type === "expenses"
                ? translateExpenseCategory(t, category)
                : translateIncomeCategory(t, category);

            return (
              <div
                key={category}
                className={clsx(styles.tile, isTop && styles.active)}
              >
                <span className={styles.amount}>
                  {formatAmount(toDisplayAmount(amount, i18n.language))}
                </span>
                <Icon size={42} strokeWidth={1.6} className={styles.icon} />
                <span className={styles.name}>{categoryLabel}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

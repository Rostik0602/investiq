import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { goToPrevMonth, goToNextMonth } from "../../calculationsSlice";
import { selectCalcMonth, selectCalcYear } from "../../selectors";
import styles from "./PeriodSwitcher.module.scss";

export const PeriodSwitcher = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const month = useAppSelector(selectCalcMonth);
  const year = useAppSelector(selectCalcYear);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t("calculations.period.label")}</span>
      <div className={styles.switcher}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => dispatch(goToPrevMonth())}
          aria-label={t("calculations.period.prevAria")}
        >
          <ChevronLeft size={16} />
        </button>

        <span className={styles.period}>
          {t(`months.${month + 1}`)} {year}
        </span>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => dispatch(goToNextMonth())}
          aria-label={t("calculations.period.nextAria")}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

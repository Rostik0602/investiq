import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../../../shared/ui/Button/Button";
import { OnboardingHint } from "../OnboardingHint/OnboardingHint";
import { ROUTES } from "../../../../routes/routes";
import { CalcIcon, CalendarIcon } from "./BalanceBarIcons";
import type { BalanceValueProps } from "./types";
import styles from "./BalanceBar.module.scss";

interface BalanceBarMobileProps extends BalanceValueProps {
  mobileAction?: ReactNode;
  today: string;
  onCalcLinkClick: () => void;
}

export const BalanceBarMobile = ({
  mobileAction,
  today,
  isConfirmed,
  formattedBalance,
  hideOnboardingHint,
  inputValue,
  onInputChange,
  isBalanceLoading,
  isBusy,
  isSubmitting,
  onStartEditing,
  onConfirm,
  editAreaRef,
  editPopover,
  onCalcLinkClick,
}: BalanceBarMobileProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.mobileLayout}>
      <div className={styles.mobileTopRow}>
        <Link to={ROUTES.CALCULATIONS} className={styles.calcLinkMobile} onClick={onCalcLinkClick}>
          {t("balance.goToCalculations")}
          <CalcIcon />
        </Link>
        {mobileAction}
      </div>

      <span className={styles.labelMobile}>{t("balance.label")}</span>

      <div className={styles.groupMobileWrap} ref={editAreaRef}>
        <div className={styles.groupMobile}>
          {isConfirmed ? (
            <>
              <div className={styles.pill}>
                {formattedBalance} {t("common.currency")}
              </div>
              <button
                type="button"
                className={styles.editBtnMobile}
                onClick={onStartEditing}
                aria-label={t("balance.changeAria")}
              >
                <Pencil size={16} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <input
                className={styles.pillInput}
                type="number"
                placeholder={t("balance.placeholder")}
                value={inputValue}
                disabled={isBalanceLoading}
                onChange={(e) => onInputChange(e.target.value)}
              />
              <Button
                type="button"
                variant="primary"
                className={styles.confirmMobileBtn}
                disabled={isBusy}
                isLoading={isSubmitting}
                onClick={onConfirm}
              >
                {t("balance.confirm")}
              </Button>
            </>
          )}
        </div>
        {editPopover}
        {!isConfirmed && !hideOnboardingHint && <OnboardingHint />}
      </div>

      <span className={styles.dateMobile}>
        <CalendarIcon />
        {today}
      </span>
    </div>
  );
};

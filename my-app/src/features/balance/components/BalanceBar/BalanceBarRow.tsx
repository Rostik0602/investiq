import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { OnboardingHint } from "../OnboardingHint/OnboardingHint";
import { ROUTES } from "../../../../routes/routes";
import { CalcIcon } from "./BalanceBarIcons";
import type { BalanceValueProps } from "./types";
import styles from "./BalanceBar.module.scss";

interface BalanceBarRowProps extends BalanceValueProps {
  onCalcLinkClick: () => void;
}

export const BalanceBarRow = ({
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
}: BalanceBarRowProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.row}>
      <div className={styles.group}>
        <span className={styles.label}>{t("balance.label")}</span>

        {isConfirmed ? (
          <div className={styles.valueWithEdit} ref={editAreaRef}>
            <div className={styles.pill}>
              {formattedBalance} {t("common.currency")}
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={onStartEditing}
              aria-label={t("balance.changeAria")}
            >
              <Pencil size={16} strokeWidth={2} />
            </button>
            {editPopover}
          </div>
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
              variant="outline"
              className={styles.confirmBtn}
              disabled={isBusy}
              isLoading={isSubmitting}
              onClick={onConfirm}
            >
              {t("balance.confirm")}
            </Button>
          </>
        )}

        {!isConfirmed && !hideOnboardingHint && <OnboardingHint />}
      </div>

      <Link to={ROUTES.CALCULATIONS} className={styles.calcLink} onClick={onCalcLinkClick}>
        {t("balance.goToCalculations")}
        <CalcIcon />
      </Link>
    </div>
  );
};

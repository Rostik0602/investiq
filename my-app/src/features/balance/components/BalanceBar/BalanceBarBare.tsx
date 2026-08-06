import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Pencil } from "lucide-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { OnboardingHint } from "../OnboardingHint/OnboardingHint";
import type { BalanceValueProps } from "./types";
import styles from "./BalanceBar.module.scss";

interface BalanceBarBareProps extends BalanceValueProps {
  compact: boolean;
}

export const BalanceBarBare = ({
  compact,
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
}: BalanceBarBareProps) => {
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.group, compact && styles.groupCompact)}>
      <span className={clsx(styles.label, compact && styles.labelCompact)}>
        {t("balance.label")}
      </span>

      {isConfirmed ? (
        <div className={styles.valueWithEdit} ref={editAreaRef}>
          <div className={clsx(styles.pill, compact && styles.pillCompact)}>
            {formattedBalance} {t("common.currency")}
          </div>
          <button
            type="button"
            className={clsx(styles.editBtn, compact && styles.editBtnCompact)}
            onClick={onStartEditing}
            aria-label={t("balance.changeAria")}
          >
            <Pencil size={compact ? 13 : 16} strokeWidth={2} />
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
            className={compact ? styles.confirmCompactBtn : styles.confirmBtn}
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
  );
};

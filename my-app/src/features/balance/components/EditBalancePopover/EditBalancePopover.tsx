import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../shared/ui/Button/Button";
import styles from "./EditBalancePopover.module.scss";

interface EditBalancePopoverProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  disabled?: boolean;
}

export const EditBalancePopover = ({
  value,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
  disabled = false,
}: EditBalancePopoverProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.popover}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onCancel}
        aria-label={t("balance.cancelEditAria")}
      >
        <X size={16} strokeWidth={2} />
      </button>

      <label className={styles.label} htmlFor="edit-balance-input">
        {t("balance.newBalance")}
      </label>
      <input
        id="edit-balance-input"
        className={styles.input}
        type="number"
        placeholder={t("balance.placeholder")}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />

      <Button
        type="button"
        variant="primary"
        className={styles.saveBtn}
        disabled={disabled}
        isLoading={isSaving}
        onClick={onSave}
      >
        {t("balance.confirm")}
      </Button>
    </div>
  );
};

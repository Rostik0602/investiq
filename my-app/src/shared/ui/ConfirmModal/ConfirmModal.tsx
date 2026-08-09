import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../Button/Button";
import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  closeAriaLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export const ConfirmModal = ({
  title,
  confirmLabel,
  cancelLabel,
  closeAriaLabel,
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
          aria-label={closeAriaLabel}
        >
          <X size={20} strokeWidth={2} />
        </button>

        <p className={styles.title}>{title}</p>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="primary"
            className={styles.confirmBtn}
            isLoading={isConfirming}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <button
            type="button"
            className={styles.cancelBtn}
            disabled={isConfirming}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

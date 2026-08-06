import type { ReactNode, RefObject } from "react";

export interface BalanceValueProps {
  isConfirmed: boolean;
  formattedBalance: string;
  hideOnboardingHint: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  isBalanceLoading: boolean;
  isBusy: boolean;
  isSubmitting: boolean;
  onStartEditing: () => void;
  onConfirm: () => void;
  editAreaRef: RefObject<HTMLDivElement | null>;
  editPopover: ReactNode;
}

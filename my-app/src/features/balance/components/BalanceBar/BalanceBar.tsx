import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks";
import { useGetBalanceQuery, useSetBalanceMutation } from "../../balanceApi";
import { setType as setCalcType } from "../../../calculations/calculationsSlice";
import { showNotification } from "../../../notification/notificationSlice";
import type { TransactionType } from "../../../calculations/types";
import { EditBalancePopover } from "../EditBalancePopover/EditBalancePopover";
import { formatAmount } from "../../../../shared/utils/formatAmount";
import {
  toDisplayAmount,
  fromDisplayAmount,
} from "../../../../shared/utils/currency";
import { BalanceBarBare } from "./BalanceBarBare";
import { BalanceBarRow } from "./BalanceBarRow";
import { BalanceBarMobile } from "./BalanceBarMobile";
import styles from "./BalanceBar.module.scss";

interface BalanceBarProps {
  mobileAction?: ReactNode;
  hideOnboardingHint?: boolean;
  bare?: boolean;
  compact?: boolean;
  activeTab?: TransactionType;
}

export const BalanceBar = ({
  mobileAction,
  hideOnboardingHint = false,
  bare = false,
  compact = false,
  activeTab = "expenses",
}: BalanceBarProps = {}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useGetBalanceQuery();
  const [setBalance, { isLoading: isSubmitting }] = useSetBalanceMutation();
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const bareEditAreaRef = useRef<HTMLDivElement>(null);
  const rowEditAreaRef = useRef<HTMLDivElement>(null);
  const mobileEditAreaRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("uk-UA");
  const handleCalcLinkClick = () => dispatch(setCalcType(activeTab));

  useEffect(() => {
    if (isBalanceError) {
      dispatch(
        showNotification({ message: t("balance.loadError"), type: "error" }),
      );
    }
  }, [isBalanceError, dispatch]);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = (ref: React.RefObject<HTMLDivElement | null>) =>
        !ref.current || !ref.current.contains(target);

      if (
        isOutside(bareEditAreaRef) &&
        isOutside(rowEditAreaRef) &&
        isOutside(mobileEditAreaRef)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const isConfirmed = balance?.isConfirmed ?? false;
  const totalBalance = balance?.totalBalance ?? 0;
  const isBusy = isBalanceLoading || isSubmitting;

  const formattedBalance = useMemo(
    () => formatAmount(toDisplayAmount(totalBalance, i18n.language)),
    [totalBalance, i18n.language],
  );

  const startEditing = () => {
    if (balance)
      setInputValue(
        String(toDisplayAmount(balance.startingBalance, i18n.language)),
      );
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setInputValue("");
    setIsEditing(false);
  };

  const handleConfirm = async () => {
    const amount = inputValue.trim() === "" ? 0 : Number(inputValue);
    if (Number.isNaN(amount)) return;

    const amountUah = fromDisplayAmount(amount, i18n.language);

    try {
      await setBalance({ startingBalance: amountUah }).unwrap();
      setIsEditing(false);
    } catch {
      dispatch(
        showNotification({ message: t("balance.saveError"), type: "error" }),
      );
    }
  };

  const editPopover = isEditing && (
    <EditBalancePopover
      value={inputValue}
      onChange={setInputValue}
      onSave={handleConfirm}
      onCancel={cancelEditing}
      isSaving={isSubmitting}
      disabled={isBalanceLoading}
    />
  );

  if (bare) {
    return (
      <BalanceBarBare
        compact={compact}
        isConfirmed={isConfirmed}
        formattedBalance={formattedBalance}
        hideOnboardingHint={hideOnboardingHint}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isBalanceLoading={isBalanceLoading}
        isBusy={isBusy}
        isSubmitting={isSubmitting}
        onStartEditing={startEditing}
        onConfirm={handleConfirm}
        editAreaRef={bareEditAreaRef}
        editPopover={editPopover}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <BalanceBarRow
        isConfirmed={isConfirmed}
        formattedBalance={formattedBalance}
        hideOnboardingHint={hideOnboardingHint}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isBalanceLoading={isBalanceLoading}
        isBusy={isBusy}
        isSubmitting={isSubmitting}
        onStartEditing={startEditing}
        onConfirm={handleConfirm}
        editAreaRef={rowEditAreaRef}
        editPopover={editPopover}
        onCalcLinkClick={handleCalcLinkClick}
      />

      <BalanceBarMobile
        mobileAction={mobileAction}
        today={today}
        isConfirmed={isConfirmed}
        formattedBalance={formattedBalance}
        hideOnboardingHint={hideOnboardingHint}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isBalanceLoading={isBalanceLoading}
        isBusy={isBusy}
        isSubmitting={isSubmitting}
        onStartEditing={startEditing}
        onConfirm={handleConfirm}
        editAreaRef={mobileEditAreaRef}
        editPopover={editPopover}
        onCalcLinkClick={handleCalcLinkClick}
      />
    </div>
  );
};

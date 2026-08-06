import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../app/hooks';
import { useGetBalanceQuery, useSetBalanceMutation } from '../../balanceApi';
import { setType as setCalcType } from '../../../calculations/calculationsSlice';
import { showNotification } from '../../../notification/notificationSlice';
import type { TransactionType } from '../../../calculations/types';
import { Button } from '../../../../shared/ui/Button/Button';
import { EditBalancePopover } from '../EditBalancePopover/EditBalancePopover';
import { OnboardingHint } from '../OnboardingHint/OnboardingHint';
import { ROUTES } from '../../../../routes/routes';
import { formatAmount } from '../../../../shared/utils/formatAmount';
import { toDisplayAmount, fromDisplayAmount } from '../../../../shared/utils/currency';
import styles from './BalanceBar.module.scss';

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" />
    <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

interface BalanceBarProps {
  mobileAction?: ReactNode;
  hideOnboardingHint?: boolean;
  /** Renders just the "Баланс: [value] [Підтвердити]" group, without the
   * calc-link/date chrome — for reuse on pages that build their own layout
   * around it (e.g. CalculationsPage). */
  bare?: boolean;
  /** Slightly smaller pill/button, so the bare group takes less horizontal
   * space when it has to share a row with other elements. */
  compact?: boolean;
  /** Currently selected Dashboard tab (expenses/income) — synced into
   * calculationsSlice when navigating to Розрахунки, so it opens showing
   * the same type the user had selected on the Dashboard. */
  activeTab?: TransactionType;
}

export const BalanceBar = ({
  mobileAction,
  hideOnboardingHint = false,
  bare = false,
  compact = false,
  activeTab = 'expenses',
}: BalanceBarProps = {}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: balance, isLoading: isBalanceLoading, isError: isBalanceError } = useGetBalanceQuery();
  const [setBalance, { isLoading: isSubmitting }] = useSetBalanceMutation();
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // Три окремих ref, а не один: .row і .mobileLayout існують у DOM
  // ОДНОЧАСНО (перемикаються через CSS display, не умовний рендер), тому
  // спільний ref просто перезаписувався б останнім змонтованим і ламав
  // click-outside для іншого варіанта.
  const bareEditAreaRef = useRef<HTMLDivElement>(null);
  const rowEditAreaRef = useRef<HTMLDivElement>(null);
  const mobileEditAreaRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString('uk-UA');
  const handleCalcLinkClick = () => dispatch(setCalcType(activeTab));

  useEffect(() => {
    if (isBalanceError) {
      dispatch(showNotification({ message: t('balance.loadError'), type: 'error' }));
    }
  }, [isBalanceError, dispatch]);

  // Клік поза попапом редагування закриває його без збереження — звичний
  // патерн для попапів, щоб не змушувати юзера щоразу тицяти в "×".
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = (ref: React.RefObject<HTMLDivElement | null>) =>
        !ref.current || !ref.current.contains(target);

      if (isOutside(bareEditAreaRef) && isOutside(rowEditAreaRef) && isOutside(mobileEditAreaRef)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  const isConfirmed = balance?.isConfirmed ?? false;
  const totalBalance = balance?.totalBalance ?? 0;
  const isBusy = isBalanceLoading || isSubmitting;

  const startEditing = () => {
    if (balance) setInputValue(String(toDisplayAmount(balance.startingBalance, i18n.language)));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setInputValue('');
    setIsEditing(false);
  };

  const handleConfirm = async () => {
    // Порожнє поле — це 0, а не "нічого не робити": і при першому
    // встановленні балансу, і при редагуванні порожній інпут має
    // трактуватись як свідомий нуль.
    const amount = inputValue.trim() === '' ? 0 : Number(inputValue);
    if (Number.isNaN(amount)) return;

    const amountUah = fromDisplayAmount(amount, i18n.language);

    try {
      await setBalance({ startingBalance: amountUah }).unwrap();
      setIsEditing(false);
    } catch {
      dispatch(showNotification({ message: t('balance.saveError'), type: 'error' }));
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
      <div className={clsx(styles.group, compact && styles.groupCompact)}>
        <span className={clsx(styles.label, compact && styles.labelCompact)}>
          {t('balance.label')}
        </span>

        {isConfirmed ? (
          <div className={styles.valueWithEdit} ref={bareEditAreaRef}>
            <div className={clsx(styles.pill, compact && styles.pillCompact)}>
              {formatAmount(toDisplayAmount(totalBalance, i18n.language))} {t('common.currency')}
            </div>
            <button
              type="button"
              className={clsx(styles.editBtn, compact && styles.editBtnCompact)}
              onClick={startEditing}
              aria-label={t('balance.changeAria')}
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
              placeholder={t('balance.placeholder')}
              value={inputValue}
              disabled={isBalanceLoading}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className={compact ? styles.confirmCompactBtn : styles.confirmBtn}
              disabled={isBusy}
              isLoading={isSubmitting}
              onClick={handleConfirm}
            >
              {t('balance.confirm')}
            </Button>
          </>
        )}

        {!isConfirmed && !hideOnboardingHint && <OnboardingHint />}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Tablet/desktop: single row */}
      <div className={styles.row}>
        <div className={styles.group}>
          <span className={styles.label}>{t('balance.label')}</span>

          {isConfirmed ? (
            <div className={styles.valueWithEdit} ref={rowEditAreaRef}>
              <div className={styles.pill}>{formatAmount(toDisplayAmount(totalBalance, i18n.language))} {t('common.currency')}</div>
              <button
                type="button"
                className={styles.editBtn}
                onClick={startEditing}
                aria-label={t('balance.changeAria')}
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
                placeholder={t('balance.placeholder')}
                value={inputValue}
                disabled={isBalanceLoading}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className={styles.confirmBtn}
                disabled={isBusy}
                isLoading={isSubmitting}
                onClick={handleConfirm}
              >
                {t('balance.confirm')}
              </Button>
            </>
          )}

          {!isConfirmed && !hideOnboardingHint && <OnboardingHint />}
        </div>

        <Link to={ROUTES.CALCULATIONS} className={styles.calcLink} onClick={handleCalcLinkClick}>
          {t('balance.goToCalculations')}
          <CalcIcon />
        </Link>
      </div>

      {/* Mobile: stacked, centered */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileTopRow}>
          <Link
            to={ROUTES.CALCULATIONS}
            className={styles.calcLinkMobile}
            onClick={handleCalcLinkClick}
          >
            {t('balance.goToCalculations')}
            <CalcIcon />
          </Link>
          {mobileAction}
        </div>

        <span className={styles.labelMobile}>{t('balance.label')}</span>

        <div className={styles.groupMobileWrap} ref={mobileEditAreaRef}>
          <div className={styles.groupMobile}>
            {isConfirmed ? (
              <>
                <div className={styles.pill}>{formatAmount(toDisplayAmount(totalBalance, i18n.language))} {t('common.currency')}</div>
                <button
                  type="button"
                  className={styles.editBtnMobile}
                  onClick={startEditing}
                  aria-label={t('balance.changeAria')}
                >
                  <Pencil size={16} strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                <input
                  className={styles.pillInput}
                  type="number"
                  placeholder={t('balance.placeholder')}
                  value={inputValue}
                  disabled={isBalanceLoading}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                  type="button"
                  variant="primary"
                  className={styles.confirmMobileBtn}
                  disabled={isBusy}
                  isLoading={isSubmitting}
                  onClick={handleConfirm}
                >
                  {t('balance.confirm')}
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
    </div>
  );
};

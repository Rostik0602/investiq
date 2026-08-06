import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Button.module.scss';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? t('common.pleaseWait') : children}
    </button>
  );
};
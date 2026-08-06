import {type InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  /** 'border' (за замовчуванням) — червона рамка навколо поля. 'background' —
   * легкий червонуватий фон замість рамки, для полів усередині спільної
   * заокругленої групи (ExpenseForm/IncomeForm .pageFieldsGroup) — там
   * прямокутна рамка окремого поля виглядає криво на заокруглених кутах
   * групи і перетинається з роздільниками між полями. */
  errorVariant?: 'border' | 'background';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, touched, errorVariant = 'border', className, id, ...rest }, ref) => {
    const showError = Boolean(touched && error);
    const errorClassName = errorVariant === 'background' ? styles.inputErrorBg : styles.inputError;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={clsx(styles.input, showError && errorClassName, className)}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

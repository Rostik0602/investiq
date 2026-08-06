import { type SelectHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Select.module.scss";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  error?: string;
  touched?: boolean;
  errorVariant?: "border" | "background";
}

export const Select = ({
  options,
  placeholder,
  error,
  touched,
  errorVariant = "border",
  className,
  value,
  ...rest
}: SelectProps) => {
  const showError = Boolean(touched && error);
  const isPlaceholderShown = !value;
  const errorClassName =
    errorVariant === "background" ? styles.selectErrorBg : styles.selectError;

  return (
    <div className={styles.wrapper}>
      <select
        value={value}
        className={clsx(
          styles.select,
          isPlaceholderShown && styles.placeholder,
          showError && errorClassName,
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

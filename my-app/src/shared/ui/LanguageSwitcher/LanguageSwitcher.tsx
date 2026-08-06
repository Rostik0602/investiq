import { useTranslation } from "react-i18next";
import clsx from "clsx";
import styles from "./LanguageSwitcher.module.scss";

const LANGUAGES = [
  { code: "en", labelKey: "language.en" },
  { code: "uk", labelKey: "language.uk" },
] as const;

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  return (
    <div className={styles.switcher}>
      {LANGUAGES.map(({ code, labelKey }, index) => (
        <span key={code} className={styles.item}>
          {index > 0 && <span className={styles.divider} aria-hidden="true" />}
          <button
            type="button"
            className={clsx(
              styles.langBtn,
              i18n.language === code && styles.active,
            )}
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={i18n.language === code}
          >
            {t(labelKey)}
          </button>
        </span>
      ))}
    </div>
  );
};

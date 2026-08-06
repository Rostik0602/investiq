import { type ReactNode } from 'react';
import { LanguageSwitcher } from '../../shared/ui/LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.scss';

interface HeaderProps {
  rightSlot?: ReactNode;
}

export const Header = ({ rightSlot }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>INVESTIQ</span>
      </div>
      <LanguageSwitcher />
      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
    </header>
  );
};
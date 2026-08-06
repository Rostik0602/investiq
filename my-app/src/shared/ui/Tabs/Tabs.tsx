import clsx from 'clsx';
import styles from './Tabs.module.scss';

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ items, activeId, onChange }: TabsProps) => {
  return (
    <div className={styles.tabs}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={clsx(styles.tab, item.id === activeId && styles.active)}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
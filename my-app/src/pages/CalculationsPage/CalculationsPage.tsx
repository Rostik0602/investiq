import { Header } from "../../components/Header/Header";
import { UserMenu } from "../../features/auth/components/UserMenu/UserMenu";
import { TopBar } from "../../features/calculations/components/TopBar/TopBar";
import { SummaryBar } from "../../features/calculations/components/SummaryBar/SummaryBar";
import { CategoryGrid } from "../../features/calculations/components/CategoryGrid/CategoryGrid";
import { CategoryChart } from "../../features/calculations/components/CategoryChart/CategoryChart";
import styles from "./CalculationsPage.module.scss";

export const CalculationsPage = () => {
  return (
    <div className={styles.page}>
      <Header rightSlot={<UserMenu />} />

      <main className={styles.content}>
        <TopBar />
        <SummaryBar />
        <CategoryGrid />
        <CategoryChart />
      </main>
    </div>
  );
};

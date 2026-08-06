import clsx from 'clsx';
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../app/hooks';
import { selectCalcPeriod, selectCalcType } from '../../selectors';
import { useGetBreakdownQuery } from '../../../statistics/statisticsApi';
import { formatAmount } from '../../../../shared/utils/formatAmount';
import { toDisplayAmount } from '../../../../shared/utils/currency';
import { useIsMobile } from '../../../../shared/utils/useIsMobile';
import styles from './CategoryChart.module.scss';

const PRIMARY = '#ff7a1a';
const MUTED = '#ffd0af';
const BAR_WIDTH = 64;
const BAR_GAP = 20;
const CHART_HEIGHT = 360;
const CHART_TOP_MARGIN = 24;
const CHART_BOTTOM_RESERVED = 46; // margin.bottom (8) + приблизна висота підписів осі X

export const CategoryChart = () => {
  const { t, i18n } = useTranslation();
  const type = useAppSelector(selectCalcType);
  const { month, year } = useAppSelector(selectCalcPeriod);
  const { data, isLoading, isError } = useGetBreakdownQuery({ month, year, type });
  const isMobile = useIsMobile();
  const formatBarLabel = (value: string | number | boolean | null | undefined) =>
    `${formatAmount(toDisplayAmount(Number(value ?? 0), i18n.language)).split('.')[0]} ${t('common.currency')}`;

  if (isLoading) {
    return (
      <div className={isMobile ? styles.mobileCard : styles.card}>
        <p className={styles.empty}>{t('calculations.categoryChart.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={isMobile ? styles.mobileCard : styles.card}>
        <p className={styles.empty}>{t('calculations.categoryChart.error')}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={isMobile ? styles.mobileCard : styles.card}>
        <p className={styles.empty}>
          {type === 'expenses'
            ? t('calculations.categoryChart.emptyExpenses')
            : t('calculations.categoryChart.emptyIncome')}
        </p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((item) => item.amount));

  if (isMobile) {
    // Mobile: назва і сума стоять РЯДКОМ НАД смугою (не збоку від неї, як у
    // recharts-осі), тому тут звичайна HTML/CSS розмітка замість BarChart
    return (
      <div className={styles.mobileCard}>
        <ul className={styles.barList}>
          {data.map((item, index) => (
            <li key={item.description} className={styles.barRow}>
              <div className={styles.barHeader}>
                <span className={styles.barName}>{item.description}</span>
                <span className={styles.barValue}>{formatBarLabel(item.amount)}</span>
              </div>
              <div
                className={clsx(styles.barFill, index % 3 === 0 && styles.barFillPrimary)}
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Ширина рахується від кількості стовпців, а не розтягується на всю
  // карту — інакше при малій кількості даних стовпці "розʼїжджаються"
  const chartWidth = data.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;

  return (
    <div className={styles.card}>
      <div className={styles.chartArea} style={{ height: CHART_HEIGHT }}>
        <div
          className={styles.gridlines}
          style={{ top: CHART_TOP_MARGIN, bottom: CHART_BOTTOM_RESERVED }}
        />

        <div className={styles.chartWrapper}>
          <BarChart
            width={chartWidth}
            height={CHART_HEIGHT}
            data={data}
            margin={{ top: 24, right: 8, left: 8, bottom: 8 }}
            barCategoryGap={BAR_GAP}
          >
            <XAxis
              dataKey="description"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b6b76' }}
            />
            <YAxis hide domain={[0, maxAmount * 1.1]} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={BAR_WIDTH} isAnimationActive={false}>
              <LabelList
                dataKey="amount"
                position="top"
                formatter={formatBarLabel}
                style={{ fontSize: 12, fill: '#14141c', fontWeight: 700 }}
              />
              {data.map((entry, index) => (
                <Cell key={entry.description} fill={index % 3 === 0 ? PRIMARY : MUTED} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

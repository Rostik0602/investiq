export const STATISTICS_TYPES = ['expenses', 'income'] as const;
export type StatisticsType = (typeof STATISTICS_TYPES)[number];

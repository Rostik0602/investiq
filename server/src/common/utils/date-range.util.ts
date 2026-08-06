// Builds a [start, end) UTC range for a given 1-indexed month/year, used
// to filter `date >= start AND date < end` — half-open so it can't
// accidentally include the first instant of the next month.
export const monthDateRange = (month: number, year: number): { start: Date; end: Date } => {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return { start, end };
};

export const yearDateRange = (year: number): { start: Date; end: Date } => {
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));
  return { start, end };
};

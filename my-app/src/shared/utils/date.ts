export const formatIsoDateForDisplay = (iso: string): string =>
  new Date(iso).toLocaleDateString("uk-UA");

export const todayAsIsoDate = (): string => new Date().toISOString();

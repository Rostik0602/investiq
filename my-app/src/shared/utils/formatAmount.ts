export const formatAmount = (value: number): string => {
  const [intPart, decPart] = value.toFixed(2).split('.');
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${withSpaces}.${decPart}`;
};

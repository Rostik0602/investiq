export const USD_TO_UAH_RATE = 41.5;

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const toDisplayAmount = (amountUah: number, language: string): number =>
  language === "en" ? round2(amountUah / USD_TO_UAH_RATE) : amountUah;

export const fromDisplayAmount = (
  enteredAmount: number,
  language: string,
): number =>
  language === "en" ? round2(enteredAmount * USD_TO_UAH_RATE) : enteredAmount;

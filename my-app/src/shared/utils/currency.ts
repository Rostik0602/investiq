// Фіксований курс — просте, передбачуване рішення без мережевих запитів.
// Щоб оновити курс, достатньо змінити це одне число.
export const USD_TO_UAH_RATE = 41.5;

const round2 = (value: number): number => Math.round(value * 100) / 100;

// Бекенд завжди зберігає суми в UAH (як і категорії — див. shared/i18n/categories.ts).
// Ці функції конвертують лише для відображення/вводу в англійському інтерфейсі,
// самі дані на бекенді залишаються в UAH.
export const toDisplayAmount = (amountUah: number, language: string): number =>
  language === 'en' ? round2(amountUah / USD_TO_UAH_RATE) : amountUah;

export const fromDisplayAmount = (enteredAmount: number, language: string): number =>
  language === 'en' ? round2(enteredAmount * USD_TO_UAH_RATE) : enteredAmount;

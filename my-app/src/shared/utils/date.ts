// Бэкенд хранит і повертає дати в ISO 8601 (UTC instant); на фронте всюди
// показуємо dd.mm.yyyy. Форматуємо в ЛОКАЛЬНОМУ часовому поясі браузера —
// той самий пояс, у якому "todayAsIsoDate" узяв поточну дату при створенні
// запису, тому дата в таблиці завжди збігається з тим, що юзер бачив у
// полі "today" у момент додавання (примусовий UTC тут зсунув би дату на
// сусідній день для будь-кого в часовому поясі попереду UTC).
export const formatIsoDateForDisplay = (iso: string): string => new Date(iso).toLocaleDateString('uk-UA');

export const todayAsIsoDate = (): string => new Date().toISOString();

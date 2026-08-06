import type { LucideIcon } from 'lucide-react';
import {
  ShoppingBasket,
  Wine,
  PartyPopper,
  HeartHandshake,
  Car,
  Sofa,
  Wrench,
  Receipt,
  Dumbbell,
  BookOpen,
  MoreHorizontal,
  Wallet,
  Laptop,
  Gift,
  TrendingUp,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Продукти: ShoppingBasket,
  Алкоголь: Wine,
  Розваги: PartyPopper,
  "Здоров'я": HeartHandshake,
  Транспорт: Car,
  'Все для дому': Sofa,
  Техніка: Wrench,
  "Комуналка, зв'язок": Receipt,
  'Спорт, хобі': Dumbbell,
  Навчання: BookOpen,
  Зарплата: Wallet,
  Фріланс: Laptop,
  Подарунок: Gift,
  Інвестиції: TrendingUp,
  Інше: MoreHorizontal,
};

export const getCategoryIcon = (category: string): LucideIcon => CATEGORY_ICONS[category] ?? MoreHorizontal;

import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../app/hooks';
import { useDeleteExpenseMutation, useGetExpensesQuery } from '../../expensesApi';
import { showNotification } from '../../../notification/notificationSlice';
import { formatIsoDateForDisplay } from '../../../../shared/utils/date';
import { translateExpenseCategory } from '../../../../shared/i18n/categories';
import { Table } from '../../../../shared/ui/Table/Table';

export const ExpenseTable = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: expenses, isLoading, isError } = useGetExpensesQuery();
  const [deleteExpense] = useDeleteExpenseMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id).unwrap();
    } catch {
      dispatch(showNotification({ message: t('expenseTable.deleteError'), type: 'error' }));
    }
  };

  let message: string | undefined;
  if (isLoading) message = t('expenseTable.loading');
  else if (isError) message = t('expenseTable.error');
  else if (!expenses || expenses.length === 0) message = t('expenseTable.empty');

  const rows = (expenses ?? []).map((item) => ({
    ...item,
    category: translateExpenseCategory(t, item.category),
    date: formatIsoDateForDisplay(item.date),
  }));

  return <Table rows={rows} onDelete={handleDelete} variant="expense" message={message} />;
};

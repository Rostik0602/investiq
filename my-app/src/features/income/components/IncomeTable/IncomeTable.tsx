import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks";
import { useDeleteIncomeMutation, useGetIncomeQuery } from "../../incomeApi";
import { showNotification } from "../../../notification/notificationSlice";
import { formatIsoDateForDisplay } from "../../../../shared/utils/date";
import { translateIncomeCategory } from "../../../../shared/i18n/categories";
import { Table } from "../../../../shared/ui/Table/Table";

export const IncomeTable = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: income, isLoading, isError } = useGetIncomeQuery();
  const [deleteIncome] = useDeleteIncomeMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome(id).unwrap();
    } catch {
      dispatch(
        showNotification({
          message: t("incomeTable.deleteError"),
          type: "error",
        }),
      );
    }
  };

  let message: string | undefined;
  if (isLoading) message = t("incomeTable.loading");
  else if (isError) message = t("incomeTable.error");
  else if (!income || income.length === 0) message = t("incomeTable.empty");

  const rows = (income ?? []).map((item) => ({
    ...item,
    category: translateIncomeCategory(t, item.category),
    date: formatIsoDateForDisplay(item.date),
  }));

  return (
    <Table
      rows={rows}
      onDelete={handleDelete}
      variant="income"
      message={message}
    />
  );
};

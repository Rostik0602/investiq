import { useFormik } from "formik";
import * as Yup from "yup";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks";
import { useAddExpenseMutation } from "../../expensesApi";
import { showNotification } from "../../../notification/notificationSlice";
import { EXPENSE_CATEGORIES } from "../../types";
import { todayAsIsoDate } from "../../../../shared/utils/date";
import { translateExpenseCategory } from "../../../../shared/i18n/categories";
import { fromDisplayAmount } from "../../../../shared/utils/currency";
import { Input } from "../../../../shared/ui/Input/Input";
import { Select } from "../../../../shared/ui/Select/Select";
import { Button } from "../../../../shared/ui/Button/Button";
import styles from "./ExpenseForm.module.scss";

const validationSchema = Yup.object({
  description: Yup.string().required("Обов'язкове поле"),
  category: Yup.string().required("Обов'язкове поле"),
  amount: Yup.number()
    .typeError("Введіть число")
    .positive("Сума має бути більше 0")
    .required("Обов'язкове поле"),
});

interface ExpenseFormProps {
  standalone?: boolean;
  onDone?: () => void;
}

export const ExpenseForm = ({
  standalone = false,
  onDone,
}: ExpenseFormProps = {}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [addExpense, { isLoading }] = useAddExpenseMutation();
  const today = new Date().toLocaleDateString("uk-UA");
  const categoryOptions = useMemo(
    () =>
      EXPENSE_CATEGORIES.map((c) => ({
        value: c,
        label: translateExpenseCategory(t, c),
      })),
    [t],
  );

  const formik = useFormik({
    initialValues: { description: "", category: "", amount: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addExpense({
          description: values.description,
          category: values.category,
          amount: fromDisplayAmount(Number(values.amount), i18n.language),
          date: todayAsIsoDate(),
        }).unwrap();
        resetForm();
        onDone?.();
      } catch {
        dispatch(
          showNotification({
            message: t("transactionForm.expenseSaveError"),
            type: "error",
          }),
        );
      }
    },
  });

  if (standalone) {
    return (
      <form className={styles.formPage} onSubmit={formik.handleSubmit}>
        <div className={styles.pageFieldsGroup}>
          <Input
            name="description"
            placeholder={t("transactionForm.expenseDescriptionPlaceholder")}
            className={styles.pageInput}
            errorVariant="background"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.description}
            touched={formik.touched.description}
          />

          <Select
            name="category"
            placeholder={t("transactionForm.expenseCategoryPlaceholder")}
            className={styles.pageInput}
            errorVariant="background"
            options={categoryOptions}
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.category}
            touched={formik.touched.category}
          />
        </div>

        <div className={styles.pageAmountGroup}>
          <Input
            name="amount"
            type="number"
            placeholder={t("balance.placeholder")}
            className={styles.pageAmountInput}
            errorVariant="background"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.amount}
            touched={formik.touched.amount}
          />
          <span className={styles.calcBtn} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <rect
                x="4"
                y="2"
                width="16"
                height="20"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <rect
                x="7"
                y="5"
                width="10"
                height="4"
                rx="1"
                fill="currentColor"
              />
              <circle cx="8" cy="13" r="1" fill="currentColor" />
              <circle cx="12" cy="13" r="1" fill="currentColor" />
              <circle cx="16" cy="13" r="1" fill="currentColor" />
              <circle cx="8" cy="17" r="1" fill="currentColor" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
              <circle cx="16" cy="17" r="1" fill="currentColor" />
            </svg>
          </span>
        </div>

        <div className={styles.pageActions}>
          <Button
            type="submit"
            variant="primary"
            className={styles.submitBtn}
            isLoading={isLoading}
          >
            {t("transactionForm.submit")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={styles.clearBtn}
            onClick={() => formik.resetForm()}
          >
            {t("transactionForm.clear")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <span className={styles.date}>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M8 3v3M16 3v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        {today}
      </span>

      <div className={styles.description}>
        <Input
          name="description"
          placeholder={t("transactionForm.expenseDescriptionPlaceholder")}
          className={styles.fieldInput}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.description}
          touched={formik.touched.description}
        />
      </div>

      <div className={styles.category}>
        <Select
          name="category"
          placeholder={t("transactionForm.expenseCategoryPlaceholder")}
          className={styles.fieldInput}
          options={categoryOptions}
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.category}
          touched={formik.touched.category}
        />
      </div>

      <div className={styles.amount}>
        <div className={styles.amountFieldWrap}>
          <Input
            name="amount"
            type="number"
            placeholder="0.00"
            className={styles.amountInput}
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.amount}
            touched={formik.touched.amount}
          />
          <span className={styles.calcIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <rect
                x="4"
                y="2"
                width="16"
                height="20"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <rect
                x="7"
                y="5"
                width="10"
                height="4"
                rx="1"
                fill="currentColor"
              />
              <circle cx="8" cy="13" r="1" fill="currentColor" />
              <circle cx="12" cy="13" r="1" fill="currentColor" />
              <circle cx="16" cy="13" r="1" fill="currentColor" />
              <circle cx="8" cy="17" r="1" fill="currentColor" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
              <circle cx="16" cy="17" r="1" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          className={styles.submitBtn}
          isLoading={isLoading}
        >
          {t("transactionForm.submit")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={styles.clearBtn}
          onClick={() => formik.resetForm()}
        >
          {t("transactionForm.clear")}
        </Button>
      </div>
    </form>
  );
};

import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Input } from "../../../../shared/ui/Input/Input";
import { AuthTabs } from "../AuthTabs/AuthTabs";
import styles from "./AuthForm.module.scss";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Некоректна електронна пошта")
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .matches(
      /(?=.*[A-Za-z])(?=.*\d)/,
      "Пароль має містити принаймні одну літеру та одну цифру",
    )
    .required("Обов'язкове поле"),
});

interface AuthFormProps {
  onLogin: (values: { email: string; password: string }) => void;
  onRegister: (values: { email: string; password: string }) => void;
  isLoginLoading?: boolean;
  isRegisterLoading?: boolean;
}

export const AuthForm = ({
  onLogin,
  onRegister,
  isLoginLoading,
  isRegisterLoading,
}: AuthFormProps) => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: () => {},
  });

  const handleAction = async (action: "login" | "register") => {
    const errors = await formik.validateForm();
    formik.setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    if (action === "login") {
      onLogin(formik.values);
    } else {
      onRegister(formik.values);
    }
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <Input
        id="email"
        name="email"
        type="email"
        label={t("auth.emailLabel")}
        placeholder="your@email.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.email}
        touched={formik.touched.email}
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={t("auth.passwordLabel")}
        placeholder={t("auth.passwordPlaceholder")}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.password}
        touched={formik.touched.password}
      />

      <AuthTabs
        onLoginClick={() => handleAction("login")}
        onRegisterClick={() => handleAction("register")}
        isLoginLoading={isLoginLoading}
        isRegisterLoading={isRegisterLoading}
      />
    </form>
  );
};

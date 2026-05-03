import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../../stores";
import styles from "./signup.module.css";

const SignupPage = observer(() => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "student",
  });

  const [localErrors, setLocalErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    if (authStore.isAuthenticated && authStore.user) {
      navigate(authStore.redirectPath, { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Имя обязательно";
    }

    if (!formData.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Некорректный email";
    }

    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      errors.password = "Пароль должен быть не менее 8 символов";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverErrors[name]) {
      setServerErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (authStore.error) {
      authStore.clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalErrors({});
    setServerErrors({});

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }

    const result = await authStore.signup(formData);

    if (result.success) {
      // Редирект в зависимости от роли
      navigate(authStore.redirectPath, { replace: true });
    } else {
      if (result.serverErrors) {
        setServerErrors(result.serverErrors);
      }
    }
  };

  const displayErrors = { ...localErrors, ...serverErrors };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Создание аккаунта</h2>
          <p className={styles.subtitle}>
            Или{" "}
            <Link to="/login" className={styles.link}>
              войдите в существующий аккаунт
            </Link>
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {authStore.error && !Object.keys(serverErrors).length && (
            <div className={styles.globalError}>
              <h3 className={styles.errorTitle}>{authStore.error}</h3>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="name" className={styles.srOnly}>
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${displayErrors.name ? styles.inputError : ""}`}
                placeholder="Полное имя"
              />
              {displayErrors.name && (
                <p className={styles.fieldError}>{displayErrors.name}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="email" className={styles.srOnly}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${displayErrors.email ? styles.inputError : ""}`}
                placeholder="Email"
              />
              {displayErrors.email && (
                <p className={styles.fieldError}>{displayErrors.email}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="password" className={styles.srOnly}>
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.input} ${displayErrors.password ? styles.inputError : ""}`}
                placeholder="Пароль (минимум 8 символов)"
              />
              {displayErrors.password && (
                <p className={styles.fieldError}>{displayErrors.password}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="roleName" className={styles.srOnly}>
                Роль
              </label>
              <select
                id="roleName"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                className={`${styles.input} ${styles.selectInput}`}
              >
                <option value="student">Ученик</option>
                <option value="teacher">Учитель</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authStore.isLoading}
              className={styles.button}
            >
              {authStore.isLoading ? (
                <>
                  <svg
                    className={styles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={styles.spinnerCircle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className={styles.spinnerPath}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Создание аккаунта...
                </>
              ) : (
                "Зарегистрироваться"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default SignupPage;

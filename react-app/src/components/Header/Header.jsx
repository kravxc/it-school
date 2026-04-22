import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores";
import styles from "./header.module.css";

const Header = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/courses" && location.pathname.startsWith("/courses"))
      return true;
    if (path === "/login" && location.pathname === "/login") return true;
    if (path === "/signup" && location.pathname === "/signup") return true;
    return false;
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    if (notificationCount > 0 && !showNotification) {
      setNotificationCount(0);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const getUserInitials = () => {
    if (!authStore.user?.name) return "?";
    return authStore.user.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Link to="/" className={styles.logo}>
            <i className="fas fa-cloud-upload-alt"></i>
            <span>
              IT.Портал <small>│ классы 9–11</small>
            </span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/" className={isActive("/") ? styles.active : ""}>
              Главная
            </Link>

            {authStore.isAuthenticated && (
              <Link
                to="/courses"
                className={isActive("/courses") ? styles.active : ""}
              >
                Мои курсы
              </Link>
            )}

            {!authStore.isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={isActive("/login") ? styles.active : ""}
                >
                  Вход
                </Link>
                <Link
                  to="/signup"
                  className={isActive("/signup") ? styles.active : ""}
                >
                  Регистрация
                </Link>
              </>
            ) : null}
          </div>

          <div className={styles.userArea}>
            {authStore.isAuthenticated && (
              <>
                <div
                  className={styles.notificationBadge}
                  onClick={handleNotificationClick}
                >
                  <i className="far fa-bell"></i>
                  {notificationCount > 0 && (
                    <span className={styles.count}>{notificationCount}</span>
                  )}
                </div>

                {showNotification && (
                  <div className={styles.notificationDropdown}>
                    <div className={styles.notificationItem}>
                      <i className="fas fa-file-upload"></i>
                      <span>Новое задание: Python основы</span>
                    </div>
                    <div className={styles.notificationItem}>
                      <i className="fas fa-check-circle"></i>
                      <span>Проверена работа: SQL JOIN</span>
                    </div>
                    <div className={styles.notificationItem}>
                      <i className="fas fa-comment"></i>
                      <span>Комментарий от учителя</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {authStore.isAuthenticated && (
              <div className={styles.userMenuWrapper}>
                <div
                  className={styles.avatar}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={authStore.user?.name}
                >
                  {getUserInitials()}
                </div>

                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>
                        {authStore.user?.name}
                      </div>
                      <div className={styles.userEmail}>
                        {authStore.user?.email}
                      </div>
                      <div className={styles.userRole}>
                        {authStore.isTeacher
                          ? "Учитель"
                          : authStore.isAdmin
                            ? "Администратор"
                            : "Ученик"}
                        {authStore.gradeDisplayName &&
                          ` · ${authStore.gradeDisplayName}`}
                      </div>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-user"></i>
                      <span>Профиль</span>
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;

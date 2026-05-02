import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { authStore } from "../../stores";
import styles from "./profile.module.css";

const ProfilePage = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authStore.user?.name || "",
    email: authStore.user?.email || "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // редактирование профиля
      setSuccessMessage("Профиль успешно обновлен");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: authStore.user?.name || "",
      email: authStore.user?.email || "",
    });
    setIsEditing(false);
  };

  const user = authStore.user;

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    const roles = {
      admin: "Администратор",
      teacher: "Учитель",
      student: "Ученик",
    };
    return roles[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Профиль</span>
        </div>

        <div className={styles.profileLayout}>
          <div className={styles.sidebar}>
            <div className={styles.avatarCard}>
              <div className={styles.avatar}>
                {user.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "?"}
              </div>
              <h2>{user.name}</h2>
              <span className={styles.roleBadge}>
                {getRoleLabel(user.role)}
              </span>
              {user.gradeDisplayName && (
                <span className={styles.gradeBadge}>
                  <i className="fas fa-graduation-cap"></i>
                  {user.gradeDisplayName}
                </span>
              )}
            </div>
          </div>

          <div className={styles.main}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3>Личная информация</h3>
                {!isEditing && (
                  <button
                    className={styles.editBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                )}
              </div>

              {successMessage && (
                <div className={styles.successMsg}>
                  <i className="fas fa-check-circle"></i>
                  {successMessage}
                </div>
              )}

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label>Имя</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div className={styles.field}>
                  <label>Роль</label>
                  <p>{getRoleLabel(user.role)}</p>
                </div>

                <div className={styles.field}>
                  <label>Класс</label>
                  <p>{user.gradeDisplayName || "Не назначен"}</p>
                </div>

                <div className={styles.field}>
                  <label>Дата регистрации</label>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {isEditing && (
                <div className={styles.fieldActions}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    <i className="fas fa-check"></i> Сохранить
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfilePage;

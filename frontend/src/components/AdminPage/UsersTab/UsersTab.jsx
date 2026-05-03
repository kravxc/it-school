import { useState, useMemo } from "react";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./users-tab.module.css";

const UsersTab = ({ users, onBindGrade, onUnbindGrade }) => {
  const [gradeFilter, setGradeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result =
      gradeFilter === "grade9"
        ? users.filter((u) => u.gradeId === 1)
        : gradeFilter === "grade11"
          ? users.filter((u) => u.gradeId === 2)
          : gradeFilter === "no-grade"
            ? users.filter((u) => !u.gradeId)
            : users;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [users, gradeFilter, searchQuery]);

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: "Админ", className: styles.roleAdmin },
      teacher: { label: "Учитель", className: styles.roleTeacher },
      student: { label: "Ученик", className: styles.roleStudent },
    };
    const r = roles[role] || { label: role, className: "" };
    return (
      <span className={`${styles.roleBadgeSm} ${r.className}`}>{r.label}</span>
    );
  };

  return (
    <>
      <div className={styles.subTabs}>
        <button
          className={`${styles.subTab} ${gradeFilter === null ? styles.active : ""}`}
          onClick={() => setGradeFilter(null)}
        >
          Все ({users.length})
        </button>
        <button
          className={`${styles.subTab} ${gradeFilter === "grade9" ? styles.active : ""}`}
          onClick={() => setGradeFilter("grade9")}
        >
          9 класс ({users.filter((u) => u.gradeId === 1).length})
        </button>
        <button
          className={`${styles.subTab} ${gradeFilter === "grade11" ? styles.active : ""}`}
          onClick={() => setGradeFilter("grade11")}
        >
          11 класс ({users.filter((u) => u.gradeId === 2).length})
        </button>
        <button
          className={`${styles.subTab} ${gradeFilter === "no-grade" ? styles.active : ""}`}
          onClick={() => setGradeFilter("no-grade")}
        >
          Без класса ({users.filter((u) => !u.gradeId).length})
        </button>
      </div>

      <div className={styles.filterBar}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по пользователям..."
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Класс</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td className={styles.idCell}>{user.id}</td>
                <td className={styles.titleCell}>{user.name}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  {user.gradeId ? (
                    <span
                      className={`${styles.gradeBadge} ${user.gradeId === 1 ? styles.grade9 : styles.grade11}`}
                    >
                      {user.gradeDisplayName ||
                        (user.gradeId === 1 ? "9 класс" : "11 класс")}
                    </span>
                  ) : (
                    <span className={styles.noGradeBadge}>Не назначен</span>
                  )}
                </td>
                <td>
                  {user.role !== "admin" && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={() => onBindGrade(user.id)}
                        title="Привязать к классу"
                      >
                        <i className="fas fa-link"></i>
                      </button>
                      {user.gradeId && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => onUnbindGrade(user.id, user.name)}
                          title="Отвязать"
                        >
                          <i className="fas fa-unlink"></i>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <i className="fas fa-users"></i>
            <h3>{searchQuery ? "Ничего не найдено" : "Нет пользователей"}</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTab;

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./topics-tab.module.css";

const TopicsTab = ({ topics, onEdit, onDelete, deletingId, isAdmin }) => {
  const [gradeFilter, setGradeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result =
      gradeFilter === "grade9"
        ? topics.filter((t) => t.gradeId === 1)
        : gradeFilter === "grade11"
          ? topics.filter((t) => t.gradeId === 2)
          : topics;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [topics, gradeFilter, searchQuery]);

  return (
    <>
      <div className={styles.subTabs}>
        <button
          className={`${styles.subTab} ${gradeFilter === null ? styles.active : ""}`}
          onClick={() => setGradeFilter(null)}
        >
          Все ({topics.length})
        </button>
        <button
          className={`${styles.subTab} ${gradeFilter === "grade9" ? styles.active : ""}`}
          onClick={() => setGradeFilter("grade9")}
        >
          9 класс ({topics.filter((t) => t.gradeId === 1).length})
        </button>
        <button
          className={`${styles.subTab} ${gradeFilter === "grade11" ? styles.active : ""}`}
          onClick={() => setGradeFilter("grade11")}
        >
          11 класс ({topics.filter((t) => t.gradeId === 2).length})
        </button>
      </div>

      <div className={styles.filterBar}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по темам..."
        />
        <button className={styles.createButton} onClick={() => onEdit(null)}>
          <i className="fas fa-plus"></i> Создать тему
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Класс</th>
              <th>Уроков</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((topic) => (
              <tr key={topic.id}>
                <td className={styles.titleCell}>{topic.title}</td>
                <td className={styles.descCell}>
                  {topic.description?.substring(0, 50)}
                  {(topic.description?.length || 0) > 50 ? "..." : ""}
                </td>
                <td>
                  <span
                    className={`${styles.gradeBadge} ${topic.gradeId === 1 ? styles.grade9 : styles.grade11}`}
                  >
                    {topic.gradeDisplayName ||
                      (topic.gradeId === 1 ? "9 класс" : "11 класс")}
                  </span>
                </td>
                <td>{topic.lessonsCount || 0}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(topic)}
                      title="Редактировать"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <Link
                      to={`/topics/${topic.id}`}
                      className={styles.viewButton}
                      title="Просмотр"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                    {isAdmin && onDelete && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(topic.id, topic.title)}
                        title="Удалить"
                        disabled={deletingId === topic.id}
                      >
                        <i
                          className={`fas ${deletingId === topic.id ? "fa-spinner fa-spin" : "fa-trash"}`}
                        ></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <i className="fas fa-book-open"></i>
            <h3>{searchQuery ? "Ничего не найдено" : "Нет тем"}</h3>
            <p>
              {searchQuery
                ? "Попробуйте изменить запрос"
                : "Создайте первую тему"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TopicsTab;

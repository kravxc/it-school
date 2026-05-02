import { useState, useMemo } from "react";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./lessons-tab.module.css";

const LessonsTab = ({
  lessons,
  topics,
  onEdit,
  onDelete,
  onTask,
  onFile,
  onMaterial,
  isAdmin,
}) => {
  const [topicFilter, setTopicFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = topicFilter
      ? lessons.filter((l) => l.topicId === topicFilter)
      : lessons;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [lessons, topicFilter, searchQuery]);

  return (
    <>
      <div className={styles.filterBar}>
        <select
          value={topicFilter || ""}
          onChange={(e) =>
            setTopicFilter(e.target.value ? Number(e.target.value) : null)
          }
          className={styles.filterSelect}
        >
          <option value="">Все темы</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.gradeDisplayName})
            </option>
          ))}
        </select>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по урокам..."
        />
        <button className={styles.createButton} onClick={() => onEdit(null)}>
          <i className="fas fa-plus"></i> Создать урок
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.lessonsGrid}>
          {filtered.map((lesson) => {
            const topic = topics.find((t) => t.id === lesson.topicId);
            return (
              <div key={lesson.id} className={styles.lessonCard}>
                <div className={styles.lessonCardHeader}>
                  <div>
                    <h3>{lesson.title}</h3>
                    {topic && (
                      <span className={styles.topicBadge}>
                        {topic.title} · {topic.gradeDisplayName}
                      </span>
                    )}
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(lesson)}
                      title="Редактировать"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {isAdmin && onDelete && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(lesson.id, lesson.title)}
                        title="Удалить"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
                {lesson.description && (
                  <p className={styles.lessonDesc}>{lesson.description}</p>
                )}
                <div className={styles.lessonStats}>
                  <span>
                    <i className="fas fa-tasks"></i>
                    {lesson.tasksCount || 0} задач
                  </span>
                  <span>
                    <i className="fas fa-file"></i>
                    {lesson.filesCount || 0} файлов
                  </span>
                </div>
                <div className={styles.lessonActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onTask(lesson.id)}
                  >
                    <i className="fas fa-plus-circle"></i> Задача
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onFile(lesson.id)}
                  >
                    <i className="fas fa-file-upload"></i> Файл
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onMaterial(lesson.id)}
                  >
                    <i className="fas fa-paperclip"></i> Материал
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <i className="fas fa-book-open"></i>
          <h3>{searchQuery ? "Ничего не найдено" : "Нет уроков"}</h3>
          <p>
            {searchQuery
              ? "Попробуйте изменить запрос"
              : topicFilter
                ? "В этой теме нет уроков"
                : "Создайте первый урок"}
          </p>
        </div>
      )}
    </>
  );
};

export default LessonsTab;

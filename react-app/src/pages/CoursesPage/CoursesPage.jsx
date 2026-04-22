import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import { authStore, topicStore } from "../../stores";
import styles from "./courses.module.css";

const CoursesPage = observer(() => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (authStore.isLoading) return;

    if (!authStore.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!authStore.user) return;

    const userGradeId = authStore.gradeId;
    console.log("CoursesPage - User gradeId:", userGradeId);

    if (userGradeId) {
      topicStore.fetchTopicsByGrade(userGradeId).then(() => {
        setInitialLoadDone(true);
      });
    } else {
      console.warn("У пользователя не указан класс (gradeId)");
      setInitialLoadDone(true);
    }
  }, [
    navigate,
    authStore.isLoading,
    authStore.isAuthenticated,
    authStore.user,
  ]);

  if (authStore.isLoading || !authStore.user) {
    return (
      <div className={styles.coursesPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Загрузка данных пользователя...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return null;
  }

  if (!authStore.gradeId) {
    return (
      <div className={styles.coursesPage}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Класс не указан</h3>
            <p>Обратитесь к администратору для привязки к классу</p>
            <Link to="/" className={styles.backButton}>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userTopics = topicStore.getTopicsByGradeId(authStore.gradeId);

  const filteredTopics = userTopics.filter((topic) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      topic.title?.toLowerCase().includes(searchLower) ||
      topic.description?.toLowerCase().includes(searchLower)
    );
  });

  const userGrade =
    authStore.gradeDisplayName ||
    (authStore.gradeId === 1
      ? "9 класс"
      : authStore.gradeId === 2
        ? "11 класс"
        : "Класс не указан");

  const userRole = authStore.isTeacher
    ? "Учитель"
    : authStore.isAdmin
      ? "Администратор"
      : "Ученик";

  if (topicStore.isLoading && !initialLoadDone) {
    return (
      <div className={styles.coursesPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Загрузка курсов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.coursesPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1>Мои курсы</h1>
            <div className={styles.userInfo}>
              <span className={styles.gradeBadge}>
                <i className="fas fa-graduation-cap"></i>
                {userGrade}
              </span>
              <span className={styles.roleBadge}>
                <i className="fas fa-user"></i>
                {userRole}
              </span>
            </div>
          </div>
          <p className={styles.subtitle}>
            Здесь собраны все темы и материалы для вашего класса
          </p>
        </div>

        {userTopics.length > 0 && (
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Поиск по темам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        )}

        {filteredTopics.length > 0 ? (
          <div className={styles.topicsGrid}>
            {filteredTopics.map((topic) => (
              <Link
                to={`/topics/${topic.id}`}
                key={topic.id}
                className={styles.topicCard}
              >
                <div className={styles.topicHeader}>
                  <div className={styles.topicIcon}>
                    <i className={getTopicIcon(topic.subject)}></i>
                  </div>
                  {topic.subject && (
                    <span className={styles.subjectBadge}>{topic.subject}</span>
                  )}
                </div>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                {topic.description && (
                  <p className={styles.topicDescription}>{topic.description}</p>
                )}
                <div className={styles.topicMeta}>
                  <span>
                    <i className="far fa-play-circle"></i>
                    {topic.lessonsCount || 0} уроков
                  </span>
                  <span>
                    <i className="far fa-clock"></i>
                    {topic.duration || "~"} мин
                  </span>
                </div>
                <div className={styles.topicFooter}>
                  <div className={styles.progress}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${topic.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>
                    {topic.progress || 0}% пройдено
                  </span>
                </div>
                <div className={styles.cardArrow}>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="fas fa-book-open"></i>
            <h3>
              {searchQuery
                ? "Темы не найдены"
                : userTopics.length === 0
                  ? "В вашем классе пока нет доступных тем"
                  : "Темы не найдены"}
            </h3>
            <p>
              {searchQuery
                ? "Попробуйте изменить параметры поиска"
                : userTopics.length === 0
                  ? "Дождитесь, пока учитель добавит материалы"
                  : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

const getTopicIcon = (subject) => {
  const icons = {
    Python: "fab fa-python",
    JavaScript: "fab fa-js",
    Java: "fab fa-java",
    "HTML/CSS": "fab fa-html5",
    SQL: "fas fa-database",
    Алгоритмы: "fas fa-code-branch",
    "Веб-разработка": "fas fa-globe",
    "Базы данных": "fas fa-database",
    Программирование: "fas fa-code",
  };
  return icons[subject] || "fas fa-book";
};

export default CoursesPage;

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { authStore, topicStore } from "../../stores";
import CourseCard from "../../components/TopicCard/TopicCard";
import styles from "./topics.module.css";

const TopicsPage = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
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
  }, []);

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
            {filteredTopics.map(
              ({
                id,
                subject,
                title,
                description,
                lessonsCount,
                duration,
                progress,
              }) => (
                <CourseCard
                  key={id}
                  id={id}
                  subject={subject}
                  title={title}
                  description={description}
                  lessonsCount={lessonsCount}
                  duration={duration}
                  progress={progress}
                />
              ),
            )}
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

export default TopicsPage;

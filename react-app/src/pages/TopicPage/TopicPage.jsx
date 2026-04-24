import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useParams, Link } from "react-router-dom";
import { topicStore, fileStore } from "../../stores";
import LessonCard from "../../components/LessonCard/LessonCard";
import styles from "./topic.module.css";

const TopicPage = observer(() => {
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState({});
  const [lessonFiles, setLessonFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [topicData, setTopicData] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);

  useEffect(() => {
    const loadTopic = async () => {
      setLessonsLoaded(false);

      const topicResult = await topicStore.fetchTopicById(id);

      if (topicResult.success) {
        setTopicData(topicResult.data);

        await new Promise((resolve) => setTimeout(resolve, 100));
        const lessonsResult = await topicStore.fetchTopicLessons(id);

        if (lessonsResult.success) {
          setLessonsData(lessonsResult.data || []);
        }

        setLessonsLoaded(true);
      } else {
        console.error("Topic not found:", topicResult.error);
        setLessonsLoaded(true);
      }
    };

    loadTopic();
  }, [id]);

  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
      topicStore.clearCurrentTopic();
      fileStore.reset();
    };
  }, [imagePreviews]);

  const loadImagePreview = useCallback(
    async (fileId) => {
      if (!imagePreviews[fileId]) {
        const result = await fileStore.getFilePreview(fileId);
        if (result.success) {
          setImagePreviews((prev) => ({ ...prev, [fileId]: result.url }));
        }
      }
    },
    [imagePreviews],
  );

  useEffect(() => {
    if (activeLesson) {
      const files = lessonFiles[activeLesson] || [];
      files.forEach(({ mimeType, originalName, id: fileId }) => {
        const isImage =
          mimeType?.startsWith("image/") || fileStore.isImageFile(originalName);
        if (isImage) {
          loadImagePreview(fileId);
        }
      });
    }
  }, [activeLesson, lessonFiles, loadImagePreview]);

  const handleLessonToggle = useCallback(
    async (lessonId) => {
      const newActiveLesson = activeLesson === lessonId ? null : lessonId;
      setActiveLesson(newActiveLesson);

      if (newActiveLesson && !lessonFiles[lessonId]) {
        setLoadingFiles((prev) => ({ ...prev, [lessonId]: true }));

        const result = await fileStore.fetchLessonFiles(lessonId);

        if (result.success) {
          setLessonFiles((prev) => ({
            ...prev,
            [lessonId]: result.data,
          }));
        }

        setLoadingFiles((prev) => ({ ...prev, [lessonId]: false }));
      }
    },
    [activeLesson, lessonFiles],
  );

  const handleDownloadFile = async (fileId, originalName) => {
    const result = await fileStore.downloadFile(fileId, originalName);
    if (!result.success) {
      alert("Ошибка при скачивании файла: " + result.error);
    }
  };

  if (topicStore.isLoading || !lessonsLoaded) {
    return (
      <div className={styles.topicPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Загрузка темы...</p>
          </div>
        </div>
      </div>
    );
  }

  if (topicStore.error && !topicData && !topicStore.currentTopic) {
    return (
      <div className={styles.topicPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <i className="fas fa-exclamation-circle"></i>
            <h3>Ошибка загрузки темы</h3>
            <p>{topicStore.error}</p>
            <Link to="/courses" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i> Вернуться к курсам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topic = topicData || topicStore.currentTopic;
  const lessons = lessonsData.length > 0 ? lessonsData : topic?.lessons || [];

  if (!topic) {
    return (
      <div className={styles.topicPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Тема не найдена</h3>
            <p>Возможно, она была удалена или у вас нет к ней доступа</p>
            <Link to="/courses" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i> Вернуться к курсам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topicPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <i className="fas fa-chevron-right"></i>
          <Link to="/courses">Мои курсы</Link>
          <i className="fas fa-chevron-right"></i>
          <span>{topic.title}</span>
        </div>

        <div className={styles.topicHeader}>
          <div className={styles.topicInfo}>
            <div className={styles.topicIcon}>
              <i className={getTopicIcon(topic.title)}></i>
            </div>
            <div>
              <h1>{topic.title}</h1>
              {topic.description && (
                <p className={styles.topicDescription}>{topic.description}</p>
              )}
              <div className={styles.topicMeta}>
                <span className={styles.gradeBadge}>
                  <i className="fas fa-graduation-cap"></i>
                  {topic.gradeDisplayName}
                </span>
                <span className={styles.lessonsBadge}>
                  <i className="fas fa-book"></i>
                  {lessons.length} уроков
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.lessonsSection}>
          <h2>Уроки</h2>

          {lessons.length > 0 ? (
            <div className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  isActive={activeLesson === lesson.id}
                  onToggle={handleLessonToggle}
                  files={lessonFiles[lesson.id] || []}
                  isFilesLoading={loadingFiles[lesson.id]}
                  imagePreviews={imagePreviews}
                  onDownloadFile={handleDownloadFile}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fas fa-book-open"></i>
              <h3>Нет уроков</h3>
              <p>В этой теме пока нет уроков</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/courses" className={styles.backLink}>
            <i className="fas fa-arrow-left"></i> Вернуться к курсам
          </Link>
        </div>
      </div>
    </div>
  );
});

const getTopicIcon = (title) => {
  const lowerTitle = title?.toLowerCase() || "";
  if (lowerTitle.includes("python")) return "fab fa-python";
  if (lowerTitle.includes("java")) return "fab fa-java";
  if (lowerTitle.includes("javascript") || lowerTitle.includes("js"))
    return "fab fa-js";
  if (lowerTitle.includes("html") || lowerTitle.includes("css"))
    return "fab fa-html5";
  if (lowerTitle.includes("sql") || lowerTitle.includes("базы данных"))
    return "fas fa-database";
  if (lowerTitle.includes("алгоритм")) return "fas fa-code-branch";
  if (lowerTitle.includes("веб")) return "fas fa-globe";
  return "fas fa-book";
};

export default TopicPage;

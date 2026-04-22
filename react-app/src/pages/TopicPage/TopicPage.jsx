import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useParams, Link, useNavigate } from "react-router-dom";
import { topicStore, authStore, fileStore } from "../../stores";
import styles from "./topic.module.css";

const TopicPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState({});
  const [lessonFiles, setLessonFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [topicData, setTopicData] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadTopic = async () => {
      setLessonsLoaded(false);

      const topicResult = await topicStore.fetchTopicById(id);

      if (topicResult.success) {
        setTopicData(topicResult.data);

        await new Promise((resolve) => setTimeout(resolve,100));
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

    isInitialLoad.current = false;
  }, [id, navigate]);

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
      const files = getFilesForLesson(activeLesson);
      files.forEach((file) => {
        const isImage =
          file.mimeType?.startsWith("image/") ||
          fileStore.isImageFile(file.originalName);
        if (isImage) {
          loadImagePreview(file.id);
        }
      });
    }
  }, [activeLesson, lessonFiles, loadImagePreview]);

  const handleLessonClick = async (lessonId) => {
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
  };

  const handleDownloadFile = async (fileId, originalName) => {
    const result = await fileStore.downloadFile(fileId, originalName);
    if (!result.success) {
      alert("Ошибка при скачивании файла: " + result.error);
    }
  };

  const getFilesForLesson = (lessonId) => {
    return lessonFiles[lessonId] || [];
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return "fa-file";
    const ext = fileName.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: "fa-file-pdf",
      doc: "fa-file-word",
      docx: "fa-file-word",
      xls: "fa-file-excel",
      xlsx: "fa-file-excel",
      ppt: "fa-file-powerpoint",
      pptx: "fa-file-powerpoint",
      zip: "fa-file-archive",
      rar: "fa-file-archive",
      jpg: "fa-file-image",
      jpeg: "fa-file-image",
      png: "fa-file-image",
      gif: "fa-file-image",
      bmp: "fa-file-image",
      webp: "fa-file-image",
      svg: "fa-file-image",
      mp4: "fa-file-video",
      mp3: "fa-file-audio",
      txt: "fa-file-alt",
    };
    return icons[ext] || "fa-file";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
              {lessons.map((lesson, index) => {
                const files = getFilesForLesson(lesson.id);
                const isFilesLoading = loadingFiles[lesson.id];
                const filesCount = lesson.filesCount || files.length;

                return (
                  <div key={lesson.id} className={styles.lessonCard}>
                    <div
                      className={styles.lessonHeader}
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      <div className={styles.lessonNumber}>
                        <span>{index + 1}</span>
                      </div>
                      <div className={styles.lessonInfo}>
                        <h3>{lesson.title}</h3>
                        {lesson.description && <p>{lesson.description}</p>}
                        <div className={styles.lessonMeta}>
                          <span>
                            <i className="fas fa-tasks"></i>
                            {lesson.tasksCount || 0} заданий
                          </span>
                          <span>
                            <i className="fas fa-file"></i>
                            {filesCount} файлов
                          </span>
                        </div>
                      </div>
                      <div className={styles.lessonArrow}>
                        <i
                          className={`fas fa-chevron-${activeLesson === lesson.id ? "up" : "down"}`}
                        ></i>
                      </div>
                    </div>

                    {activeLesson === lesson.id && (
                      <div className={styles.lessonContent}>
                        <div className={styles.filesSection}>
                          <h4>
                            <i className="fas fa-paperclip"></i> Файлы урока
                          </h4>

                          {isFilesLoading ? (
                            <div className={styles.filesLoading}>
                              <i className="fas fa-spinner fa-spin"></i>
                              <span>Загрузка файлов...</span>
                            </div>
                          ) : files.length > 0 ? (
                            <div className={styles.filesList}>
                              {files.map((file) => {
                                const isImage =
                                  file.mimeType?.startsWith("image/") ||
                                  fileStore.isImageFile(file.originalName);
                                const displayName =
                                  file.originalName || file.name || "Файл";

                                return (
                                  <div
                                    key={file.id}
                                    className={styles.fileItem}
                                  >
                                    <div className={styles.fileInfo}>
                                      {isImage && imagePreviews[file.id] ? (
                                        <img
                                          src={imagePreviews[file.id]}
                                          alt={displayName}
                                          className={styles.filePreview}
                                        />
                                      ) : (
                                        <i
                                          className={`fas ${getFileIcon(displayName)}`}
                                        ></i>
                                      )}
                                      <span className={styles.fileName}>
                                        {displayName}
                                      </span>
                                      {file.fileSize && (
                                        <span className={styles.fileSize}>
                                          {formatFileSize(file.fileSize)}
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      className={styles.downloadButton}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadFile(
                                          file.id,
                                          file.originalName || file.name,
                                        );
                                      }}
                                      title="Скачать файл"
                                    >
                                      <i className="fas fa-download"></i>
                                      <span>Скачать</span>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className={styles.noFiles}>
                              {filesCount > 0
                                ? "Нажмите на урок, чтобы загрузить файлы"
                                : "Нет прикрепленных файлов"}
                            </p>
                          )}
                        </div>

                        {lesson.tasks && lesson.tasks.length > 0 && (
                          <div className={styles.tasksSection}>
                            <h4>
                              <i className="fas fa-tasks"></i> Задания
                            </h4>
                            <div className={styles.tasksList}>
                              {lesson.tasks.map((task) => (
                                <div key={task.id} className={styles.taskCard}>
                                  <div className={styles.taskHeader}>
                                    <h5>{task.title}</h5>
                                    <span
                                      className={`${styles.difficultyBadge} ${styles[task.difficulty?.toLowerCase()] || ""}`}
                                    >
                                      {task.difficulty}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className={styles.taskDescription}>
                                      {task.description}
                                    </p>
                                  )}
                                  {task.content && (
                                    <div className={styles.taskContent}>
                                      <pre>{task.content}</pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!lesson.tasks || lesson.tasks.length === 0) &&
                          files.length === 0 &&
                          !isFilesLoading && (
                            <p className={styles.noContent}>
                              Нет материалов для этого урока
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
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

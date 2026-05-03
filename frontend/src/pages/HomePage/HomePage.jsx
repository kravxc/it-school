import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { topicStore, lessonStore, taskStore, fileStore } from "../../stores";
import styles from "./home.module.css";

const HomePage = observer(() => {
  useEffect(() => {
    topicStore.fetchAllTopics();
    lessonStore.fetchAllLessons();
    taskStore.fetchAllTasks();
    fileStore.fetchAllFiles();
  }, []);

  const topics = topicStore.topics;
  const lessons = lessonStore.lessons;
  const tasks = taskStore.tasks;
  const files = fileStore.files || [];

  const grade9Topics = topics.filter((t) => t.gradeId === 1);
  const grade11Topics = topics.filter((t) => t.gradeId === 2);
  const grade9Lessons = lessons.filter((l) => l.gradeId === 1);
  const grade11Lessons = lessons.filter((l) => l.gradeId === 2);

  const recentTasks = tasks.slice(0, 6);
  const recentFiles = files.slice(0, 6);

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>
            Знания — это обмен.
            <br />
            Учись, решай, передавай.
          </h1>
          <div className={styles.subhead}>
            Платформа для учителей и учеников: лекции, задачи, доп. материалы и
            удобная передача файлов.
          </div>
        </section>

        <div className={styles.classesSection}>
          <div className={styles.sectionHeader}>
            <h2>Классы</h2>
          </div>

          <div className={styles.classCards}>
            <Link to="/courses" className={styles.classCard}>
              <span className={styles.classBadge}>
                <i className="fas fa-graduation-cap"></i> после 9 класса
              </span>
              <h3>
                Основы IT
                <br />и алгоритмика
              </h3>
              <div className={styles.classMeta}>
                <span>
                  <i className="far fa-folder-open"></i> {grade9Topics.length}{" "}
                  тем
                </span>
                <span>
                  <i className="far fa-file"></i> {grade9Lessons.length} уроков
                </span>
              </div>
              <p>
                Программирование с нуля, Python, веб-вёрстка. Лекции с задачами
                и доп. материалами.
              </p>

              <span className={styles.btnOutline}>
                Перейти к классу <i className="fas fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/courses" className={styles.classCard}>
              <span className={styles.classBadge}>
                <i className="fas fa-laptop-code"></i> после 11 класса
              </span>
              <h3>
                Продвинутая
                <br />
                разработка
              </h3>
              <div className={styles.classMeta}>
                <span>
                  <i className="far fa-folder-open"></i> {grade11Topics.length}{" "}
                  тем
                </span>
                <span>
                  <i className="far fa-file"></i> {grade11Lessons.length} уроков
                </span>
              </div>
              <p>
                Алгоритмы, базы данных, бэкенд, подготовка к экзаменам. Каждый
                урок — задачи + материалы.
              </p>

              <span className={styles.btnOutline}>
                Перейти к классу <i className="fas fa-arrow-right"></i>
              </span>
            </Link>
          </div>
        </div>

        {topics.length > 0 && (
          <div className={styles.themesSection}>
            <div className={styles.sectionHeader}>
              <h2>Последние темы</h2>
              <Link to="/courses">
                Все темы <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className={styles.themesGrid}>
              {topics.slice(0, 6).map((topic) => (
                <Link
                  to={`/topics/${topic.id}`}
                  key={topic.id}
                  className={styles.themeCard}
                >
                  <div className={styles.themeIcon}>
                    <i className={getTopicIcon(topic.title)}></i>
                  </div>
                  <h4>{topic.title}</h4>
                  <p className={styles.themeMeta}>
                    {topic.gradeDisplayName} · {topic.lessonsCount || 0} уроков
                  </p>

                  <div className={styles.extraMaterials}>
                    <p>
                      <i className="fas fa-info-circle"></i> Информация
                    </p>
                    <span className={styles.fileLink}>
                      {topic.description?.substring(0, 60) ||
                        "Описание отсутствует"}
                      {(topic.description?.length || 0) > 60 ? "..." : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentTasks.length > 0 && (
          <div className={styles.recentTasks}>
            <div className={styles.sectionHeader}>
              <h2>Последние задания</h2>
              <Link to="/courses">
                Все уроки <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {recentTasks.map((task) => (
              <div key={task.id} className={styles.taskRow}>
                <div className={styles.taskIcon}>
                  <i className={`fas ${getTaskIcon(task.difficulty)}`}></i>
                </div>
                <div className={styles.taskInfo}>
                  <div className={styles.taskTitle}>{task.title}</div>
                  <div className={styles.taskMeta}>
                    {task.gradeDisplayName ||
                      (task.gradeId === 1
                        ? "9 класс"
                        : task.gradeId === 2
                          ? "11 класс"
                          : "")}
                    {task.difficulty && ` · ${task.difficulty}`}
                  </div>
                </div>
                <div className={styles.taskFile}>
                  <i className="fas fa-tasks"></i>{" "}
                  {task.description?.substring(0, 30) || "Задание"}
                </div>
                <i className={`fas fa-chevron-right ${styles.chevron}`}></i>
              </div>
            ))}
          </div>
        )}

        {recentFiles.length > 0 && (
          <div className={styles.recentTasks}>
            <div className={styles.sectionHeader}>
              <h2>Последние файлы</h2>
            </div>

            {recentFiles.map((file) => (
              <div key={file.id} className={styles.taskRow}>
                <div className={styles.taskIcon}>
                  <i
                    className={`fas ${getFileIcon(file.originalName || file.name)}`}
                  ></i>
                </div>
                <div className={styles.taskInfo}>
                  <div className={styles.taskTitle}>
                    {file.originalName || file.name || "Файл"}
                  </div>
                  <div className={styles.taskMeta}>
                    {file.type && `${file.type.toUpperCase()} · `}
                    {file.size ? formatFileSize(file.size) : ""}
                  </div>
                </div>
                <div className={styles.taskFile}>
                  <i className="fas fa-download"></i> Скачать
                </div>
                <i className={`fas fa-chevron-right ${styles.chevron}`}></i>
              </div>
            ))}
          </div>
        )}
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

const getTaskIcon = (difficulty) => {
  const icons = {
    Начальный: "fa-seedling",
    Средний: "fa-code-branch",
    Продвинутый: "fa-fire",
  };
  return icons[difficulty] || "fa-tasks";
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

export default HomePage;

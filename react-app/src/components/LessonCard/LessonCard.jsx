import { fileStore } from "../../stores";
import styles from "./lesson-card.module.css";

const LessonCard = ({
  lesson,
  index,
  isActive,
  onToggle,
  files,
  isFilesLoading,
  imagePreviews,
  onDownloadFile,
}) => {
  const {
    id: lessonId,
    title,
    description,
    tasksCount,
    filesCount,
    tasks,
  } = lesson;

  return (
    <div className={styles.lessonCard}>
      <div className={styles.lessonHeader} onClick={() => onToggle(lessonId)}>
        <div className={styles.lessonNumber}>
          <span>{index + 1}</span>
        </div>
        <div className={styles.lessonInfo}>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
          <div className={styles.lessonMeta}>
            <span>
              <i className="fas fa-tasks"></i>
              {tasksCount || 0} заданий
            </span>
            <span>
              <i className="fas fa-file"></i>
              {filesCount || files.length} файлов
            </span>
          </div>
        </div>
        <div className={styles.lessonArrow}>
          <i className={`fas fa-chevron-${isActive ? "up" : "down"}`}></i>
        </div>
      </div>

      {isActive && (
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
                  const displayName = file.originalName || file.name || "Файл";

                  return (
                    <div key={file.id} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        {isImage && imagePreviews[file.id] ? (
                          <img
                            src={imagePreviews[file.id]}
                            alt={displayName}
                            className={styles.filePreview}
                          />
                        ) : (
                          <i className={`fas ${getFileIcon(displayName)}`}></i>
                        )}
                        <span className={styles.fileName}>{displayName}</span>
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
                          onDownloadFile(
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

          {tasks && tasks.length > 0 && (
            <div className={styles.tasksSection}>
              <h4>
                <i className="fas fa-tasks"></i> Задания
              </h4>
              <div className={styles.tasksList}>
                {tasks.map(
                  ({
                    id: taskId,
                    title: taskTitle,
                    difficulty,
                    description: taskDesc,
                    content,
                  }) => (
                    <div key={taskId} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <h5>{taskTitle}</h5>
                        <span
                          className={`${styles.difficultyBadge} ${styles[difficulty?.toLowerCase()] || ""}`}
                        >
                          {difficulty}
                        </span>
                      </div>
                      {taskDesc && (
                        <p className={styles.taskDescription}>{taskDesc}</p>
                      )}
                      {content && (
                        <div className={styles.taskContent}>
                          <pre>{content}</pre>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {(!tasks || tasks.length === 0) &&
            files.length === 0 &&
            !isFilesLoading && (
              <p className={styles.noContent}>Нет материалов для этого урока</p>
            )}
        </div>
      )}
    </div>
  );
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

export default LessonCard;

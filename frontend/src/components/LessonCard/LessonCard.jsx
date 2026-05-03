import { useState, useEffect, useRef } from "react";
import { fileStore, additionalMaterialStore } from "../../stores";
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
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialPreviews, setMaterialPreviews] = useState({});
  const materialsLoadedRef = useRef(false);
  const fetchInProgressRef = useRef(false);

  const loadMaterials = async () => {
    if (fetchInProgressRef.current || materialsLoadedRef.current) return;

    fetchInProgressRef.current = true;
    setMaterialsLoading(true);

    try {
      const result = await additionalMaterialStore.fetchByLessonId(lessonId);
      if (result.success) {
        setMaterials(result.data);

        result.data.forEach((material) => {
          if (material.fileId && material.fileName) {
            const imageExtensions = [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "bmp",
              "webp",
              "svg",
            ];
            const ext = material.fileName.split(".").pop()?.toLowerCase();
            const isImage = imageExtensions.includes(ext);

            if (isImage && !materialPreviews[material.fileId]) {
              loadMaterialPreview(material.fileId);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    } finally {
      materialsLoadedRef.current = true;
      fetchInProgressRef.current = false;
      setMaterialsLoading(false);
    }
  };

  const loadMaterialPreview = async (fileId) => {
    if (!materialPreviews[fileId]) {
      const result = await fileStore.getFilePreview(fileId);
      if (result.success) {
        setMaterialPreviews((prev) => ({ ...prev, [fileId]: result.url }));
      }
    }
  };

  useEffect(() => {
    if (isActive) {
      loadMaterials();
    }

    return () => {
      if (!isActive) {
        materialsLoadedRef.current = false;
      }
    };
  }, [isActive, lessonId]);

  useEffect(() => {
    return () => {
      Object.values(materialPreviews).forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [materialPreviews]);

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

  const isImageByFileName = (fileName) => {
    if (!fileName) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const ext = fileName.split(".").pop()?.toLowerCase();
    return imageExtensions.includes(ext);
  };

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
              <i className="fas fa-file"></i> Файлы урока
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
                    isImageByFileName(file.originalName);
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
                        {file.size && (
                          <span className={styles.fileSize}>
                            {formatFileSize(file.size)}
                          </span>
                        )}
                      </div>
                      <button
                        className={styles.downloadButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadFile(file.id, displayName);
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
              <p className={styles.noFiles}>Нет прикрепленных файлов</p>
            )}
          </div>

          <div className={styles.materialsSection}>
            <h4>
              <i className="fas fa-paperclip"></i> Дополнительные материалы
            </h4>
            {materialsLoading ? (
              <div className={styles.filesLoading}>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Загрузка материалов...</span>
              </div>
            ) : materials.length > 0 ? (
              <div className={styles.materialsList}>
                {materials.map((material) => {
                  const hasFile = !!material.fileId;
                  const materialFileName =
                    material.fileName || material.originalName || "";
                  const isImage =
                    hasFile && isImageByFileName(materialFileName);
                  const displayName = materialFileName || "Файл материала";

                  return (
                    <div key={material.id} className={styles.materialItem}>
                      <div className={styles.materialInfo}>
                        {/* Иконка или превью файла */}
                        <div className={styles.materialIcon}>
                          {hasFile &&
                          isImage &&
                          materialPreviews[material.fileId] ? (
                            <img
                              src={materialPreviews[material.fileId]}
                              alt={displayName}
                              className={styles.filePreview}
                            />
                          ) : hasFile ? (
                            <i
                              className={`fas ${getFileIcon(displayName)}`}
                            ></i>
                          ) : (
                            <i className="fas fa-bookmark"></i>
                          )}
                        </div>

                        <div className={styles.materialContent}>
                          <span className={styles.materialTitle}>
                            {material.title}
                          </span>

                          {material.link && (
                            <a
                              href={material.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.materialLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-external-link-alt"></i>{" "}
                              {material.link}
                            </a>
                          )}

                          {material.content && !material.link && (
                            <p className={styles.materialText}>
                              {material.content}
                            </p>
                          )}

                          {hasFile && (
                            <span className={styles.materialFileName}>
                              <i
                                className={`fas ${getFileIcon(displayName)}`}
                              ></i>
                              {displayName}
                              {material.fileSize && (
                                <span className={styles.fileSize}>
                                  {" "}
                                  {formatFileSize(material.fileSize)}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {hasFile && (
                        <button
                          className={styles.downloadButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadFile(material.fileId, displayName);
                          }}
                          title={`Скачать ${displayName}`}
                        >
                          <i className="fas fa-download"></i>
                          <span>Скачать</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noFiles}>Нет дополнительных материалов</p>
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
            materials.length === 0 &&
            !isFilesLoading &&
            !materialsLoading && (
              <p className={styles.noContent}>Нет материалов для этого урока</p>
            )}
        </div>
      )}
    </div>
  );
};

export default LessonCard;

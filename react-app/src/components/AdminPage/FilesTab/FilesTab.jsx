import { useState, useMemo } from "react";
import { fileStore } from "../../../stores/index";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./files-tab.module.css";

const FilesTab = ({ files, onDelete, deletingId, isAdmin }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.originalName?.toLowerCase().includes(q) ||
        f.type?.toLowerCase().includes(q),
    );
  }, [files, searchQuery]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      <div className={styles.filterBar}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по файлам..."
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Оригинальное имя</th>
              <th>Тип</th>
              <th>Размер</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((file) => (
              <tr key={file.id}>
                <td className={styles.titleCell}>{file.name || "—"}</td>
                <td>{file.originalName || "—"}</td>
                <td>
                  <span className={styles.fileTypeBadge}>
                    {file.type || file.extension || "—"}
                  </span>
                </td>
                <td>{file.size ? formatFileSize(file.size) : "—"}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.downloadBtn}
                      onClick={() =>
                        fileStore.downloadFile(
                          file.id,
                          file.originalName || file.name,
                        )
                      }
                      title="Скачать"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    {isAdmin && onDelete && (
                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          onDelete(file.id, file.originalName || file.name)
                        }
                        title="Удалить"
                        disabled={deletingId === file.id}
                      >
                        <i
                          className={`fas ${deletingId === file.id ? "fa-spinner fa-spin" : "fa-trash"}`}
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
            <i className="fas fa-file"></i>
            <h3>{searchQuery ? "Ничего не найдено" : "Нет файлов"}</h3>
            <p>
              {searchQuery
                ? "Попробуйте изменить запрос"
                : "Загрузите первый файл"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FilesTab;

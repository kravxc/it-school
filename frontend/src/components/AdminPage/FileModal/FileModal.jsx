import { useState } from "react";
import styles from "../modal.module.css";

const FileModal = ({ lessonId, onSubmit, onClose, isLoading }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Выберите файл");
      return;
    }
    const success = await onSubmit(lessonId, file, fileName);
    if (success) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Прикрепить файл</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название (необязательно)</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Оставьте пустым для имени файла"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Файл *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.fileInput}
              required
            />
            {file && (
              <p style={{ marginTop: 8, fontSize: 13, color: "#2563eb" }}>
                <i className="fas fa-file"></i> {file.name}
              </p>
            )}
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Загрузка...
                </>
              ) : (
                "Загрузить"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileModal;

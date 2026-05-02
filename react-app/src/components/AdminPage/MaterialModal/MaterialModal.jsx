import { useState } from "react";
import styles from "../modal.module.css";

const MaterialModal = ({ lessonId, onSubmit, onClose, isLoading }) => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title && !file) {
      alert("Введите название или выберите файл");
      return;
    }
    const success = await onSubmit(lessonId, form, file);
    if (success) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Добавить материал</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Название материала"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Ссылка или текст</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows="3"
              placeholder="http://... или текст"
            />
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Начинается с http — сохранится как ссылка
            </p>
          </div>
          <div className={styles.formGroup}>
            <label>Файл (необязательно)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.fileInput}
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
                  <i className="fas fa-spinner fa-spin"></i> Сохранение...
                </>
              ) : (
                "Добавить"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;

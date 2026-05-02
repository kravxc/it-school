import { useState } from "react";
import styles from "../modal.module.css";

const LessonModal = ({ editing, topics, onSubmit, onClose, isLoading }) => {
  const [form, setForm] = useState({
    title: editing ? editing.title : "",
    description: editing ? editing.description || "" : "",
    topicId: editing ? editing.topicId : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editing ? "Редактировать урок" : "Создать урок"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Тема *</label>
            <select
              value={form.topicId}
              onChange={(e) =>
                setForm((p) => ({ ...p, topicId: Number(e.target.value) }))
              }
              required
            >
              <option value="">Выберите тему</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.gradeDisplayName})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Название *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              placeholder="Название урока"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows="3"
              placeholder="Описание урока"
            />
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
              ) : editing ? (
                "Сохранить"
              ) : (
                "Создать"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonModal;

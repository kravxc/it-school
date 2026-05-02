import { useState } from "react";
import styles from "../modal.module.css";

const TaskModal = ({ lessonId, onSubmit, onClose, isLoading }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    difficulty: "Начальный",
    lessonId: lessonId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, lessonId });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Добавить задачу</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              placeholder="Название задачи"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows="2"
              placeholder="Краткое описание"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Содержание</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows="4"
              placeholder="Подробное описание"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Сложность</label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm((p) => ({ ...p, difficulty: e.target.value }))
              }
            >
              <option value="Начальный">Начальный</option>
              <option value="Средний">Средний</option>
              <option value="Продвинутый">Продвинутый</option>
            </select>
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
                  <i className="fas fa-spinner fa-spin"></i> Создание...
                </>
              ) : (
                "Добавить задачу"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

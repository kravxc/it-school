import { useState } from "react";
import styles from "../modal.module.css";

const TopicModal = ({ editing, onSubmit, onClose, isLoading }) => {
  const [form, setForm] = useState({
    title: editing ? editing.title : "",
    description: editing ? editing.description || "" : "",
    gradeId: editing ? editing.gradeId : 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editing ? "Редактировать тему" : "Создать тему"}</h2>
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
              placeholder="Введите название"
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
              placeholder="Введите описание"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Класс</label>
            <select
              value={form.gradeId}
              onChange={(e) =>
                setForm((p) => ({ ...p, gradeId: Number(e.target.value) }))
              }
            >
              <option value={1}>9 класс</option>
              <option value={2}>11 класс</option>
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

export default TopicModal;

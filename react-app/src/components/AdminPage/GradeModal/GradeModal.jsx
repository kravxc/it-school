import { useState } from "react";
import styles from "../modal.module.css";

const GradeModal = ({ onSubmit, onClose, isLoading }) => {
  const [gradeId, setGradeId] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(gradeId);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Привязать к классу</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Класс</label>
            <select
              value={gradeId}
              onChange={(e) => setGradeId(Number(e.target.value))}
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
                  <i className="fas fa-spinner fa-spin"></i> Привязка...
                </>
              ) : (
                "Привязать"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;

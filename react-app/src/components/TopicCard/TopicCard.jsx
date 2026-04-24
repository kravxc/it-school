import styles from './topic-card.module.css'
import { Link } from 'react-router-dom';
const TopicCard = (props) => {
    
  const { id, subject, title, description, lessonsCount, duration, progress } =
    props;
    
  return (
    <Link to={`/topics/${id}`} className={styles.topicCard}>
      <div className={styles.topicHeader}>
        <div className={styles.topicIcon}>
          <i className={getTopicIcon(subject)}></i>
        </div>
        {subject && <span className={styles.subjectBadge}>{subject}</span>}
      </div>

      <h3 className={styles.topicTitle}>{title}</h3>

      {description && <p className={styles.topicDescription}>{description}</p>}

      <div className={styles.topicMeta}>
        <span>
          <i className="far fa-play-circle"></i>
          {lessonsCount || 0} уроков
        </span>
        <span>
          <i className="far fa-clock"></i>
          {duration || "~"} мин
        </span>
      </div>

      <div className={styles.topicFooter}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        <span className={styles.progressText}>{progress || 0}% пройдено</span>
      </div>

      <div className={styles.cardArrow}>
        <i className="fas fa-arrow-right"></i>
      </div>
    </Link>
  );
};

const getTopicIcon = (subject) => {
  const icons = {
    Python: "fab fa-python",
    JavaScript: "fab fa-js",
    Java: "fab fa-java",
    "HTML/CSS": "fab fa-html5",
    SQL: "fas fa-database",
    Алгоритмы: "fas fa-code-branch",
    "Веб-разработка": "fas fa-globe",
    "Базы данных": "fas fa-database",
    Программирование: "fas fa-code",
  };
  return icons[subject] || "fas fa-book";
};

export default TopicCard;
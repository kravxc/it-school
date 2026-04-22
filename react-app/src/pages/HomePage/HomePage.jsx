import styles from "./home.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>
            Знания — это обмен.
            <br />
            Учись, решай, передавай.
          </h1>
          <div className={styles.subhead}>
            Платформа для учителей и учеников: лекции, задачи, доп. материалы и
            удобная передача файлов.
          </div>
        </section>

        <div className={styles.classesSection}>
          <div className={styles.sectionHeader}>
            <h2>Классы</h2>
            <a href="#">
              Все направления <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          <div className={styles.classCards}>
            <div className={styles.classCard}>
              <span className={styles.classBadge}>
                <i className="fas fa-graduation-cap"></i> после 9 класса
              </span>
              <h3>
                Основы IT
                <br />и алгоритмика
              </h3>
              <div className={styles.classMeta}>
                <span>
                  <i className="far fa-folder-open"></i> 8 активных тем
                </span>
                <span>
                  <i className="far fa-file"></i> 42 урока
                </span>
              </div>
              <p>
                Программирование с нуля, Python, веб-вёрстка. Лекции с задачами
                и доп. материалами.
              </p>

              <div className={styles.progressTag}>
                <i className="fas fa-exchange-alt"></i> обмен заданиями · 14
                новых работ
              </div>

              <a href="#" className={styles.btnOutline}>
                Перейти к классу <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className={styles.classCard}>
              <span className={styles.classBadge}>
                <i className="fas fa-laptop-code"></i> после 11 класса
              </span>
              <h3>
                Продвинутая
                <br />
                разработка
              </h3>
              <div className={styles.classMeta}>
                <span>
                  <i className="far fa-folder-open"></i> 12 тем
                </span>
                <span>
                  <i className="far fa-file"></i> 56 уроков
                </span>
              </div>
              <p>
                Алгоритмы, базы данных, бэкенд, подготовка к экзаменам. Каждый
                урок — задачи + материалы.
              </p>

              <div className={styles.progressTag}>
                <i className="fas fa-cloud-upload-alt"></i> активная передача
                файлов · 8 проектов
              </div>

              <a href="#" className={styles.btnOutline}>
                Перейти к классу <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.themesSection}>
          <div className={styles.sectionHeader}>
            <h2>Популярные темы и уроки</h2>
            <a href="#">
              Все темы <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          <div className={styles.themesGrid}>
            <div className={styles.themeCard}>
              <div className={styles.themeIcon}>
                <i className="fas fa-code"></i>
              </div>
              <h4>Python: основы</h4>
              <p className={styles.themeMeta}>9 класс · 6 лекций</p>

              <ul className={styles.lessonList}>
                <li>
                  <i className="far fa-play-circle"></i> Введение и переменные
                  <span className={styles.fileBadge}>
                    <i className="far fa-file-pdf"></i> 2
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> Условные операторы
                  <span className={styles.fileBadge}>
                    <i className="fas fa-tasks"></i> 4 зад.
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> Циклы и списки
                  <span className={styles.fileBadge}>
                    <i className="fas fa-paperclip"></i> 3
                  </span>
                </li>
              </ul>

              <div className={styles.extraMaterials}>
                <p>
                  <i className="fas fa-paperclip"></i> Доп. материалы
                </p>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-alt"></i> Шпаргалка по
                  синтаксису.pdf
                </a>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-archive"></i> Задачи для
                  самостоятельной работы.zip
                </a>
              </div>
            </div>

            <div className={styles.themeCard}>
              <div className={styles.themeIcon}>
                <i className="fas fa-database"></i>
              </div>
              <h4>SQL и базы данных</h4>
              <p className={styles.themeMeta}>11 класс · 5 лекций</p>

              <ul className={styles.lessonList}>
                <li>
                  <i className="far fa-play-circle"></i> SELECT, WHERE
                  <span className={styles.fileBadge}>
                    <i className="fas fa-download"></i> 5
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> JOIN и связи
                  <span className={styles.fileBadge}>
                    <i className="fas fa-tasks"></i> 3 зад.
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> Группировка и агрегация
                  <span className={styles.fileBadge}>
                    <i className="far fa-file"></i> 2
                  </span>
                </li>
              </ul>

              <div className={styles.extraMaterials}>
                <p>
                  <i className="fas fa-paperclip"></i> Материалы учителя
                </p>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-excel"></i> Пример БД (sqlite)
                </a>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-pdf"></i> Конспект по JOIN
                </a>
              </div>
            </div>

            <div className={styles.themeCard}>
              <div className={styles.themeIcon}>
                <i className="fas fa-globe"></i>
              </div>
              <h4>Веб-разработка</h4>
              <p className={styles.themeMeta}>9-11 класс · 7 лекций</p>

              <ul className={styles.lessonList}>
                <li>
                  <i className="far fa-play-circle"></i> HTML & CSS база
                  <span className={styles.fileBadge}>
                    <i className="far fa-file-code"></i> 4
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> Flexbox и Grid
                  <span className={styles.fileBadge}>
                    <i className="fas fa-tasks"></i> 5
                  </span>
                </li>
                <li>
                  <i className="far fa-play-circle"></i> Основы JavaScript
                  <span className={styles.fileBadge}>
                    <i className="fas fa-cloud-upload-alt"></i> 2
                  </span>
                </li>
              </ul>

              <div className={styles.extraMaterials}>
                <p>
                  <i className="fas fa-paperclip"></i> Доп. файлы
                </p>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-archive"></i> Макеты для практики
                </a>
                <a href="#" className={styles.fileLink}>
                  <i className="far fa-file-video"></i> Скринкаст по DevTools
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recentTasks}>
          <div className={styles.sectionHeader}>
            <h2>Недавние задания и лекции</h2>
            <a href="#">
              Все уроки <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          <div className={styles.taskRow}>
            <div className={styles.taskIcon}>
              <i className="fas fa-code-branch"></i>
            </div>
            <div className={styles.taskInfo}>
              <div className={styles.taskTitle}>
                Задача: Рекурсивный обход дерева
              </div>
              <div className={styles.taskMeta}>
                11 класс · Python · дедлайн 25 мая
              </div>
            </div>
            <div className={styles.taskFile}>
              <i className="fas fa-paperclip"></i> условие.pdf + тесты
            </div>
            <i className={`fas fa-chevron-right ${styles.chevron}`}></i>
          </div>

          <div className={styles.taskRow}>
            <div className={styles.taskIcon}>
              <i className="fas fa-laptop"></i>
            </div>
            <div className={styles.taskInfo}>
              <div className={styles.taskTitle}>Лекция: Основы SQL (JOIN)</div>
              <div className={styles.taskMeta}>
                9 класс · доп. материалы прикреплены
              </div>
            </div>
            <div className={styles.taskFile}>
              <i className="fas fa-download"></i> презентация.pptx + датасет
            </div>
            <i className={`fas fa-chevron-right ${styles.chevron}`}></i>
          </div>

          <div className={styles.taskRow}>
            <div className={styles.taskIcon}>
              <i className="fas fa-file-export"></i>
            </div>
            <div className={styles.taskInfo}>
              <div className={styles.taskTitle}>
                Домашнее задание: адаптивная вёрстка
              </div>
              <div className={styles.taskMeta}>
                для 9 класса · проверка учителем
              </div>
            </div>
            <div className={styles.taskFile}>
              <i className="fas fa-cloud-upload-alt"></i> файлы задания
            </div>
            <i className={`fas fa-chevron-right ${styles.chevron}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

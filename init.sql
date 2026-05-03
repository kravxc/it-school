SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

CREATE DATABASE IF NOT EXISTS it_school 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE it_school;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `grades` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `grades` (`id`, `name`, `display_name`) VALUES
(1, '9', '9 класс'),
(2, '11', '11 класс');


CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Администратор'),
(2, 'teacher', 'Учитель'),
(3, 'student', 'Ученик');

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL DEFAULT '3',
  `grade_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_grade_id_foreign` (`grade_id`),
  CONSTRAINT `users_grade_id_foreign` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role_id`, `grade_id`) VALUES
(1, 'Администратор', 'admin@itschool.ru', '$2a$10$Yl87YiE7D8TBJN0qm4pFGOxEG7zgMMR5hc6dH12gORvU1DKZr5yYi', 1, 1),
(2, 'Учитель', 'teacher@itschool.ru', '$2a$10$XUmLSnuJg8qQAvxj6o.jmenbp7Feboesv2rJ3Md8KioQzmjiMA5P.', 2, 1),
(3, 'Ученик', 'student@itschool.ru', '$2a$10$DuK8dAHXqFVVpzcji4ari.M8HAcyrZoL1egfCMfReuAehER5noY72', 3, 1);


CREATE TABLE IF NOT EXISTS `files` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `original_name` text NOT NULL,
  `path` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `size` int NOT NULL,
  `extension` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `topics` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `grade_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topics_grade_id_foreign` (`grade_id`),
  CONSTRAINT `topics_grade_id_foreign` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `topics` (`id`, `title`, `description`, `grade_id`) VALUES
(5, '1. Основы языка', 'Введение в Java, установка JDK, настройка IDE, синтаксис', 1),
(6, 'ООП', 'Объектно-ориентированное программирование', 1),
(7, 'Коллекции', 'Дженерики, List, Set, Map', 1),
(8, 'Углубление в Java', 'Исключения, IO, работа с файлами, алгоритмы', 1),
(9, '1. Основы Java', 'Введение, переменные, типы данных, Git, циклы, массивы, методы', 2),
(10, 'ООП и углубление в Java', 'Классы, объекты, инкапсуляция, наследование, полиморфизм, интерфейсы', 2),
(11, 'Web. Spring. Работа с Back-end', 'Введение в веб, Spring Boot, REST API, безопасность', 2),
(12, 'Базы данных', 'SQLite/H2, SELECT, INSERT, UPDATE, DELETE, подключение к REST API', 2),
(13, 'Изучение технологий Front-end', 'HTML, CSS, JavaScript, интеграция с Spring', 2);


CREATE TABLE IF NOT EXISTS `lessons` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `topic_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lessons_topic_id_foreign` (`topic_id`),
  CONSTRAINT `lessons_topic_id_foreign` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `lessons` (`id`, `title`, `description`, `topic_id`) VALUES
(15, 'Введение. Установка JDK, настройка IDE', 'Установка JDK, настройка IntelliJ IDEA. Первая программа "Hello, World!". Синтаксис. Жизненный цикл программы', 5),
(16, 'Переменные и примитивные типы данных', 'Переменные, примитивные типы данных (int, double, boolean, char), приведение типов, операторы и ввод/вывод (Scanner)', 5),
(17, 'Git', 'Изучаем или повторяем особенности Git. Работа с репозиториями', 5),
(18, 'Введение в try/catch. Условные операторы', 'Введение в try/catch. Условные операторы: if, if-else, switch-case', 5),
(19, 'Циклы', 'Циклы: for, while, do-while. Операторы break и continue', 5),
(20, 'Массивы', 'Массивы: одномерные и многомерные. Цикл for-each', 5),
(21, 'Методы', 'Методы: создание, параметры, возвращаемое значение. Перегрузка методов', 5),
(22, 'Красивый ввод/вывод. Отладка', 'Углубленная работа с консолью. Основы отладки (Debugging) в IDE. Пошаговое выполнение, точки останова', 5),
(23, 'Строки (String)', 'Строки. Основные методы класса String', 5),
(24, 'Введение в ООП', 'Введение в ООП. Классы и объекты. Понятие конструктора. Ключевое слово this', 6),
(25, 'Инкапсуляция', 'Инкапсуляция. Модификаторы доступа (private, public). Getter-ы и Setter-ы', 6),
(26, 'Наследование', 'Наследование. Ключевое слово extends. Переопределение методов (@Override). Аннотации', 6),
(27, 'Полиморфизм', 'Полиморфизм. Абстрактные классы и методы', 6),
(28, 'Интерфейсы', 'Интерфейсы. Ключевое слово implements. Различие между абстрактными классами и интерфейсами', 6),
(29, 'Повторение ООП', 'Повторяем ООП. Комплексно пробегаем по всему материалу', 6),
(30, 'Дженерики (Generics)', 'Дженерики. Обобщенные классы и методы', 7),
(31, 'Коллекции. List', 'Коллекции. List: ArrayList, LinkedList', 7),
(32, 'Коллекции. Set', 'Коллекции. Set: HashSet, TreeSet', 7),
(33, 'Коллекции. Map', 'Коллекции. Map: HashMap, TreeMap', 7),
(34, 'Исключения (Exceptions)', 'Исключения. Ключевые слова try-catch-finally. Иерархия исключений', 8),
(35, 'Введение в IO', 'Введение в IO. Работа с файлами: File, FileReader/FileWriter. JSON', 8),
(36, 'Работа с датой и временем', 'Работа с датой и временем. Регулярные выражения', 8),
(37, 'Введение в Maven/Gradle', 'Введение в Maven/Gradle. Сборка проекта, управление зависимостями', 8),
(38, 'Алгоритмы сортировок', 'Алгоритмы сортировок: пузырек, быстрая сортировка', 8),
(39, 'Потоки ввода-вывода (Streams)', 'Потоки ввода-вывода. BufferedReader/BufferedWriter', 8),
(40, 'JVM', 'Java Virtual Machine. Как работает JVM', 8),
(41, 'Введение в WEB', 'Введение в WEB. Концепция клиент-сервер', 8),
(42, 'Введение в Java', 'Введение. Установка JDK, настройка IDE. Первая программа "Hello, World!". Синтаксис', 9),
(43, 'Переменные и константы', 'Переменные и константы, типы данных, консольный ввод/вывод', 9),
(44, 'Git. Основы', 'Git. Изучаем или повторяем особенности', 9),
(45, 'Try/catch. Условные конструкции. Циклы', 'Введение в try/catch. Преобразования. Условные конструкции. Циклы', 9),
(46, 'Массивы и Методы', 'Массивы: одномерные и многомерные. Цикл for-each. Методы: создание, параметры, возвращаемое значение', 9),
(47, 'Перегрузка методов. Отладка', 'Перегрузка методов. Углубленная работа с консолью. Основы отладки в IDE', 9),
(48, 'Строки', 'Строки (String). Основные методы класса String', 9),
(49, 'Введение в IO', 'Введение в IO. Работа с файлами: File, FileReader/FileWriter', 9),
(50, 'Введение в ООП', 'Введение в ООП. Классы и объекты. Конструктор. this. Инкапсуляция. Getter/Setter', 10),
(51, 'Наследование и Полиморфизм', 'Наследование. extends. @Override. Полиморфизм. Абстрактные классы и методы', 10),
(52, 'Интерфейсы', 'Интерфейсы. implements. Различие между абстрактными классами и интерфейсами', 10),
(53, 'Класс Object. Дженерики. Коллекции', 'Класс Object. Дженерики. Обобщенные классы и методы. Коллекции', 10),
(54, 'Введение в веб', 'Введение в веб. Что происходит когда открывается сайт', 11),
(55, 'Spring Boot. Начало', 'Spring. Spring Boot. localhost, DNS. Аннотации. JSON. URL шаблоны', 11),
(56, 'REST API', 'Построение REST API. Методы запросов. Работа с телом запроса', 11),
(57, 'Spring Security', 'Безопасность. Введение в Spring Security. Аутентификация и авторизация. JWT', 11),
(58, 'Введение в БД', 'БД, SQLite/H2. Введение в тему. Установка базы данных', 12),
(59, 'SELECT, WHERE, ORDER BY, LIMIT', 'БД. SELECT, WHERE, ORDER BY, LIMIT', 12),
(60, 'INSERT, UPDATE, DELETE', 'БД. INSERT, UPDATE, DELETE', 12),
(61, 'Подключение БД к REST API', 'Подключение БД к REST API. CRUD операции', 12),
(62, 'HTML', 'HTML. Минимальная верстка страницы', 13),
(63, 'CSS', 'CSS. Добавляем стили на страницу', 13),
(64, 'JavaScript', 'Минимальный JS для отправки запросов на фронтенд', 13),
(65, 'Интеграция Фронта и Spring', 'Дружим Фронт и Spring. Соединяем сервер и фронтенд', 13);


CREATE TABLE IF NOT EXISTS `lesson_files` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `file_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lesson_files_lesson_id_foreign` (`lesson_id`),
  KEY `lesson_files_file_id_foreign` (`file_id`),
  CONSTRAINT `lesson_files_file_id_foreign` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_files_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `additional_materials` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `file_id` bigint UNSIGNED DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `additional_materials_lesson_id_foreign` (`lesson_id`),
  KEY `additional_materials_file_id_foreign` (`file_id`),
  CONSTRAINT `additional_materials_file_id_foreign` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  CONSTRAINT `additional_materials_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` text NOT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_lesson_id_foreign` (`lesson_id`),
  CONSTRAINT `tasks_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `tasks` (`id`, `title`, `description`, `content`, `difficulty`, `lesson_id`) VALUES
(5, 'Установка IntelliJ IDEA', 'Установка Intellij IDEA. Вывод Hello World. Простой тест на понимание программирования', '1. Скачать и установить IntelliJ IDEA\n2. Создать первый проект\n3. Написать программу Hello World\n4. Пройти простой тест на понимание программирования', 'Начальный', 15),
(6, 'Работа с переменными', 'Создание различных переменных, выполнение различных операций, ввод/вывод. Создание калькулятора', '1. Создать переменные всех примитивных типов\n2. Выполнить арифметические операции\n3. Реализовать ввод данных через Scanner\n4. Создать простой калькулятор (+, -, *, /)', 'Начальный', 16),
(7, 'Практика Git', 'Повторить всю работу описанную в презентации. Практика на https://learngitbranching.js.org/?locale=ru_RU', '1. Повторить основные команды Git\n2. Пройти интерактивный tutorial на learngitbranching.js.org\n3. Создать репозиторий и сделать первый commit', 'Начальный', 17),
(8, 'Условные операторы', 'Программа, которая определяет, является ли число четным/нечетным, положительным/отрицательным. Вывод названия дня недели по номеру', '1. Написать программу для определения четности числа\n2. Определить положительное или отрицательное число\n3. Вывести название дня недели по номеру (1-7)\n4. Использовать try/catch для обработки некорректного ввода', 'Начальный', 18),
(9, 'Циклы', 'Вывести таблицу умножения. Посчитать сумму чисел в диапазоне', '1. Вывести таблицу умножения от 1 до 10\n2. Посчитать сумму всех чисел в заданном диапазоне\n3. Реализовать цикл for, while, do-while\n4. Использовать break и continue', 'Начальный', 19),
(10, 'Работа с массивами', 'Найти минимальный/максимальный элемент в массиве', '1. Создать массив из 10 случайных чисел\n2. Найти минимальный элемент\n3. Найти максимальный элемент\n4. Вывести все элементы массива\n5. Использовать цикл for-each', 'Начальный', 20),
(11, 'Рефакторинг на методы', 'Разбить предыдущие программы на методы', '1. Взять программу с массивами\n2. Вынести поиск min/max в отдельные методы\n3. Создать метод для вывода массива\n4. Продемонстрировать перегрузку методов', 'Средний', 21),
(12, 'Отладка программ', 'Проходить все предыдущие задания в режиме отладки, отслеживая значения переменных', '1. Установить точки останова в коде\n2. Выполнить пошаговую отладку\n3. Отслеживать значения переменных в процессе выполнения\n4. Найти и исправить ошибки', 'Средний', 22),
(13, 'Работа со строками', 'Программа, которая проверяет, является ли строка палиндромом. Подсчитать количество вхождений символа в строке. Тест по пройденному материалу', '1. Проверить строку на палиндром\n2. Подсчитать количество вхождений заданного символа\n3. Использовать методы класса String\n4. Пройти тест по пройденному материалу', 'Средний', 23),
(14, 'Иерархия классов "Ящик и Фигуры"', 'Реализовать схему иерархии классов. Ящик может содержать фигуры. При попытке положить фигуру выводить сообщение об успехе или неудаче', '1. Создать абстрактный класс Figure\n2. Создать классы-наследники: Cube, Sphere, Cylinder\n3. Создать класс Box (ящик) с объемом\n4. Реализовать метод add(Figure figure)\n5. Выводить сообщение об успехе/неудаче', 'Средний', 24),
(15, 'Практика инкапсуляции', 'Создать класс с приватными полями, реализовать геттеры и сеттеры', '1. Создать класс Person с приватными полями (name, age)\n2. Реализовать конструктор\n3. Добавить геттеры и сеттеры\n4. Добавить валидацию в сеттеры', 'Средний', 25),
(16, 'Практика наследования', 'Создать иерархию классов животных с переопределением методов', '1. Создать класс Animal\n2. Создать классы Dog, Cat, Bird\n3. Переопределить метод makeSound()\n4. Использовать аннотацию @Override', 'Средний', 26),
(17, 'Практика полиморфизма', 'Создать абстрактный класс Shape и классы-наследники Circle, Rectangle с переопределением метода getArea()', '1. Создать абстрактный класс Shape\n2. Создать класс Circle с полем radius\n3. Создать класс Rectangle с полями width, height\n4. Переопределить метод getArea()\n5. Продемонстрировать полиморфизм', 'Средний', 27),
(18, 'Практика интерфейсов', 'Создать интерфейс Drawable и реализовать его в нескольких классах', '1. Создать интерфейс Drawable с методом draw()\n2. Реализовать интерфейс в классах Circle, Rectangle, Triangle\n3. Вызвать метод draw() для каждого объекта', 'Средний', 28),
(19, 'Тест по ООП', 'Комплексный тест по объектно-ориентированному программированию', '1. Тест на понимание принципов ООП\n2. Практические задания по ООП\n3. Рефакторинг кода с использованием ООП', 'Средний', 29),
(20, 'Практика Generics', 'Создать обобщенный класс Box<T> и методы для работы с ним', '1. Создать обобщенный класс Box<T>\n2. Добавить методы set(T item) и get()\n3. Создать обобщенный метод для сравнения объектов\n4. Продемонстрировать работу с разными типами', 'Сложный', 30),
(21, 'Практика List', 'Создать телефонный справочник с использованием ArrayList', '1. Создать класс Contact\n2. Использовать ArrayList для хранения контактов\n3. Реализовать методы add, remove, find\n4. Сравнить производительность ArrayList и LinkedList', 'Сложный', 31),
(22, 'Практика Set', 'Написать программу для удаления дубликатов из списка с использованием HashSet', '1. Создать список с дубликатами\n2. Использовать HashSet для удаления дубликатов\n3. Сравнить HashSet и TreeSet\n4. Продемонстрировать сортировку', 'Сложный', 32),
(23, 'Практика Map', 'Создать программу для подсчета частоты слов в тексте с использованием HashMap', '1. Разбить текст на слова\n2. Использовать HashMap для подсчета частоты\n3. Вывести статистику\n4. Сравнить HashMap и TreeMap', 'Сложный', 33),
(24, 'Практика исключений', 'Написать программу с обработкой различных исключений', '1. Обработать ArithmeticException\n2. Обработать ArrayIndexOutOfBoundsException\n3. Обработать NullPointerException\n4. Использовать try-catch-finally\n5. Создать собственное исключение', 'Сложный', 34),
(25, 'Работа с файлами', 'Создать программу для чтения и записи текстовых файлов. Работа с JSON', '1. Чтение из файла с помощью FileReader\n2. Запись в файл с помощью FileWriter\n3. Работа с JSON (библиотека Jackson/Gson)\n4. Сериализация/десериализация объектов', 'Сложный', 35),
(26, 'Работа с датой и временем', 'Расчет количества дней между двумя датами. Регулярные выражения', '1. Использовать LocalDate, LocalDateTime\n2. Рассчитать количество дней между датами\n3. Использовать регулярные выражения для валидации\n4. Форматирование дат', 'Сложный', 36),
(27, 'Сборка проекта с Maven', 'Создать многомодульный проект с использованием Maven/Gradle', '1. Создать проект с Maven\n2. Добавить зависимости в pom.xml\n3. Собрать проект\n4. Настроить плагины', 'Сложный', 37),
(28, 'Реализация сортировок', 'Реализовать алгоритмы сортировки "пузырьком" и "быструю сортировку"', '1. Реализовать сортировку пузырьком\n2. Реализовать быструю сортировку\n3. Сравнить скорость выполнения\n4. Протестировать на разных массивах', 'Сложный', 38),
(29, 'Практика Streams', 'Использование BufferedReader/BufferedWriter для работы с файлами', '1. Чтение больших файлов через BufferedReader\n2. Запись через BufferedWriter\n3. Сравнить производительность с FileReader/FileWriter', 'Сложный', 39),
(30, 'Изучение JVM', 'Написать программу с отслеживанием работы сборщика мусора', '1. Создать много объектов\n2. Вызвать System.gc()\n3. Отслеживать память через Runtime\n4. Изучить параметры JVM', 'Сложный', 40),
(31, 'Клиент-серверное взаимодействие', 'Создать простой клиент-серверный чат', '1. Создать сервер на сокетах\n2. Создать клиента\n3. Реализовать обмен сообщениями\n4. Понять принципы клиент-сервер', 'Сложный', 41),
(40, 'Установка и Hello World (11 класс)', 'Установка IntelliJ IDEA, Hello World, тест на понимание программирования', '1. Скачать и установить JDK\n2. Установить IntelliJ IDEA\n3. Написать программу Hello World\n4. Пройти тест', 'Начальный', 42),
(41, 'Переменные и калькулятор (11 класс)', 'Создание переменных, выполнение операций, создание калькулятора', '1. Объявить переменные разных типов\n2. Выполнить арифметические операции\n3. Реализовать ввод данных\n4. Создать калькулятор', 'Начальный', 43),
(42, 'Git практика (11 класс)', 'Работа с Git на learngitbranching.js.org', '1. Основные команды Git\n2. Работа с ветками\n3. Интерактивный tutorial', 'Начальный', 44),
(43, 'Условные операторы и циклы (11 класс)', 'Определение четности, дня недели, таблица умножения, сумма чисел', '1. Определить четность/нечетность\n2. Вывести день недели\n3. Таблица умножения\n4. Сумма чисел в диапазоне', 'Начальный', 45),
(44, 'Массивы и методы (11 класс)', 'Поиск min/max в массиве, разбивка программ на методы', '1. Работа с массивами\n2. Поиск min/max\n3. Вынести логику в методы', 'Средний', 46),
(45, 'Отладка (11 класс)', 'Пошаговая отладка всех предыдущих программ', '1. Точки останова\n2. Пошаговое выполнение\n3. Анализ переменных', 'Средний', 47),
(46, 'Строки (11 класс)', 'Проверка строки на палиндром, подсчет символов', '1. Проверка на палиндром\n2. Подсчет символов\n3. Методы String', 'Средний', 48),
(47, 'Файловый ввод-вывод (11 класс)', 'Чтение и запись файлов', '1. FileReader/FileWriter\n2. Чтение из файла\n3. Запись в файл', 'Средний', 49),
(48, 'ООП практика (11 класс)', 'Реализация иерархии классов "Ящик и Фигуры"', '1. Классы и объекты\n2. Наследование\n3. Полиморфизм\n4. Инкапсуляция', 'Средний', 50),
(49, 'Наследование и полиморфизм (11 класс)', 'Создание иерархии с абстрактными классами', '1. Абстрактные классы\n2. Наследование\n3. Переопределение методов', 'Средний', 51),
(50, 'Интерфейсы (11 класс)', 'Реализация интерфейсов', '1. Создание интерфейсов\n2. Реализация интерфейсов\n3. Множественное наследование', 'Средний', 52),
(51, 'Коллекции и Generics (11 класс)', 'Работа с List, Set, Map, Generics', '1. ArrayList, LinkedList\n2. HashSet, TreeSet\n3. HashMap, TreeMap\n4. Generics', 'Средний', 53),
(52, 'Введение в веб (11 класс)', 'Изучение модели клиент-сервер', '1. HTTP протокол\n2. Клиент-сервер\n3. REST API', 'Сложный', 54),
(53, 'Spring Boot Hello World (11 класс)', 'Создание проекта Spring Boot, первый Hello World эндпоинт', '1. Создать Spring Boot проект\n2. Создать REST контроллер\n3. GET запрос /hello\n4. Запустить приложение', 'Сложный', 55),
(54, 'REST API практика (11 класс)', 'Построение REST API на файлах', '1. CRUD операции\n2. Работа с JSON\n3. Postman тестирование', 'Сложный', 56),
(55, 'Spring Security (11 класс)', 'Настройка аутентификации и авторизации, JWT', '1. Добавить Spring Security\n2. Настроить аутентификацию\n3. Реализовать JWT', 'Сложный', 57),
(56, 'Введение в SQL (11 класс)', 'Установка базы данных H2, первые запросы', '1. Подключить H2\n2. Написать CREATE TABLE\n3. Вставить данные', 'Сложный', 58),
(65, 'название', '123', '313', 'Средний', 15);

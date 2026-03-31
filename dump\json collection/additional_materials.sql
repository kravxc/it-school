-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:8889
-- Время создания: Мар 31 2026 г., 07:54
-- Версия сервера: 8.0.40
-- Версия PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `it_school`
--

-- --------------------------------------------------------

--
-- Структура таблицы `additional_materials`
--

CREATE TABLE `additional_materials` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `file_id` bigint UNSIGNED DEFAULT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `additional_materials`
--

INSERT INTO `additional_materials` (`id`, `title`, `description`, `lesson_id`, `file_id`, `link`, `type`, `created_at`, `updated_at`) VALUES
(4, 'title material', NULL, 3, NULL, 'vk.com', NULL, '2026-03-30 10:16:07', '2026-03-30 10:16:07'),
(13, 'title material', NULL, 3, 8, 'vk.com', NULL, '2026-03-31 02:49:34', '2026-03-31 02:49:34'),
(14, 'title material', NULL, 4, 8, 'vk.com', NULL, '2026-03-31 02:49:41', '2026-03-31 02:49:41');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `additional_materials`
--
ALTER TABLE `additional_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `additional_materials_lesson_id_foreign` (`lesson_id`),
  ADD KEY `additional_materials_file_id_foreign` (`file_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `additional_materials`
--
ALTER TABLE `additional_materials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `additional_materials`
--
ALTER TABLE `additional_materials`
  ADD CONSTRAINT `additional_materials_file_id_foreign` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `additional_materials_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

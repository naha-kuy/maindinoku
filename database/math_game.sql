
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `answers` (
  `id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `answer_text` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `time_spent` int DEFAULT NULL,
  `answered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `answers` (`id`, `player_id`, `question_id`, `answer_text`, `is_correct`, `time_spent`, `answered_at`, `level`) VALUES
(374, 53, 1, '{\"number1\":29,\"number2\":7,\"operation\":\"×\",\"final_answer\":\"203\"}', 1, 36, '2025-11-03 10:15:05', 1),
(375, 53, 2, '{\"number1\":9,\"number2\":18,\"operation\":\"×\",\"final_answer\":\"\"}', 0, 5, '2025-11-03 10:17:12', 1),
(376, 53, 3, '{\"number1\":98,\"number2\":54,\"operation\":\"×\",\"final_answer\":\"\"}', 0, 4, '2025-11-03 10:17:22', 1),
(377, 53, 1, '{\"number1\":24,\"number2\":6,\"operation\":\"÷\",\"final_answer\":\"4\"}', 1, 12, '2025-11-03 10:47:39', 2),
(378, 53, 2, '{\"number1\":85,\"number2\":17,\"operation\":\"÷\",\"final_answer\":\"\"}', 0, 3, '2025-11-03 10:47:54', 2),
(379, 53, 1, '{\"number1\":\"24\",\"number2\":\"8\",\"operation\":\"÷\",\"final_answer\":\"3\"}', 1, 14, '2025-11-03 10:48:28', 4),
(380, 53, 2, '{\"number1\":\"7\",\"number2\":\"14\",\"operation\":\"×\",\"final_answer\":\"98\"}', 1, 14, '2025-11-03 10:49:52', 4),
(381, 53, 3, '{\"number1\":\"72\",\"number2\":\"9\",\"operation\":\"÷\",\"final_answer\":\"8\"}', 1, 23, '2025-11-03 10:51:16', 4),
(382, 53, 4, '{\"number1\":\"\",\"number2\":\"\",\"operation\":\"×\",\"final_answer\":\"\"}', 0, 2, '2025-11-03 10:51:57', 4),
(383, 53, 5, '{\"number1\":\"96\",\"number2\":\"6\",\"operation\":\"÷\",\"final_answer\":\"17\"}', 0, 12, '2025-11-03 10:52:11', 4),
(384, 54, 1, '{\"number1\":68,\"number2\":9,\"operation\":\"×\",\"final_answer\":\"612\"}', 1, 11, '2025-11-03 11:11:38', 1),
(385, 54, 2, '{\"number1\":5,\"number2\":13,\"operation\":\"×\",\"final_answer\":\"\"}', 0, 1, '2025-11-03 11:11:53', 1),
(386, 54, 3, '{\"number1\":65,\"number2\":54,\"operation\":\"×\",\"final_answer\":\"\"}', 0, 1, '2025-11-03 11:11:56', 1),
(387, 54, 1, '{\"number1\":28,\"number2\":1,\"operation\":\"÷\",\"final_answer\":\"28\"}', 1, 4, '2025-11-03 11:12:13', 2),
(388, 54, 2, '{\"number1\":54,\"number2\":27,\"operation\":\"÷\",\"final_answer\":\"\"}', 0, 2, '2025-11-03 11:12:24', 2),
(389, 54, 1, '{\"number1\":\"8\",\"number2\":\"24\",\"operation\":\"÷\",\"final_answer\":\"3\"}', 0, 12, '2025-11-03 11:12:48', 4),
(390, 54, 2, '{\"number1\":\"14\",\"number2\":\"7\",\"operation\":\"×\",\"final_answer\":\"98\"}', 1, 12, '2025-11-03 11:13:04', 4),
(391, 54, 3, '{\"number1\":\"72\",\"number2\":\"9\",\"operation\":\"÷\",\"final_answer\":\"8\"}', 1, 14, '2025-11-03 11:13:26', 4),
(392, 54, 4, '{\"number1\":\"\",\"number2\":\"\",\"operation\":\"×\",\"final_answer\":\"\"}', 0, 1, '2025-11-03 11:13:37', 4),
(393, 54, 5, '{\"number1\":\"\",\"number2\":\"\",\"operation\":\"×\",\"final_answer\":\"\"}', 0, 1, '2025-11-03 11:13:40', 4);

CREATE TABLE `dinos` (
  `id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `dino_name` varchar(50) DEFAULT NULL,
  `dino_type` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `obtained_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `answer_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dinos` (`id`, `player_id`, `dino_name`, `dino_type`, `image`, `obtained_at`, `answer_id`) VALUES
(159, 53, 'Troodon-8780', 'Troodon', '/assets/images/troodon.png', '2025-11-03 10:15:05', 374),
(160, 53, 'Dilophosaurus-4577', 'Dilophosaurus', '/assets/images/dilophosaurus.png', '2025-11-03 10:47:39', 377),
(161, 53, 'Tarbosaurus-3189', 'Tarbosaurus', '/assets/images/tarbosaurus.png', '2025-11-03 10:48:28', 379),
(162, 53, 'Iguanodon-3178', 'Iguanodon', '/assets/images/iguanodon.png', '2025-11-03 10:49:52', 380),
(163, 53, 'Ankylosaurus-7907', 'Ankylosaurus', '/assets/images/ankylosaurus.png', '2025-11-03 10:51:16', 381),
(164, 54, 'Iguanodon-9184', 'Iguanodon', '/assets/images/iguanodon.png', '2025-11-03 11:11:38', 384),
(165, 54, 'Velociraptor-3361', 'Velociraptor', '/assets/images/velociraptor.png', '2025-11-03 11:12:13', 387),
(166, 54, 'Troodon-2665', 'Troodon', '/assets/images/troodon.png', '2025-11-03 11:13:04', 390),
(167, 54, 'Ankylosaurus-7363', 'Ankylosaurus', '/assets/images/ankylosaurus.png', '2025-11-03 11:13:26', 391);

CREATE TABLE `levels` (
  `id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `level_number` int DEFAULT NULL,
  `status` enum('unlocked','locked','completed') DEFAULT 'locked',
  `score` int DEFAULT '0',
  `time_spent` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `levels` (`id`, `player_id`, `level_number`, `status`, `score`, `time_spent`) VALUES
(201, 53, 1, 'completed', 0, 364),
(202, 53, 2, 'completed', 10, 183),
(203, 53, 4, 'completed', 0, 732),
(204, 54, 1, 'completed', 10, 361),
(205, 54, 2, 'completed', 10, 182),
(206, 54, 4, 'completed', 20, 721);

CREATE TABLE `players` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `score` int DEFAULT '0',
  `total_time` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `players` (`id`, `name`, `score`, `total_time`, `created_at`) VALUES
(53, 'Percobaan 1', 10, 1279, '2025-11-03 10:02:36'),
(54, 'percobaan 2', 40, 1264, '2025-11-03 11:11:23');

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `level` int DEFAULT NULL,
  `question_text` text,
  `question_image` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(50) DEFAULT NULL,
  `number1` int DEFAULT NULL,
  `number2` int DEFAULT NULL,
  `operation` enum('×','÷') DEFAULT NULL,
  `final_answer` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `questions` (`id`, `level`, `question_text`, `question_image`, `correct_answer`, `number1`, `number2`, `operation`, `final_answer`) VALUES
(1, 4, 'Sebanyak 24 petualang cilik yang bersemangat telah berkumpul untuk memulai ekspedisi \'Festival Penjelajah Dino\'. Mereka akan dibagi menjadi beberapa kelompok untuk memudahkan penjelajahan dan pencarian telur dinosaurus yang tersembunyi. Jika panitia memutuskan untuk membentuk 8 kelompok dengan jumlah anggota yang sama banyak di setiap kelompok, berapakah jumlah petualang cilik yang akan berada di dalam satu kelompok?', '/assets/images/soal_cerita_1.png', '3', 24, 8, '÷', 3),
(2, 4, 'Di Jurassic Garden, seorang peneliti sedang mengumpulkan telur dinosaurus untuk diteliti. Ia memiliki 14 box yang tersusun rapi di sampingnya. Setiap box berisi 7 telur dinosaurus berwarna putih dengan corak emas indah yang baru saja ditemukan. Jika semua telur itu dihitung, berapa jumlah seluruh telur dinosaurus yang dimiliki peneliti tersebut?', '/assets/images/soal_cerita_2.png', '98', 14, 7, '×', 98),
(3, 4, 'Kereta ekspedisi Jurassic World membawa 72 pengunjung yang ingin berkeliling taman dinosaurus. Setiap gerbong hanya dapat menampung 9 orang. Berapa banyak gerbong yang dibutuhkan agar semua penumpang bisa naik dengan aman?', '/assets/images/soal_cerita_3.png', '8', 72, 9, '÷', 8),
(4, 4, 'Terdapat seorang petualang cilik bernama Cello yang membawa 7 keranjang berisi burger untuk dibagikan kepada teman-temannya. Setiap keranjang berisi 19 burger yang lezat. Cello ingin menghitung berapa banyak burger yang ia bawa semuanya. Berapa jumlah seluruh burger yang dibawa Cello?', '/assets/images/soal_cerita_4.png', '133', 7, 19, '×', 133),
(5, 4, 'Selama perjalanan penelitian, para ilmuwan berhasil mengumpulkan 96 telur Pterosaurus dari tebing tinggi. Telur-telur itu dibagikan rata kepada 6 anggota tim peneliti agar proses pemeriksaan lebih cepat. Hitunglah berapa telur yang diterima setiap anggota tim?', '/assets/images/soal_cerita_5.png', '16', 96, 6, '÷', 16);

ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `question_id` (`question_id`);

ALTER TABLE `dinos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dinos_answer_id_unique` (`answer_id`),
  ADD KEY `player_id` (`player_id`);

ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`);

ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=394;

ALTER TABLE `dinos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

ALTER TABLE `levels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

ALTER TABLE `players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

ALTER TABLE `dinos`
  ADD CONSTRAINT `dinos_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `fk_dinos_answer` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);
COMMIT;
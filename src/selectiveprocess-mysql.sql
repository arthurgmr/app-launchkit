CREATE DATABASE launchkitdb;

CREATE TABLE `students` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `birth_date` text NOT NULL,
  `user_id` text NOT NULL,
  `class_id` text,
  `class_name` text NOT NULL,
  `regime` text,
  `launchkit` text,
  `diaper_size` text
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `role` text NOT NULL,
  `password` text NOT NULL DEFAULT '{XXX}',
  `password_master` text,
  `reset_token` text,
  `reset_token_expires` text
);


-- CREATE TABLE `classes` (
--   `id` int PRIMARY KEY AUTO_INCREMENT,
--   `name` text NOT NULL,
--   `user_id` text NOT NULL,
--   `student_id` text NOT NULL
-- )

ALTER TABLE `students` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);



CREATE TABLE session(
  sid                     VARCHAR(100) PRIMARY KEY NOT NULL,   
  session                 VARCHAR(2048) DEFAULT '{}',   
  lastSeen                DATETIME DEFAULT NOW() 
);


-- -- TO RUN SEEDS
-- DELETE FROM users;
-- DELETE FROM users_admin;
-- DELETE FROM files;

-- -- RESTAR SEQUENCE AUTO_INCREMENT FROM TABLES IDS
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE files_id_seq RESTART WITH 1;
-- Create "failed_jobs" table
CREATE TABLE `failed_jobs` (`id` bigint unsigned NOT NULL AUTO_INCREMENT, `uuid` varchar(255) NOT NULL, `connection` text NOT NULL, `queue` text NOT NULL, `payload` longtext NOT NULL, `exception` longtext NOT NULL, `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), UNIQUE INDEX `failed_jobs_uuid_unique` (`uuid`)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Create "migrations" table
CREATE TABLE `migrations` (`id` int unsigned NOT NULL AUTO_INCREMENT, `migration` varchar(255) NOT NULL, `batch` int NOT NULL, PRIMARY KEY (`id`)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci AUTO_INCREMENT 5;
-- Create "password_reset_tokens" table
CREATE TABLE `password_reset_tokens` (`email` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `created_at` timestamp NULL, PRIMARY KEY (`email`)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Create "personal_access_tokens" table
CREATE TABLE `personal_access_tokens` (`id` bigint unsigned NOT NULL AUTO_INCREMENT, `tokenable_type` varchar(255) NOT NULL, `tokenable_id` bigint unsigned NOT NULL, `name` varchar(255) NOT NULL, `token` varchar(64) NOT NULL, `abilities` text NULL, `last_used_at` timestamp NULL, `expires_at` timestamp NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`), UNIQUE INDEX `personal_access_tokens_token_unique` (`token`), INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Create "users" table
CREATE TABLE `users` (`id` bigint unsigned NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `email_verified_at` timestamp NULL, `password` varchar(255) NOT NULL, `remember_token` varchar(100) NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`), UNIQUE INDEX `users_email_unique` (`email`)) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

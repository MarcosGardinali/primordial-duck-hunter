-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `blood_type` VARCHAR(10) NULL,
    `height` DECIMAL(5, 2) NULL,
    `weight` DECIMAL(5, 2) NULL,
    `rank` VARCHAR(100) NULL,
    `specialization` VARCHAR(255) NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `verification_code` VARCHAR(10) NULL,
    `code_expires_at` DATETIME(3) NULL,
    `tours_completed` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serial_number` VARCHAR(100) NOT NULL,
    `brand` VARCHAR(100) NOT NULL,
    `manufacturer` VARCHAR(100) NOT NULL,
    `country_origin` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `drones_serial_number_key`(`serial_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `superpowers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `classification` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `primordial_ducks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(255) NULL,
    `photo_url` VARCHAR(255) NULL,
    `drone_id` INTEGER NOT NULL,
    `height` DECIMAL(10, 2) NOT NULL,
    `weight` DECIMAL(10, 2) NOT NULL,
    `height_unit` VARCHAR(10) NOT NULL DEFAULT 'cm',
    `weight_unit` VARCHAR(10) NOT NULL DEFAULT 'g',
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `country_code` VARCHAR(10) NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `gps_precision` DECIMAL(10, 2) NOT NULL,
    `precision_unit` VARCHAR(10) NOT NULL DEFAULT 'cm',
    `reference_point` VARCHAR(255) NULL,
    `hibernation_status` ENUM('desperto', 'em_transe', 'hibernacao_profunda') NOT NULL,
    `heart_rate_bpm` INTEGER NULL,
    `mutations_count` INTEGER NOT NULL DEFAULT 0,
    `superpower_id` INTEGER NULL,
    `captured` BOOLEAN NOT NULL DEFAULT false,
    `capture_strategy` VARCHAR(255) NULL,
    `capture_date` DATETIME(3) NULL,
    `discovered_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drone_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `battery` INTEGER NOT NULL DEFAULT 100,
    `fuel` INTEGER NOT NULL DEFAULT 100,
    `integrity` INTEGER NOT NULL DEFAULT 100,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `screen_name` VARCHAR(50) NOT NULL,
    `completed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_tours_user_id_screen_name_key`(`user_id`, `screen_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `primordial_ducks` ADD CONSTRAINT `primordial_ducks_drone_id_fkey` FOREIGN KEY (`drone_id`) REFERENCES `drones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `primordial_ducks` ADD CONSTRAINT `primordial_ducks_superpower_id_fkey` FOREIGN KEY (`superpower_id`) REFERENCES `superpowers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tours` ADD CONSTRAINT `user_tours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
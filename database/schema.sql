-- ============================================================================
-- LuxeStay Enterprise Hospitality Management System — MySQL 8.0 Relational Schema
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `luxestay_hotel_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `luxestay_hotel_db`;

-- 1. USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('guest', 'manager', 'staff', 'admin') NOT NULL DEFAULT 'guest',
  `phone` VARCHAR(30) NULL,
  `country` VARCHAR(100) NULL,
  `loyalty_tier` ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond VIP') DEFAULT 'Bronze',
  `reward_points` INT UNSIGNED DEFAULT 500,
  `managed_hotel_id` VARCHAR(50) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. HOTELS PORTFOLIO TABLE
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `neighborhood` VARCHAR(100) NOT NULL,
  `star_rating` TINYINT UNSIGNED NOT NULL CHECK (`star_rating` BETWEEN 1 AND 5),
  `guest_rating` DECIMAL(3,2) NOT NULL DEFAULT 4.50,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `category` ENUM('Luxury Resort', 'Heritage Palace', 'Boutique Hotel', 'Business & City', 'Beachfront Villa', 'Eco Lodge') NOT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `description` TEXT NOT NULL,
  `check_in_time` VARCHAR(20) NOT NULL DEFAULT '02:00 PM',
  `check_out_time` VARCHAR(20) NOT NULL DEFAULT '11:00 AM',
  `cancellation_policy` VARCHAR(255) NOT NULL,
  `contact_phone` VARCHAR(30) NOT NULL,
  `contact_email` VARCHAR(150) NOT NULL,
  `total_rooms` INT UNSIGNED NOT NULL DEFAULT 100,
  `available_rooms` INT UNSIGNED NOT NULL DEFAULT 40,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_hotels_city` (`city`),
  INDEX `idx_hotels_category` (`category`),
  INDEX `idx_hotels_price` (`price_per_night`),
  INDEX `idx_hotels_star` (`star_rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ROOM INVENTORY TABLE
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `room_number` VARCHAR(20) NOT NULL,
  `room_type` VARCHAR(100) NOT NULL,
  `capacity_adults` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  `capacity_children` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `bed_type` VARCHAR(50) NOT NULL DEFAULT 'King Bed',
  `size_sqft` INT UNSIGNED NOT NULL,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `floor` VARCHAR(20) NOT NULL,
  `view` VARCHAR(50) NOT NULL,
  `breakfast_included` BOOLEAN NOT NULL DEFAULT TRUE,
  `free_cancellation` BOOLEAN NOT NULL DEFAULT TRUE,
  `smoking` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('Available', 'Occupied', 'Under Cleaning', 'Maintenance') NOT NULL DEFAULT 'Available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE,
  INDEX `idx_rooms_hotel_status` (`hotel_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. BOOKINGS / RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `room_id` VARCHAR(50) NOT NULL,
  `guest_id` VARCHAR(50) NOT NULL,
  `guest_name` VARCHAR(150) NOT NULL,
  `guest_email` VARCHAR(150) NOT NULL,
  `guest_phone` VARCHAR(30) NOT NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `nights` INT UNSIGNED NOT NULL,
  `adults_count` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  `children_count` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `rooms_count` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `room_total` DECIMAL(10,2) NOT NULL,
  `tax_amount` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `special_requests` TEXT NULL,
  `booking_status` ENUM('Confirmed', 'Checked In', 'Checked Out', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  `payment_status` ENUM('Pending', 'Paid', 'Refunded') NOT NULL DEFAULT 'Paid',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Credit Card',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`),
  FOREIGN KEY (`guest_id`) REFERENCES `users`(`id`),
  INDEX `idx_bookings_status` (`booking_status`),
  INDEX `idx_bookings_dates` (`check_in`, `check_out`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `booking_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `gateway` VARCHAR(50) NOT NULL DEFAULT 'Stripe / Razorpay',
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `status` ENUM('Success', 'Failed', 'Refunded') NOT NULL DEFAULT 'Success',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. VERIFIED GUEST REVIEWS
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `guest_id` VARCHAR(50) NOT NULL,
  `guest_name` VARCHAR(150) NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL,
  `cleanliness_rating` TINYINT UNSIGNED NOT NULL,
  `service_rating` TINYINT UNSIGNED NOT NULL,
  `comment` TEXT NOT NULL,
  `stay_type` VARCHAR(50) DEFAULT 'Leisure Couple',
  `verified_stay` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE,
  INDEX `idx_reviews_hotel` (`hotel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. HOTEL AMENITIES
CREATE TABLE IF NOT EXISTS `hotel_amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `amenity_name` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE,
  INDEX `idx_amenities_hotel` (`hotel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. HOTEL GALLERY IMAGES
CREATE TABLE IF NOT EXISTS `hotel_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. GUEST SERVICE REQUESTS (IN-ROOM DINING & CONCIERGE)
CREATE TABLE IF NOT EXISTS `service_requests` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `hotel_id` VARCHAR(50) NOT NULL,
  `room_number` VARCHAR(20) NOT NULL,
  `guest_name` VARCHAR(150) NOT NULL,
  `service_category` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. LOYALTY REWARD TRANSACTIONS
CREATE TABLE IF NOT EXISTS `loyalty_transactions` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `points` INT NOT NULL,
  `type` ENUM('EARNED', 'REDEEMED', 'BONUS') NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. PROMO CODES & VOUCHERS
CREATE TABLE IF NOT EXISTS `coupons` (
  `code` VARCHAR(50) NOT NULL PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `discount_percent` INT UNSIGNED NOT NULL,
  `max_discount` DECIMAL(10,2) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `expiry_date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS `system_audit_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `actor_id` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Demo Promo Codes
INSERT INTO `coupons` (`code`, `title`, `discount_percent`, `max_discount`, `active`, `expiry_date`) VALUES
('LUXE20', 'Grand 20% Luxury Welcome', 20, 15000.00, TRUE, '2028-12-31'),
('ROYAL15', '15% Royal Ambassador Privilege', 15, 10000.00, TRUE, '2028-12-31'),
('SUMMER10', '10% Summer Escape Discount', 10, 8000.00, TRUE, '2028-12-31')
ON DUPLICATE KEY UPDATE `active` = TRUE;

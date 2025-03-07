-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 07, 2025 lúc 05:33 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `real_estate`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` enum('LAND','HOUSE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'LAND'),
(2, 'HOUSE');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favourite_properties`
--

CREATE TABLE `favourite_properties` (
  `favourite_property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `favourite_properties`
--

INSERT INTO `favourite_properties` (`favourite_property_id`, `user_id`, `property_id`) VALUES
(1, 1, 4),
(2, 1, 5),
(3, 2, 1),
(4, 3, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `furnished_statuses`
--

CREATE TABLE `furnished_statuses` (
  `furnished_status_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `furnished_statuses`
--

INSERT INTO `furnished_statuses` (`furnished_status_id`, `name`) VALUES
(1, 'HIGH_END_FURNITURE'),
(2, 'FULLY_FURNISHED'),
(3, 'BASIC_FINISHING'),
(4, 'RAW_HANDOVER');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `houses`
--

CREATE TABLE `houses` (
  `house_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `floors` int(11) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `toilets` int(11) NOT NULL,
  `furnished_status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `houses`
--

INSERT INTO `houses` (`house_id`, `property_id`, `floors`, `bedrooms`, `toilets`, `furnished_status_id`) VALUES
(1, 4, 3, 5, 5, 2),
(2, 5, 3, 3, 3, 3),
(3, 6, 1, 2, 2, 1),
(4, 14, 2, 3, 2, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `house_characteristics`
--

CREATE TABLE `house_characteristics` (
  `house_characteristic_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `house_characteristics`
--

INSERT INTO `house_characteristics` (`house_characteristic_id`, `name`) VALUES
(1, 'CAR_ACCESS_ALLEY'),
(2, 'EXPANDED_HOUSE'),
(3, 'NARROWED_HOUSE'),
(4, 'PLANNING_AFFECTED_HOUSE'),
(5, 'UNCOMPLETED_HOUSE'),
(6, 'DAMAGED_HOUSE'),
(7, 'NON_RESIDENTIAL_LAND');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `house_characteristic_mappings`
--

CREATE TABLE `house_characteristic_mappings` (
  `house_characteristic_mapping_id` int(11) NOT NULL,
  `house_id` int(11) NOT NULL,
  `house_characteristic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `house_characteristic_mappings`
--

INSERT INTO `house_characteristic_mappings` (`house_characteristic_mapping_id`, `house_id`, `house_characteristic_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 2, 2),
(4, 3, 3),
(5, 4, 2),
(6, 4, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lands`
--

CREATE TABLE `lands` (
  `land_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `land_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lands`
--

INSERT INTO `lands` (`land_id`, `property_id`, `land_type_id`) VALUES
(1, 1, 1),
(2, 2, 4),
(3, 3, 3),
(4, 9, 3),
(5, 10, 3),
(6, 11, 3),
(7, 12, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `land_characteristics`
--

CREATE TABLE `land_characteristics` (
  `land_characteristic_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `land_characteristics`
--

INSERT INTO `land_characteristics` (`land_characteristic_id`, `name`) VALUES
(1, 'FRONTAGE'),
(2, 'BACK_EXPANSION'),
(3, 'PARTIAL_RESIDENTIAL'),
(4, 'NO_RESIDENTIAL'),
(5, 'CAR_ALLEY'),
(6, 'ALL_RESIDENTIAL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `land_characteristic_mappings`
--

CREATE TABLE `land_characteristic_mappings` (
  `land_characteristic_mapping_id` int(11) NOT NULL,
  `land_id` int(11) NOT NULL,
  `land_characteristic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `land_characteristic_mappings`
--

INSERT INTO `land_characteristic_mappings` (`land_characteristic_mapping_id`, `land_id`, `land_characteristic_id`) VALUES
(1, 1, 1),
(2, 1, 5),
(3, 2, 4),
(4, 3, 4),
(5, 5, 5),
(6, 5, 1),
(7, 6, 1),
(8, 6, 5),
(9, 7, 5),
(10, 7, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `land_types`
--

CREATE TABLE `land_types` (
  `land_type_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `land_types`
--

INSERT INTO `land_types` (`land_type_id`, `name`) VALUES
(1, 'RESIDENTIAL_LAND'),
(2, 'PROJECT_LAND'),
(3, 'INDUSTRIAL_LAND'),
(4, 'AGRICULTURAL_LAND');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `properties`
--

CREATE TABLE `properties` (
  `property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `status` enum('PENDING','APPROVAL','CANCELED') NOT NULL DEFAULT 'PENDING',
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `region` varchar(50) NOT NULL,
  `ward_name` varchar(50) NOT NULL,
  `street_name` varchar(100) NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `property_legal_document_id` int(11) NOT NULL,
  `direction` int(11) NOT NULL,
  `area` double NOT NULL,
  `length` double NOT NULL,
  `width` double NOT NULL,
  `images` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `properties`
--

INSERT INTO `properties` (`property_id`, `user_id`, `category_id`, `status`, `title`, `description`, `region`, `ward_name`, `street_name`, `longitude`, `latitude`, `property_legal_document_id`, `direction`, `area`, `length`, `width`, `images`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'APPROVAL', 'Đất nền khu vực Liên Chiểu', 'Đất nền dự án có vị trí đắc địa, tiềm năng tăng giá cao', 'Đà Nẵng', 'Phường Hòa Thuận Đông', 'Đại lộ Lê Hồng Phong', 108.21, 16.035, 1, 3, 300, 30, 15, 'land_danang1.jpg,land_danang2.jpg', 6500000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(2, 2, 1, 'APPROVAL', 'Đất nông nghiệp tại Cẩm Lệ', 'Đất canh tác màu mỡ, thích hợp cho nông nghiệp sạch', 'Đà Nẵng', 'Phường Hòa Cường Nam', 'Đường Nguyễn Văn Linh', 108.185, 16.03, 2, 5, 4500, 110, 55, 'agri_land_danang1.jpg,agri_land_danang2.jpg', 3200000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(3, 1, 1, 'PENDING', 'Đất công nghiệp tại Sơn Trà', 'Đất công nghiệp có hạ tầng đầy đủ, gần bến cảng', 'Đà Nẵng', 'Phường Sơn Trà', 'Đường Lê Duẩn', 108.3, 16.07, 1, 2, 9000, 140, 90, 'industrial_land_danang.jpg', 23000000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(4, 2, 2, 'APPROVAL', 'Biệt thự ven biển Bãi Bụt', 'Biệt thự sang trọng với view biển, khuôn viên rộng, an ninh 24/7', 'Đà Nẵng', 'Phường Ngũ Hành Sơn', 'Đường Trần Phú', 108.315, 16.075, 1, 7, 360, 35, 20, 'villa_danang1.jpg,villa_danang2.jpg,villa_danang3.jpg', 57000000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(5, 1, 2, 'APPROVAL', 'Nhà phố Đà Nẵng', 'Nhà phố liền kề khu thương mại sầm uất, thuận tiện giao thông', 'Đà Nẵng', 'Phường Thanh Bình', 'Đường Lê Duẩn', 108.22, 16.055, 1, 4, 140, 20, 12, 'townhouse_danang1.jpg,townhouse_danang2.jpg', 16000000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(6, 3, 2, 'PENDING', 'Chung cư cao cấp Bạch Đằng', 'Chung cư hiện đại, view thành phố, đầy đủ tiện ích', 'Đà Nẵng', 'Phường Hòa Cường Bắc', 'Đường Bạch Đằng', 108.226, 16.067, 1, 6, 95, 14, 9, 'apartment_danang1.jpg,apartment_danang2.jpg', 8200000000.00, '2025-03-06 09:51:17', '2025-03-06 09:51:17'),
(9, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-07 02:54:30', '2025-03-07 02:54:30'),
(10, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-07 03:16:36', '2025-03-07 03:16:36'),
(11, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-07 03:25:03', '2025-03-07 03:25:03'),
(12, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-07 03:25:57', '2025-03-07 03:25:57'),
(14, 2, 2, 'PENDING', 'Nhà phố trung tâm', 'Nhà phố 2 tầng, mặt tiền đường lớn, gần trường học và chợ', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 2, 100, 10, 10, 'house_new_1.jpg,house_new_2.jpg', 3500000000.00, '2025-03-07 03:52:55', '2025-03-07 03:52:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `property_legal_documents`
--

CREATE TABLE `property_legal_documents` (
  `property_legal_document_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `property_legal_documents`
--

INSERT INTO `property_legal_documents` (`property_legal_document_id`, `name`) VALUES
(1, 'HAS_PAPER'),
(2, 'WAITING_FOR_PAPER'),
(3, 'NO_PAPER'),
(4, 'SHARED_PAPER'),
(5, 'HANDWRITTEN_DOCUMENT');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` enum('CUSTOMER','BROKER','ADMIN') NOT NULL DEFAULT 'CUSTOMER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`role_id`, `name`) VALUES
(1, 'ADMIN'),
(2, 'BROKER'),
(3, 'CUSTOMER');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tokens`
--

CREATE TABLE `tokens` (
  `token_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tokens`
--

INSERT INTO `tokens` (`token_id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 3, 'f001af96-3f54-4244-a4f2-b234820d2461', '2025-03-14 09:40:31', '2025-03-07 02:40:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions_history`
--

CREATE TABLE `transactions_history` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transaction_type` enum('UPGRADE') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 3,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `username`, `email`, `password`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 1, 'user1', 'user1@example.com', 'hashed_password_1', '0123456789', '123 Main St', '2025-02-27 07:52:47', '2025-02-27 07:52:47'),
(2, 2, 'broker1', 'broker1@example.com', 'hashed_password_2', '0987654321', '456 Elm St', '2025-02-27 07:52:47', '2025-02-27 07:52:47'),
(3, 3, 'admin1', 'admin1@example.com', 'hashed_password_3', '0112233445', '789 Oak St', '2025-02-27 07:52:47', '2025-02-27 07:52:47');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `favourite_properties`
--
ALTER TABLE `favourite_properties`
  ADD PRIMARY KEY (`favourite_property_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Chỉ mục cho bảng `furnished_statuses`
--
ALTER TABLE `furnished_statuses`
  ADD PRIMARY KEY (`furnished_status_id`);

--
-- Chỉ mục cho bảng `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`house_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `furnished_status_id` (`furnished_status_id`);

--
-- Chỉ mục cho bảng `house_characteristics`
--
ALTER TABLE `house_characteristics`
  ADD PRIMARY KEY (`house_characteristic_id`);

--
-- Chỉ mục cho bảng `house_characteristic_mappings`
--
ALTER TABLE `house_characteristic_mappings`
  ADD PRIMARY KEY (`house_characteristic_mapping_id`),
  ADD KEY `house_id` (`house_id`),
  ADD KEY `house_characteristic_id` (`house_characteristic_id`);

--
-- Chỉ mục cho bảng `lands`
--
ALTER TABLE `lands`
  ADD PRIMARY KEY (`land_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `land_type_id` (`land_type_id`);

--
-- Chỉ mục cho bảng `land_characteristics`
--
ALTER TABLE `land_characteristics`
  ADD PRIMARY KEY (`land_characteristic_id`);

--
-- Chỉ mục cho bảng `land_characteristic_mappings`
--
ALTER TABLE `land_characteristic_mappings`
  ADD PRIMARY KEY (`land_characteristic_mapping_id`),
  ADD KEY `land_id` (`land_id`),
  ADD KEY `land_characteristic_id` (`land_characteristic_id`);

--
-- Chỉ mục cho bảng `land_types`
--
ALTER TABLE `land_types`
  ADD PRIMARY KEY (`land_type_id`);

--
-- Chỉ mục cho bảng `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`property_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `property_legal_document_id` (`property_legal_document_id`);

--
-- Chỉ mục cho bảng `property_legal_documents`
--
ALTER TABLE `property_legal_documents`
  ADD PRIMARY KEY (`property_legal_document_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Chỉ mục cho bảng `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `transactions_history`
--
ALTER TABLE `transactions_history`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `favourite_properties`
--
ALTER TABLE `favourite_properties`
  MODIFY `favourite_property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `furnished_statuses`
--
ALTER TABLE `furnished_statuses`
  MODIFY `furnished_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `houses`
--
ALTER TABLE `houses`
  MODIFY `house_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `house_characteristics`
--
ALTER TABLE `house_characteristics`
  MODIFY `house_characteristic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `house_characteristic_mappings`
--
ALTER TABLE `house_characteristic_mappings`
  MODIFY `house_characteristic_mapping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `lands`
--
ALTER TABLE `lands`
  MODIFY `land_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `land_characteristics`
--
ALTER TABLE `land_characteristics`
  MODIFY `land_characteristic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `land_characteristic_mappings`
--
ALTER TABLE `land_characteristic_mappings`
  MODIFY `land_characteristic_mapping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `land_types`
--
ALTER TABLE `land_types`
  MODIFY `land_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `properties`
--
ALTER TABLE `properties`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `property_legal_documents`
--
ALTER TABLE `property_legal_documents`
  MODIFY `property_legal_document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tokens`
--
ALTER TABLE `tokens`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `transactions_history`
--
ALTER TABLE `transactions_history`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `favourite_properties`
--
ALTER TABLE `favourite_properties`
  ADD CONSTRAINT `favourite_properties_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `favourite_properties_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `houses`
--
ALTER TABLE `houses`
  ADD CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `houses_ibfk_2` FOREIGN KEY (`furnished_status_id`) REFERENCES `furnished_statuses` (`furnished_status_id`);

--
-- Các ràng buộc cho bảng `house_characteristic_mappings`
--
ALTER TABLE `house_characteristic_mappings`
  ADD CONSTRAINT `house_characteristic_mappings_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `house_characteristic_mappings_ibfk_2` FOREIGN KEY (`house_characteristic_id`) REFERENCES `house_characteristics` (`house_characteristic_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lands`
--
ALTER TABLE `lands`
  ADD CONSTRAINT `lands_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lands_ibfk_2` FOREIGN KEY (`land_type_id`) REFERENCES `land_types` (`land_type_id`);

--
-- Các ràng buộc cho bảng `land_characteristic_mappings`
--
ALTER TABLE `land_characteristic_mappings`
  ADD CONSTRAINT `land_characteristic_mappings_ibfk_1` FOREIGN KEY (`land_id`) REFERENCES `lands` (`land_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `land_characteristic_mappings_ibfk_2` FOREIGN KEY (`land_characteristic_id`) REFERENCES `land_characteristics` (`land_characteristic_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `properties_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `properties_ibfk_3` FOREIGN KEY (`property_legal_document_id`) REFERENCES `property_legal_documents` (`property_legal_document_id`);

--
-- Các ràng buộc cho bảng `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `transactions_history`
--
ALTER TABLE `transactions_history`
  ADD CONSTRAINT `transactions_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

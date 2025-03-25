-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 25, 2025 lúc 04:29 AM
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
CREATE DATABASE IF NOT EXISTS `real_estate` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `real_estate`;

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
  `furnished_status_id` int(11) NOT NULL,
  `house_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `houses`
--

INSERT INTO `houses` (`house_id`, `property_id`, `floors`, `bedrooms`, `toilets`, `furnished_status_id`, `house_type_id`) VALUES
(1, 4, 3, 5, 5, 2, 1),
(2, 5, 3, 3, 3, 3, 2),
(3, 6, 1, 2, 2, 1, 3),
(4, 14, 2, 3, 2, 2, 4);

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
-- Cấu trúc bảng cho bảng `house_type`
--

CREATE TABLE `house_type` (
  `house_type_id` int(11) NOT NULL,
  `house_type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `house_type`
--

INSERT INTO `house_type` (`house_type_id`, `house_type_name`) VALUES
(1, 'STREETFRONT_HOUSE'),
(2, 'ALLEY_HOUSE'),
(3, 'VILLA'),
(4, 'TOWNHOUSE');

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
(7, 12, 3),
(9, 16, 3),
(10, 17, 3),
(11, 18, 3),
(12, 19, 3),
(13, 20, 3),
(14, 21, 3),
(15, 22, 3);

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
(10, 7, 1),
(17, 9, 3),
(18, 9, 5),
(19, 10, 1),
(20, 10, 5),
(21, 11, 5),
(22, 11, 1),
(23, 12, 5),
(24, 12, 1),
(25, 13, 1),
(26, 13, 5),
(29, 14, 1),
(30, 14, 5),
(31, 15, 5),
(32, 15, 1);

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
(14, 2, 2, 'PENDING', 'Nhà phố trung tâm', 'Nhà phố 2 tầng, mặt tiền đường lớn, gần trường học và chợ', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 2, 100, 10, 10, 'house_new_1.jpg,house_new_2.jpg', 3500000000.00, '2025-03-07 03:52:55', '2025-03-07 03:52:55'),
(16, 1, 1, 'APPROVAL', 'Đất nền khu công nghiệp123123123123', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-09 01:35:29', '2025-03-12 07:33:59'),
(17, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-10 11:28:45', '2025-03-10 11:28:45'),
(18, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-10 11:59:24', '2025-03-10 11:59:24'),
(19, 1, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'land_new_1.jpg,land_new_2.jpg', 12500000000.00, '2025-03-10 11:59:44', '2025-03-10 11:59:44'),
(20, 5, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F20697b83-6270-4fc5-a2fc-2cef7ee26f2b.png?alt=media&token=20697b83-6270-4fc5-a2fc-2cef7ee26f2b.png,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F0b62c308-8a63-49dc-be5d-626bf595ba72.jpeg?alt=media&token=0b62c308-8a63-49dc-be5d-626bf595ba72.jpeg', 12500000000.00, '2025-03-12 08:10:33', '2025-03-12 08:10:33'),
(21, 5, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F963e4274-a0ea-4e79-af99-dc088bc98022.jpg?alt=media&token=963e4274-a0ea-4e79-af99-dc088bc98022.jpg,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F4a989a87-4a8d-4fb0-bc2b-17fd76ac4bac.jpg?alt=media&token=4a989a87-4a8d-4fb0-bc2b-17fd76ac4bac.jpg,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F73e3553c-7958-40f3-8e4c-b869a689c288.png?alt=media&token=73e3553c-7958-40f3-8e4c-b869a689c288.png', 12500000000.00, '2025-03-12 08:12:10', '2025-03-12 08:47:51'),
(22, 5, 1, 'PENDING', 'Đất nền khu công nghiệp', 'Đất nền mặt tiền đường, phù hợp xây dựng nhà xưởng', 'Đà Nẵng', 'Phường Hòa Khánh Bắc', 'Đường Nguyễn Tất Thành', 108.175, 16.065, 1, 1, 1200, 40, 30, 'https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2Fe523d34a-e725-403a-adfa-ae31f9e2639f.png?alt=media&token=e523d34a-e725-403a-adfa-ae31f9e2639f.png,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F55dd66cb-79f8-4d01-8e78-168e0eed4c7a.jpeg?alt=media&token=55dd66cb-79f8-4d01-8e78-168e0eed4c7a.jpeg', 12500000000.00, '2025-03-13 03:40:56', '2025-03-13 03:40:56');

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
(1, 3, 'f001af96-3f54-4244-a4f2-b234820d2461', '2025-03-14 09:40:31', '2025-03-07 02:40:31'),
(2, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lX2RvZTEiLCJ1c2VySWQiOjUsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTc0MTc0Njc1NywiZXhwIjoxNzQxODMzMTU3fQ.l4c6W-LGCBQl-nqCiApv7aEx8SFhbqzXsma5-_rKHzQ', '2025-03-13 09:32:37', '2025-03-12 02:32:37'),
(3, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lX2RvZTEiLCJ1c2VySWQiOjUsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTc0MTc0Njc2OCwiZXhwIjoxNzQxODMzMTY4fQ.ixQMKrYFydcpxWKfbKYkYNTASUX1I86M0lGpR7gvpKs', '2025-03-13 09:32:48', '2025-03-12 02:32:48'),
(4, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lX2RvZTIiLCJ1c2VySWQiOjYsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTc0MTc0ODgyOSwiZXhwIjoxNzQxODM1MjI5fQ.dOzLdAUjJV21swnBsznEsXGrNPCcSvxJlAZ18_2sLiE', '2025-03-13 10:07:09', '2025-03-12 03:07:09'),
(5, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lX2RvZTIiLCJ1c2VySWQiOjYsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTc0MTc1MjM2MiwiZXhwIjoxNzQyMzU3MTYyfQ.Bj__m1ZElRvLIhPqC46zmOTdsEY25h3WmycNKh6MYcg', '2025-03-19 11:06:02', '2025-03-12 04:06:02'),
(6, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjAxIiwidXNlcklkIjo1LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDE3NjQ4MjMsImV4cCI6MTc0MjM2OTYyM30.BEgHHkLm-Yk30guSc8YdmZj8AlwvDefWDgwEjXMfVfI', '2025-03-19 14:33:43', '2025-03-12 07:33:43'),
(7, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjAxIiwidXNlcklkIjo1LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDE3NzIyOTEsImV4cCI6MTc0MjM3NzA5MX0.p54zxvWNDhIs6Oebzcy4dXZbAphPt5QbPJUKyV0ApwM', '2025-03-19 16:38:11', '2025-03-12 09:38:11'),
(8, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjAxIiwidXNlcklkIjo1LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQxODMzMDAwLCJleHAiOjE3NDI0Mzc4MDB9.hhJam2RuLMolIR3mkNfX-Vog7859UyKfhB7_cknroKc', '2025-03-20 09:30:00', '2025-03-13 02:30:00'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjEiLCJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0MTkxODcxNywiZXhwIjoxNzQyNTIzNTE3fQ.3X2I5lm_FuyO_ToAYu5dvf0UCWNOuEdxeK8Ao1Xeaic', '2025-03-21 09:18:37', '2025-03-14 02:18:37'),
(10, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NDg3NzMsImV4cCI6MTc0MzI1MzU3M30.uGmPOI8N6UP0LZZKjW6PkoEpQcfTEQXOfHKTBWvTo3o', '2025-03-29 20:06:13', '2025-03-22 13:06:13'),
(11, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NDkxNDIsImV4cCI6MTc0MzI1Mzk0Mn0.BLK9XnGx-mI6_pNdaGqYgRB2RyqK1j_3Q6xhd00Qt-w', '2025-03-29 20:12:22', '2025-03-22 13:12:22'),
(12, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NDkzMTUsImV4cCI6MTc0MzI1NDExNX0.vCZoIjqqUItwvlUwjXI9kfH_IvdcjgOi4PQXpU9foZ4', '2025-03-29 20:15:15', '2025-03-22 13:15:15'),
(13, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NDkzMjYsImV4cCI6MTc0MzI1NDEyNn0.D-pomSt883ZHbWUVaVUm-gkMfppLy5RvIJzXP_-ncDY', '2025-03-29 20:15:26', '2025-03-22 13:15:26'),
(14, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NDk0MDYsImV4cCI6MTc0MzI1NDIwNn0.fiMZWjpih8o3xt0auzh20Sda5XpwuHt1CHoNFXz6F-Q', '2025-03-29 20:16:46', '2025-03-22 13:16:46'),
(15, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTAwNjUsImV4cCI6MTc0MzI1NDg2NX0.o3RWvppaUv4oEzSwa9GQ5tHBydJ3usjuqwS2SBa5AkY', '2025-03-29 20:27:45', '2025-03-22 13:27:45'),
(16, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTAxMTYsImV4cCI6MTc0MzI1NDkxNn0.8cLGCEWiB_8Moq-YG0x9wfqu9K0aJN9YRtDabHsc9gM', '2025-03-29 20:28:36', '2025-03-22 13:28:36'),
(17, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTAzOTIsImV4cCI6MTc0MzI1NTE5Mn0.j_AeJkjm9ZgT17Q_Gv1E_3_v1BU20zqcIxWxekEVhJg', '2025-03-29 20:33:12', '2025-03-22 13:33:12'),
(18, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA0MjMsImV4cCI6MTc0MzI1NTIyM30.q68NAsOfPdBqQldefdixw-gY319KX2kwcoDCfQgBjWE', '2025-03-29 20:33:43', '2025-03-22 13:33:43'),
(19, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA0NTcsImV4cCI6MTc0MzI1NTI1N30.hlpvUfs5EuJR6PgxZmnkYZZUZq_mtI6N5LgdG5vnuJs', '2025-03-29 20:34:17', '2025-03-22 13:34:17'),
(20, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA1NTEsImV4cCI6MTc0MzI1NTM1MX0.oGH0_avtw3OBWcLcl30mTo7GisnUR-gbrJUXD5ECq4Q', '2025-03-29 20:35:51', '2025-03-22 13:35:51'),
(21, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA2OTksImV4cCI6MTc0MzI1NTQ5OX0.VV45bEuQEBtltyELgNPOg-6hjh7UJHidUNi7O_YuWIU', '2025-03-29 20:38:19', '2025-03-22 13:38:19'),
(22, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA3MjYsImV4cCI6MTc0MzI1NTUyNn0.efDBi1i6JMm_GCqgft_qW8hc1fklYCMGtnIArfHTzCM', '2025-03-29 20:38:46', '2025-03-22 13:38:46'),
(23, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA4NTIsImV4cCI6MTc0MzI1NTY1Mn0.MHoGTsQLJTUloWnjDAmT2eGu8lyeq_TzYaicqPpm0xg', '2025-03-29 20:40:52', '2025-03-22 13:40:52'),
(24, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTA4ODIsImV4cCI6MTc0MzI1NTY4Mn0.rosQ-ydHg4ygibExI5oOlXQOKtq0N9FUyqMDd56amnA', '2025-03-29 20:41:22', '2025-03-22 13:41:22'),
(25, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTExMjYsImV4cCI6MTc0MzI1NTkyNn0.jtV3dssxYCT7qNgFCL7hHPyDVfqS7Y8XX54kgemc-ZY', '2025-03-29 20:45:26', '2025-03-22 13:45:26'),
(26, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTE1MjEsImV4cCI6MTc0MzI1NjMyMX0.ASi5Zo6kyh5g_oOsmYvdV3MBjHEmB7bMoyS90mjPukw', '2025-03-29 20:52:01', '2025-03-22 13:52:01'),
(27, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDI2NTE2NTAsImV4cCI6MTc0MzI1NjQ1MH0.X2nCs1jzpdUsjGpkzMHbeCfHQciA4HX00xJSHUBYU5o', '2025-03-29 20:54:10', '2025-03-22 13:54:10'),
(28, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTE3NzcsImV4cCI6MTc0MzI1NjU3N30.Map2LB28f_pZcpxlgJiqZBgw73wG0jpmTU-O96O1rRA', '2025-03-29 20:56:17', '2025-03-22 13:56:17'),
(29, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTI2MjYsImV4cCI6MTc0MzI1NzQyNn0.Yn4HTiX19wmNHd6h-RbENGt39baj7fMLloNfxxqWPvY', '2025-03-29 21:10:26', '2025-03-22 14:10:26'),
(30, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTI2NDYsImV4cCI6MTc0MzI1NzQ0Nn0.zGhxqV5DX0eWn2rjwFWlRxuqLZHeW3KkUJqz0Ja-ibk', '2025-03-29 21:10:46', '2025-03-22 14:10:46'),
(31, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTMwMzYsImV4cCI6MTc0MzI1NzgzNn0.cLauVtXOaCo3TP-vPn2ezSKntSw-S5xL_eHa6MXv2tw', '2025-03-29 21:17:16', '2025-03-22 14:17:16'),
(32, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTMyOTQsImV4cCI6MTc0MzI1ODA5NH0.vmWuFJ1wOThWFP3yeupFNbqHf02u7eFICJqJZaU7sKI', '2025-03-29 21:21:34', '2025-03-22 14:21:34'),
(33, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTMzNDQsImV4cCI6MTc0MzI1ODE0NH0.0drObWO5JaFP9EPaWUzOVl81meXKIGbq_hXXQwkBgzM', '2025-03-29 21:22:24', '2025-03-22 14:22:24'),
(34, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTM1NTYsImV4cCI6MTc0MzI1ODM1Nn0.4oTe2JgtO3R2iY72nytK7oAP_zC9DCpENHihuaihfIw', '2025-03-29 21:25:56', '2025-03-22 14:25:56'),
(35, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NTM1ODQsImV4cCI6MTc0MzI1ODM4NH0._93inaOWDf1EbTGgIglTpGYVRUgTcCyS1oGX5DStueU', '2025-03-29 21:26:24', '2025-03-22 14:26:24'),
(36, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NjA2MTIsImV4cCI6MTc0MzI2NTQxMn0.kSSIHimAuqPSmxwtoyGrW4qWZzFmNnyCLy0QcinOdng', '2025-03-29 23:23:32', '2025-03-22 16:23:32'),
(37, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NjI4MjEsImV4cCI6MTc0MzI2NzYyMX0.dRG4MtzslwVWVAcPwO-wGTlqQk1LPqhgf9WMwkctzuw', '2025-03-30 00:00:21', '2025-03-22 17:00:21');

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

--
-- Đang đổ dữ liệu cho bảng `transactions_history`
--

INSERT INTO `transactions_history` (`transaction_id`, `user_id`, `transaction_type`, `amount`, `updated_at`, `created_at`) VALUES
(16, 1, 'UPGRADE', 1000000.00, '2025-03-13 04:11:15', '2025-03-13 04:11:15'),
(17, 2, 'UPGRADE', 2000000.00, '2025-03-13 04:11:15', '2025-03-13 04:11:15'),
(18, 3, 'UPGRADE', 3000000.00, '2025-03-13 04:11:15', '2025-03-13 04:11:15'),
(19, 6, 'UPGRADE', 4000000.00, '2025-03-13 04:11:15', '2025-03-13 04:11:15'),
(20, 5, 'UPGRADE', 5000000.00, '2025-03-13 04:11:15', '2025-03-13 04:11:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 3,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `fullName`, `email`, `password`, `phone`, `created_at`, `updated_at`) VALUES
(1, 1, '', 'admin1@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '0123456789', '2025-02-27 07:52:47', '2025-03-14 02:17:54'),
(2, 2, '', 'broker1@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '0987654321', '2025-02-27 07:52:47', '2025-03-14 02:13:32'),
(3, 3, '', 'user01@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '0112233445', '2025-02-27 07:52:47', '2025-03-14 02:17:39'),
(5, 3, '', 'user02@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '093454856978', '2025-03-12 02:32:04', '2025-03-14 02:16:54'),
(6, 3, '', 'jane.do2@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '093454456978', '2025-03-12 03:06:41', '2025-03-14 02:13:24'),
(7, 3, '', 'jane.do1@example.com', '$2a$10$d4In6plUgTmyC6RHirAfze1zt1JLcle8UqWiHOpChFYNBSL/tq86e', '093224856978', '2025-03-14 02:13:08', '2025-03-14 02:13:08'),
(8, 3, 'Vấn Đức', 'nguyenducvan260903@gmail.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0373115431', '2025-03-22 11:43:57', '2025-03-22 13:56:04');

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
  ADD KEY `furnished_status_id` (`furnished_status_id`),
  ADD KEY `fk_house_type` (`house_type_id`);

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
-- Chỉ mục cho bảng `house_type`
--
ALTER TABLE `house_type`
  ADD PRIMARY KEY (`house_type_id`);

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
  MODIFY `favourite_property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- AUTO_INCREMENT cho bảng `house_type`
--
ALTER TABLE `house_type`
  MODIFY `house_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `lands`
--
ALTER TABLE `lands`
  MODIFY `land_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `land_characteristics`
--
ALTER TABLE `land_characteristics`
  MODIFY `land_characteristic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `land_characteristic_mappings`
--
ALTER TABLE `land_characteristic_mappings`
  MODIFY `land_characteristic_mapping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `land_types`
--
ALTER TABLE `land_types`
  MODIFY `land_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `properties`
--
ALTER TABLE `properties`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `transactions_history`
--
ALTER TABLE `transactions_history`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  ADD CONSTRAINT `fk_house_type` FOREIGN KEY (`house_type_id`) REFERENCES `house_type` (`house_type_id`),
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

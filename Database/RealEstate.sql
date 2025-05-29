-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 29, 2025 lúc 02:41 PM
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
  `property_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `favourite_properties`
--

INSERT INTO `favourite_properties` (`favourite_property_id`, `user_id`, `property_id`, `created_at`) VALUES
(38, 8, 51, '2025-05-19 06:57:35'),
(39, 8, 2, '2025-05-19 06:57:36'),
(40, 8, 57, '2025-05-19 06:57:37'),
(41, 8, 1, '2025-05-19 06:57:41'),
(42, 8, 55, '2025-05-19 06:57:42'),
(43, 8, 53, '2025-05-19 06:57:42'),
(44, 1, 55, '2025-05-24 09:55:40');

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
(7, 1, 2, 2, 1, 3, 4);

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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `house_type`
--

CREATE TABLE `house_type` (
  `house_type_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `house_type`
--

INSERT INTO `house_type` (`house_type_id`, `name`) VALUES
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
(2, 2, 1),
(26, 43, 1),
(27, 44, 1),
(28, 45, 1),
(29, 46, 1),
(33, 50, 1),
(34, 51, 1),
(35, 52, 1),
(36, 53, 1),
(38, 55, 1),
(40, 57, 1);

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
(90, 38, 4),
(97, 2, 6),
(107, 36, 1),
(108, 35, 5),
(111, 33, 3),
(112, 33, 1),
(113, 29, 2),
(114, 29, 1),
(127, 26, 1),
(128, 27, 2),
(129, 27, 5),
(130, 28, 4),
(131, 28, 2);

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
  `district_name` varchar(50) NOT NULL,
  `ward_name` varchar(50) NOT NULL,
  `street_name` varchar(100) DEFAULT NULL,
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

INSERT INTO `properties` (`property_id`, `user_id`, `category_id`, `status`, `title`, `description`, `region`, `district_name`, `ward_name`, `street_name`, `longitude`, `latitude`, `property_legal_document_id`, `direction`, `area`, `length`, `width`, `images`, `price`, `created_at`, `updated_at`) VALUES
(1, 8, 2, 'APPROVAL', 'Bán nhà mặt tiền Bãi Sậy, gần trường Nguyễn Khuyến', 'Bán nhà mặt tiền đường 5m5 Bãi Sậy, Khuê Trung, Cẩm Lệ, Đà Nẵng\nKhu dân trí, gần trường học Nguyễn Khuyến, gần chợ, bệnh viện\nNhà cấp 4 gồm:\n2 phòng ngủ\n1 phòng khách\n1 bếp\nSân thượng\nPhòng thờ\nGiá bán: 5 tỷ 200 triệu (Có thương lượng)', 'Thành phố Đà Nẵng', 'Quận Cẩm Lệ', 'Phường Khuê Trung', 'Bãi Sậy', 108.2109546, 16.0220567, 1, 8, 88, 17.6, 5, '', 5200000000.00, '2025-03-06 09:51:17', '2025-05-29 12:41:02'),
(2, 8, 1, 'APPROVAL', 'Đất Hoà Sơn giá rẻ', 'Cần ra đi lô đất Xuân Phú Hoà Sơn.\nDiện tích 150m², ngang 6m.\nĐường bê tông 3.5m, sau quy hoạch thành 5m.\nTrục thông tứ hướng, khu dân cư đông đúc.\nGần chợ, trường học, trục đường chính.\nGiá: 1 tỷ 550 triệu. Hỗ trợ vay 50% cho khách có nhu cầu.\nAi quan tâm xin liên hệ để xem đất', 'Thành phố Đà Nẵng', 'Huyện Hòa Vang', 'Xã Hòa Sơn', 'Đường Xuân Phú', 108.1067993, 16.0683614, 1, 5, 150, 25, 6, '', 1550000000.00, '2025-03-06 09:51:17', '2025-05-29 12:41:02'),
(43, 8, 1, 'APPROVAL', 'Bán đất sát fpt giá chỉ 1ty7', 'Bán vài lô đât vị trí đẹp tầm tc dưới 2tỷ🍀🍀🍀\r\nGần ĐH Phan Châu Trinh, Chợ Điện Ngọc...\r\n1. 5x16m đường 5m5 giá 1tỷ7\r\n2. 5x17m đường 5m5 giá 1tỷ7\r\n3. 6,5x16m đường 7m5 giá 1tỷ750\r\n4. 5x16m đường 5m5 giá 1tỷ6 kẹp cống', 'Thành phố Đà Nẵng', 'Quận Ngũ Hành Sơn', 'Phường Hoà Hải', 'FPT complex', 108.2614728, 15.9781224, 1, 1, 80, 16, 5, '', 1700000000.00, '2025-05-18 15:13:25', '2025-05-29 12:41:02'),
(44, 8, 1, 'APPROVAL', '700m2 có 120m2 đất có sẵng nhà gần đường dh2 về hoàng văn thái gần', '700m2 có 120m2 đất ở ngang 25m xã hòa nhơn gần đường lớn dh2\n_______\nĐã rào lưới khuông viên rõ ràng, có sẵng ngôi nhà nho nhỏ mua vào ở ngay được.\nNgang 25m, đường bê tông oto thông, hướng nam\n\nCách đường tránh khoảng 2km, cách ngã 4 hoàng văn thái khoảng 4km thuận tiện di chuyển về thành phố.\nPháp lý rõ ràng bán đến công chứng', 'Thành phố Đà Nẵng', 'Huyện Hòa Vang', 'Xã Hòa Sơn', 'Đường Bê Tông Oto', 108.1067993, 16.0683614, 1, 3, 700, 35, 20, '', 10000000000.00, '2025-05-18 15:13:36', '2025-05-29 12:41:02'),
(45, 8, 1, 'APPROVAL', 'Bán đất Cổ Mân Cúc 2 Vị trí đẹp đối diện công viên giá chỉ 3.250 Tỷ', '🔥 Bán đất Cổ Mân Cúc 2 – Vị trí đẹp đối diện công viên, giá chỉ 3.Ty 250 triệu! 🔥\r\n🏡 Diện tích: 100m² – Lô đất vuông vức, sạch đẹp, không cống, không trụ.\r\n🌳 Vị trí đắc địa: Đối diện công viên, không gian sống thoáng đãng, tiện ích đầy đủ.\r\n📍 Thuộc khu vực Hòa Xuân, Cẩm Lệ – Khu dân cư sầm uất, tiềm năng tăng giá cao.\r\n💰 Giá hấp dẫn: Chỉ 3 Tỷ 250 triệu – Cơ hội tốt cho nhà đầu tư và an cư!\r\n📞 Liên hệ ngay để xem đất hôm nay', 'Thành phố Đà Nẵng', 'Quận Cẩm Lệ', 'Phường Hòa Xuân', 'Đường Cổ Mân Cúc 2', 108.2154592, 15.981331, 1, 1, 100, 20, 5, 'https://realestate2609.s3.ap-southeast-1.amazonaws.com/RealEstate/bfaf9b96-a39e-4291-b482-7a7799983b3e.jpg,https://realestate2609.s3.ap-southeast-1.amazonaws.com/RealEstate/a47f0089-c746-4e94-b374-d9090194bdbf.jpg,https://realestate2609.s3.ap-southeast-1.amazonaws.com/RealEstate/b39bdcc6-e169-4101-8cab-c2d48ec76939.jpg', 3250000000.00, '2025-03-13 17:00:00', '2025-05-27 09:01:02'),
(46, 8, 1, 'APPROVAL', 'bán lô đất khu dân cư Tân Trà Sát FPT Và biển', 'Bán đất đường Huỳnh thì một sát rạt Khu FPt - Phú mỹ an  sát biển \r\nCách chưa tới 1km ra tới biển Tân Trà cạnh các khu nghỉ dưỡng \r\nLô đất đường 5m5 lề 3m hướng đông trục thông dài \r\n-100m2 ngang 5m có lối thoát hiểm sau \r\nCạnh sông cạnh biển \r\nGiá chỉ hơn 3 tỷ 250 có thương lượng \r\nLh em Quang :', 'Thành phố Đà Nẵng', 'Quận Ngũ Hành Sơn', 'Phường Hoà Hải', 'Huỳnh Thị Một', 108.2689747, 15.9807552, 1, 3, 100, 20, 5, '', 3250000000.00, '2025-03-16 17:00:00', '2025-05-29 12:41:02'),
(50, 8, 1, 'APPROVAL', 'Bán đất mặt tiền đường Trường Sơn', 'Thị trường đất sốt, chừ cầm hơn 2 tỉ mua đất kiệt ô tô quay đầu rất khó, vậy mà em có lô đất đường 20m, lề 10, mà giá cũng có hơn 2 tỉ thôi ạ.\r\n\r\nBán lô đất lên số nhà 230 đường Trường Sơn, Hòa Thọ Tây, Cẩm Lệ.\r\n\r\nDiện tích trên sổ 66m (diện tích thực tế sự dụng 100m), ngang 6m, nở hậu 6m2 siêu đẹp, đất hướng đông nam sinh khí tốt. Đất kẹp cống 10m bên hông, tha hồ trồng cây, phía sau view hồ điều tiết nước mát mẻ.\r\n\r\nĐất cách cầu vượt Hòa Cầm 2km, gần khu công nghiệp Hòa Cầm, bệnh viện Hòa Vang, ngã 4 Túy Loan... Là con đường liên quận (Cẩm Lệ - Hòa Vang), giao thông đông đúc.\r\n\r\nGiá bán: 2.35 tỉ (thương lượng nhẹ).', 'Thành phố Đà Nẵng', 'Huyện Hòa Vang', 'Xã Hòa Nhơn', 'Đường Trường Sơn', 108.1654769, 16.0115725, 1, 6, 105, 21, 5, '', 2350000000.00, '2025-02-24 17:00:00', '2025-05-29 12:41:02'),
(51, 8, 1, 'APPROVAL', 'Cần bán lô đất đẹp thuộc P. Hòa Hải, Q. Ngũ Hành Sơn,', 'Cần bán lô đất đẹp thuộc P. Hòa Hải, Q. Ngũ Hành Sơn, Đà Nẵng.\r\nĐịa chỉ: Đường Huỳnh Thị Một - Phường Hoà Hải - Quận Ngũ Hành Sơn - Đà Nẵng.\r\n- Diện tích: 100m² (đất thổ cư 100%).\r\n- Đất có vị trí đắc địa mặt tiền đường Huỳnh Thị Một rộng rãi rất phù hợp xây nhà ở, kinh doanh buôn bán đầu tư sinh lời.\r\n- Nằm ngay trung tâm biển Tân Trà là nơi sắp khởi công cầu Võ Chí Công nối từ Phú Mỹ An, FPT, sang đường Võ Quý Huân thông thẳng ra bãi tắm Tân Trà. Hứa hẹn nhiều tiềm năng phát triển nơi đây.\r\n- Dân cư ở đây rất đông đúc, an ninh tốt, gần trường học, bệnh viện, trung tâm mua sắm lớn. Sát dãy Resort 5 sao lớn như: Vinpearl, sân golf BRG và Montgomerie quốc tế.\r\n- Giấy tờ pháp lý: Đã có sổ hồng chính chủ sang tên công chứng ngay.\r\n- Giá bán nhanh 2.7 tỉ', 'Thành phố Đà Nẵng', 'Quận Ngũ Hành Sơn', 'Phường Hoà Hải', 'Đường Lê Thị Riêng', 108.2642553, 15.9962329, 1, 3, 100, 20, 5, '', 3000000000.00, '2025-02-21 17:00:00', '2025-05-29 12:41:02'),
(52, 8, 1, 'APPROVAL', 'Bán Gấp Lô góc ngã 4 Bầu Cầu 27 và Bùi Huy Đáp', 'có việc cần bán gấp cần bán \r\nLô đất đẹp góc ngã tư.\r\nHướng Tây Bắc \r\nDT 135 m2 \r\nGiá 3,950 tỷ có Tl ít', 'Thành phố Đà Nẵng', 'Huyện Hòa Vang', 'Xã Hòa Phước', 'Đường Bàu Cầu 27', 108.2028246, 15.9897628, 1, 1, 135, 20, 6.75, '', 3950000000.00, '2025-03-30 17:00:00', '2025-05-29 12:41:02'),
(53, 8, 1, 'APPROVAL', 'Chủ gởi bán đất Mặt tiền đường Thích Phước Huệ -Hoà Hải-Ngũ hành Sơn', 'Chủ gởi bán đất Mặt tiền đường Thích Phước Huệ -Hoà Hải-Ngũ hành Sơn \n☘️ Khu vực làng đại học , sau lưng đường Võ Chí Công \n☘️Mặt tiền đường rộng 7.5 lề 4m dt 132,5m2 thích hợp ở , xây căn hộ bao full phòng ạ \n☘️Giá rẻ hơn đường 5.5 chỉ 30tr/m2 chỉ có 1 lô *** ạ \n☎️Liên hệ em Hậu đi xem đất và lvv', 'Thành phố Đà Nẵng', 'Quận Ngũ Hành Sơn', 'Phường Hoà Hải', 'Đường Thích Phước Huệ', 108.2500631, 15.9825438, 1, 1, 132.5, 0, 0, '', 3970000000.00, '2025-03-22 17:00:00', '2025-05-29 12:41:02'),
(55, 8, 1, 'PENDING', 'ĐẤT 125m² MT đường Bàu Mạc 5, thông Nguyễn Chánh, Liên Chiểu, Đà Nẵng', 'ĐẤT 125m² MT đường 5m5 Bàu Mạc 5, thông đường Nguyễn Chánh, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng\r\n\r\nGIÁ BÁN: 3,990 tỷ (thương lượng)\r\n- Lên số nhà: 48 Bàu Mạc 5\r\n- Vị trí: thông đường Phan Văn Trường, gần Biển Nguyễn Tất Thành\r\n- Đường: 5m5, vỉa hè: 3m\r\n- Diện tích: 125m²(5 x 25m) không ngập lụt, không cống trụ\r\n- Hướng: Tây Nam\r\n- Sổ hồng chính chủ, hỗ trợ vay ngân hàng', 'Đà Nẵng', 'Quận Liên Chiểu', 'Phường Hòa Khánh Bắc', 'Đường Bàu Mạc 5', 108.1509, 16.086306, 1, 8, 125, 25, 5, '', 3990000000.00, '2025-03-20 17:00:00', '2025-05-19 06:59:21'),
(57, 8, 1, 'APPROVAL', 'BÁN ĐẤT NAM HÒA XUÂN – ĐƯỜNG ĐẶNG HỒI XUÂN – 7.5M – LỀ 4M', 'BÁN ĐẤT NAM HÒA XUÂN – ĐƯỜNG ĐẶNG HỒI XUÂN – 7.5M – LỀ 4M\r\n\r\n📍 Vị trí: B2.74 Nam Hòa Xuân, P. Hòa Quý, Q. Ngũ Hành Sơn, Đà Nẵng\r\n📐 Diện tích: 110m² (5m x 22m) – Vuông vức, sạch đẹp\r\n🚗 Đường rộng 7.5m, lề mỗi bên 4m – Giao thông thuận tiện, dân cư hiện hữu\r\n💰 Giá chốt nhanh: 4 tỷ Thương Lượng Trực Tiếp Chính Chủ\r\n\r\n🔹 Ưu điểm nổi bật:\r\n✔️ Khu dân cư sầm uất, gần sông, không gian sống thoáng mát\r\n✔️ Pháp lý rõ ràng, sẵn sàng công chứng sang tên\r\n✔️ Tiềm năng tăng giá cao – Phù hợp an cư hoặc đầu tư lâu dài', 'Thành phố Đà Nẵng', 'Quận Ngũ Hành Sơn', 'Phường Hoà Quý', 'Đặng Hồi Xuân', 108.2416095, 16.0048727, 1, 2, 100, 20, 5, 'https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2Fbe7269d2-2d8e-4b51-b0e3-c6cae3761801.jpg?alt=media&token=be7269d2-2d8e-4b51-b0e3-c6cae3761801.jpg,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2Fc1802dc3-5300-41e4-85f2-0d61e9517667.jpg?alt=media&token=c1802dc3-5300-41e4-85f2-0d61e9517667.jpg,https://firebasestorage.googleapis.com/v0/b/rare-animals.appspot.com/o/RealEstate%2F312d2128-5fc7-4d86-97da-aa697b2cf1d4.jpg?alt=media&token=312d2128-5fc7-4d86-97da-aa697b2cf1d4.jpg', 4000000000.00, '2025-03-14 17:00:00', '2025-05-18 17:45:57');

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
(2, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lX2RvZTEiLCJ1c2VySWQiOjUsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTc0MTc0Njc1NywiZXhwIjoxNzQxODMzMTU3fQ.l4c6W-LGCBQl-nqCiApv7aEx8SFhbqzXsma5-_rKHzQ', '2025-03-13 09:32:37', '2026-03-04 02:32:37'),
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
(37, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI2NjI4MjEsImV4cCI6MTc0MzI2NzYyMX0.dRG4MtzslwVWVAcPwO-wGTlqQk1LPqhgf9WMwkctzuw', '2025-03-30 00:00:21', '2025-03-22 17:00:21'),
(38, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDI5NTM4MjYsImV4cCI6MTc0MzU1ODYyNn0.yzry6Xf5Mr2RgBnF46z5BDmCI2ZZY_sf3tf741s2OpY', '2025-04-02 08:50:26', '2025-03-26 01:50:26'),
(39, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDMwNDM1MTMsImV4cCI6MTc0MzY0ODMxM30.lEBEYcXfFi-baNtyr_JsxK0jsdgsPzWnT2dAp5_68Rc', '2025-04-03 09:45:13', '2025-03-27 02:45:13'),
(40, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzNTE3MDIxLCJleHAiOjE3NDQxMjE4MjF9.uSsHnVLXWRQlZlQVzaPZZN1Zp9I1EWwbUh2LwFh8dk0', '2025-04-08 21:17:01', '2025-04-01 14:17:01'),
(41, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzNTIxNjI3LCJleHAiOjE3NDQxMjY0Mjd9.P751VFgQgC2SX5hjUcT69vgLINtXc2w0bQNszUj8bnI', '2025-04-08 22:33:47', '2025-04-01 15:33:47'),
(42, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1IiwidXNlcklkIjo3LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDM1ODc1OTUsImV4cCI6MTc0NDE5MjM5NX0.lK2RbI8kWSJCLWMsVIckT8Hmrtd2GoPnAsy-QRDxAns', '2025-04-09 16:53:15', '2025-04-02 09:53:15'),
(43, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzQzNjY1MDgzLCJleHAiOjE3NDQyNjk4ODN9.uz0Uv1BawexDYogbJx2OQeBRSD8KCOKyL08mllR0MEU', '2025-04-10 14:24:43', '2025-04-03 07:24:43'),
(44, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1IiwidXNlcklkIjo3LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDM2NjUxOTgsImV4cCI6MTc0NDI2OTk5OH0.nEJA55hwDP7qYuKno8KvgLWchWJP_Fk4JKDR25O4pO8', '2025-04-10 14:26:38', '2025-04-03 07:26:38'),
(45, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzQzNjY1NDMyLCJleHAiOjE3NDQyNzAyMzJ9.9fNGKtCQpb3UZtz-uAFdeWwMmYxa3PjFFsnjE5H6c7k', '2025-04-10 14:30:32', '2025-04-03 07:30:32'),
(46, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1IiwidXNlcklkIjo3LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDM2NjU1MzEsImV4cCI6MTc0NDI3MDMzMX0.FsFeGJYjE2UiZKtScLhzqeiKPIJhr9FHn4o8RAleMiY', '2025-04-10 14:32:11', '2025-04-03 07:32:11'),
(47, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzQzNjY1NTg5LCJleHAiOjE3NDQyNzAzODl9.hBxbq13wrxVvr9gtGFjEJNZ8devMVCDbIX2MYVqc5BA', '2025-04-10 14:33:09', '2025-04-03 07:33:09'),
(48, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzNjY4MjgxLCJleHAiOjE3NDQyNzMwODF9.APJ5NVlsHyyBDrh2xCM9KISgnuONIO8fd38pnBCPSuI', '2025-04-10 15:18:01', '2025-04-03 08:18:01'),
(49, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDM2NzAxMjcsImV4cCI6MTc0NDI3NDkyN30.znj8evaNs2akwTGHG1snYoEyidDthe9LXVA929mlgC0', '2025-04-10 15:48:47', '2025-04-03 08:48:47'),
(50, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDM2NzAzMjIsImV4cCI6MTc0NDI3NTEyMn0.vOJb3qInTruOegsxcJ0taQ9wFjz7k_vl6izAhKw2es4', '2025-04-10 15:52:02', '2025-04-03 08:52:02'),
(51, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkJST0tFUiIsImlhdCI6MTc0MzczMjY0MCwiZXhwIjoxNzQ0MzM3NDQwfQ.BMqoMCl5gULHEC2hNJqiGSohZV6ity0FR7z_lSuf-vM', '2025-04-11 09:10:40', '2025-04-04 02:10:40'),
(52, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDM3MzM4MjgsImV4cCI6MTc0NDMzODYyOH0.a7kktYlUAfh-4RjWZk7UL8vggrNyC3sctpD8f9L16U4', '2025-04-11 09:30:28', '2025-04-04 02:30:28'),
(53, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkJST0tFUiIsImlhdCI6MTc0MzczNjEyOCwiZXhwIjoxNzQ0MzQwOTI4fQ.yFZorSO3tDcgFsr1HdrFt56Qu2YQoo-8dQGZ0PvP6s0', '2025-04-11 10:08:48', '2025-04-04 03:08:48'),
(54, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzODQyNTI1LCJleHAiOjE3NDQ0NDczMjV9.5GGVILATBHW6oFzqHStrGi63FlvzvnY1auyU09YdXls', '2025-04-12 15:42:05', '2025-04-05 08:42:05'),
(55, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzOTAyMTIxLCJleHAiOjE3NDQ1MDY5MjF9.YEDu32eq-1d0cOkq-MINegKRus56MGq1rcmVe3igcZs', '2025-04-13 08:15:21', '2025-04-06 01:15:21'),
(56, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzOTAyMjU4LCJleHAiOjE3NDQ1MDcwNTh9.TDXG5RPZF0_oipPzcXv6nyMm1BN6byfY4Rg7czeZYQg', '2025-04-13 08:17:38', '2025-04-06 01:17:38'),
(57, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzOTAyMzA1LCJleHAiOjE3NDQ1MDcxMDV9.r2ldsQTpoiNcS4NPpf8AYhE4Vb8ge1RAuEp_j6rmGyA', '2025-04-13 08:18:25', '2025-04-06 01:18:25'),
(58, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzOTAyNzQxLCJleHAiOjE3NDQ1MDc1NDF9.1Gwa6hnpJ57nKFjQTKpQ4rpZdLiSsDWwa3b1OnS6qMU', '2025-04-13 08:25:41', '2025-04-06 01:25:41'),
(59, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQzOTAzMzMxLCJleHAiOjE3NDQ1MDgxMzF9.ulTi6oVNuIofmK_uJpldiWL6YOI7jCkytex6VSwaBfI', '2025-04-13 08:35:31', '2025-04-06 01:35:31'),
(60, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0NjgzMjQxLCJleHAiOjE3NDUyODgwNDF9.OggL7_KkiS-W_tjQfsa-d1mOBO8YsMIDwrGCgMqWoIE', '2025-04-22 09:14:01', '2025-04-15 02:14:01'),
(61, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0Njg0OTY2LCJleHAiOjE3NDUyODk3NjZ9.jqpy8Q_oWbHcpwBI4mgGbO60u1LbD6rNrf0WDFIun5Q', '2025-04-22 09:42:46', '2025-04-15 02:42:46'),
(62, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ3OTQyOTcsImV4cCI6MTc0NTM5OTA5N30.G1iz8DQQL_RsF_r13vu2k9m16wqAnfCBYIIM-EqjkfE', '2025-04-23 16:04:57', '2025-04-16 09:04:57'),
(63, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODU4ODYzLCJleHAiOjE3NDU0NjM2NjN9.QKCb3yPQQYpyhN86AmRCkbjzcOALUtU1TTU9n819PeM', '2025-04-24 10:01:03', '2025-04-17 03:01:03'),
(64, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODYxNTcyLCJleHAiOjE3NDU0NjYzNzJ9.2s035WZWn_VnzOU0rkqJVZWlVVY9Em_0C0ZH0HS2WR0', '2025-04-24 10:46:12', '2025-04-17 03:46:12'),
(65, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkJST0tFUiIsImlhdCI6MTc0NDg2MTYxMCwiZXhwIjoxNzQ1NDY2NDEwfQ.EdGXiigVZEDTKyWMl01iEP6fVRgUiO6nTpS-Jr4EuQw', '2025-04-24 10:46:50', '2025-04-17 03:46:50'),
(66, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTA2NDYyNjg1MSIsInVzZXJJZCI6Nywicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzQ0ODYxNjM5LCJleHAiOjE3NDU0NjY0Mzl9.SUKgbBV5ghgPfA_Gf6O0oNEtJizMgdxItcR19bW-o18', '2025-04-24 10:47:19', '2025-04-17 03:47:19'),
(67, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODYyMzE5LCJleHAiOjE3NDU0NjcxMTl9.AneW8fX_diZCqBt9umpXSsLs_1QyEuZg10M1X8UqJHc', '2025-04-24 10:58:39', '2025-04-17 03:58:39'),
(68, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ4NjI1MTYsImV4cCI6MTc0NTQ2NzMxNn0.AE1oFHPnf_w6aGBywhcEFn9S9s28SfwAUMs5vN6lRsI', '2025-04-24 11:01:56', '2025-04-17 04:01:56'),
(69, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODYyNzg1LCJleHAiOjE3NDU0Njc1ODV9.uAXcLIMXT0BnqYekXB5bdcuJVGYAukFr0GA87xXqtUI', '2025-04-24 11:06:25', '2025-04-17 04:06:25'),
(70, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ4NjQ2NDYsImV4cCI6MTc0NTQ2OTQ0Nn0.5fTHl6p7nrWfME1CpcLv1lxwDrWfr4T66Y7rzEAZqmc', '2025-04-24 11:37:26', '2025-04-17 04:37:26'),
(71, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODc0NTY1LCJleHAiOjE3NDU0NzkzNjV9.W23Abki0cJh_BHV7RD5OYCHNzij_1f7MFi9D6AQSCIc', '2025-04-24 14:22:45', '2025-04-17 07:22:45'),
(72, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODc0NTg0LCJleHAiOjE3NDU0NzkzODR9.hPKnZ1QMRYSswgjnzqLWpFQnRATVoYg8PmVtP49luAU', '2025-04-24 14:23:04', '2025-04-17 07:23:04'),
(73, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTM0NTQ0NTY5IiwidXNlcklkIjo2LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDQ4NzQ1OTMsImV4cCI6MTc0NTQ3OTM5M30.pR3n0huQOftAKxEHyL2VBNxhNQHDk7XhCkWjdxztVQo', '2025-04-24 14:23:13', '2025-04-17 07:23:13'),
(74, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ0ODc2NDA0LCJleHAiOjE3NDU0ODEyMDR9.QOPal-9IQwaAu5LSjxeiKiiLnpt2JopoK2SP8nopb1Y', '2025-04-24 14:53:24', '2025-04-17 07:53:24'),
(75, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ4NzcxOTIsImV4cCI6MTc0NTQ4MTk5Mn0._MRrhUBmwpHNUbwsvFu2u6H_Xk-G9DkonxEwUHrONzs', '2025-04-24 15:06:32', '2025-04-17 08:06:32'),
(76, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ4ODQxMTUsImV4cCI6MTc0NTQ4ODkxNX0.D7JXWpQNOCXXiV2mOW-KSO7TjYo4-IA3DBd6EFNJ0O8', '2025-04-24 17:01:55', '2025-04-17 10:01:55'),
(77, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ4ODQzNzMsImV4cCI6MTc0NTQ4OTE3M30.KO8p2y0Mt-ewMm6uzsTaEqVKwdDD5W3o4dbw_ObHx_Q', '2025-04-24 17:06:13', '2025-04-17 10:06:13'),
(78, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDQ5NDEzNDgsImV4cCI6MTc0NTU0NjE0OH0.R_hrDqBL33NPhgv1Fmrnk1T0DTLeMX-x4ZcSS68J0WE', '2025-04-25 08:55:48', '2025-04-18 01:55:48'),
(79, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1MDU1NTc4LCJleHAiOjE3NDU2NjAzNzh9.BOlGE5HW46qJWZhFdFbuAXN04HdCm7ai3eeVGn810lY', '2025-04-26 16:39:38', '2025-04-19 09:39:38'),
(80, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDUyOTI0MzcsImV4cCI6MTc0NTg5NzIzN30.DByhn08Joi3gme2yrdSOMojrHWyOULXcoD2LjDi0N-k', '2025-04-29 10:27:17', '2025-04-22 03:27:17'),
(81, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1MjkyNDc5LCJleHAiOjE3NDU4OTcyNzl9.LvdyvAGKNVoip3bqIvx-8kfewOfWdv0lTeAyftXa6IE', '2025-04-29 10:27:59', '2025-04-22 03:27:59'),
(82, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1MjkzMzMwLCJleHAiOjE3NDU4OTgxMzB9.NMNeuFqbrQZQZoJ52yZlHbDA2EpIzmcvWI42won1qdI', '2025-04-29 10:42:10', '2025-04-22 03:42:10'),
(83, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDUyOTMzNDAsImV4cCI6MTc0NTg5ODE0MH0.aTMbC5oXzGBvHSpQXGXkF8PhXuWN5T68v2jhN79Mfzw', '2025-04-29 10:42:20', '2025-04-22 03:42:20'),
(84, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDU0ODYwMDcsImV4cCI6MTc0NjA5MDgwN30.IOHML0XBEej6d0fd0xlRkTVd-4LtfND6nQUsxHMnxIY', '2025-05-01 16:13:27', '2025-04-24 09:13:27'),
(85, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU3NTkxOTMsImV4cCI6MTc0NjM2Mzk5M30.lRDsxgdNGWZpsd-dFtyrICLK30jAvS-zxwk9bRa5fM4', '2025-05-04 20:06:33', '2025-04-27 13:06:33'),
(86, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1NzU5MjIxLCJleHAiOjE3NDYzNjQwMjF9.kpEdTkRyteFCSdFH46zmdSFglGmhUOyILSPQ0HFpTe4', '2025-05-04 20:07:01', '2025-04-27 13:07:01'),
(87, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU3NTkzNDYsImV4cCI6MTc0NjM2NDE0Nn0.h7X0RzKN4akLSKNYCvCdp80zSnfFS_XUbn4GcR1Wfkg', '2025-05-04 20:09:06', '2025-04-27 13:09:06'),
(88, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1NzU5NTc5LCJleHAiOjE3NDYzNjQzNzl9.zhvXGAjZbxOquxxLZz3BZ0fIGT4ubGlaN7s6645Wa98', '2025-05-04 20:12:59', '2025-04-27 13:12:59'),
(89, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDU3NTk2NzQsImV4cCI6MTc0NjM2NDQ3NH0.YuY1mTeN3cT0zmT86HiIiKljWmlyfJy4Hqzw0k9cj1c', '2025-05-04 20:14:34', '2025-04-27 13:14:34'),
(90, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1NzU5NzIyLCJleHAiOjE3NDYzNjQ1MjJ9.iwRR7WWwGm_PDi6IIxfqBfiZEvXtTjYaC2HMjZGzOWE', '2025-05-04 20:15:22', '2025-04-27 13:15:22'),
(91, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1NzYwMTQ1LCJleHAiOjE3NDYzNjQ5NDV9.DdPMy0xc9IduN5OQoAjTm8pVVGXZfRgj_d20JoMmuEo', '2025-05-04 20:22:25', '2025-04-27 13:22:25'),
(92, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODM0ODIxLCJleHAiOjE3NDY0Mzk2MjF9.pFpfOBGhIqEmPuE2RHq1uysKVOazGcQWtRo6qm-pShs', '2025-05-05 17:07:01', '2025-04-28 10:07:01'),
(93, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODM1NjM3LCJleHAiOjE3NDY0NDA0Mzd9.QOcrrmQB2b0_Zn0R8SX7LNwv8RL4SZDuvFrFm5OxwPQ', '2025-05-05 17:20:37', '2025-04-28 10:20:37'),
(94, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4MzU3MTUsImV4cCI6MTc0NjQ0MDUxNX0.hlPX7IzUbVcJoKCQG7kDEeSuzqZ57S18nEhvMlzvGDA', '2025-05-05 17:21:55', '2025-04-28 10:21:55'),
(95, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4MzU4MDIsImV4cCI6MTc0NjQ0MDYwMn0._ggBCInZvNhV3sdnHoBcXzXrC0n3r9pUWDq_A8DbpI8', '2025-05-05 17:23:22', '2025-04-28 10:23:22'),
(96, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODM3NDgyLCJleHAiOjE3NDY0NDIyODJ9.fxQsdWPILn7ro-9NbK7o0gyiE9G2NQtG4pmVi7Sfguk', '2025-05-05 17:51:22', '2025-04-28 10:51:22'),
(97, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODM4Njg4LCJleHAiOjE3NDY0NDM0ODh9.VdBicfUDTcTRIWsu7JPK9U1lX9tW7y-E2m9_GOVbU3Y', '2025-05-05 18:11:28', '2025-04-28 11:11:28'),
(98, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4Mzg3MDcsImV4cCI6MTc0NjQ0MzUwN30.2bUP2IY4PfThN1xxsidR8ZDRlkcmAFx4oqPSLL2hRTc', '2025-05-05 18:11:47', '2025-04-28 11:11:47'),
(99, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODM4NzE1LCJleHAiOjE3NDY0NDM1MTV9.qfRRFLEa6wYJ7r1MqCSwHZXktZ2jdJctqXVZ3FwHWgA', '2025-05-05 18:11:55', '2025-04-28 11:11:55'),
(100, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4OTQyNDgsImV4cCI6MTc0NjQ5OTA0OH0.ySO3W61VAWhu4NfzFtFOoerVHt8ek28PyxPZ-g7OlGQ', '2025-05-06 09:37:28', '2025-04-29 02:37:28'),
(101, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4OTQ0NDcsImV4cCI6MTc0NjQ5OTI0N30.FO4GEByAw9EU5N8tcivvXJr_HwLNNIC1g5udjuxmLfY', '2025-05-06 09:40:47', '2025-04-29 02:40:47'),
(102, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDU4OTQ4MjEsImV4cCI6MTc0NjQ5OTYyMX0.icWEpTVYYtz0t5J8UWsChcGZ2fnY3ic7QeBFTlhsEyc', '2025-05-06 09:47:01', '2025-04-29 02:47:01'),
(103, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ1ODk0OTUxLCJleHAiOjE3NDY0OTk3NTF9.l6crtO9pmWCbXzrLZa3F6BVL-aOfLXuMNqjhsZeJVc0', '2025-05-06 09:49:11', '2025-04-29 02:49:11'),
(104, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ2NDk4MDM1LCJleHAiOjE3NDcxMDI4MzV9.NXlmoDONh65MM8kIf2QcnruG5-VyjGY-JtLHkAxtXbA', '2025-05-13 09:20:35', '2025-05-06 02:20:35'),
(105, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ2NjEwNzU4LCJleHAiOjE3NDcyMTU1NTh9.ExnV6v5Qk3CKELo8ldkssOOy0tn6iJHvhMDc88cyzgA', '2025-05-14 16:39:18', '2025-05-07 09:39:18'),
(106, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ2ODkwODI0LCJleHAiOjE3NDc0OTU2MjR9.aGvqfLSL7DR-U0WsN1lgmi1UbCAplIu1_MljQ4QepIU', '2025-05-17 22:27:04', '2025-05-10 15:27:04'),
(107, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDcyMDk1NTQsImV4cCI6MTc0NzgxNDM1NH0.HEJ6AN5lsgph9VcS_A7PlPWsZwO72gTJspEHLmaA7Bk', '2025-05-21 14:59:14', '2025-05-14 07:59:14'),
(108, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3MjA5NzEzLCJleHAiOjE3NDc4MTQ1MTN9.O1GhO_6TqzO2ipgtxN9phquAovlEukS4uTDyS-qPb8Q', '2025-05-21 15:01:53', '2025-05-14 08:01:53'),
(109, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3MzYzNjE3LCJleHAiOjE3NDc5Njg0MTd9.MaR56EzM5AiTC9_UMxk7XAg41GUuYp9pqHHeKUKiLQ0', '2025-05-23 09:46:57', '2025-05-16 02:46:57'),
(110, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc0MDYyODYsImV4cCI6MTc0ODAxMTA4Nn0.55U0soiZakkmb6rWJ80jr0RG8JUTwAudL7c2siKHA6U', '2025-05-23 21:38:06', '2025-05-16 14:38:06'),
(111, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NDA2NTAxLCJleHAiOjE3NDgwMTEzMDF9.as6ZHh-KcMt4K87sqlXLy8dVdTD759YMTBTlj8Ood3M', '2025-05-23 21:41:41', '2025-05-16 14:41:41'),
(112, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NDkxMzY0LCJleHAiOjE3NDgwOTYxNjR9.N_Ob629StpbO2jKGugBfNgdCBz1grx6Xq_DJz2300E0', '2025-05-24 21:16:04', '2025-05-17 14:16:04'),
(113, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NDkzOTA4LCJleHAiOjE3NDgwOTg3MDh9.S5FTZF4QZEAIk65Ba3Q39wExWi1w-RS3NFGkhEQKwvU', '2025-05-24 21:58:28', '2025-05-17 14:58:28'),
(114, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NTkwMDAwLCJleHAiOjE3NDgxOTQ4MDB9.QiDMQU8uX-c0Eo4H_D1sJG95jg74se8W-KS14bbZnwk', '2025-05-26 00:40:00', '2025-05-18 17:40:00'),
(115, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMyIiwidXNlcklkIjo5LCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NDc2Mzg0MzIsImV4cCI6MTc0ODI0MzIzMn0.I8je3dF2utKV9r0LYW790Nrm-gXa1SQRs9k7q1fDYhE', '2025-05-26 14:07:12', '2025-05-19 07:07:12'),
(116, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NjM4NDg4LCJleHAiOjE3NDgyNDMyODh9.h2PWzJ-rqfy0CU7vdaahkGyW2fzeMYZHLDVYq_1Tfbw', '2025-05-26 14:08:08', '2025-05-19 07:08:08'),
(117, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NjQ2OTIxLCJleHAiOjE3NDgyNTE3MjF9.youPL3xcdd2Bh-vf8iG1NfmNx2YdRWNz0MTdSpVqxTE', '2025-05-26 16:28:41', '2025-05-19 09:28:41'),
(118, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMzIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NjUwMzIxLCJleHAiOjE3NDgyNTUxMjF9._8ySjBkhg5F60VDEAFtXAVbDPre3Vvb9M5JB9FKXiPM', '2025-05-26 17:25:21', '2025-05-19 10:25:21'),
(119, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3NjUwMzM0LCJleHAiOjE3NDgyNTUxMzR9.lAHg87u2P1kRkFG2ZGV03xzVS9Wnqkpa1W1XYUR0IdQ', '2025-05-26 17:25:34', '2025-05-19 10:25:34'),
(120, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc2NjYyNTIsImV4cCI6MTc0ODI3MTA1Mn0.mVBvj-zF8cQrr4UH0jmDOF5P-hbiQJM87-0TNL21RZo', '2025-05-26 21:50:52', '2025-05-19 14:50:52'),
(121, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ3OTAwNTkwLCJleHAiOjE3NDg1MDUzOTB9.SIBL8dsgAlYu6yuwLsVEYF-UiHfQtKPyKp7pUl8z8m0', '2025-05-29 14:56:30', '2025-05-22 07:56:30'),
(122, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ4MDc4MDA4LCJleHAiOjE3NDg2ODI4MDh9.B0jBir1WgiJZXslNjslHFLBNFpPpAiV-KC9I7o96lO8', '2025-05-31 16:13:28', '2025-05-24 09:13:28'),
(123, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwidXNlcklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDgwNzg0NDQsImV4cCI6MTc0ODY4MzI0NH0.NeWWmhNn2v9zO610j8a13hUAfAHOaL0ydPXN1IpZYig', '2025-05-31 16:20:44', '2025-05-24 09:20:44'),
(124, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzczMTE1NDMxIiwidXNlcklkIjo4LCJyb2xlIjoiQlJPS0VSIiwiaWF0IjoxNzQ4MTgyNzY5LCJleHAiOjE3NDg3ODc1Njl9.IADUaoyA5_7kNXgmL8ZivkY-qvPFe0_F_B0FnTKG_vM', '2025-06-01 21:19:29', '2025-05-25 14:19:29');

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
(17, 7, 'UPGRADE', 2000000.00, '2025-04-03 02:59:23', '2025-03-13 04:11:15'),
(18, 7, 'UPGRADE', 3000000.00, '2025-04-03 02:59:18', '2025-03-13 04:11:15'),
(19, 8, 'UPGRADE', 376000.00, '2025-05-19 07:09:29', '2025-03-13 04:11:15'),
(20, 8, 'UPGRADE', 376000.00, '2025-05-19 07:10:24', '2025-05-21 04:11:15'),
(22, 6, 'UPGRADE', 376000.00, '2025-04-03 03:24:15', '2025-04-03 03:24:15'),
(54, 7, 'UPGRADE', 37600000.00, '2025-04-03 03:38:27', '2025-04-03 03:38:27'),
(55, 7, 'UPGRADE', 37600000.00, '2025-04-03 03:40:16', '2025-04-03 03:40:16'),
(56, 7, 'UPGRADE', 37600000.00, '2025-04-03 03:43:40', '2025-04-03 03:43:40'),
(57, 7, 'UPGRADE', 376000.00, '2025-04-03 03:45:48', '2025-04-03 03:45:48'),
(58, 7, 'UPGRADE', 376000.00, '2025-04-03 07:47:17', '2025-04-03 07:47:17'),
(59, 7, 'UPGRADE', 376000.00, '2025-04-17 03:47:57', '2025-04-17 03:47:57'),
(63, 9, 'UPGRADE', 376000.00, '2025-04-28 10:22:34', '2025-04-28 10:22:34');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `fullName`, `email`, `password`, `phone`, `created_at`, `updated_at`, `is_enabled`) VALUES
(1, 1, 'Đức Thiện', 'admin1@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0123456789', '2025-02-27 07:52:47', '2025-04-18 02:01:11', 1),
(2, 2, 'Phan Trí', 'broker1@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0987654321', '2025-02-27 07:52:47', '2025-04-18 02:01:13', 1),
(3, 3, 'Hồng Trần', 'user01@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0112233445', '2025-02-27 07:52:47', '2025-04-18 02:01:15', 1),
(5, 3, 'Thu Hà', 'user02@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '093454856978', '2025-03-12 02:32:04', '2025-04-18 02:01:16', 1),
(6, 3, 'Phương Lan', 'jane.do2@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0934544569', '2025-03-12 03:06:41', '2025-04-18 02:01:17', 1),
(7, 2, 'Kiều Nhi', 'jane.do1@example.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0906462685', '2025-03-14 02:13:08', '2025-05-16 14:38:39', 0),
(8, 2, 'Vấn Đức', 'nguyenducvan260903@gmail.com', '$2a$10$wYybyB.K5yEBOB7C6HNWlugAr/YJnUJOp.wt5H4T55BXYLyNkj76K', '0373115431', '2025-03-22 11:43:57', '2025-05-19 10:25:26', 1),
(9, 3, 'Vấn Đức', 'nguyenducvan260901@gmail.com', '$2a$10$66PHemI24hQRBxdVqQdzIO88U9oeoOTJXlJuHnb.6KxriNUjiBvla', '0373115432', '2025-04-27 13:06:27', '2025-05-24 09:21:45', 1);

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
  MODIFY `favourite_property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `furnished_statuses`
--
ALTER TABLE `furnished_statuses`
  MODIFY `furnished_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `houses`
--
ALTER TABLE `houses`
  MODIFY `house_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `house_characteristics`
--
ALTER TABLE `house_characteristics`
  MODIFY `house_characteristic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `house_characteristic_mappings`
--
ALTER TABLE `house_characteristic_mappings`
  MODIFY `house_characteristic_mapping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `house_type`
--
ALTER TABLE `house_type`
  MODIFY `house_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `lands`
--
ALTER TABLE `lands`
  MODIFY `land_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `land_characteristics`
--
ALTER TABLE `land_characteristics`
  MODIFY `land_characteristic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `land_characteristic_mappings`
--
ALTER TABLE `land_characteristic_mappings`
  MODIFY `land_characteristic_mapping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT cho bảng `land_types`
--
ALTER TABLE `land_types`
  MODIFY `land_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `properties`
--
ALTER TABLE `properties`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT cho bảng `transactions_history`
--
ALTER TABLE `transactions_history`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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

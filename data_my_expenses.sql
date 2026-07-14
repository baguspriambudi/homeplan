-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql109.infinityfree.com
-- Generation Time: Jul 12, 2026 at 08:21 AM
-- Server version: 11.4.12-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_40868646_my_expenses`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('myexpanses-cache-livewire-rate-limiter:0a0af3e2a2e9bf1a49335b839abdf8c01f01587f', 'i:1;', 1769914222),
('myexpanses-cache-livewire-rate-limiter:0a0af3e2a2e9bf1a49335b839abdf8c01f01587f:timer', 'i:1769914222;', 1769914222),
('myexpanses-cache-livewire-rate-limiter:0e09792ec35c6c60d446f0b2ebd85482385b3a6c', 'i:1;', 1769232872),
('myexpanses-cache-livewire-rate-limiter:0e09792ec35c6c60d446f0b2ebd85482385b3a6c:timer', 'i:1769232872;', 1769232872),
('myexpanses-cache-livewire-rate-limiter:12eddcde83e29aba99fde382f9268246c67e46e1', 'i:1;', 1777447553),
('myexpanses-cache-livewire-rate-limiter:12eddcde83e29aba99fde382f9268246c67e46e1:timer', 'i:1777447553;', 1777447553),
('myexpanses-cache-livewire-rate-limiter:12f2417350bb0c0591b8eb0ec3464d66207bd979', 'i:1;', 1768214591),
('myexpanses-cache-livewire-rate-limiter:12f2417350bb0c0591b8eb0ec3464d66207bd979:timer', 'i:1768214591;', 1768214591),
('myexpanses-cache-livewire-rate-limiter:1ff0579427a469f21f6999c9374eb1464341f8e9', 'i:1;', 1769330087),
('myexpanses-cache-livewire-rate-limiter:1ff0579427a469f21f6999c9374eb1464341f8e9:timer', 'i:1769330087;', 1769330087),
('myexpanses-cache-livewire-rate-limiter:21e6be0621ef7f0b4cf2fd153b0a4e43f17896f5', 'i:1;', 1783174611),
('myexpanses-cache-livewire-rate-limiter:21e6be0621ef7f0b4cf2fd153b0a4e43f17896f5:timer', 'i:1783174611;', 1783174611),
('myexpanses-cache-livewire-rate-limiter:25cd8c02dabbb0a1db266881e7864bf6ac30cf39', 'i:1;', 1769344129),
('myexpanses-cache-livewire-rate-limiter:25cd8c02dabbb0a1db266881e7864bf6ac30cf39:timer', 'i:1769344129;', 1769344129),
('myexpanses-cache-livewire-rate-limiter:25f2f5ada0d5cc8b05c5d5e557fa92d484e7e36b', 'i:1;', 1777352073),
('myexpanses-cache-livewire-rate-limiter:25f2f5ada0d5cc8b05c5d5e557fa92d484e7e36b:timer', 'i:1777352073;', 1777352073),
('myexpanses-cache-livewire-rate-limiter:2c43dcad9142364815d79b8bc8c795b8776a1f65', 'i:1;', 1769944645),
('myexpanses-cache-livewire-rate-limiter:2c43dcad9142364815d79b8bc8c795b8776a1f65:timer', 'i:1769944645;', 1769944645),
('myexpanses-cache-livewire-rate-limiter:2e3797ab4e02b201abb4e4885ce9c36834a62f5d', 'i:1;', 1772334826),
('myexpanses-cache-livewire-rate-limiter:2e3797ab4e02b201abb4e4885ce9c36834a62f5d:timer', 'i:1772334826;', 1772334826),
('myexpanses-cache-livewire-rate-limiter:2f08b9a8b83afee31268439367ad6d9039b35b9a', 'i:1;', 1783735366),
('myexpanses-cache-livewire-rate-limiter:2f08b9a8b83afee31268439367ad6d9039b35b9a:timer', 'i:1783735366;', 1783735366),
('myexpanses-cache-livewire-rate-limiter:31119dcf5fc10500ec354419333416a12e9c03b6', 'i:2;', 1781338564),
('myexpanses-cache-livewire-rate-limiter:31119dcf5fc10500ec354419333416a12e9c03b6:timer', 'i:1781338564;', 1781338564),
('myexpanses-cache-livewire-rate-limiter:38c07c19029fb88d9d9c08a2a3be0e366e15d96d', 'i:1;', 1774770505),
('myexpanses-cache-livewire-rate-limiter:38c07c19029fb88d9d9c08a2a3be0e366e15d96d:timer', 'i:1774770505;', 1774770505),
('myexpanses-cache-livewire-rate-limiter:39017b447cc9de9ebf32240ac5f59522b112de94', 'i:1;', 1776495316),
('myexpanses-cache-livewire-rate-limiter:39017b447cc9de9ebf32240ac5f59522b112de94:timer', 'i:1776495316;', 1776495316),
('myexpanses-cache-livewire-rate-limiter:390d6873e36eb2677273dd8f37a3c4c349f484b0', 'i:1;', 1778410934),
('myexpanses-cache-livewire-rate-limiter:390d6873e36eb2677273dd8f37a3c4c349f484b0:timer', 'i:1778410934;', 1778410934),
('myexpanses-cache-livewire-rate-limiter:3a8972c968d90e4af934e985fceb978d931ca1b2', 'i:1;', 1777630443),
('myexpanses-cache-livewire-rate-limiter:3a8972c968d90e4af934e985fceb978d931ca1b2:timer', 'i:1777630443;', 1777630443),
('myexpanses-cache-livewire-rate-limiter:4cb4d1922076a436bb8f19f08d1f8791459547f4', 'i:1;', 1778023850),
('myexpanses-cache-livewire-rate-limiter:4cb4d1922076a436bb8f19f08d1f8791459547f4:timer', 'i:1778023850;', 1778023850),
('myexpanses-cache-livewire-rate-limiter:4e66e3aa080290a5271d1f8462f8011309a00e2c', 'i:1;', 1778230472),
('myexpanses-cache-livewire-rate-limiter:4e66e3aa080290a5271d1f8462f8011309a00e2c:timer', 'i:1778230472;', 1778230472),
('myexpanses-cache-livewire-rate-limiter:4e6ca584f083311122f66a3bfcf89e943b54a1bd', 'i:1;', 1771291804),
('myexpanses-cache-livewire-rate-limiter:4e6ca584f083311122f66a3bfcf89e943b54a1bd:timer', 'i:1771291804;', 1771291804),
('myexpanses-cache-livewire-rate-limiter:5270ac316aab8311b4e8ab668d9781b35c663caa', 'i:2;', 1768113529),
('myexpanses-cache-livewire-rate-limiter:5270ac316aab8311b4e8ab668d9781b35c663caa:timer', 'i:1768113529;', 1768113529),
('myexpanses-cache-livewire-rate-limiter:5dbd18243a7d68295eafe01c8094e30c527a0da1', 'i:1;', 1782721220),
('myexpanses-cache-livewire-rate-limiter:5dbd18243a7d68295eafe01c8094e30c527a0da1:timer', 'i:1782721220;', 1782721220),
('myexpanses-cache-livewire-rate-limiter:5fb269aed719e54f74b670f07dcd4d3b1b49e740', 'i:1;', 1772198934),
('myexpanses-cache-livewire-rate-limiter:5fb269aed719e54f74b670f07dcd4d3b1b49e740:timer', 'i:1772198934;', 1772198934),
('myexpanses-cache-livewire-rate-limiter:5fe186077001274d96f847139eb0914691ced372', 'i:1;', 1780384683),
('myexpanses-cache-livewire-rate-limiter:5fe186077001274d96f847139eb0914691ced372:timer', 'i:1780384683;', 1780384683),
('myexpanses-cache-livewire-rate-limiter:6300261713be02e19b85bdf450f6a027f4331636', 'i:1;', 1770811809),
('myexpanses-cache-livewire-rate-limiter:6300261713be02e19b85bdf450f6a027f4331636:timer', 'i:1770811809;', 1770811809),
('myexpanses-cache-livewire-rate-limiter:635abdae44db80aa6919ab2e79595b228d1cb6fa', 'i:1;', 1781179359),
('myexpanses-cache-livewire-rate-limiter:635abdae44db80aa6919ab2e79595b228d1cb6fa:timer', 'i:1781179359;', 1781179359),
('myexpanses-cache-livewire-rate-limiter:64494367d13681fefb5183576eb9417fc2a84562', 'i:1;', 1770557471),
('myexpanses-cache-livewire-rate-limiter:64494367d13681fefb5183576eb9417fc2a84562:timer', 'i:1770557471;', 1770557471),
('myexpanses-cache-livewire-rate-limiter:6533775d59aa8c505ee8771563bd215416566666', 'i:1;', 1782619269),
('myexpanses-cache-livewire-rate-limiter:6533775d59aa8c505ee8771563bd215416566666:timer', 'i:1782619269;', 1782619269),
('myexpanses-cache-livewire-rate-limiter:6898fb09949b959e4b41d5cdcaa90fc762b14a5d', 'i:1;', 1773128978),
('myexpanses-cache-livewire-rate-limiter:6898fb09949b959e4b41d5cdcaa90fc762b14a5d:timer', 'i:1773128978;', 1773128978),
('myexpanses-cache-livewire-rate-limiter:6dbaf8082ba80077d8af62867f4575294c57f9d1', 'i:1;', 1779243816),
('myexpanses-cache-livewire-rate-limiter:6dbaf8082ba80077d8af62867f4575294c57f9d1:timer', 'i:1779243816;', 1779243816),
('myexpanses-cache-livewire-rate-limiter:6f3cc70416ea13fa9b1e7c25d0012c5aceb834d3', 'i:1;', 1775718931),
('myexpanses-cache-livewire-rate-limiter:6f3cc70416ea13fa9b1e7c25d0012c5aceb834d3:timer', 'i:1775718931;', 1775718931),
('myexpanses-cache-livewire-rate-limiter:71337492ca688e53150f5c9090be214040fe05ae', 'i:1;', 1768189952),
('myexpanses-cache-livewire-rate-limiter:71337492ca688e53150f5c9090be214040fe05ae:timer', 'i:1768189952;', 1768189952),
('myexpanses-cache-livewire-rate-limiter:74c2f053a7ff1e7a23f7c6872c71bbe6e7f11f43', 'i:1;', 1775089902),
('myexpanses-cache-livewire-rate-limiter:74c2f053a7ff1e7a23f7c6872c71bbe6e7f11f43:timer', 'i:1775089902;', 1775089902),
('myexpanses-cache-livewire-rate-limiter:76c92be7608409788ab119533578dd73db470bb1', 'i:1;', 1774012280),
('myexpanses-cache-livewire-rate-limiter:76c92be7608409788ab119533578dd73db470bb1:timer', 'i:1774012280;', 1774012280),
('myexpanses-cache-livewire-rate-limiter:7ab315d2c0c9c335043f3ccdcd135753d3e8f8cb', 'i:1;', 1778587282),
('myexpanses-cache-livewire-rate-limiter:7ab315d2c0c9c335043f3ccdcd135753d3e8f8cb:timer', 'i:1778587282;', 1778587282),
('myexpanses-cache-livewire-rate-limiter:7c6ea238a67940951243176e5e7e64f4ec004831', 'i:1;', 1770018072),
('myexpanses-cache-livewire-rate-limiter:7c6ea238a67940951243176e5e7e64f4ec004831:timer', 'i:1770018072;', 1770018072),
('myexpanses-cache-livewire-rate-limiter:81999777ed7d404f34327b446a6167a95115538c', 'i:1;', 1772850672),
('myexpanses-cache-livewire-rate-limiter:81999777ed7d404f34327b446a6167a95115538c:timer', 'i:1772850672;', 1772850672),
('myexpanses-cache-livewire-rate-limiter:8dea930c533c717ed7a39928e595e1786dfdc0e7', 'i:1;', 1771143276),
('myexpanses-cache-livewire-rate-limiter:8dea930c533c717ed7a39928e595e1786dfdc0e7:timer', 'i:1771143276;', 1771143276),
('myexpanses-cache-livewire-rate-limiter:8e4493fb2871c9b65c89eb1812e635bfb32528fa', 'i:1;', 1769519502),
('myexpanses-cache-livewire-rate-limiter:8e4493fb2871c9b65c89eb1812e635bfb32528fa:timer', 'i:1769519502;', 1769519502),
('myexpanses-cache-livewire-rate-limiter:95e4e3f79af6b3de53b3a1ad4649610fa098299b', 'i:1;', 1782264977),
('myexpanses-cache-livewire-rate-limiter:95e4e3f79af6b3de53b3a1ad4649610fa098299b:timer', 'i:1782264977;', 1782264977),
('myexpanses-cache-livewire-rate-limiter:a141b798f9fdab3c5220b206d20ca12e3572e1bd', 'i:1;', 1783686506),
('myexpanses-cache-livewire-rate-limiter:a141b798f9fdab3c5220b206d20ca12e3572e1bd:timer', 'i:1783686506;', 1783686506),
('myexpanses-cache-livewire-rate-limiter:a4e323dd81955218a92f46004c9baf4663b4487d', 'i:1;', 1769685203),
('myexpanses-cache-livewire-rate-limiter:a4e323dd81955218a92f46004c9baf4663b4487d:timer', 'i:1769685203;', 1769685203),
('myexpanses-cache-livewire-rate-limiter:a568ab01478cf1f03e64e20c1d8318929befa500', 'i:1;', 1768743084),
('myexpanses-cache-livewire-rate-limiter:a568ab01478cf1f03e64e20c1d8318929befa500:timer', 'i:1768743084;', 1768743084),
('myexpanses-cache-livewire-rate-limiter:aa3664127973854535516847060149395d570459', 'i:1;', 1771823828),
('myexpanses-cache-livewire-rate-limiter:aa3664127973854535516847060149395d570459:timer', 'i:1771823828;', 1771823828),
('myexpanses-cache-livewire-rate-limiter:ad40f8e0cee0398c4ffc27838ee3c0951e7a31cf', 'i:2;', 1772435528),
('myexpanses-cache-livewire-rate-limiter:ad40f8e0cee0398c4ffc27838ee3c0951e7a31cf:timer', 'i:1772435528;', 1772435528),
('myexpanses-cache-livewire-rate-limiter:ae4348937edca75672e9d66cb1a93322bc32e4ae', 'i:1;', 1780277265),
('myexpanses-cache-livewire-rate-limiter:ae4348937edca75672e9d66cb1a93322bc32e4ae:timer', 'i:1780277265;', 1780277265),
('myexpanses-cache-livewire-rate-limiter:ae56bc92fcf044aace1beca3b3e18802853990de', 'i:1;', 1770539856),
('myexpanses-cache-livewire-rate-limiter:ae56bc92fcf044aace1beca3b3e18802853990de:timer', 'i:1770539856;', 1770539856),
('myexpanses-cache-livewire-rate-limiter:b55bb16e5fa9f1ee6f55100c5f99da4e2733e86b', 'i:1;', 1769822690),
('myexpanses-cache-livewire-rate-limiter:b55bb16e5fa9f1ee6f55100c5f99da4e2733e86b:timer', 'i:1769822690;', 1769822690),
('myexpanses-cache-livewire-rate-limiter:b9c0f3bea8dad6c5b651af3908fca117df1392bf', 'i:1;', 1783858837),
('myexpanses-cache-livewire-rate-limiter:b9c0f3bea8dad6c5b651af3908fca117df1392bf:timer', 'i:1783858837;', 1783858837),
('myexpanses-cache-livewire-rate-limiter:bb6fef2f93bd70e3d5ebeed2ed7fcec6a18a188a', 'i:1;', 1773289573),
('myexpanses-cache-livewire-rate-limiter:bb6fef2f93bd70e3d5ebeed2ed7fcec6a18a188a:timer', 'i:1773289573;', 1773289573),
('myexpanses-cache-livewire-rate-limiter:bbeecfcc3090056b0a0822cc07ebe007af429043', 'i:1;', 1783743231),
('myexpanses-cache-livewire-rate-limiter:bbeecfcc3090056b0a0822cc07ebe007af429043:timer', 'i:1783743231;', 1783743231),
('myexpanses-cache-livewire-rate-limiter:bc198b9fe58f03c21d73aed20bd5f11334c921a3', 'i:1;', 1770539735),
('myexpanses-cache-livewire-rate-limiter:bc198b9fe58f03c21d73aed20bd5f11334c921a3:timer', 'i:1770539735;', 1770539735),
('myexpanses-cache-livewire-rate-limiter:c070ba80215c2f02c3f55d20d07eab92e6498b48', 'i:1;', 1774265897),
('myexpanses-cache-livewire-rate-limiter:c070ba80215c2f02c3f55d20d07eab92e6498b48:timer', 'i:1774265897;', 1774265897),
('myexpanses-cache-livewire-rate-limiter:c60f29f2391bd16bdd286fa68ed514b13f6843e0', 'i:1;', 1768896492),
('myexpanses-cache-livewire-rate-limiter:c60f29f2391bd16bdd286fa68ed514b13f6843e0:timer', 'i:1768896492;', 1768896492),
('myexpanses-cache-livewire-rate-limiter:d1d77aa4571417911c485e3bf79522c26fc28db1', 'i:1;', 1781853589),
('myexpanses-cache-livewire-rate-limiter:d1d77aa4571417911c485e3bf79522c26fc28db1:timer', 'i:1781853589;', 1781853589),
('myexpanses-cache-livewire-rate-limiter:d4285db6cd63849c2e52758d879149833d069dc4', 'i:1;', 1772434377),
('myexpanses-cache-livewire-rate-limiter:d4285db6cd63849c2e52758d879149833d069dc4:timer', 'i:1772434377;', 1772434377),
('myexpanses-cache-livewire-rate-limiter:d8281f0b9954c85215ea467c3ccc297e821067e5', 'i:1;', 1778987495),
('myexpanses-cache-livewire-rate-limiter:d8281f0b9954c85215ea467c3ccc297e821067e5:timer', 'i:1778987495;', 1778987495),
('myexpanses-cache-livewire-rate-limiter:dc5aff030fd6b7d71a34b9a7455e093a1d5c4515', 'i:1;', 1778726508),
('myexpanses-cache-livewire-rate-limiter:dc5aff030fd6b7d71a34b9a7455e093a1d5c4515:timer', 'i:1778726508;', 1778726508),
('myexpanses-cache-livewire-rate-limiter:e0271a565cee8f294fabfabc183ee26353054b54', 'i:1;', 1773579834),
('myexpanses-cache-livewire-rate-limiter:e0271a565cee8f294fabfabc183ee26353054b54:timer', 'i:1773579834;', 1773579834),
('myexpanses-cache-livewire-rate-limiter:e29b49e6bbd5068c770b28b42ee4b25258d1fcfb', 'i:1;', 1771851742),
('myexpanses-cache-livewire-rate-limiter:e29b49e6bbd5068c770b28b42ee4b25258d1fcfb:timer', 'i:1771851742;', 1771851742),
('myexpanses-cache-livewire-rate-limiter:e8878a136dc8f2a05049795d5956f444ffe86849', 'i:1;', 1769410765),
('myexpanses-cache-livewire-rate-limiter:e8878a136dc8f2a05049795d5956f444ffe86849:timer', 'i:1769410765;', 1769410765),
('myexpanses-cache-livewire-rate-limiter:ef9a56e567ab20e298e8d45abbed2bc968671b2a', 'i:2;', 1782459424),
('myexpanses-cache-livewire-rate-limiter:ef9a56e567ab20e298e8d45abbed2bc968671b2a:timer', 'i:1782459424;', 1782459424),
('myexpanses-cache-livewire-rate-limiter:f6ccf75c6d2e977ad017c9eb8685738fbcc76e80', 'i:1;', 1769007111),
('myexpanses-cache-livewire-rate-limiter:f6ccf75c6d2e977ad017c9eb8685738fbcc76e80:timer', 'i:1769007111;', 1769007111),
('myexpanses-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:103:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:12:\"ViewAny:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:9:\"View:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:11:\"Create:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:11:\"Update:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:11:\"Delete:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"Restore:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:16:\"ForceDelete:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:19:\"ForceDeleteAny:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:15:\"RestoreAny:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:14:\"Replicate:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:12:\"Reorder:Role\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:16:\"ViewAny:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:13:\"View:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:15:\"Create:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:15:\"Update:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:15:\"Delete:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:16:\"Restore:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:20:\"ForceDelete:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:23:\"ForceDeleteAny:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:19:\"RestoreAny:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:18:\"Replicate:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:16:\"Reorder:Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:15:\"ViewAny:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:12:\"View:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:14:\"Create:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:14:\"Update:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:14:\"Delete:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:15:\"Restore:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:19:\"ForceDelete:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:22:\"ForceDeleteAny:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:18:\"RestoreAny:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:31;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:17:\"Replicate:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:32;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:15:\"Reorder:Expense\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:33;a:4:{s:1:\"a\";i:34;s:1:\"b\";s:12:\"ViewAny:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:34;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:9:\"View:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:35;a:4:{s:1:\"a\";i:36;s:1:\"b\";s:11:\"Create:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:36;a:4:{s:1:\"a\";i:37;s:1:\"b\";s:11:\"Update:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:37;a:4:{s:1:\"a\";i:38;s:1:\"b\";s:11:\"Delete:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:38;a:4:{s:1:\"a\";i:39;s:1:\"b\";s:12:\"Restore:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:39;a:4:{s:1:\"a\";i:40;s:1:\"b\";s:16:\"ForceDelete:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:40;a:4:{s:1:\"a\";i:41;s:1:\"b\";s:19:\"ForceDeleteAny:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:41;a:4:{s:1:\"a\";i:42;s:1:\"b\";s:15:\"RestoreAny:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:42;a:4:{s:1:\"a\";i:43;s:1:\"b\";s:14:\"Replicate:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:43;a:4:{s:1:\"a\";i:44;s:1:\"b\";s:12:\"Reorder:User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:44;a:4:{s:1:\"a\";i:45;s:1:\"b\";s:18:\"ViewAny:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:45;a:4:{s:1:\"a\";i:46;s:1:\"b\";s:15:\"View:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:46;a:4:{s:1:\"a\";i:47;s:1:\"b\";s:17:\"Create:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:47;a:4:{s:1:\"a\";i:48;s:1:\"b\";s:17:\"Update:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:48;a:4:{s:1:\"a\";i:49;s:1:\"b\";s:17:\"Delete:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:49;a:4:{s:1:\"a\";i:50;s:1:\"b\";s:18:\"Restore:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:50;a:4:{s:1:\"a\";i:51;s:1:\"b\";s:22:\"ForceDelete:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:51;a:4:{s:1:\"a\";i:52;s:1:\"b\";s:25:\"ForceDeleteAny:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:52;a:4:{s:1:\"a\";i:53;s:1:\"b\";s:21:\"RestoreAny:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:53;a:4:{s:1:\"a\";i:54;s:1:\"b\";s:20:\"Replicate:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:54;a:4:{s:1:\"a\";i:55;s:1:\"b\";s:18:\"Reorder:FiscalYear\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:55;a:4:{s:1:\"a\";i:56;s:1:\"b\";s:16:\"ViewAny:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:56;a:4:{s:1:\"a\";i:57;s:1:\"b\";s:13:\"View:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:57;a:4:{s:1:\"a\";i:58;s:1:\"b\";s:15:\"Create:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:58;a:4:{s:1:\"a\";i:59;s:1:\"b\";s:15:\"Update:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:59;a:4:{s:1:\"a\";i:60;s:1:\"b\";s:15:\"Delete:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:60;a:4:{s:1:\"a\";i:61;s:1:\"b\";s:16:\"Restore:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:61;a:4:{s:1:\"a\";i:62;s:1:\"b\";s:20:\"ForceDelete:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:62;a:4:{s:1:\"a\";i:63;s:1:\"b\";s:23:\"ForceDeleteAny:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:63;a:4:{s:1:\"a\";i:64;s:1:\"b\";s:19:\"RestoreAny:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:64;a:4:{s:1:\"a\";i:65;s:1:\"b\";s:18:\"Replicate:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:65;a:4:{s:1:\"a\";i:66;s:1:\"b\";s:16:\"Reorder:FoodMenu\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:66;a:4:{s:1:\"a\";i:67;s:1:\"b\";s:18:\"ViewAny:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:67;a:4:{s:1:\"a\";i:68;s:1:\"b\";s:15:\"View:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:68;a:4:{s:1:\"a\";i:69;s:1:\"b\";s:17:\"Create:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:69;a:4:{s:1:\"a\";i:70;s:1:\"b\";s:17:\"Update:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:70;a:4:{s:1:\"a\";i:71;s:1:\"b\";s:17:\"Delete:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:71;a:4:{s:1:\"a\";i:72;s:1:\"b\";s:18:\"Restore:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:72;a:4:{s:1:\"a\";i:73;s:1:\"b\";s:22:\"ForceDelete:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:73;a:4:{s:1:\"a\";i:74;s:1:\"b\";s:25:\"ForceDeleteAny:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:74;a:4:{s:1:\"a\";i:75;s:1:\"b\";s:21:\"RestoreAny:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:75;a:4:{s:1:\"a\";i:76;s:1:\"b\";s:20:\"Replicate:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:76;a:4:{s:1:\"a\";i:77;s:1:\"b\";s:18:\"Reorder:FoodRecipe\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:77;a:4:{s:1:\"a\";i:78;s:1:\"b\";s:14:\"ViewAny:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:78;a:4:{s:1:\"a\";i:79;s:1:\"b\";s:11:\"View:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:79;a:4:{s:1:\"a\";i:80;s:1:\"b\";s:13:\"Create:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:80;a:4:{s:1:\"a\";i:81;s:1:\"b\";s:13:\"Update:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:81;a:4:{s:1:\"a\";i:82;s:1:\"b\";s:13:\"Delete:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:82;a:4:{s:1:\"a\";i:83;s:1:\"b\";s:14:\"Restore:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:83;a:4:{s:1:\"a\";i:84;s:1:\"b\";s:18:\"ForceDelete:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:84;a:4:{s:1:\"a\";i:85;s:1:\"b\";s:21:\"ForceDeleteAny:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:85;a:4:{s:1:\"a\";i:86;s:1:\"b\";s:17:\"RestoreAny:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:86;a:4:{s:1:\"a\";i:87;s:1:\"b\";s:16:\"Replicate:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:87;a:4:{s:1:\"a\";i:88;s:1:\"b\";s:14:\"Reorder:Income\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:88;a:4:{s:1:\"a\";i:89;s:1:\"b\";s:16:\"ViewAny:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:89;a:4:{s:1:\"a\";i:90;s:1:\"b\";s:13:\"View:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:90;a:4:{s:1:\"a\";i:91;s:1:\"b\";s:15:\"Create:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:91;a:4:{s:1:\"a\";i:92;s:1:\"b\";s:15:\"Update:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:92;a:4:{s:1:\"a\";i:93;s:1:\"b\";s:15:\"Delete:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:93;a:4:{s:1:\"a\";i:94;s:1:\"b\";s:16:\"Restore:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:94;a:4:{s:1:\"a\";i:95;s:1:\"b\";s:20:\"ForceDelete:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:95;a:4:{s:1:\"a\";i:96;s:1:\"b\";s:23:\"ForceDeleteAny:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:96;a:4:{s:1:\"a\";i:97;s:1:\"b\";s:19:\"RestoreAny:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:97;a:4:{s:1:\"a\";i:98;s:1:\"b\";s:18:\"Replicate:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:98;a:4:{s:1:\"a\";i:99;s:1:\"b\";s:16:\"Reorder:MealPlan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:99;a:4:{s:1:\"a\";i:100;s:1:\"b\";s:23:\"View:GlobalFiscalFilter\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:100;a:4:{s:1:\"a\";i:101;s:1:\"b\";s:20:\"View:ExpenseOverview\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:101;a:4:{s:1:\"a\";i:102;s:1:\"b\";s:26:\"View:SpendingSummaryWidget\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:102;a:4:{s:1:\"a\";i:103;s:1:\"b\";s:23:\"View:BillsSummaryWidget\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:3:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:11:\"super_admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:5:\"Admin\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:4:\"Wife\";s:1:\"c\";s:3:\"web\";}}}', 1783878856);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('income','spending','bills','instalment','saving') NOT NULL DEFAULT 'spending',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `type`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'FOOD', 'spending', 1, '2026-01-08 15:25:13', '2026-01-08 15:25:38'),
(2, 'GROCERIES', 'spending', 1, '2026-01-08 15:26:06', '2026-01-08 15:26:06'),
(3, 'TRANSPORT', 'spending', 1, '2026-01-08 15:28:45', '2026-01-08 15:28:45'),
(4, 'ENTERTAIN', 'spending', 1, '2026-01-08 15:32:10', '2026-01-08 15:32:10'),
(5, 'SHOPPING', 'spending', 1, '2026-01-08 15:33:47', '2026-01-08 15:33:47'),
(6, 'PULSA', 'spending', 1, '2026-01-08 15:40:54', '2026-01-08 15:40:54'),
(7, 'ETC', 'spending', 1, '2026-01-08 15:41:02', '2026-01-08 15:41:02'),
(8, 'ELECTRICITY', 'bills', 1, '2026-01-10 10:14:03', '2026-01-10 10:16:33'),
(9, 'WIFI', 'bills', 1, '2026-01-10 10:16:48', '2026-01-10 10:16:48'),
(10, 'KIDS SAVINGS', 'saving', 4, '2026-01-14 19:22:17', '2026-01-14 19:22:17'),
(11, 'EMERGENCY SAVINGS', 'saving', 4, '2026-01-14 19:22:41', '2026-01-14 19:22:41'),
(12, 'ADDITIONAL INCOME', 'income', 4, '2026-01-14 19:24:10', '2026-01-14 19:24:10'),
(13, 'EID EXPENSES', 'spending', 4, '2026-03-12 11:27:54', '2026-03-12 11:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `adjust_to_cash` tinyint(1) NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `expense_date` date NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `category_id`, `amount`, `adjust_to_cash`, `description`, `expense_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, '52000.00', 0, 'MAKAN LAMONGAN', '2026-01-06', 1, '2026-01-09 16:10:54', '2026-01-09 16:10:54'),
(2, 2, '53700.00', 0, 'BELANJA IBUK', '2026-01-06', 1, '2026-01-09 16:12:33', '2026-01-09 16:12:33'),
(3, 2, '55000.00', 0, 'TISU', '2026-01-08', 1, '2026-01-09 16:12:58', '2026-01-09 16:12:58'),
(4, 1, '12000.00', 0, 'ROTI BAKAR', '2026-01-09', 1, '2026-01-09 16:14:31', '2026-01-09 16:14:31'),
(5, 1, '20000.00', 0, 'NASPAD', '2026-01-11', 1, '2026-01-11 13:11:15', '2026-01-11 13:11:27'),
(6, 7, '36000.00', 0, 'LAUNDRY', '2026-01-11', 1, '2026-01-11 13:12:16', '2026-01-11 13:12:16'),
(7, 1, '33000.00', 0, 'GONGSO', '2026-01-11', 1, '2026-01-11 13:12:45', '2026-01-11 13:12:45'),
(8, 2, '21000.00', 0, 'GALON + SHAMPOO', '2026-01-11', 3, '2026-01-11 17:10:15', '2026-01-11 17:10:15'),
(9, 1, '25000.00', 0, 'NASGOR', '2026-01-11', 3, '2026-01-11 17:10:48', '2026-01-11 17:10:48'),
(10, 1, '39000.00', 0, 'LAMONGAN', '2026-01-11', 4, '2026-01-12 11:52:14', '2026-01-12 11:52:14'),
(11, 2, '48000.00', 0, 'BELI SAYOR DAN IKAN', '2026-01-14', 3, '2026-01-14 13:58:52', '2026-01-14 13:58:52'),
(12, 2, '20000.00', 0, 'BELI KOPI', '2026-01-13', 3, '2026-01-14 13:59:31', '2026-01-14 13:59:31'),
(13, 1, '32000.00', 0, 'TAHU KUPAT', '2026-01-16', 4, '2026-01-18 21:31:20', '2026-01-18 21:31:20'),
(14, 1, '33000.00', 0, 'SHOFOOD', '2026-01-17', 4, '2026-01-18 21:31:49', '2026-01-18 21:31:49'),
(15, 1, '17000.00', 0, 'MAKAN HIK', '2026-01-18', 4, '2026-01-18 21:32:31', '2026-01-18 21:32:31'),
(16, 1, '57000.00', 0, 'LAMONGAN', '2026-01-18', 4, '2026-01-18 21:33:32', '2026-01-18 21:33:32'),
(17, 2, '37000.00', 0, 'BELANJA MOJO 9', '2026-01-18', 4, '2026-01-18 21:34:08', '2026-01-18 21:34:08'),
(18, 7, '70000.00', 0, 'ANC PUSKESMAS TAPI TIDAK JADI DI ANC', '2026-01-21', 4, '2026-01-21 18:16:19', '2026-01-21 18:16:19'),
(19, 7, '35000.00', 0, 'LAUNDRY', '2026-01-21', 3, '2026-01-21 22:47:06', '2026-01-21 22:47:06'),
(20, 1, '34000.00', 0, 'MIE AYAM', '2026-01-21', 3, '2026-01-21 22:49:42', '2026-01-21 22:49:42'),
(21, 1, '35000.00', 0, 'LAMONGAN ', '2026-01-22', 4, '2026-01-23 09:29:28', '2026-01-23 09:29:28'),
(22, 2, '65000.00', 0, 'BELANJA INDOMART', '2026-01-22', 4, '2026-01-23 09:30:07', '2026-01-23 09:30:07'),
(23, 1, '35000.00', 0, 'MAKAN BAKMI & CAPJAY', '2026-01-23', 4, '2026-01-24 15:06:52', '2026-01-24 15:06:52'),
(24, 1, '23850.00', 0, 'SUBSIDI SS', '2026-01-24', 3, '2026-01-25 16:35:32', '2026-01-25 16:35:32'),
(25, 1, '77000.00', 0, 'MAKAN RICA MENTOK', '2026-01-25', 4, '2026-01-25 20:30:28', '2026-01-25 20:30:28'),
(26, 2, '40000.00', 0, 'GALON & GAS', '2026-01-25', 4, '2026-01-25 21:46:58', '2026-01-25 21:46:58'),
(27, 2, '57000.00', 0, 'BELANJA UNS', '2026-01-27', 4, '2026-01-27 21:11:30', '2026-01-27 21:11:30'),
(28, 1, '26000.00', 0, 'MAKAN GEPREK KUMLOT', '2026-01-27', 4, '2026-01-27 21:12:03', '2026-01-27 21:12:03'),
(29, 7, '29500.00', 0, 'LAUNDRY', '2026-01-29', 3, '2026-01-29 19:13:29', '2026-01-29 19:13:29'),
(30, 7, '44000.00', 0, 'MASKER', '2026-01-31', 4, '2026-01-31 09:26:39', '2026-01-31 09:26:39'),
(31, 1, '63000.00', 0, 'SS', '2026-02-01', 3, '2026-02-01 10:51:02', '2026-02-01 10:51:02'),
(32, 8, '155000.00', 0, 'LISTRIK', '2026-02-01', 3, '2026-02-01 10:51:33', '2026-02-01 10:51:33'),
(33, 9, '250000.00', 0, 'INDIEHOME', '2026-02-01', 3, '2026-02-01 19:17:04', '2026-02-01 19:17:04'),
(34, 2, '123000.00', 0, 'BELANJA SAYURAN', '2026-02-04', 3, '2026-02-04 16:09:36', '2026-02-04 16:09:36'),
(35, 1, '12000.00', 0, 'BELI LELE', '2026-02-02', 3, '2026-02-04 16:10:19', '2026-02-04 16:10:19'),
(36, 2, '5000.00', 0, 'BELANJA TEMPE', '2026-02-04', 4, '2026-02-06 14:21:38', '2026-02-06 14:21:38'),
(37, 1, '35000.00', 0, 'MAKAN GOFOOD STEAK', '2026-02-08', 4, '2026-02-08 16:35:23', '2026-02-08 16:35:23'),
(38, 7, '15000.00', 0, 'LAUNDRY', '2026-02-08', 4, '2026-02-08 16:35:44', '2026-02-08 16:35:44'),
(39, 1, '65000.00', 0, 'SFA', '2026-02-08', 3, '2026-02-08 21:30:46', '2026-02-08 21:30:46'),
(40, 3, '75000.00', 0, 'TUNE UP MOBIL', '2026-02-08', 3, '2026-02-08 21:31:23', '2026-02-08 21:31:23'),
(41, 2, '140000.00', 0, 'GALON + SAYOR', '2026-02-08', 3, '2026-02-08 21:33:19', '2026-02-08 21:33:19'),
(42, 2, '118400.00', 0, 'BELANJA KEBUTUHAN RUMAH', '2026-02-11', 3, '2026-02-11 20:10:02', '2026-02-11 20:10:02'),
(43, 2, '40000.00', 0, 'INDOMART', '2026-02-06', 4, '2026-02-15 16:15:42', '2026-02-15 16:15:42'),
(44, 7, '25000.00', 0, 'LAUNDRY ', '2026-02-12', 4, '2026-02-15 16:16:15', '2026-02-15 16:16:15'),
(45, 1, '55000.00', 0, 'LAMONGAN', '2026-02-13', 4, '2026-02-15 16:16:39', '2026-02-15 16:16:39'),
(46, 3, '100000.00', 0, 'BBM', '2026-02-14', 4, '2026-02-15 16:17:07', '2026-02-15 16:17:07'),
(47, 7, '50000.00', 0, 'TOP UP', '2026-02-14', 4, '2026-02-15 16:17:42', '2026-02-15 16:17:42'),
(48, 1, '61000.00', 0, 'MAKAN RICA SRG', '2026-02-16', 4, '2026-02-17 09:30:45', '2026-02-17 09:30:45'),
(49, 7, '56500.00', 0, 'METRO KAMPUS', '2026-02-16', 4, '2026-02-17 09:32:41', '2026-02-17 09:32:41'),
(50, 2, '56500.00', 0, 'BELANJA SAYOR', '2026-02-18', 3, '2026-02-19 12:49:24', '2026-02-19 12:49:24'),
(51, 1, '30000.00', 0, 'WARTEG UNS', '2026-02-18', 3, '2026-02-19 12:49:58', '2026-02-19 12:49:58'),
(52, 2, '79000.00', 0, 'DAGING AYAM DAN SAPI', '2026-02-20', 3, '2026-02-20 16:43:06', '2026-02-20 16:43:06'),
(53, 1, '20000.00', 0, 'GORENGAN, ACAR, SEMPOLAN, SIOMY', '2026-02-22', 4, '2026-02-23 13:38:02', '2026-02-23 13:38:02'),
(54, 2, '134000.00', 0, 'SAYUR DAN DAGING', '2026-02-23', 3, '2026-02-23 21:01:51', '2026-02-23 21:01:51'),
(55, 1, '38000.00', 0, 'GONGSO', '2026-02-24', 3, '2026-02-26 16:39:58', '2026-02-26 16:39:58'),
(56, 1, '20000.00', 0, 'CAMILAN', '2026-02-27', 4, '2026-02-27 21:28:56', '2026-02-27 21:28:56'),
(57, 1, '65000.00', 0, 'LAMONGAN & CAMILAN', '2026-02-27', 4, '2026-02-27 21:29:22', '2026-02-27 21:29:22'),
(58, 8, '142000.00', 0, 'LISTRIK RUMAH', '2026-03-01', 4, '2026-03-01 11:13:37', '2026-03-01 11:13:37'),
(60, 1, '30000.00', 0, 'GOFOOD', '2026-02-28', 4, '2026-03-01 11:17:09', '2026-03-01 11:17:09'),
(61, 2, '143000.00', 0, 'BELANJA DAGING DAN SAYOR', '2026-03-02', 3, '2026-03-02 14:53:19', '2026-03-02 14:53:19'),
(62, 7, '51000.00', 0, 'LAUNDRY', '2026-03-04', 3, '2026-03-05 12:49:04', '2026-03-05 12:49:04'),
(63, 9, '250000.00', 0, 'INDIEHOME', '2026-03-04', 3, '2026-03-05 13:07:38', '2026-03-05 13:07:38'),
(64, 13, '550000.00', 0, 'BELANJA PARCEL', '2026-03-08', 3, '2026-03-09 13:42:27', '2026-03-12 11:28:24'),
(65, 1, '71000.00', 0, 'WAROENG SPESIAL SAMBAL', '2026-03-08', 3, '2026-03-09 13:43:04', '2026-03-09 13:43:04'),
(66, 2, '40000.00', 0, 'BERAS DAN BAWANG', '2026-03-10', 3, '2026-03-10 14:49:28', '2026-03-10 14:49:28'),
(67, 1, '26000.00', 0, 'SATE AYAM', '2026-03-10', 3, '2026-03-10 14:49:51', '2026-03-10 14:49:51'),
(68, 2, '87000.00', 0, 'BELI SAYOR DLL', '2026-03-11', 3, '2026-03-11 11:06:08', '2026-03-11 11:06:41'),
(69, 7, '100000.00', 0, 'KONTROL ADEK', '2026-03-10', 4, '2026-03-12 11:29:33', '2026-03-12 11:29:33'),
(70, 1, '15000.00', 0, 'CAMILAN BUKA', '2026-03-11', 4, '2026-03-12 11:30:22', '2026-03-12 11:30:22'),
(71, 1, '52000.00', 0, 'MAKAN LAMONGAN', '2026-03-15', 4, '2026-03-15 20:03:50', '2026-03-15 20:03:50'),
(72, 1, '18000.00', 0, 'JAJAN PENTOL', '2026-03-15', 4, '2026-03-15 20:04:17', '2026-03-15 20:04:17'),
(73, 1, '67000.00', 0, 'MAKAN SS', '2026-03-16', 4, '2026-03-19 21:53:40', '2026-03-19 21:53:40'),
(74, 1, '125000.00', 0, 'BUKBER SAMA IBUK', '2026-03-18', 4, '2026-03-19 21:54:23', '2026-03-19 21:54:23'),
(75, 7, '100000.00', 0, 'LAUNDRY ', '2026-03-19', 4, '2026-03-19 21:57:35', '2026-03-19 21:57:35'),
(76, 7, '50000.00', 0, 'SERVICE PLAFON', '2026-03-15', 3, '2026-03-19 22:03:32', '2026-03-19 22:03:32'),
(77, 7, '90000.00', 0, 'BERAS 6 KG', '2026-03-17', 4, '2026-03-19 22:08:33', '2026-03-19 22:08:33'),
(78, 1, '80000.00', 0, 'JAJAN ODDS', '2026-03-20', 4, '2026-03-20 20:11:45', '2026-03-20 20:11:45'),
(79, 3, '118000.00', 0, 'BENSIN + ANGIN', '2026-03-23', 3, '2026-03-23 18:38:22', '2026-03-23 18:38:41'),
(80, 1, '54000.00', 0, 'NASI TEMPONG MAK ROS', '2026-03-23', 3, '2026-03-23 18:39:21', '2026-03-23 18:39:21'),
(81, 1, '48000.00', 0, 'LAMONGAN', '2026-03-27', 4, '2026-03-29 14:48:45', '2026-03-29 14:48:45'),
(82, 2, '50000.00', 0, 'BELANJA SEBELUM KERUMAH IBUK', '2026-03-26', 4, '2026-03-29 15:42:05', '2026-03-29 15:42:05'),
(83, 1, '80000.00', 0, 'MAKAN RICHEESE', '2026-03-28', 4, '2026-03-29 15:42:52', '2026-03-29 15:42:52'),
(84, 1, '30000.00', 0, 'NASGOR DEKET RUMAH', '2026-03-31', 3, '2026-04-01 16:18:44', '2026-04-01 16:18:44'),
(85, 1, '40000.00', 0, 'MIE KAPTEN', '2026-03-31', 3, '2026-04-01 16:19:18', '2026-04-01 16:19:18'),
(86, 8, '175000.00', 0, 'LISTRIK', '2026-04-02', 3, '2026-04-02 07:31:08', '2026-04-02 07:31:08'),
(87, 9, '250000.00', 0, 'BAYAR INDIHOME', '2026-04-03', 4, '2026-04-03 20:13:04', '2026-04-03 20:13:04'),
(88, 2, '24000.00', 0, 'GALON', '2026-04-01', 4, '2026-04-03 20:13:38', '2026-04-03 20:13:38'),
(89, 1, '153000.00', 0, 'SATE PAK DAHLAN', '2026-04-03', 4, '2026-04-04 19:34:04', '2026-04-04 19:34:04'),
(90, 1, '107000.00', 0, 'DIHABISKAN', '2026-04-04', 4, '2026-04-09 14:15:32', '2026-04-09 14:15:32'),
(91, 7, '50500.00', 0, 'LAUNDRY', '2026-04-06', 4, '2026-04-09 14:17:35', '2026-04-09 14:17:35'),
(92, 3, '65000.00', 0, 'GANTI OLI', '2026-04-07', 4, '2026-04-09 14:18:08', '2026-04-09 14:18:08'),
(93, 7, '135000.00', 0, 'CEK LAB', '2026-04-08', 4, '2026-04-09 14:18:44', '2026-04-09 14:19:06'),
(94, 1, '70000.00', 0, 'MAKAN SS', '2026-04-08', 4, '2026-04-09 14:19:33', '2026-04-09 14:19:33'),
(95, 1, '84000.00', 0, 'MAKAN FAIZ', '2026-04-10', 3, '2026-04-11 03:38:26', '2026-04-11 03:38:26'),
(96, 2, '162676.00', 0, 'BELANJA KEPERLUAN MEYNIL', '2026-04-10', 3, '2026-04-11 03:39:25', '2026-04-11 03:39:25'),
(97, 7, '200000.00', 0, 'PERIKSA DAN CEK LAB', '2026-04-10', 3, '2026-04-11 03:40:13', '2026-04-12 19:29:41'),
(98, 1, '40000.00', 0, 'PADANG + MIE AYAM', '2026-04-12', 4, '2026-04-12 19:31:41', '2026-04-12 19:31:41'),
(99, 1, '50000.00', 0, 'NASGOR UNS + INDOMARET ', '2026-04-13', 3, '2026-04-15 20:05:52', '2026-04-15 20:05:52'),
(100, 1, '48000.00', 0, 'LAMONGAN', '2026-04-14', 3, '2026-04-15 20:06:37', '2026-04-15 20:06:37'),
(101, 1, '19500.00', 0, 'ANGKRINGAN', '2026-04-15', 3, '2026-04-15 20:07:09', '2026-04-15 20:07:09'),
(102, 7, '95000.00', 0, 'LAUNDRY', '2026-04-16', 4, '2026-04-18 13:55:32', '2026-04-18 13:55:32'),
(103, 1, '24000.00', 0, 'MAKAN HIK 24 KARAOKE', '2026-04-18', 4, '2026-04-18 13:59:07', '2026-04-18 13:59:07'),
(104, 1, '30000.00', 0, 'NASI GORENG', '2026-04-17', 4, '2026-04-18 13:59:31', '2026-04-18 13:59:31'),
(105, 2, '76000.00', 0, 'BELANJA SAYOR', '2026-04-20', 3, '2026-04-21 05:13:37', '2026-04-21 05:13:37'),
(106, 1, '45000.00', 0, 'LAMONGAN', '2026-04-20', 3, '2026-04-21 05:14:10', '2026-04-21 05:14:10'),
(107, 7, '20000.00', 0, 'LAUNDRY', '2026-04-23', 3, '2026-04-25 20:28:49', '2026-04-25 20:28:49'),
(108, 1, '67000.00', 0, 'ARJES', '2026-04-25', 3, '2026-04-25 20:29:28', '2026-04-25 20:29:28'),
(109, 2, '100000.00', 0, 'CUSHION + BANDO', '2026-04-25', 3, '2026-04-25 20:30:44', '2026-04-25 20:30:44'),
(110, 1, '33000.00', 0, 'PADANG', '2026-04-27', 3, '2026-04-28 11:54:24', '2026-04-28 11:54:24'),
(111, 2, '95000.00', 0, 'BELANJA SUAMIIK', '2026-04-29', 3, '2026-04-29 07:23:55', '2026-04-29 07:23:55'),
(112, 1, '60000.00', 0, 'NYEMEK MBAH IMO', '2026-04-28', 3, '2026-04-29 07:24:21', '2026-04-29 07:24:21'),
(113, 2, '100000.00', 0, 'FOLAMIL', '2026-04-29', 3, '2026-04-29 07:36:39', '2026-04-29 07:36:39'),
(114, 7, '29500.00', 0, 'LAUNDRY ', '2026-05-01', 4, '2026-05-01 14:39:38', '2026-05-01 14:39:38'),
(115, 1, '24000.00', 0, 'SARAPAN', '2026-05-01', 4, '2026-05-01 14:40:00', '2026-05-01 14:40:00'),
(116, 8, '67000.00', 0, 'LISTRIK', '2026-05-01', 4, '2026-05-01 14:40:31', '2026-05-01 14:40:31'),
(117, 9, '250000.00', 0, 'INDIHOME', '2026-05-01', 3, '2026-05-01 14:50:05', '2026-05-01 14:50:05'),
(118, 1, '67000.00', 0, 'SERBA SAMBEL', '2026-05-03', 3, '2026-05-03 07:05:10', '2026-05-03 07:05:10'),
(119, 3, '100000.00', 0, 'BENSIN', '2026-05-03', 3, '2026-05-03 17:26:45', '2026-05-03 17:26:45'),
(120, 2, '21000.00', 0, 'BELANJO', '2026-05-03', 3, '2026-05-03 17:27:07', '2026-05-03 17:27:07'),
(121, 2, '71000.00', 0, 'SAYOR', '2026-05-04', 3, '2026-05-06 06:30:34', '2026-05-06 06:30:34'),
(122, 2, '105000.00', 0, 'GOJEK + ONIGIRI + JEPUN + ETC ETC', '2026-05-09', 3, '2026-05-09 16:25:46', '2026-05-09 16:25:46'),
(123, 1, '40000.00', 0, 'NYEMEK MBAH IMO', '2026-05-09', 3, '2026-05-09 16:26:13', '2026-05-09 16:26:13'),
(124, 1, '42000.00', 0, 'MAKAN MALAM GEPREK', '2026-05-10', 4, '2026-05-10 18:03:03', '2026-05-10 18:03:22'),
(125, 1, '50000.00', 0, 'BELANJA MINUM INDOMART ', '2026-05-10', 4, '2026-05-10 18:04:19', '2026-05-10 18:04:19'),
(126, 7, '2500.00', 0, 'FOTO COPY', '2026-05-10', 4, '2026-05-10 18:05:09', '2026-05-10 18:05:09'),
(127, 7, '50000.00', 0, 'BELANJA ADEK ALFAMART', '2026-05-11', 4, '2026-05-12 19:01:33', '2026-05-12 19:01:33'),
(128, 1, '55300.00', 0, 'SEI SAPI', '2026-05-12', 4, '2026-05-12 19:04:43', '2026-05-12 19:04:43'),
(129, 1, '22000.00', 0, 'NASGOR', '2026-05-10', 4, '2026-05-12 19:05:34', '2026-05-12 19:05:34'),
(130, 1, '50000.00', 0, 'SARAPAN SAAT DI RS', '2026-05-13', 4, '2026-05-14 09:42:17', '2026-05-14 09:42:17'),
(131, 7, '30000.00', 0, 'PARKIR', '2026-05-13', 4, '2026-05-14 09:44:13', '2026-05-14 09:44:13'),
(132, 7, '60000.00', 0, 'KAPSUL KUTUK', '2026-05-14', 4, '2026-05-14 09:44:43', '2026-05-14 09:44:43'),
(133, 7, '142000.00', 0, 'CEK PENDENGARAN TELINGA ADEK', '2026-05-13', 4, '2026-05-14 09:47:05', '2026-05-14 09:47:05'),
(134, 2, '100000.00', 0, 'BOTOL DAN SENSIPAD', '2026-05-16', 3, '2026-05-16 19:29:09', '2026-05-16 19:29:09'),
(135, 2, '82000.00', 0, 'BELANJA SAYOR', '2026-05-16', 3, '2026-05-16 19:30:24', '2026-05-16 19:31:34'),
(136, 1, '21000.00', 0, 'MAKAN KAMBING', '2026-05-14', 4, '2026-05-17 10:11:30', '2026-05-17 10:11:30'),
(137, 7, '20500.00', 0, 'LAUNDRY', '2026-05-14', 4, '2026-05-17 10:11:58', '2026-05-17 10:11:58'),
(138, 1, '28000.00', 0, 'MAKAN MALAM PADANG', '2026-05-16', 4, '2026-05-17 10:12:43', '2026-05-17 10:12:43'),
(139, 7, '50000.00', 0, 'TOP UP E-MONEY', '2026-05-19', 4, '2026-05-20 09:24:13', '2026-05-20 09:24:13'),
(140, 1, '36000.00', 0, 'AYAM BAKAR', '2026-05-20', 4, '2026-05-21 01:45:40', '2026-05-21 01:45:40'),
(141, 1, '44000.00', 0, 'MAKAN BAKSO MIE AYAM', '2026-05-21', 4, '2026-05-22 17:26:46', '2026-05-22 17:26:46'),
(142, 2, '183000.00', 0, 'ALL SHOPEE MAS BAGUS', '2026-05-24', 3, '2026-05-24 18:19:01', '2026-05-24 18:19:01'),
(143, 1, '30000.00', 0, 'NASGOR', '2026-05-25', 4, '2026-05-26 18:25:03', '2026-05-26 18:25:03'),
(144, 7, '50000.00', 0, 'DIAMBIL UANG CASH', '2026-05-26', 4, '2026-05-26 18:45:21', '2026-05-26 20:33:01'),
(146, 1, '40000.00', 0, 'KOPI DAN ARANG', '2026-05-27', 4, '2026-05-27 19:57:38', '2026-05-27 19:57:38'),
(147, 7, '90000.00', 0, 'ANTI RUAM DAN KAPAS BALL', '2026-05-27', 4, '2026-05-27 20:01:52', '2026-05-27 20:01:52'),
(148, 7, '230000.00', 0, 'KONTROL HERVY DAN NASGOR', '2026-05-31', 3, '2026-05-31 08:08:28', '2026-05-31 08:08:28'),
(149, 1, '38000.00', 0, 'NASDANG', '2026-05-30', 3, '2026-05-31 08:08:59', '2026-05-31 08:08:59'),
(150, 7, '12000.00', 0, 'LAUNDRY', '2026-05-30', 3, '2026-05-31 08:09:46', '2026-05-31 08:10:06'),
(151, 8, '54000.00', 0, 'LISTRIK ', '2026-06-01', 3, '2026-06-01 08:27:59', '2026-06-01 08:27:59'),
(152, 9, '250000.00', 0, 'INDIHOME ', '2026-06-01', 3, '2026-06-01 08:33:33', '2026-06-01 08:33:33'),
(153, 1, '43000.00', 0, 'MAKAN LAMONGAN', '2026-06-02', 4, '2026-06-03 18:10:51', '2026-06-03 18:10:51'),
(154, 1, '27000.00', 0, 'JAJAN INDOMART', '2026-06-02', 4, '2026-06-03 18:11:26', '2026-06-03 18:11:26'),
(155, 1, '35000.00', 0, 'BELI JUS PELANCAR ASI', '2026-06-03', 4, '2026-06-03 18:12:19', '2026-06-03 18:12:19'),
(156, 7, '20000.00', 0, 'LAUNDRY', '2026-06-04', 4, '2026-06-05 04:53:56', '2026-06-05 04:53:56'),
(157, 1, '24000.00', 0, 'NASGOR', '2026-06-04', 4, '2026-06-05 04:54:27', '2026-06-05 04:54:27'),
(158, 7, '17500.00', 0, 'PEMBALUR', '2026-06-04', 4, '2026-06-06 22:06:09', '2026-06-06 22:06:09'),
(159, 7, '126200.00', 0, 'LAIN LAIN', '2026-06-04', 4, '2026-06-06 22:10:31', '2026-06-07 15:17:04'),
(160, 1, '32000.00', 0, 'MAKAN SIANG AYAM', '2026-06-07', 3, '2026-06-07 15:18:39', '2026-06-07 15:18:39'),
(161, 7, '100000.00', 0, 'BABY BOX MAI ', '2026-06-11', 3, '2026-06-11 19:02:30', '2026-06-11 19:02:30'),
(162, 4, '77000.00', 0, 'CUKUR MAI', '2026-06-11', 3, '2026-06-11 19:03:04', '2026-06-11 19:03:04'),
(163, 7, '16000.00', 0, 'LAUDRY', '2026-06-12', 4, '2026-06-13 15:18:39', '2026-06-13 15:18:39'),
(164, 7, '60000.00', 0, 'BELI KAPAS, SISIR DAN HAND SANITAZER', '2026-06-11', 4, '2026-06-13 15:19:13', '2026-06-13 15:19:13'),
(165, 1, '39000.00', 0, 'GONGSO', '2026-06-13', 4, '2026-06-13 15:51:53', '2026-06-13 15:51:53'),
(166, 2, '90000.00', 0, 'PAMPERS, DLL', '2026-06-14', 3, '2026-06-14 08:05:39', '2026-06-14 08:05:39'),
(167, 2, '80000.00', 0, 'PAMPERS CHECKOUT IBUN', '2026-06-14', 3, '2026-06-14 08:06:29', '2026-06-14 08:06:29'),
(168, 3, '120000.00', 0, 'BENSIN DAN ISI ANGIN', '2026-06-13', 4, '2026-06-15 18:23:30', '2026-06-15 18:23:30'),
(169, 1, '40000.00', 0, 'SHOPEE FOOD AYAM KATSU SAMBAL MATAH', '2026-06-14', 4, '2026-06-15 18:24:51', '2026-06-15 18:24:51'),
(170, 1, '26000.00', 0, 'BELI SATE AYAM', '2026-06-14', 4, '2026-06-15 18:25:32', '2026-06-15 18:26:27'),
(171, 2, '90000.00', 0, 'EARBUDS & PEMPERS MAI', '2026-06-15', 4, '2026-06-16 01:32:51', '2026-06-16 01:32:51'),
(172, 1, '44000.00', 0, 'MAKAN TAHU KUPAT + SKM', '2026-06-16', 4, '2026-06-16 19:16:24', '2026-06-16 19:16:24'),
(173, 1, '29000.00', 0, 'LAUK ATI + LELE', '2026-06-16', 4, '2026-06-16 19:17:01', '2026-06-16 19:17:01'),
(174, 1, '6000.00', 0, 'ES TEH', '2026-06-18', 4, '2026-06-18 22:42:28', '2026-06-18 22:42:28'),
(176, 7, '60000.00', 0, 'JIMPITAN 4BULAN', '2026-06-21', 3, '2026-06-21 20:07:55', '2026-06-21 20:07:55'),
(177, 1, '23750.00', 0, 'MIE COMANDO', '2026-06-21', 3, '2026-06-21 20:10:20', '2026-06-21 20:10:20'),
(178, 2, '100000.00', 0, 'BELANJA PROTEIN', '2026-06-26', 4, '2026-06-26 15:19:48', '2026-06-26 15:19:48'),
(179, 2, '25000.00', 0, 'BELANJA SAYUR', '2026-06-26', 4, '2026-06-26 15:20:09', '2026-06-26 15:20:09'),
(180, 2, '20000.00', 0, 'BUKU ADEK', '2026-06-26', 4, '2026-06-26 15:20:41', '2026-06-26 15:20:41'),
(181, 5, '40000.00', 0, 'BEDONG ADEK', '2026-06-28', 4, '2026-06-28 11:01:27', '2026-06-28 11:01:27'),
(182, 5, '150000.00', 0, 'KARPET ADEK', '2026-06-28', 4, '2026-06-28 11:02:25', '2026-06-28 11:02:25'),
(183, 5, '100000.00', 0, 'BELANJA SHOOPEE', '2026-06-29', 4, '2026-06-29 15:20:27', '2026-06-29 15:20:27'),
(184, 1, '52500.00', 0, 'MAKAN GEPREK KUMLOT', '2026-06-28', 4, '2026-06-29 15:20:55', '2026-06-29 15:20:55'),
(185, 5, '80000.00', 0, 'PEMPERS MAI', '2026-06-30', 4, '2026-06-30 20:02:36', '2026-06-30 20:02:36'),
(186, 5, '113000.00', 0, 'KARPET ADEK', '2026-06-30', 4, '2026-06-30 23:12:22', '2026-06-30 23:12:22'),
(187, 8, '54000.00', 0, 'LISTRIK', '2026-07-01', 4, '2026-07-01 20:01:58', '2026-07-01 20:01:58'),
(188, 9, '250000.00', 0, 'WIFI', '2026-07-01', 4, '2026-07-01 20:02:47', '2026-07-01 20:02:47'),
(189, 1, '40000.00', 0, 'MAKAN AYAM GORENG', '2026-07-01', 4, '2026-07-01 20:03:24', '2026-07-01 20:03:24'),
(190, 2, '66000.00', 0, 'GALON', '2026-07-01', 4, '2026-07-01 20:04:09', '2026-07-01 20:04:34'),
(191, 1, '36000.00', 0, 'AYAM BAKAR MADU + PISANG GORENG', '2026-07-03', 4, '2026-07-03 18:28:43', '2026-07-03 18:28:43'),
(192, 2, '58000.00', 0, 'BELANJA AKHIR BULAN', '2026-07-04', 4, '2026-07-04 21:16:47', '2026-07-04 21:16:47'),
(193, 1, '43000.00', 0, 'MAKAN MALAM', '2026-07-04', 4, '2026-07-04 21:17:13', '2026-07-04 21:17:13'),
(194, 7, '50000.00', 0, 'BERSIHKAN LISTRIK', '2026-07-04', 4, '2026-07-04 21:18:24', '2026-07-04 21:18:24'),
(195, 1, '50000.00', 0, 'MAKAN AYAM', '2026-07-04', 4, '2026-07-05 23:23:15', '2026-07-05 23:23:15'),
(196, 1, '62000.00', 0, 'MAKAN UNS', '2026-07-08', 4, '2026-07-08 14:04:24', '2026-07-08 14:04:24'),
(197, 2, '22000.00', 0, 'BELANJA SAYUR UNS', '2026-07-07', 4, '2026-07-08 14:10:02', '2026-07-08 14:10:02'),
(198, 2, '30009.00', 0, 'AYAM', '2026-07-09', 3, '2026-07-10 18:57:51', '2026-07-10 18:57:51'),
(199, 2, '35000.00', 0, 'REFILL SABUN MAI', '2026-07-10', 3, '2026-07-10 18:58:17', '2026-07-10 18:58:17'),
(200, 1, '13000.00', 0, 'ES TEH + PARKIR ARI', '2026-07-10', 4, '2026-07-10 19:28:53', '2026-07-10 19:28:53'),
(201, 2, '50000.00', 0, 'BELANJA METRO KAMPUS', '2026-07-11', 4, '2026-07-11 09:02:44', '2026-07-11 09:02:44'),
(202, 7, '60000.00', 0, 'PERPANJANG BOX ADEK', '2026-07-11', 4, '2026-07-11 11:15:16', '2026-07-11 11:15:16'),
(203, 2, '70000.00', 0, 'KOOLFEVER, SUNLIGHT, SPONS', '2026-07-11', 3, '2026-07-12 00:55:10', '2026-07-12 00:55:10');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `fiscal_years`
--

CREATE TABLE `fiscal_years` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `opening_balance` double NOT NULL DEFAULT 0,
  `total_expenses` double NOT NULL DEFAULT 0,
  `remaining_amount` double NOT NULL DEFAULT 0,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `fiscal_years`
--

INSERT INTO `fiscal_years` (`id`, `name`, `start_date`, `end_date`, `opening_balance`, `total_expenses`, `remaining_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 'January 2026', '2026-01-06', '2026-02-05', 2100000, 1770050, 329950, 'closed', '2026-01-10 10:02:44', '2026-02-06 14:31:49'),
(2, 'February 2026', '2026-02-06', '2026-03-05', 2100000, 1894400, 205600, 'closed', '2026-02-06 14:22:48', '2026-03-07 10:31:24'),
(3, 'March 2026', '2026-03-06', '2026-04-05', 2600000, 2600000, 0, 'closed', '2026-03-07 10:31:54', '2026-04-09 14:16:12'),
(4, 'April 2026', '2026-04-06', '2026-05-05', 2600000, 2299176, 300824, 'closed', '2026-04-09 14:15:54', '2026-05-08 15:54:05'),
(5, 'May 2026', '2026-05-06', '2026-06-05', 2500000, 2300000, 200000, 'closed', '2026-05-08 15:54:26', '2026-06-07 15:17:57'),
(6, 'June 2026', '2026-06-06', '2026-07-05', 2500000, 2260250, 239750, 'closed', '2026-06-06 22:11:27', '2026-07-07 14:05:37'),
(7, 'July 2026', '2026-07-06', '2026-08-05', 2500000, 0, 0, 'open', '2026-07-07 14:05:22', '2026-07-07 14:05:22');

-- --------------------------------------------------------

--
-- Table structure for table `incomes`
--

CREATE TABLE `incomes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `adjust_to_cash` tinyint(4) NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `income_date` date NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incomes`
--

INSERT INTO `incomes` (`id`, `category_id`, `amount`, `adjust_to_cash`, `description`, `income_date`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 11, '3623726.00', 0, 'TABUNGAN DANA DARURAT', '2026-01-24', 1, '2026-01-24 15:02:37', '2026-01-24 15:02:37'),
(3, 10, '3682424.00', 0, 'TABUNGAN ADEK', '2026-01-24', 4, '2026-01-24 15:04:32', '2026-01-24 15:04:32'),
(4, 11, '3931887.00', 0, 'UANG DARURAT SISA BULANAN', '2026-02-08', 3, '2026-02-08 16:44:57', '2026-02-08 16:46:06'),
(5, 10, '3991827.00', 0, 'TABUNGAN ADEK', '2026-02-15', 4, '2026-02-15 16:20:27', '2026-02-15 16:20:27'),
(6, 12, '500000.00', 1, 'KEBUTUHAN LEBARAN', '2026-03-07', 4, '2026-03-07 10:32:48', '2026-03-07 10:32:48'),
(7, 10, '4301944.00', 0, 'TABUNGAN ADEK', '2026-03-07', 4, '2026-03-07 10:34:55', '2026-03-07 10:34:55'),
(8, 11, '4145934.00', 0, 'TABUNGAN DARURAT', '2026-03-09', 4, '2026-03-12 11:31:43', '2026-03-12 11:31:43'),
(9, 12, '500000.00', 1, 'PERLENGKAPAN ADEK', '2026-04-06', 4, '2026-04-09 14:20:18', '2026-04-09 14:20:18'),
(10, 10, '4616908.00', 0, 'TABUNGAN ADEK', '2026-04-06', 4, '2026-04-09 14:21:43', '2026-04-09 14:21:43'),
(11, 11, '4154072.00', 0, 'DANA DARURAT', '2026-04-06', 4, '2026-04-09 14:22:35', '2026-04-09 14:22:35'),
(12, 11, '4463245.00', 0, 'DANA DARURAT', '2026-05-07', 4, '2026-05-08 15:55:12', '2026-05-08 15:55:12'),
(13, 10, '4931316.00', 0, 'TABUNGAN ADEK', '2026-05-07', 4, '2026-05-08 15:55:57', '2026-05-08 15:55:57'),
(14, 10, '5243420.00', 0, 'TABUNGAN ADEK', '2026-06-06', 4, '2026-06-06 22:36:15', '2026-06-06 22:36:15'),
(15, 11, '4672612.00', 0, 'DANA DARURAT', '2026-06-07', 3, '2026-06-07 15:20:24', '2026-06-07 15:20:24'),
(16, 10, '5559893.00', 0, 'TABUNGAN ADEK', '2026-07-07', 4, '2026-07-07 14:06:46', '2026-07-07 14:06:46'),
(17, 11, '4687092.00', 0, 'DANA DARURAT', '2026-07-07', 4, '2026-07-07 14:07:12', '2026-07-07 14:07:12');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_01_05_065534_create_categories_table', 2),
(5, '2026_01_05_065539_create_expenses_table', 2),
(6, '2026_01_05_072240_create_permission_tables', 3),
(7, '2026_01_09_042648_create_fiscal_years_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3),
(3, 'App\\Models\\User', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'ViewAny:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(2, 'View:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(3, 'Create:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(4, 'Update:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(5, 'Delete:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(6, 'Restore:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(7, 'ForceDelete:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(8, 'ForceDeleteAny:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(9, 'RestoreAny:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(10, 'Replicate:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(11, 'Reorder:Role', 'web', '2026-01-05 15:34:40', '2026-01-05 15:34:40'),
(12, 'ViewAny:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(13, 'View:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(14, 'Create:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(15, 'Update:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(16, 'Delete:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(17, 'Restore:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(18, 'ForceDelete:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(19, 'ForceDeleteAny:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(20, 'RestoreAny:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(21, 'Replicate:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(22, 'Reorder:Category', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(23, 'ViewAny:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(24, 'View:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(25, 'Create:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(26, 'Update:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(27, 'Delete:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(28, 'Restore:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(29, 'ForceDelete:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(30, 'ForceDeleteAny:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(31, 'RestoreAny:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(32, 'Replicate:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(33, 'Reorder:Expense', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(34, 'ViewAny:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(35, 'View:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(36, 'Create:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(37, 'Update:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(38, 'Delete:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(39, 'Restore:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(40, 'ForceDelete:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(41, 'ForceDeleteAny:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(42, 'RestoreAny:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(43, 'Replicate:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(44, 'Reorder:User', 'web', '2026-01-05 15:59:03', '2026-01-05 15:59:03'),
(45, 'ViewAny:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(46, 'View:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(47, 'Create:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(48, 'Update:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(49, 'Delete:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(50, 'Restore:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(51, 'ForceDelete:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(52, 'ForceDeleteAny:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(53, 'RestoreAny:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(54, 'Replicate:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(55, 'Reorder:FiscalYear', 'web', '2026-01-09 12:32:46', '2026-01-09 12:32:46'),
(56, 'ViewAny:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(57, 'View:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(58, 'Create:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(59, 'Update:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(60, 'Delete:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(61, 'Restore:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(62, 'ForceDelete:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(63, 'ForceDeleteAny:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(64, 'RestoreAny:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(65, 'Replicate:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(66, 'Reorder:FoodMenu', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(67, 'ViewAny:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(68, 'View:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(69, 'Create:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(70, 'Update:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(71, 'Delete:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(72, 'Restore:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(73, 'ForceDelete:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(74, 'ForceDeleteAny:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(75, 'RestoreAny:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(76, 'Replicate:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(77, 'Reorder:FoodRecipe', 'web', '2026-01-20 16:28:15', '2026-01-20 16:28:15'),
(78, 'ViewAny:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(79, 'View:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(80, 'Create:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(81, 'Update:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(82, 'Delete:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(83, 'Restore:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(84, 'ForceDelete:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(85, 'ForceDeleteAny:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(86, 'RestoreAny:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(87, 'Replicate:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(88, 'Reorder:Income', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(89, 'ViewAny:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(90, 'View:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(91, 'Create:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(92, 'Update:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(93, 'Delete:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(94, 'Restore:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(95, 'ForceDelete:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(96, 'ForceDeleteAny:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(97, 'RestoreAny:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(98, 'Replicate:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(99, 'Reorder:MealPlan', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(100, 'View:GlobalFiscalFilter', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(101, 'View:ExpenseOverview', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(102, 'View:SpendingSummaryWidget', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28'),
(103, 'View:BillsSummaryWidget', 'web', '2026-01-20 16:30:28', '2026-01-20 16:30:28');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'web', '2026-01-05 15:32:53', '2026-01-05 15:32:53'),
(2, 'Admin', 'web', '2026-01-05 15:59:25', '2026-01-05 15:59:25'),
(3, 'Wife', 'web', '2026-01-10 13:00:03', '2026-01-10 13:00:03');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(63, 1),
(64, 1),
(65, 1),
(66, 1),
(67, 1),
(68, 1),
(69, 1),
(70, 1),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(77, 1),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 1),
(89, 1),
(90, 1),
(91, 1),
(92, 1),
(93, 1),
(94, 1),
(95, 1),
(96, 1),
(97, 1),
(98, 1),
(99, 1),
(100, 1),
(101, 1),
(102, 1),
(103, 1),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(12, 3),
(13, 3),
(14, 3),
(15, 3),
(16, 3),
(17, 3),
(18, 3),
(19, 3),
(20, 3),
(21, 3),
(22, 3),
(23, 3),
(24, 3),
(25, 3),
(26, 3),
(27, 3),
(28, 3),
(29, 3),
(30, 3),
(31, 3),
(32, 3),
(33, 3),
(34, 3),
(35, 3),
(37, 3),
(45, 3),
(46, 3),
(47, 3),
(48, 3),
(78, 3),
(79, 3),
(80, 3),
(81, 3),
(82, 3),
(83, 3),
(84, 3),
(85, 3),
(86, 3),
(87, 3),
(88, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('c1JZHn7nFMT9czwaGkLeEQPlWkjcKYBaTRkN6QuW', 3, '182.9.2.80', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'YTo4OntzOjY6Il90b2tlbiI7czo0MDoib0NpdGxjdlNYdGgzRHAyUUp2WFdRTlM5TnNBenJXclV6TTlIeHg2YyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQyOiJodHRwczovL215LWV4cGVuc2VzLnBhZ2UuZ2QvYWRtaW4vZXhwZW5zZXMiO3M6NToicm91dGUiO3M6Mzk6ImZpbGFtZW50LmFkbWluLnJlc291cmNlcy5leHBlbnNlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjM7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjQ6ImUzODI2MjBlNDJlOTk1NGE5NmZiYjAwNTA4NWViODAxZGZjZmUwNThhZTQwM2QyZDA3MGI4ZTlhODkxZGVlOTAiO3M6NjoidGFibGVzIjthOjI6e3M6NDA6IjAzZGM1OTE0Mzc3NmZlMWZmMWQ2YzhlZTA1OWU0M2U0X2NvbHVtbnMiO2E6NDp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjQ6Im5hbWUiO3M6NToibGFiZWwiO3M6MTE6IkRlc2NyaXB0aW9uIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo1OiJkZWJpdCI7czo1OiJsYWJlbCI7czo5OiJEZWJpdCAoKykiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToyO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjY6ImtyZWRpdCI7czo1OiJsYWJlbCI7czoxMDoiQ3JlZGl0ICgtKSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NzoiYmFsYW5jZSI7czo1OiJsYWJlbCI7czo3OiJCYWxhbmNlIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fX1zOjQwOiJjM2ZmNDY3ZDczNTgyYzVkZWE5ZDQ4N2VjMjk4MTU0OF9jb2x1bW5zIjthOjc6e2k6MDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMzoiY2F0ZWdvcnkubmFtZSI7czo1OiJsYWJlbCI7czoxMzoiQ2F0ZWdvcnkgTmFtZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjE7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NjoiYW1vdW50IjtzOjU6ImxhYmVsIjtzOjY6IkFtb3VudCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTE6ImRlc2NyaXB0aW9uIjtzOjU6ImxhYmVsIjtzOjExOiJEZXNjcmlwdGlvbiI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTI6ImV4cGVuc2VfZGF0ZSI7czo1OiJsYWJlbCI7czoxMjoiRXhwZW5zZSBEYXRlIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMjoiY3JlYXRvci5uYW1lIjtzOjU6ImxhYmVsIjtzOjEwOiJDcmVhdGVkIEJ5IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiY3JlYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMDoiQ3JlYXRlZCBBdCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjA7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjE7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtiOjE7fWk6NjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoidXBkYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMDoiVXBkYXRlZCBBdCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjA7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjE7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtiOjE7fX19czo4OiJmaWxhbWVudCI7YTowOnt9fQ==', 1783796050),
('jYFE3QqSTCJngi3YW5DaURiSz5LbrteFpD2hRdJ7', 4, '182.5.105.114', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'YTo4OntzOjY6Il90b2tlbiI7czo0MDoiYVRqVXdwRlVJa2ZwYjExU0lvRHdZb0UwZ2RlYlZmR2N6UDdDcXZQSyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQyOiJodHRwczovL215LWV4cGVuc2VzLnBhZ2UuZ2QvYWRtaW4vZXhwZW5zZXMiO3M6NToicm91dGUiO3M6Mzk6ImZpbGFtZW50LmFkbWluLnJlc291cmNlcy5leHBlbnNlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjQ7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjQ6IjQ5NGRmMDExOGZmNjk3NDg3N2FjNGFkNWE1OTE1YTY0NDM1ZWU5NmIyMmM0NmYxNGMwMTk3MzA2ZWZmOGQyNWEiO3M6NjoidGFibGVzIjthOjI6e3M6NDA6IjAzZGM1OTE0Mzc3NmZlMWZmMWQ2YzhlZTA1OWU0M2U0X2NvbHVtbnMiO2E6NDp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjQ6Im5hbWUiO3M6NToibGFiZWwiO3M6MTE6IkRlc2NyaXB0aW9uIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo1OiJkZWJpdCI7czo1OiJsYWJlbCI7czo5OiJEZWJpdCAoKykiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToyO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjY6ImtyZWRpdCI7czo1OiJsYWJlbCI7czoxMDoiQ3JlZGl0ICgtKSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NzoiYmFsYW5jZSI7czo1OiJsYWJlbCI7czo3OiJCYWxhbmNlIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fX1zOjQwOiJjM2ZmNDY3ZDczNTgyYzVkZWE5ZDQ4N2VjMjk4MTU0OF9jb2x1bW5zIjthOjc6e2k6MDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMzoiY2F0ZWdvcnkubmFtZSI7czo1OiJsYWJlbCI7czoxMzoiQ2F0ZWdvcnkgTmFtZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjE7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NjoiYW1vdW50IjtzOjU6ImxhYmVsIjtzOjY6IkFtb3VudCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTE6ImRlc2NyaXB0aW9uIjtzOjU6ImxhYmVsIjtzOjExOiJEZXNjcmlwdGlvbiI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTI6ImV4cGVuc2VfZGF0ZSI7czo1OiJsYWJlbCI7czoxMjoiRXhwZW5zZSBEYXRlIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMjoiY3JlYXRvci5uYW1lIjtzOjU6ImxhYmVsIjtzOjEwOiJDcmVhdGVkIEJ5IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiY3JlYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMDoiQ3JlYXRlZCBBdCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjA7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjE7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtiOjE7fWk6NjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoidXBkYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMDoiVXBkYXRlZCBBdCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjA7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjE7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtiOjE7fX19czo4OiJmaWxhbWVudCI7YTowOnt9fQ==', 1783735369),
('pyXallop1Odrg5lqBm0HTgpUPk3xSAdiLF3arM4D', 4, '182.9.2.80', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo3OntzOjY6Il90b2tlbiI7czo0MDoiZncycnVDUkJmMndLSnVWR1VKa1N5Y1pyOTVBZWowY0ZWS0xkYmJhciI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjM3OiJodHRwczovL215LWV4cGVuc2VzLnBhZ2UuZ2QvYWRtaW4/aT0xIjtzOjU6InJvdXRlIjtzOjMwOiJmaWxhbWVudC5hZG1pbi5wYWdlcy5kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo0O3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiI0OTRkZjAxMThmZjY5NzQ4NzdhYzRhZDVhNTkxNWE2NDQzNWVlOTZiMjJjNDZmMTRjMDE5NzMwNmVmZjhkMjVhIjtzOjY6InRhYmxlcyI7YToxOntzOjQwOiIwM2RjNTkxNDM3NzZmZTFmZjFkNmM4ZWUwNTllNDNlNF9jb2x1bW5zIjthOjQ6e2k6MDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo0OiJuYW1lIjtzOjU6ImxhYmVsIjtzOjExOiJEZXNjcmlwdGlvbiI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjE7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NToiZGViaXQiO3M6NToibGFiZWwiO3M6OToiRGViaXQgKCspIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo2OiJrcmVkaXQiO3M6NToibGFiZWwiO3M6MTA6IkNyZWRpdCAoLSkiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjc6ImJhbGFuY2UiO3M6NToibGFiZWwiO3M6NzoiQmFsYW5jZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO319fX0=', 1783858793),
('yWKGYwxsJOKWxsWJOKHJzyHWA5z9VCVrBCiA60LC', 4, '125.163.213.202', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo4OntzOjY6Il90b2tlbiI7czo0MDoiczZqUzZJNUttNkkwUzZWbzVVR3V3aUFUdWRmdzFuOVVwbGV5VmhiYyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQyOiJodHRwczovL215LWV4cGVuc2VzLnBhZ2UuZ2QvYWRtaW4vZXhwZW5zZXMiO3M6NToicm91dGUiO3M6Mzk6ImZpbGFtZW50LmFkbWluLnJlc291cmNlcy5leHBlbnNlcy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjQ7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjQ6IjQ5NGRmMDExOGZmNjk3NDg3N2FjNGFkNWE1OTE1YTY0NDM1ZWU5NmIyMmM0NmYxNGMwMTk3MzA2ZWZmOGQyNWEiO3M6NjoidGFibGVzIjthOjE6e3M6NDA6ImMzZmY0NjdkNzM1ODJjNWRlYTlkNDg3ZWMyOTgxNTQ4X2NvbHVtbnMiO2E6Nzp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEzOiJjYXRlZ29yeS5uYW1lIjtzOjU6ImxhYmVsIjtzOjEzOiJDYXRlZ29yeSBOYW1lIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo2OiJhbW91bnQiO3M6NToibGFiZWwiO3M6NjoiQW1vdW50IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMToiZGVzY3JpcHRpb24iO3M6NToibGFiZWwiO3M6MTE6IkRlc2NyaXB0aW9uIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MzthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMjoiZXhwZW5zZV9kYXRlIjtzOjU6ImxhYmVsIjtzOjEyOiJFeHBlbnNlIERhdGUiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEyOiJjcmVhdG9yLm5hbWUiO3M6NToibGFiZWwiO3M6MTA6IkNyZWF0ZWQgQnkiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo1O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJjcmVhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEwOiJDcmVhdGVkIEF0IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTo2O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEwOiJVcGRhdGVkIEF0IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9fX1zOjg6ImZpbGFtZW50IjthOjA6e319', 1783743320);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'superadmin@gmail.com', '2026-01-06 19:56:18', '$2y$12$8Br3CQUAtToIvUVmBMsp.ugQR1cpolPrIAMZHE4esTtLk8zEHr5Qe', NULL, '2026-01-05 15:32:53', '2026-01-10 12:56:23'),
(2, 'Admin', 'admin.expanses@gmail.com', '2026-01-06 19:56:44', '$2y$12$8Br3CQUAtToIvUVmBMsp.ugQR1cpolPrIAMZHE4esTtLk8zEHr5Qe', NULL, '2026-01-05 15:59:58', '2026-01-10 12:56:49'),
(3, 'Wife', 'nursanti.setyo12@gmail.com', '2026-01-10 19:58:02', '$2y$12$qNzk2YLzxXJykN1Nx84XFeT5Qb5jcvStsHXgH3FgP2blttmhKpXmS', NULL, '2026-01-10 12:58:48', '2026-01-10 12:58:48'),
(4, 'Husband', 'baguspriambudi77@gmail.com', '2026-01-12 18:50:52', '$2y$12$rJRKZJ//WvG9KP4Bsuy4n.XvLBvmg29.wtBx.7fjPHfiikFu7FTky', NULL, '2026-01-12 11:51:16', '2026-01-12 11:51:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`) USING BTREE;

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`) USING BTREE;

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `categories_created_by_index` (`created_by`) USING BTREE;

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `expenses_category_id_index` (`category_id`) USING BTREE,
  ADD KEY `expenses_created_by_index` (`created_by`) USING BTREE;

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`) USING BTREE;

--
-- Indexes for table `fiscal_years`
--
ALTER TABLE `fiscal_years`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `incomes`
--
ALTER TABLE `incomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incomes_category_id_index` (`category_id`),
  ADD KEY `incomes_created_by_index` (`created_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `jobs_queue_index` (`queue`) USING BTREE;

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`) USING BTREE,
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`) USING BTREE;

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`) USING BTREE,
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`) USING BTREE;

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`) USING BTREE;

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`) USING BTREE;

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`) USING BTREE;

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`) USING BTREE,
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`) USING BTREE;

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `sessions_user_id_index` (`user_id`) USING BTREE,
  ADD KEY `sessions_last_activity_index` (`last_activity`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `users_email_unique` (`email`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fiscal_years`
--
ALTER TABLE `fiscal_years`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `incomes`
--
ALTER TABLE `incomes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

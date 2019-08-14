-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: gallery
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `writer` varchar(50) NOT NULL,
  `content` varchar(200) NOT NULL,
  `upTime` datetime NOT NULL,
  `post_idx` int(11) NOT NULL,
  PRIMARY KEY (`idx`),
  KEY `comments_ibfk_1` (`post_idx`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_idx`) REFERENCES `post` (`idx`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (6,'minho','내 곁에 있어줘\r\n내게 머물러줘\r\n네 손을 잡은 날\r\n놓치지 말아줘','2019-08-01 22:21:14',17),(7,'abcd','젠젠젠','2019-08-03 15:04:16',18),(8,'abcd','사진이 너무 길어요','2019-08-03 15:04:36',16),(9,'admin','찰 . 칵 !','2019-08-03 15:26:42',21);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `its_good`
--

DROP TABLE IF EXISTS `its_good`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `its_good` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `post_idx` int(11) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `its_good`
--

LOCK TABLES `its_good` WRITE;
/*!40000 ALTER TABLE `its_good` DISABLE KEYS */;
INSERT INTO `its_good` VALUES (3,'minho',19),(4,'minho',19),(5,'minho',19);
/*!40000 ALTER TABLE `its_good` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(200) NOT NULL,
  `upTime` datetime NOT NULL,
  `img_path` varchar(100) NOT NULL,
  `writer` varchar(50) DEFAULT NULL,
  `good` int(11) DEFAULT '0',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (5,'유리병에 꿈을 담다.\r\n','2019-07-31 17:11:54','uploads/1564560714384-은하수병.jpg','star',0),(6,'여러 모양들','2019-07-31 17:13:04','uploads/1564560784461-icons.png','star',0),(7,'한 여 름','2019-07-31 17:14:33','uploads/1564560873279-따뜻해.jfif','minho',0),(8,'개굴 !','2019-08-05 11:29:30','uploads/1564560927951-개굴.jfif','minho22',0),(9,'히힣힝','2019-07-31 17:16:27','uploads/1564560987297-말.jpg','admin',0),(10,'와삭 !\r\nㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ','2019-08-03 15:29:51','uploads/1564561026110-사과.jpg','admin',0),(11,'320 x 320\r\n33333333\r\n2222222\r\n11111','2019-08-01 21:51:41','uploads/1564561072467-320 320.jfif','admin',0),(13,'아이린','2019-08-01 16:50:19','uploads/1564645819347-아이린.jpg','abcd',0),(14,'언어의 정원','2019-08-01 16:50:40','uploads/1564645840050-언어의 정원.png','abcd',0),(16,'귤\r\n소녀','2019-08-01 16:51:37','uploads/1564645897376-귤소녀.jpg','admin',0),(17,'정준일','2019-08-01 16:51:57','uploads/1564645917764-정준일.jfif','admin',2),(18,'너의 이름은','2019-08-01 16:52:29','uploads/1564645949150-너의 이름은.jpg','minhoo',0),(19,'냥','2019-08-01 17:00:31','uploads/1564646431675-고양이.jpg','admin',3),(20,'Window 잠금화면 중에서...\r\n\r\n???: 석양이... 진다...','2019-08-03 15:24:41','uploads/1564813445729-c9e67fcbe3c9c200aded897a979d41af5b34de71699073e5e576dab7073bf69b.jpg','abcd',0),(21,'Windows 카메라 아이콘','2019-08-03 15:26:22','uploads/1564813582805-24198b27d057b958cfbd6aa699ceff733de4447885f3f1c8408cad2fbf2cb03d.jpg','abcd',0);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `user_pwd` varchar(30) NOT NULL,
  `user_name` varchar(10) NOT NULL,
  `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin','관리자','0000'),(2,'minho','minho','민호','010-0000-1111'),(3,'minho22','minho22','민호22','010-2222-2222'),(4,'abcd','abcd','에이비씨디','010-1234-5678'),(5,'star','star','별별','010-0000-4444'),(6,'minhoo','minhoo','민후','010-2229-9999');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-07 15:18:02

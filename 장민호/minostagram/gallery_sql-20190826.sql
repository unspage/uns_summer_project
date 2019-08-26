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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (6,'minho','내 곁에 있어줘\r\n내게 머물러줘\r\n네 손을 잡은 날\r\n놓치지 말아줘','2019-08-01 22:21:14',17),(7,'abcd','젠젠젠','2019-08-03 15:04:16',18),(8,'abcd','사진이 너무 길어요','2019-08-03 15:04:36',16),(9,'admin','찰 . 칵 !','2019-08-03 15:26:42',21),(11,'minho','dddddd','2019-08-07 17:09:49',14),(13,'admin','XSS 방어 성공','2019-08-19 21:51:19',58);
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
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `its_good`
--

LOCK TABLES `its_good` WRITE;
/*!40000 ALTER TABLE `its_good` DISABLE KEYS */;
INSERT INTO `its_good` VALUES (21,'minho22',13),(22,'minho22',17),(26,'admin',19),(31,'admin',5),(33,'admin',22),(35,'admin',8),(53,'admin',44),(57,'admin',14),(59,'admin',51),(60,'admin',40),(61,'admin',9),(62,'admin',41),(63,'admin',16),(64,'admin',49),(65,'admin',37),(67,'abcd',16),(68,'abcd',27),(69,'abcd',46),(70,'abcd',43),(71,'abcd',40),(72,'minhoo',27),(73,'minhoo',42),(74,'minhoo',39),(76,'minhoo',55),(77,'minhoo',48),(78,'minhoo',50),(79,'minhoo',40),(80,'minhoo',26),(82,'minho',54),(84,'minho',47),(86,'admin',58),(90,'new',55);
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
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (5,'유리병에 꿈을 담다.\r\n','2019-07-31 17:11:54','uploads/1564560714384-은하수병.jpg','star',1),(6,'여러 모양들','2019-07-31 17:13:04','uploads/1564560784461-icons.png','star',0),(7,'한 여 름\r\n여 름 한','2019-08-14 14:22:38','uploads/1564560873279-따뜻해.jfif','minho',0),(8,'개굴 !','2019-08-05 11:29:30','uploads/1564560927951-개굴.jfif','minho22',1),(9,'히힣힝','2019-08-16 14:35:28','uploads/1564560987297-말.jpg','admin',1),(10,'와삭 !\r\nㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ','2019-08-03 15:29:51','uploads/1564561026110-사과.jpg','admin',0),(11,'320 x 320\r\n33333333\r\n2222222\r\n11111','2019-08-01 21:51:41','uploads/1564561072467-320 320.jfif','admin',0),(13,'아이린','2019-08-01 16:50:19','uploads/1564645819347-아이린.jpg','abcd',1),(14,'언어의 정원','2019-08-01 16:50:40','uploads/1564645840050-언어의 정원.png','abcd',1),(16,'귤\r\n소녀','2019-08-01 16:51:37','uploads/1564645897376-귤소녀.jpg','admin',2),(17,'정준일','2019-08-01 16:51:57','uploads/1564645917764-정준일.jfif','admin',1),(18,'너의 이름은','2019-08-01 16:52:29','uploads/1564645949150-너의 이름은.jpg','minhoo',0),(19,'냥','2019-08-01 17:00:31','uploads/1564646431675-고양이.jpg','admin',2),(20,'Window 잠금화면 중에서...\r\n\r\n???: 석양이... 진다...','2019-08-03 15:24:41','uploads/1564813445729-c9e67fcbe3c9c200aded897a979d41af5b34de71699073e5e576dab7073bf69b.jpg','abcd',0),(21,'Windows 카메라 아이콘','2019-08-03 15:26:22','uploads/1564813582805-24198b27d057b958cfbd6aa699ceff733de4447885f3f1c8408cad2fbf2cb03d.jpg','abcd',0),(22,'사나\r\n','2019-08-07 15:52:45','uploads/1565160765171-사나.jpg','minho',2),(24,'10cm - 짝사랑','2019-08-14 18:21:38','uploads/1565774498911-10cm 앨범.jpg','minhoo',0),(25,'PUBG','2019-08-14 18:21:56','uploads/1565774516586-배그.jpg','minhoo',0),(26,'한요한 - 범퍼카','2019-08-14 18:22:13','uploads/1565774533265-범퍼카.jpg','minhoo',1),(27,'Beenzino','2019-08-14 18:22:50','uploads/1565774570081-빈지노.jpg','abcd',2),(28,'스물다섯번째 밤','2019-08-14 18:23:12','uploads/1565774592961-신의탑.jpg','abcd',0),(29,'화살을 미간에 꽂아주지','2019-08-14 18:24:42','uploads/1565774682746-애쉬.png','abcd',0),(30,'박새로이','2019-08-14 18:25:17','uploads/1565774717081-이태원클라쓰.jpg','abcd',0),(31,'잔나비 - 주저하는 연인들을 위해','2019-08-14 18:25:58','uploads/1565774758070-잔나비 앨범.png','star',0),(32,'킫밀리','2019-08-14 18:26:13','uploads/1565774773096-킫밀리.jpg','star',0),(33,'캏~','2019-08-14 18:26:41','uploads/1565774801353-하와이 음료수.jpg','minho22',0),(34,'뿌링클ㄹㄹ','2019-08-14 18:32:03','uploads/1565775123483-뿌링클.png','minho22',0),(35,'숲 사슴','2019-08-14 18:32:23','uploads/1565775143501-숲.jpg','minho22',0),(36,'자아아암마아안보오','2019-08-14 18:32:50','uploads/1565775170182-잠만보.png','minho22',0),(37,'하늘 바다','2019-08-14 18:33:56','uploads/1565775236166-유럽.jpg','minho22',1),(38,'...','2019-08-14 18:34:09','uploads/1565775249452-갤럭시+S9+S8+S8플러스+노트8+배경화면+스마트폰+고화질+바탕화면_8.jpg','minho22',0),(39,'! TWICE !','2019-08-14 18:36:28','uploads/1565775388683-트와이스.jpg','minho22',1),(40,'제니','2019-08-14 18:39:13','uploads/1565775553496-제니.jpg','minho22',5),(41,'suzi','2019-08-14 21:34:13','uploads/1565786053073-수지.jpg','admin',1),(42,'굳찌','2019-08-14 22:16:54','uploads/1565788614666-구찌.jpg','admin',1),(43,'기생충','2019-08-14 22:17:18','uploads/1565788638218-기생충.jpg','abcd',1),(44,'NewYork','2019-08-14 22:17:32','uploads/1565788652890-뉴욕.jpg','abcd',1),(45,'금연','2019-08-14 22:17:46','uploads/1565788666508-담배.jpg','abcd',0),(46,'나이키 x 언더커버 데이브레이크','2019-08-14 22:18:04','uploads/1565788684188-데이브레이크.jpg','abcd',1),(47,'갓','2019-08-14 22:18:18','uploads/1565788698035-박효신.jpg','abcd',1),(48,'산\r\n산\r\n산','2019-08-14 22:18:33','uploads/1565788713128-산산.jpg','abcd',1),(49,'ㅅㄱㅂㅇ','2019-08-14 22:18:49','uploads/1565788729042-수고.png','abcd',1),(50,'순천','2019-08-14 22:19:00','uploads/1565788740536-순천.png','abcd',1),(51,'가즈아','2019-08-14 22:19:22','uploads/1565788762609-주식.png','abcd',1),(52,'씨익','2019-08-14 22:20:12','uploads/1565788812367-초승.jpg','abcd',0),(53,'코코코\r\n코지마','2019-08-14 22:20:56','uploads/1565788856002-코끼리.jpg','admin',0),(54,'Coding and Coding','2019-08-14 22:21:20','uploads/1565788880473-코딩.jpg','admin',2),(55,'IU','2019-08-14 22:21:40','uploads/1565788900063-아이유.jpg','admin',4),(56,'SIMPLE\r\nSIMPLE\r\nSIMPLE','2019-08-19 20:32:44','uploads/1566214352379-simple.png','new2',0),(58,'&lt;script&gt;alert(\"xss test\")&lt;/script&gt;','2019-08-19 21:45:54','uploads/1566218754132-화려화려.jpg','minho',1),(59,'ㅎㅇㅎㅇ','2019-08-20 14:17:17','uploads/1566278237897-움짤.gif','admin',0);
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
  PRIMARY KEY (`idx`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin','관리자','0000'),(2,'minho','minho','민호','010-0000-1111'),(3,'minho22','minho22','민호22','010-2222-2222'),(4,'abcd','abcd','에이비씨디','010-1234-5678'),(5,'star','star','별별','010-0000-4444'),(6,'minhoo','minhoo','민후','010-2229-9999'),(20,'new','new','뉴','123-4564-7897'),(23,'newbie2','newbie','뉴비2','010-3333-2222');
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

-- Dump completed on 2019-08-26 15:15:18

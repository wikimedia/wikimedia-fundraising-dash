-- MySQL dump 10.14  Distrib 5.5.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fredge
-- ------------------------------------------------------
-- Server version	5.5.34-MariaDB-1~precise-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES binary */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `fredge`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fredge` /*!40100 DEFAULT CHARACTER SET binary */;

USE `fredge`;

--
-- Table structure for table `payments_fraud`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `payments_fraud` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contribution_tracking_id` int(10) unsigned DEFAULT NULL,
  `gateway` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `validation_action` varchar(16) DEFAULT NULL,
  `user_ip` varbinary(16) DEFAULT NULL,
  `payment_method` varchar(16) DEFAULT NULL,
  `risk_score` float DEFAULT NULL,
  `server` varchar(64) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contribution_tracking_id` (`contribution_tracking_id`),
  KEY `order_id` (`order_id`),
  KEY `gateway` (`gateway`),
  KEY `date` (`date`),
  KEY `user_ip` (`user_ip`),
  KEY `risk_score` (`risk_score`),
  KEY `payment_method` (`payment_method`)
) DEFAULT CHARSET=utf8 COMMENT='Tracks donation fraud scores for all donations.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments_fraud_breakdown`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `payments_fraud_breakdown` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payments_fraud_id` bigint(20) unsigned DEFAULT NULL,
  `filter_name` varchar(64) DEFAULT NULL,
  `risk_score` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_fraud_id` (`payments_fraud_id`),
  KEY `filter_name` (`filter_name`)
) DEFAULT CHARSET=utf8 COMMENT='Tracks breakdown of donation fraud scores for all donations.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments_initial`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `payments_initial` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contribution_tracking_id` int(11) DEFAULT NULL,
  `gateway` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `gateway_txn_id` varchar(255) DEFAULT NULL,
  `validation_action` varchar(16) DEFAULT NULL,
  `payments_final_status` varchar(16) DEFAULT NULL,
  `payment_method` varchar(16) DEFAULT NULL,
  `payment_submethod` varchar(32) DEFAULT NULL,
  `country` varchar(2) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `currency_code` varchar(3) DEFAULT NULL,
  `server` varchar(64) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contribution_tracking_id` (`contribution_tracking_id`),
  KEY `order_id` (`order_id`),
  KEY `gateway` (`gateway`),
  KEY `date` (`date`)
) DEFAULT CHARSET=utf8 COMMENT='Tracks user experience through donation pipeline.';
/*!40101 SET character_set_client = @saved_cs_client */;


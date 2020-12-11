-- 阅读记录表
-- 设置用户id为key，email和article为外键，关联用户表和新闻表
CREATE TABLE `userhistory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `article` int(10) unsigned NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `article` (`article`),
  CONSTRAINT `userhistory_ibfk_1` FOREIGN KEY (`email`) REFERENCES `userinfo` (`email`),
  CONSTRAINT `userhistory_ibfk_2` FOREIGN KEY (`article`) REFERENCES `news` (`n_id`)
);
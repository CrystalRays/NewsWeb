-- 账户操作表
-- 设置账户操作记录id为key,email为外键，关联用户表
CREATE TABLE `useroperate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `operate` int(11) NOT NULL,
  `time` datetime DEFAULT NULL,
  `description` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  CONSTRAINT `useroperate_ibfk_1` FOREIGN KEY (`email`) REFERENCES `userinfo` (`email`)
);
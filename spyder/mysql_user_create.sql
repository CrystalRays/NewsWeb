-- 用户表
-- 设置用户id为key，email为唯一约束
CREATE TABLE `userinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` text COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `avator` varchar(5120) COLLATE utf8_unicode_ci DEFAULT '/image/user.svg',
  `favor` varchar(256) COLLATE utf8_unicode_ci DEFAULT '',
  `tags` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

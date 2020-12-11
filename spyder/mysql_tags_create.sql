-- 新闻提取记录表
-- 设置提取记录id为key，article为外键，关联新闻表
CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `article` int(10) unsigned NOT NULL,
  `tag` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `article` (`article`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`article`) REFERENCES `news` (`n_id`)
);
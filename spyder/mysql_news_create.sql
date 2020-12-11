-- 新闻表结构
-- 设置新闻表新闻id为key，url为外键，关联新闻标签表
CREATE TABLE `news` (
  `n_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` char(150) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `au_fr` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime DEFAULT NULL,
  `keyword` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `context` mediumtext COLLATE utf8_unicode_ci,
  `category` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `hit` bigint(20) DEFAULT '0',
  `img` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`n_id`),
  KEY `url` (`url`)
);
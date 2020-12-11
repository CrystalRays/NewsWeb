-- 新闻标签表
-- 设置id为key
CREATE TABLE `sina` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` char(150) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
);

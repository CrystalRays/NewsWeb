# NewsWeb

这是一个支持前后端分离的网站，你可以将前端、后端和数据库部署在三台独立的服务器上。

## 文件目录结构

#### frontend

前端部分，完全静态，仅由html、css、javascript和svg构成

#### backend

后端部分，使用python3 fastapi框架，返回数据全部都是json格式

#### spyder

爬虫与数据分析部分

## 使用方法

#### 本地使用

```shell
python3 local.py
```

#### 分布式部署

##### 数据库服务器

安装mysql/mariadb，配置my.ini/my.conf允许远程连接

在mysql中创建一个空数据库
```sql
create database example;
```

在mysql中创建一个支持远程登录的用户，并授予其刚创建的空数据库的完整权限
```sql
create user `example`@`%` identified by 'password';
grant all privileges on `example`.* to `example`@`%` identified by 'password';
```

##### 后端服务器

将backend目录复制到后端服务器中

在config.py中配置数据库服务器ip、用户名、密码、要连接的数据库和后端服务器ip、端口;

运行
```shell
python3 app.py
```

##### 前端服务器

部署nginx 或者 apache

配置站点静态目录 /var/www/html

配置反向代理后端服务器到站点的/user和/news路径下

将frontend中的文件复制到/var/www/html下



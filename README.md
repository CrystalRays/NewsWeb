# NewsWeb

![rE4PF1.png](https://s3.ax1x.com/2020/12/12/rE4PF1.png)

这是一个基于python 3 fastapi和原生JavaScript，支持前后端分离的单页应用（Single Page Application）新闻聚合网站，你可以将前端、后端和数据库部署在三台独立的服务器上。

## 文件目录结构

### frontend

前端部分，完全静态，仅由html、css、javascript和svg构成

### backend

后端部分，使用python3 fastapi框架，返回数据全部都是json格式

### spyder

爬虫与数据分析部分

## 项目进度 ToDO

### 前端

- [x] 前端模板化

#### 用户

- [x] 注册

- [x] 登录

- [x] 修改密码

- [x] 修改头像

- [x] 订阅标签

- [ ] 忘记密码

- [ ] 浏览记录

#### 新闻


- [x] 分类

- [x] 标签

- [x] 加载更多

- [x] 阅读

- [x] 搜索

- [ ] 筛选

- [ ] PushState

- [ ] 评论

- [ ] 点赞

- [ ] 收藏

### 后端

#### 基础

- [x] 新建用户

- [x] 登录验证

- [x] 更新用户

- [x] 加载新闻

- [x] 搜索新闻

#### 更多

- [ ] 筛选？

- [x] 用户浏览记录

- [ ] 账号操作记录 

- [x] 热点推荐

- [x] 新闻点击量统计

- [ ] 评论功能

### 数据后台


- [x] 数据爬取

- [ ] 用户偏好分析

- [ ] 新闻自动分类

- [x] 新闻关键词提取

- [ ] 新闻关联性分析

## 使用方法

### 本地使用

```shell
pip install -r requirements.txt
python3 local.py
```

### 分布式部署

#### 数据服务器

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

运行脚本
```python
python3 np.py
```

#### 后端服务器

将backend目录复制到后端服务器中

运行
```shell
python3 app.py
```

#### 前端服务器

部署nginx 或者 apache

配置站点静态目录 /var/www/html

配置反向代理后端服务器到站点的/user和/news路径下

将frontend中的文件复制到/var/www/html下



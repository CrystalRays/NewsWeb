#coding:utf-8
from lxml import etree
import requests
from bs4 import BeautifulSoup
import base64
import re
import sys
import sys
import jieba
import jieba.analyse
import pymysql

try:
    if __name__.split(".")[0]=="spyder":
        from spyder.config import * 
    else:
        from config import *
    db=pymysql.connect(host=db_host, user=db_user, passwd=db_passwd, db=db_name,charset='utf8')
except:
    db_host,db_user,db_passwd,db_name=input("请输入要连接的数据库主机,用户名,密码以及数据库名称:localhost user password databasename:",).split()
    open("config.py","w").write('''db_host='{db_host}'
db_user="{db_user}"
db_passwd='{db_passwd}'
db_name="{db_name}"
    ''')
    db=pymysql.connect(host=db_host, user=db_user, passwd=db_passwd, db=db_name,charset='utf8')


def tags_update(url,id):
    cur=db.cursor()
    r=requests.get(url)
    r.encoding="utf-8"
    html=etree.HTML(r.text)
    fsc=html.xpath(".//*[@class='article']/p/strong/text() | .//*[@class='article']/p/font/text() | .//*[@class='article']/p/text()")
    x=''
    for fsca in fsc:
        x=x+fsca
    content = x
    tags = jieba.analyse.extract_tags(content, topK=5)
    for tag in tags:
        try:
            cur.execute("insert into tags(article,tag)values(%s,%s)",(id,tag))
            db.commit()
        except:
            print(url)
def news_update_context(url):
    r = requests.get(url)
    r.encoding = 'utf-8'
    html_str=r.text
    soup = BeautifulSoup(html_str,'lxml', from_encoding='utf-8')
    soup = soup.select("#article")
    soup = str(soup)
    s="//n\.sinaimg\.cn/spider.*?\.jpg"
    pattern=re.compile(s,re.S)
    res=re.findall(pattern,soup)
    for r in res:
        f=requests.get("https:"+r)
        base64_data = base64.b64encode(f.content)
        s = base64_data.decode()
        s="data:image/jpeg;base64,"+s
        soup=soup.replace(r,s) 
    cur=db.cursor()  
    try:
        cur.execute("update news set context=%s where url like %s",(soup,url))
        db.commit()
    except:
        print(soup)     
def news_update_time():
    cur=db.cursor()
    cur.execute('select url,time from news where time is NULL')
    res=cur.fetchall()
    if res!=None:
        for rows in res:
            url=rows[0]
            cur=db.cursor()
            r=requests.get(url)
            r.encoding="utf-8"
            html = etree.HTML(r.text)
            try:
                fsc= html.xpath(".//*[@class='date']/text()")[0]
                print(url,fsc)
            except:
                print(url)
            try:
                cur.execute("update news set time=str_to_date(%s,'%%Y年%%m月%%d日 %%H:%%i') where url like %s",(fsc,url))
                db.commit()
            except:
                print(url)
def news_downloads(urls):
    for url in urls:
        cur=db.cursor()
        r=requests.get(url)
        r.encoding="utf-8"
        html_str=r.text
        x = BeautifulSoup(html_str,'lxml', from_encoding='utf-8')
        x = x.select("#article")
        x = str(x)
        s="//n\.sinaimg\.cn/spider.*?\.jpg"
        pattern=re.compile(s,re.S)
        res=re.findall(pattern,x)
        for r1 in res:
            f=requests.get("https:"+r1)
            base64_data = base64.b64encode(f.content)
            s = base64_data.decode()
            s="data:image/jpeg;base64,"+s#将文章内的图片格式下载后转换为base64模式存入文章中
            x=x.replace(r1,s) #爬取文章内容 
        x=x[36:len(x)-8]
        html=etree.HTML(r.text)
        try:
            fsc= html.xpath(".//*[@class='date']/text()")[0]#爬取文章时间
            print(url,fsc)
        except:
            print(url)
        title=html.xpath(".//*[@class='main-title']/text()")#爬取文章标题
        kk=html.xpath(".//*[@class='keywords']/a/text()")#爬取文章关键字
        keyword=""
        for keywords in kk:
            keyword=keyword+keywords+' '
        author=html.xpath(".//*[@data-sudaclick='content_author_p']/text()")#爬取文章来源
        if author==[]:
            author=html.xpath(".//*[@data-sudaclick='content_media_p']/text()")
        try:
            cur.execute("insert into news(url,title,au_fr,keyword,time,context)values(%s,%s,%s,%s,str_to_date(%s,'%%Y年%%m月%%d日 %%H:%%i'),%s)",(url,title,author,keyword,fsc,x))
            db.commit()
        except:
            print(url)
def cs(r):
    r.encoding = 'utf-8'
    html = etree.HTML(r.text)
    fsc=[]
    try:
        fsc=html.xpath(".//ul[@class='linkNews']//li/a[@target='_blank']")
    except:
        print(html)
    for fsca in fsc:
        cur=db.cursor()
        title=fsca.xpath("./text()")#获取导航页面title 
        url=fsca.xpath("./@href")#获取导航页面url
        cur.execute('select * from sina where url like %s',url)
        res=cur.fetchone()
        if res==None:
            cur.execute('insert into sina(url,title)values(%s,%s)',(url,title))
            db.commit()
        cur.execute('select * from news where url like %s',url)
        res=cur.fetchone()
        if res==None:
            news_downloads(url)#爬取文章页面
        #news_update_context(url[0])#更新文本内图片内容
        cur.execute('select n_id from news where url like %s',url)#关键词提取
        resl=cur.fetchone()
        try:
            res=int(resl[0])
            cur.execute('select * from tags where article=%s',(res,))
            rest=cur.fetchone()
            if rest==None:
                tags_update(url[0],res)
        except:
            print(url)
def main():
    cur=db.cursor()
    s="show tables"
    if cur.execute(s):
        pass
    else:
        with open("{}/spyder/mysql_sina_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
        with open("{}/spyder/mysql_news_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
        with open("{}/spyder/mysql_user_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
        with open("{}/spyder/mysql_useroperate_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
        with open("{}/spyder/mysql_tags_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
        with open("{}/spyder/mysql_userhistory_create.sql".format(sys.path[0]),encoding="utf-8") as create_sql:
                    cur.execute(create_sql.read())
    r = requests.get('http://mil.news.sina.com.cn/roll/index.d.html?cid=57918&page=1')
    cs(r)#爬取导航页面
    r = requests.get('http://mil.news.sina.com.cn/roll/index.d.html?cid=57919&page=1')
    cs(r)
    r = requests.get('http://mil.news.sina.com.cn/roll/index.d.html?cid=57920&page=1')
    cs(r)
    news_update_time()#更新time为空的的数据集
if __name__=='__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.stderr.write("\rCtrl-C captured,Exiting!\n")
        db.close()
        sys.exit()
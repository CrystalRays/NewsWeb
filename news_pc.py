from lxml import etree
import requests
import MySQLdb
def news_downloads(urls):
    for url in urls:
        cur=db.cursor()
        r=requests.get(url)
        r.encoding="utf-8"
        html=etree.HTML(r.text)
        t=1
        x=""
        fsc=html.xpath(".//*[@class='article']/p/strong/text() | .//*[@class='article']/p/font/text() | .//*[@class='article']/p/text()")
        for fsca in fsc:
            x=x+'{'+str(t)+'}'+fsca+'\n'
            t=t+1
        title=html.xpath(".//*[@class='main-title']/text()")
        kk=html.xpath(".//*[@class='keywords']/a/text()")
        keyword=""
        for keywords in kk:
            keyword=keyword+keywords+' '
        author=html.xpath(".//*[@data-sudaclick='content_author_p']/text()")
        #print(title)
        if author==[]:
            author=html.xpath(".//*[@data-sudaclick='content_media_p']/text()")
        #print(author)
        cur.execute('insert into news(url,title,au_fr,keyword,context)values(%s,%s,%s,%s,%s)',(url,title,author,keyword,x))
        db.commit()
db = MySQLdb.connect("localhost", "spider", "123456", "military", charset='utf8' )
#s=['https://mil.news.sina.com.cn/2020-12-05/doc-iiznezxs5352974.shtml']
#news_downloads(s)
r = requests.get('https://mil.news.sina.com.cn/')
r.encoding = 'utf-8'
html = etree.HTML(r.text)
fsc=html.xpath(".//div[@class='fs_right']//li/a[@target='_blank']")
for fsca in fsc:
    cur=db.cursor()
    title=fsca.xpath("./text()") 
    url=fsca.xpath("./@href")
    cur.execute('select * from sina where url like %s',url)
    res=cur.fetchone()
    if res==None:
        cur.execute('insert into sina(url,title)values(%s,%s)',(url,title))
        db.commit()
    cur.execute('select * from news where url like %s',url)
    res=cur.fetchone()
    if res==None:
        news_downloads(url)
fsc=html.xpath(".//div[@class='zgjq']//li/a[@target='_blank']")
for fsca in fsc:
    cur=db.cursor()
    title=fsca.xpath("./text()") 
    url=fsca.xpath("./@href")
    cur.execute('select * from sina where url like %s',url)
    res=cur.fetchone()
    if res==None:
        cur.execute('insert into sina(url,title)values(%s,%s)',(url,title))
        db.commit()
    cur.execute('select * from news where url like %s',url)
    res=cur.fetchone()
    if res==None:
        news_downloads(url)
# #title
# #context
# #author/from_web
# #key
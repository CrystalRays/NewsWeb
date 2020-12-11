from hashlib import md5
import pymysql
import re
from typing import Union,Sequence
import os
from html.entities import html5 as htmlentities
from fastapi.exceptions import HTTPException
import sys

htmlentities=dict(map(reversed,htmlentities.items()))
for each in tuple(htmlentities.keys()):
    if len(each)>1:
        htmlentities.pop(each)
        continue
    if len(hex(ord(each)))>6:
        htmlentities.pop(each)
pat="".join(htmlentities.keys())
pat=re.escape(pat)

try:
    from config import *
except:
    print(f"No config found! Initlizing...")
    db_host,db_user,db_passwd,db_db=[input(f"Setup MySQL {each}:") for each in ("Host","User","Password","DataBase")]
    host_ip=input("Setup Web Host IP:")
    host_port=input("Setup Web Host Port:")
    with open(sys.path[0]+"/config.py","w")as f:
        f.write(f'db_host="{db_host}"\ndb_user="{db_user}"\ndb_passwd="{db_passwd}"\ndb_db="{db_db}"\nhost_ip="{host_ip}"\nhost_port={host_port}')


fake_db = {"test@example.com": {"nickname":"admin","password":md5(b"123456").hexdigest(),"favor":None,"avator":"data:image/jpg;base64,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"}}

class SqlException(HTTPException):
    "this is user's Exception for check the sql "
    def __init__(self,message:str=""):
        self.message=message
        super().__init__(400,"You damn Hacker")
    def __str__(self):
        return self.message

class sql:
    re_default="[^0-9A-Za-z\._\-;&/+一-\u9fa5%@#]"
    def __init__(self,**kwargs):
        for each in kwargs.values():
            self.evil_check(each)
        for k,v in kwargs.items():
            self.__setattr__(k,v)

    def __str__(self):
        pass
    def evil_check(self,value,strre=re_default):
        return evil_check(value,strre)


def evil_check(value:Union[int,Sequence,dict,sql],strre:str="[^0-9A-Za-z]"):
    if type(value)==int:
        return 
    elif type(value)==sql:
        return 
    elif type(value)==str:
        if re.search(strre,value):
            raise SqlException(f"Evil Param: {value}")
    elif type(value)==list or type(value)==tuple:
        for each in value:
            evil_check(each,strre)
        else:
            return
    elif type(value)==dict:
        for k,v in value.items():
            evil_check(k,strre)
            evil_check(v,strre)
        else:
            return 
    elif value:
        raise SqlException(f"Evil Param: {value}")

class sql_where(sql):

    relations=["<",">","=","!=","<=",">=","like","in","not in","exists","not exists","between","and"]
    def __init__(self,key:str,relation:str,value:Union[int,str]):
        params=locals()
        params.pop("self")
        super().__init__(**params)
    

class sql_val_text(sql):
    def replace(self,pos,escape):
        for each in set(re.findall(pat,text)):
            text.replace(each,htmlentities[each])
    def __init__(self,text:str):
        self.text=text
        self.replace()
    def __str__(self):
        return self.text

# class sql_from(sql):
#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)

# class sql_union(sql):

# class sql_join


class sql_select(sql):
    def __init__(self,table:Union[str,Sequence],columns:Sequence,conditions:Sequence[sql_where],orderby:Union[str,Sequence]="id",DESC:str="",limit:Union[None,int,Sequence]=None):
        super().__init__(*(locals().values()))


# def db_select(table:Union[str,Sequence[Union[str,dict]]],columns:Sequence[Union[str,dict]],conditions:sql_compare,orderby:Union[str,Sequence]="id",DESC:str="",limit:Union[None,int,list]=None):
#     conn=pymysql.Connect(host=db_host, user=db_user, passwd=db_passwd, db=db_db)
#     cursor=conn.cursor()
    
#     cursor.execute(f"select {1}")

def db_select(sql:str):
    conn=pymysql.Connect(host=db_host, user=db_user, passwd=db_passwd, db=db_db)
    cursor=conn.cursor()
    cursor.execute(sql)
    res=cursor.fetchall()
    conn.close()
    return res

def db_exec(sql:str):
    conn=pymysql.Connect(host=db_host, user=db_user, passwd=db_passwd, db=db_db)
    cursor=conn.cursor()
    try:
        cursor.execute(sql)
        conn.commit()
    except pymysql.Error as e:
        print(e.args[0], e.args[1])
        conn.rollback()
    conn.close()
    return cursor.rowcount

def load_user(email: str):  # could also be an asynchronous function
    evil_check(email,"[^0-9A-Za-z@\._]")
    user=None
    res=db_select(f"select nickname,password,avator,tags,favor from userinfo where email='{email}'")
    if res:
        user=dict(zip(("nickname","password","avator","tags","favor"),res[0]))
    return user

def add_user(email:str,nickname:str,passwd:str):
    evil_check(email,"[^0-9A-Za-z@\.]")
    evil_check(nickname,"[^0-9A-Za-z\u4e00-\u9fa5]")
    evil_check(passwd)
    return db_exec(f"insert into userinfo (email,nickname,password,avator) values('{email}','{nickname}','{passwd}','/image/user.svg')")


def update_user(email:str,nickname:str="",password:str="",tags:str="",avator:str=""):
    if tags.count(",")>9:raise SqlException
    params=tuple(locals().items())
    re_={"email":"[^0-9A-Za-z@\._]","nickname":"[^0-9A-Za-z\u4e00-\u9fa5]","password":"[^0-9A-Za-z]","tags":"[^0-9A-Za-z\u4e00-\u9fa5.·,]","avator":"[^0-9A-Za-z\.;,/+:]"}
    where=""
    setter=[]
    for k,v in params:
        evil_check(v,re_[k])
        if k=="email":
            where=f"email='{v}'"
        elif v!="":
            setter.append(f"{k}='{v}'")
    setter=",".join(setter)
    return db_exec(f"update userinfo set {setter} where {where}")

def news_loader(cate:str,start:int,num:int,favor:str="",hit_weight:int=10):
    evil_check(cate)
    evil_check(favor,"[^0-9A-Za-z\u4e00-\u9fa5,\.]")
    cate=f"category='{cate}'" if cate!='suggest' else "true"
    sql=f'''
        (select n_id,title,au_fr,time,category,hit,img,left(context,100) as 'summary' 
        from news x
        where {cate} and not exists (select tag from tags where article=x.n_id and tag in (select '{favor}'))
        order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc 
        limit {start},{num} )
        union (select n_id,title,au_fr,time,category,hit,img,left(context,100) as 'summary' 
        from news x
        where {cate} and exists (select tag from tags where article=x.n_id and tag in (select '{favor}'))
        order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc 
        limit {start},{num}) order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc
        '''
    return db_select(sql)

def tag_loader(tag:str,start:int,num:int,favor:str="",hit_weight:int=10):
    evil_check(tag,"[^0-9A-Za-z\u4e00-\u9fa5]")
    evil_check(favor,"[^0-9A-Za-z\u4e00-\u9fa5,\.]")
    return db_select(f'''
        (select n_id,title,au_fr,time,category,hit,img,left(context,100) as 'summary' 
        from news x
        where '{tag}' in (select tag from tags where article=x.n_id) and not exists (select tag from tags where article=x.n_id and tag in (select '{favor}'))
        order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc 
        limit {start},{num} )
        union (select n_id,title,au_fr,time,category,hit,img,left(context,100) as 'summary' 
        from news x
        where '{tag}' in (select tag from tags where article=x.n_id) and exists (select tag from tags where article=x.n_id and tag in (select '{favor}'))
        order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc 
        limit {start},{num}) order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc
        '''
        )

def article_loader(nid:int,email:str):
    evil_check(nid)
    evil_check(email,"[^0-9A-Za-z@\.]")
    db_exec(f"update news set hit=hit+1 where n_id={nid}")
    if email:
        db_exec(f"insert into userhistory (email,article,time) values('{email}',{nid},now())")
    return db_select(f"select title,au_fr,time,category,hit,context from news where n_id={nid}")


def search_loader(exp:str,start:int,num:int,hit_weight:str=10):
    evil_check(exp,"[^0-9A-Za-z\u4e00-\u9fa5\'% (),]")
    return db_select(f"select n_id,title,au_fr,time,category,hit,img,left(context,100) as 'summary' from news where {exp} order by UNIX_TIMESTAMP(`time`)+{hit_weight} desc limit {start},{num}")



# if __name__ == "__main__":
    # b=sql_compare("n'am.e","<","5
    # print(b.key)
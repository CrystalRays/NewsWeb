from hashlib import md5
import pymysql
import re
from typing import Union
import os

cwd=os.getcwd()
if cwd[cwd.rfind("//")+1:]=="backend":
    from config import *
else:
    from backend.config import *

fake_db = {"test@example.com": {"nickname":"admin","password":md5(b"123456").hexdigest(),"favor":None,"avator":"data:image/jpg;base64,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"}}

def evil_check(value:Union[int,str,list,tuple,dict]):
    if type(value)==type(int):
        return False
    elif type(value)==type(str):
        return not re.search("[^0-9A-Za-z().{}]",value)
    elif type(value)==type(list) or type(value)==type(tuple):
        for each in value:
            if evil_check(each):return True
        else:
            return False
    elif type(value)==type(dict):
        for k,v in value.items():
            if evil_check(k):return True
            if evil_check(v):return True
        else:
            return False


def db_select(table:Union[str,list],columns:list,conditions:dict={1:1},orderby:Union[str,list]="id",DESC:str="",limit:Union[None,int,list]=None):
    conn=pymysql.Connect(host=db_host, user=db_user, passwd=db_passwd, db=db_db)
    cursor=conn.cursor()
    
    cursor.execute(f"select {1}")



def load_user(email: str):  # could also be an asynchronous function
    return fake_db.get(email)

def add_user(email:str,nickname:str,passwd:str):
    if fake_db.get(email):
        return False
    else:
        fake_db[email]={"nickname":nickname,"password":passwd,"favor":None,"avator":"user.svg"}
        if fake_db[email]!={"nickname":nickname,"password":passwd,"favor":None,"avator":"user.svg"}:
            return False
        return True


def update_user(email:str,nickname:str=None,passwd:str=None,favor:str=None,avator:str=None):
    if fake_db.get(email):
        a={"nickname":nickname,"password":passwd,"favor":favor,"avator":avator}
        for key,value in a.items():
            if value!=None:
                fake_db[email][key]=value
                if fake_db.get(email)[key]!=value:
                    return False
        return True
    else:
        return False
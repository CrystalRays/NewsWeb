from fastapi import FastAPI,Depends,Request,Body,Form,Cookie,File,UploadFile
import io
import os
from fastapi.responses import *
from fastapi.exceptions import *
import mimetypes
import uvicorn
import re
from datetime import datetime,timedelta
import json
import io
import base64
from PIL import Image
import locale

if __name__.split(".")[0]=="backend":
    from backend.config import * 
    from backend.modules import *
    from backend.JWT import JWT,JWT_tail
else:
    from config import *
    from modules import *
    from JWT import JWT,JWT_tail

app=FastAPI()
secret=os.urandom(24)

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request,exc):
    print(exc)
    return JSONResponse({"code": "400", "message": "Incorrect Params"},status_code=422)


# @app.post('/test')
# async def auth(a,b,c=Cookie(None)):
#     return {"a":a,"b":b,"c":c}


def authe(token:str):
    try:
        head,body,tail=token.split(".")
        bodydata=json.loads(base64.b64decode(body.ljust((len(body)+3)//4*4,"=")))
        user=load_user(bodydata["email"])
    except:
        raise HTTPException(400,"Incorrect Params")
    if not user:
        raise HTTPException(401,"Auth Failed")
    user["email"]=bodydata["email"]
    # print(111)
    # print(JWT_tail(secret+user["password"].encode(),f"{head}.{body}".encode())==tail , bodydata["exp"],int(datetime.utcnow().timestamp()))
    if JWT_tail(secret+user["password"].encode(),f"{head}.{body}".encode())==tail and bodydata["exp"]>int(datetime.utcnow().timestamp()):
        return user
    else:
        raise HTTPException(401,"Auth Failed")

@app.get("/user/auth")
async def auth(token:str):
    user= authe(token)
    return {'nickname':user['nickname'],'token': token,"avator":user["avator"],"favor":user["favor"],"tags":user["tags"]}

@app.get("/user/renew")
async def renew(token:str):
    user=authe(token)
    # print(user)
    exptime=datetime.utcnow()+timedelta(hours=1)
    user["token"] = JWT(secret+user["password"].encode(),{"email":user["email"],"exp":int(exptime.timestamp())})
    return user



@app.post('/user/login')
async def login(email:str=Body(...),password:str=Body(...),remember:int=Body(...)):
    # print(email,password,remember)
    user = load_user(email)  # we are using the same function to retrieve the user
    # print(user)
    if not user:
        raise HTTPException(401,"User Not Exists")  # you can also use your own HTTPException
    elif password != user['password']:
        raise HTTPException(401,"Incorrect Password")
    max_age=timedelta(hours=1 if not remember else 168)
    exptime=datetime.utcnow()+max_age
    token = JWT(secret+user["password"].encode(),{"email":email,"exp":int(exptime.timestamp())})
    response=JSONResponse({'nickname':user['nickname'],'token': token,"avator":user["avator"],"tags":user["tags"]},status_code=200)
    if remember:
        # print(remember)
        response.set_cookie(key="token",value=token,max_age=max_age.total_seconds(),expires=exptime.strftime("%A, %d-%b-%Y %H:%M:%S GMT"))
    return response

@app.post('/user/register')
async def register(email:str=Body(...),nickname:str=Body(...),password:str=Body(...),repasswd:str=Body(...)):
    # print(email,nickname,password,repasswd)
    user = load_user(email)  # we are using the same function to retrieve the user
    if user:
        raise HTTPException(400,"User Exists")  # you can also use your own HTTPException
    elif password != repasswd:
        raise HTTPException(400,"repeat password not same")
    elif add_user(email,nickname,password):
        return JSONResponse({'result':"success"},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)

@app.post('/user/chgpwd')
async def chgpwd(token:str,password:str=Body(...),repasswd:str=Body(...)):
    user=authe(token)
    if repasswd!=password:
        raise HTTPException(400,"repeat password not same")
    if update_user(user["email"],password=password):
        return JSONResponse({'result':"success"},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)

@app.post('/user/chgtag')
async def chgtag(token:str,tags:dict=Body(...)):
    user=authe(token)
    tags=tags.get("tags")
    if tags.count(",")>=10:
        return HTTPException(400,"Too many tags")
    if update_user(user["email"],tags=tags):
        return JSONResponse({'result':"success"},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)


def newslist(res:tuple):
    res=list(map(list,res))
    for i in range(len(res)):
        dtime=(datetime.now()-res[i][3])
        if dtime.days>0:
            res[i][3]=f"{dtime.days}天前"
        elif dtime.seconds>3600:
            res[i][3]=f"{dtime.seconds//3600}小时前"
        elif dtime.seconds>60:
            res[i][3]=f"{dtime.seconds//60}分钟前"
        else:
            res[i][3]=f"{dtime.seconds}秒前"

    return JSONResponse([dict(zip(("id","title","author","time","category","hit","img","summary"),each)) for each in res],status_code=200)

@app.get("/news/index")
async def index(token:str,category:str,start:int,num:int):
    if num>=200:
        raise HTTPException(400,"too much response content")
    if token:
        user=authe(token)
    res=news_loader(cate=category,start=start,num=num,favor=user["favor"]if token else "")
    return newslist(res)

@app.get("/news/tag")
async def tag(token:str,tag:str,start:int,num:int):
    if num>=200:
        raise HTTPException(400,"too much response content")
    user=authe(token)
    res=tag_loader(tag=tag,start=start,num=num,favor=user["favor"])
    return newslist(res)

def imagezipper(contents):
    pic=Image.open(io.BytesIO(contents)).convert('RGB')
    x,y=pic.size
    x,y=map(lambda a:a//(min(x,y)//44),(x,y))
    pic=pic.resize((x,y))
    picdata=io.BytesIO()
    pic.save(picdata,"jpeg")
    return f"data:image/jpeg;base64,"+base64.b64encode(picdata.getvalue()).decode().strip("=")


@app.post('/user/uploadAvator')
async def chgAvator(token:str,file:UploadFile=File(...)):
    user=authe(token)
    contents=await file.read()
    avator=imagezipper(contents)
    if update_user(user["email"],avator=avator):
        # print(user)
        return JSONResponse({'result':"success","avator":avator},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)

# @app.get("/{file}")
# async def getfile(file):
#     if not (re.match(r"^[0-9A-Za-z\.]*$", file)):raise HTTPException(404,"Not Valid URI")
#     if file not in os.listdir("template"):raise HTTPException(404,"Not Found")
#     try:c=open(f"template/{file}","rb").read()
#     except:raise HTTPException(502,"Fetch Resource Failed")
#     # print(c)
#     return StreamingResponse(content=io.BytesIO(c), status_code=200,media_type=mimetypes.guess_type(file)[0])

@app.get("/news/article")
async def article(id:int,token:str=""):
    email = authe(token)["email"] if token else ""
    res=article_loader(id,email)[0]
    locale.setlocale(locale.LC_CTYPE, 'chinese')
    res=list(res)
    res[2]=res[2].strftime("%Y年%m月%d日 %H:%M:%S")
    return JSONResponse(dict(zip(("title","author","time","category","hit","context"),res)),status_code=200)


@app.get("/news/search")
async def search(s:str,start:int,num:int,token:str):
    res=search_loader( "and".join(map(lambda x:f" concat(title,context) like '%{x}%' ",s.split(" "))),start,num)
    return newslist(res)
    


if __name__ == "__main__":
    try:uvicorn.run(app,host="0.0.0.0",port=8081)
    except:pass
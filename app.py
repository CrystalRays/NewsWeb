from fastapi import FastAPI,Depends,Request,Body,Form,Cookie
import io
import os
from fastapi.responses import *
from fastapi.exceptions import *
import mimetypes
import uvicorn
import re
from datetime import datetime,timedelta
import json
import base64

from JWT import JWT,JWT_tail
from data import *

app=FastAPI()
secret=os.urandom(24)

# @app.exception_handler(RequestValidationError)
# async def request_validation_exception_handler(request,exc):
#     print(exc)
#     return JSONResponse({"code": "400", "message": "Incorrect Params"},status_code=422)

@app.get("/")
async def home():
    return HTMLResponse(content=open(f"template/index.html","r",encoding="utf-8").read(), status_code=200)

@app.post('/test')
async def auth(a,b,c=Cookie(None)):
    return {"a":a,"b":b,"c":c}


def authe(token:str):
    head,body,tail=token.split(".")
    bodydata=json.loads(base64.b64decode(body))
    user=load_user(bodydata["email"])
    user["email"]=bodydata["email"]
    # print(111)
    # print(JWT_tail(secret+user["password"].encode(),f"{head}.{body}".encode())==tail , bodydata["exp"],int(datetime.utcnow().timestamp()))
    if JWT_tail(secret+user["password"].encode(),f"{head}.{body}".encode())==tail and bodydata["exp"]>int(datetime.utcnow().timestamp()):
        return user
    else:
        raise HTTPException(401,"Auth Failed")

@app.get("/token/auth")
async def auth(token:str):
    user= authe(token)
    return {'nickname':user['nickname'],'token': token,"favor":user["favor"],"avator":user["avator"]}

@app.get("/token/renew")
async def renew(token:str):
    user=authe(token)
    print(user)
    exptime=datetime.utcnow()+timedelta(hours=1)
    user["token"] = JWT(secret+user["password"].encode(),{"email":user["email"],"exp":int(exptime.timestamp())})
    return user



@app.post('/login')
async def login(email:str=Body(...),password:str=Body(...),remember:int=Body(...)):

    user = load_user(email)  # we are using the same function to retrieve the user
    if not user:
        raise HTTPException(401,"User Not Exists")  # you can also use your own HTTPException
    elif password != user['password']:
        raise HTTPException(401,"Incorrect Password")
    max_age=timedelta(hours=1 if not remember else 168)
    exptime=datetime.utcnow()+max_age
    token = JWT(secret+user["password"].encode(),{"email":email,"exp":int(exptime.timestamp())})
    response=JSONResponse({'nickname':user['nickname'],'token': token,"avator":user["avator"],"favor":user["favor"]},status_code=200)
    if remember:
        print(remember)
        response.set_cookie(key="token",value=token,max_age=max_age.total_seconds(),expires=exptime.strftime("%A, %d-%b-%Y %H:%M:%S GMT"))
    return response

@app.post('/register')
async def login(email:str=Body(...),password:str=Body(...),remember:int=Body(...)):

    user = load_user(email)  # we are using the same function to retrieve the user
    if not user:
        raise HTTPException(401,"User Not Exists")  # you can also use your own HTTPException
    elif password != user['password']:
        raise HTTPException(401,"Incorrect Password")
    max_age=timedelta(hours=1 if not remember else 168)
    exptime=datetime.utcnow()+max_age
    token = JWT(secret+user["password"].encode(),{"email":email,"exp":int(exptime.timestamp())})
    response=JSONResponse({'nickname':user['nickname'],'token': token,"avator":user["avator"],"favor":user["favor"]},status_code=200)
    if remember:
        print(remember)
        response.set_cookie(key="token",value=token,max_age=max_age.total_seconds(),expires=exptime.strftime("%A, %d-%b-%Y %H:%M:%S GMT"))
    return response

@app.post('/chgpwd')
async def chgpwd(token:str,password:str=Body(...),repasswd:str=Body(...)):
    user=authe(token)
    if repasswd!=password:
        raise HTTPException(400,"repeat password not same")
    if update_user(user["email"],passwd=password):
        return JSONResponse({'result':"success"},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)

@app.get("/{file}")
async def getfile(file):
    if not (re.match(r"^[0-9A-Za-z\.]*$", file)):raise HTTPException(404,"Not Valid URI")
    if file not in os.listdir("template"):raise HTTPException(404,"Not Found")
    try:c=open(f"template/{file}","rb").read()
    except:raise HTTPException(502,"Fetch Resource Failed")
    # print(c)
    return StreamingResponse(content=io.BytesIO(c), status_code=200,media_type=mimetypes.guess_type(file)[0])

@app.get("/page/{pageid}")
async def page(pageid):
    pass

if __name__ == "__main__":
    try:uvicorn.run(app,host="0.0.0.0",port=8081)
    except:pass
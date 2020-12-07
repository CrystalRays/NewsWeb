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

cwd=os.getcwd()
if cwd[cwd.rfind("//")+1:]=="backend":
    from config import server_ip,server_port
    from modules import *
    from JWT import JWT,JWT_tail
else:
    from backend.modules import *
    from backend.JWT import JWT,JWT_tail

app=FastAPI()
secret=os.urandom(24)

# @app.exception_handler(RequestValidationError)
# async def request_validation_exception_handler(request,exc):
#     print(exc)
#     return JSONResponse({"code": "400", "message": "Incorrect Params"},status_code=422)


# @app.post('/test')
# async def auth(a,b,c=Cookie(None)):
#     return {"a":a,"b":b,"c":c}


def authe(token:str):
    head,body,tail=token.split(".")
    bodydata=json.loads(base64.b64decode(body))
    user=load_user(bodydata["email"])
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
    return {'nickname':user['nickname'],'token': token,"favor":user["favor"],"avator":user["avator"]}

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
    response=JSONResponse({'nickname':user['nickname'],'token': token,"avator":user["avator"],"favor":user["favor"]},status_code=200)
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
    if update_user(user["email"],passwd=password):
        return JSONResponse({'result':"success"},status_code=200)
    else:
        return JSONResponse({'result':"unknown error"},status_code=500)

@app.get("/news/index")
async def index(token:str,start:int,num:int):
    pass


@app.post('/user/uploadAvator')
async def chgAvator(token:str,file:UploadFile=File(...)):
    user=authe(token)
    contents=await file.read()
    pic=Image.open(io.BytesIO(contents)).convert('RGB')
    x,y=pic.size
    x,y=map(lambda a:a//(min(x,y)//44),(x,y))
    pic.resize((x,y))
    picdata=io.BytesIO()
    pic.save(picdata,"jpeg")
    avator=f"data:image/jpeg;base64,"+base64.b64encode(picdata.getvalue()).decode()
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

@app.get("/artical")
async def page(id:str):
    pass

if __name__ == "__main__":
    try:uvicorn.run(app,host="0.0.0.0",port=8081)
    except:pass
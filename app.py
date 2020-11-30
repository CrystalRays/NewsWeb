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

from JWT import JWT,JWT_tail
from data import *

app=FastAPI()
secret=os.urandom(24)

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request,exc):
    print(exc)
    return JSONResponse({"code": "400", "message": "Incorrect Params"},status_code=400)

@app.get("/")
async def home():
    return HTMLResponse(content=open(f"template/index.html","r",encoding="utf-8").read(), status_code=200)

@app.post('/test')
async def auth(a,b,c=Cookie(None)):
    return {"a":a,"b":b,"c":c}

@app.get("/auth")
async def auth(token:str):
    try:
        head,body,tail=token.split(".")
        if JWT_tail(f"{head}.{body}")==tail:
            user=load_user(body["email"])
            return {'nickname':user['nickname'],'token': token,"favor":user["favor"]}
        else:
            raise HTTPException(401,"Auth Failed")
    except:
        raise RequestValidationError

@app.post('/login')
async def login(email:str=Body(...),password:str=Body(...),remember:int=Body(...)):

    user = load_user(email)  # we are using the same function to retrieve the user
    if not user:
        raise HTTPException(401,"User Not Exists")  # you can also use your own HTTPException
    elif password != user['password']:
        raise HTTPException(401,"Incorrect Password")
    max_age=timedelta(hours=1 if not remember else 168)
    exptime=(max_age+datetime.utcnow()).strftime("%A, %d-%b-%Y %H:%M:%S GMT")
    token = JWT(secret,{"email":email,"exp":exptime})
    response=JSONResponse({'nickname':user['nickname'],'token': token,"favor":user["favor"]},status_code=200)
    response.set_cookie(key="token",value=token,max_age=max_age.seconds,expires=exptime)
    return response

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
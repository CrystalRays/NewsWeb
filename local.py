import re
from fastapi import FastAPI
from fastapi.responses import HTMLResponse,StreamingResponse
from fastapi.exceptions import HTTPException
from fastapi.staticfiles import StaticFiles
import io
import os
import mimetypes

from backend.app import *

app.mount("/css", StaticFiles(directory="frontend/css"), name="css")
app.mount("/image", StaticFiles(directory="frontend/image"), name="image")
app.mount("/js", StaticFiles(directory="frontend/js"), name="js")

@app.get("/")
async def home():
    return HTMLResponse(content=open(f"frontend/index.html","r",encoding="utf-8").read(), status_code=200)


# @app.get("/{file}")
# async def getfile(file):
#     if not (re.match(r"^[0-9A-Za-z\./]*$", file)):raise HTTPException(404,"Not Valid URI")
#     if file not in os.listdir("frontend"):raise HTTPException(404,"Not Found")
#     try:c=open(f"frontend/{file}","rb").read()
#     except:raise HTTPException(502,"Fetch Resource Failed")
#     # print(c)
#     return StreamingResponse(content=io.BytesIO(c), status_code=200,media_type=mimetypes.guess_type(file)[0])



if __name__ == "__main__":
    ip=input("server ip:")
    port=input("server port:")
    uvicorn.run(app,host=ip,port=int(port))
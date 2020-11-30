import hmac
import base64
import jwt
import json

def JWT_tail(secret,code) -> str:
        return base64.urlsafe_b64encode(hmac.new(secret, code, digestmod="sha256").digest()).decode().strip("=")
def JWT(secret,payload={"sub": "admin","exp": "9893845934343"}) -> str:
  header={"typ":"JWT","alg":"HS256"}
  base64encode=lambda x:base64.urlsafe_b64encode(json.dumps(x).replace(" ","").encode()).decode().strip("=")
  head=f"{base64encode(header)}.{base64encode(payload)}"
  return f"{head}.{JWT_tail(secret,head.encode())}"

def pyJWT(key,payload):
        return jwt.encode(payload,  # payload, 有效载体 
                       key,  # 进行加密签名的密钥
                       algorithm="HS256",  # 指明签名算法方式, 默认也是HS256
                       )  # python3 编码后得到 bytes, 再进行解码(指明解码的格式), 得到一个str

if __name__=="__main__":
    # code=b"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6Ijk4OTM4NDU5MzQzNDMifQ"
    secret=b"-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAn/KiHQ+/zwE7kY/Xf89PY6SowSb7CUk2b+lSVqC9u+R4BaE/5tNF\neNlneGNny6fQhCRA+Pdw1UJSnNpG26z/uOK8+H7fMb2Da5t/94wavw410sCKVbvf\nft8gKquUaeq//tp20BETeS5MWIXp5EXCE+lEdAHgmWWoMVMIOXwaKTMnCVGJ2SRr\n+xH9147FZqOa/17PYIIHuUDlfeGi+Iu7T6a+QZ0tvmHL6j9Onk/EEONuUDfElonY\nM688jhuAM/FSLfMzdyk23mJk3CKPah48nzVmb1YRyfBWiVFGYQqMCBnWgoGOanpd\n46Fp1ff1zBn4sZTfPSOus/+00D5Lxh6bsbRa6A1vAApfmTcu026lIb7gbG7DU1/s\neDId9s1qA5BJpzWFKO4ztkPGvPTUok8hQBMDaSH1JOoFQgfJIfC7w2CQe+KbodQL\n3akKQDCZhcoA4tf5VC6ODJpFxCn6blML5cD6veOBPJiIk8DBRgmt2AHzOUju+5ns\nQcplOVxW5TFYxLqeJ8FPWqQcVekZ749FjchtAwPlUsoWIH0PTSun38ua8usrwTXb\npBlf4r0wz22FPqaecvp7z6Rj/xfDauDGDSU4hmn/TY9Fr+OmFJPW/9k2RAv7KEFv\nFCLP/3U3r0FMwSe/FPHmt5fjAtsGlZLj+bZsgwFllYeD90VQU8Ds+KkCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n"
    print(JWT(secret,{  "sub": "admin",  "exp": "9893845934343"}))
    print(pyJWT("-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAn/KiHQ+/zwE7kY/Xf89PY6SowSb7CUk2b+lSVqC9u+R4BaE/5tNF\neNlneGNny6fQhCRA+Pdw1UJSnNpG26z/uOK8+H7fMb2Da5t/94wavw410sCKVbvf\nft8gKquUaeq//tp20BETeS5MWIXp5EXCE+lEdAHgmWWoMVMIOXwaKTMnCVGJ2SRr\n+xH9147FZqOa/17PYIIHuUDlfeGi+Iu7T6a+QZ0tvmHL6j9Onk/EEONuUDfElonY\nM688jhuAM/FSLfMzdyk23mJk3CKPah48nzVmb1YRyfBWiVFGYQqMCBnWgoGOanpd\n46Fp1ff1zBn4sZTfPSOus/+00D5Lxh6bsbRa6A1vAApfmTcu026lIb7gbG7DU1/s\neDId9s1qA5BJpzWFKO4ztkPGvPTUok8hQBMDaSH1JOoFQgfJIfC7w2CQe+KbodQL\n3akKQDCZhcoA4tf5VC6ODJpFxCn6blML5cD6veOBPJiIk8DBRgmt2AHzOUju+5ns\nQcplOVxW5TFYxLqeJ8FPWqQcVekZ749FjchtAwPlUsoWIH0PTSun38ua8usrwTXb\npBlf4r0wz22FPqaecvp7z6Rj/xfDauDGDSU4hmn/TY9Fr+OmFJPW/9k2RAv7KEFv\nFCLP/3U3r0FMwSe/FPHmt5fjAtsGlZLj+bZsgwFllYeD90VQU8Ds+KkCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n",{  "sub": "admin",  "exp": "9893845934343"}))

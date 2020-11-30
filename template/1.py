import os
from pathlib import Path
import traceback
from hashlib import md5
import re
import shutil
dir=r"E:\Games\3DHGAME\3d2 MOD"
fp=open("log6.py","a+",encoding="utf-8")
dirlist=[dir]
i=0


# ------------------file repeatation detect-------------------


hashdict={}
rmlist=[]

while i <len(dirlist):
    dirlist_tmp=os.scandir(dirlist[i])
    for each in dirlist_tmp:
        print(dirlist[i].ljust(160," "),end="\r")
        if each.is_dir():
            dirlist.append(each.path)
    i+=1
print("PATH SCAN FINISH".center(160,"-"),"\t"*10)
dirlist.reverse()
for eachdir in dirlist:
    dirlist_tmp=os.listdir(eachdir)
    if len(dirlist_tmp) == 0:
        # c=input(f"rm {eachdir}\{eachdir}?[Y/n]")
        c="Y"
        if c in "Yy":
            try:
                os.rmdir(eachdir)
            except:
                fp.write(f"[FAILED] rm {eachdir}\{eachdir}")
            else:
                fp.write(f"[SUCCESS] rm {eachdir}\{eachdir}")
            continue
    count_file_same=0
    for each in dirlist_tmp:
        eachpath=f"{eachdir}\{each}"
        each_path=Path(eachpath)
        if each_path.is_file():
            print("PATH:",eachpath.ljust(160," "),end="\r")
            each_hash=md5(open(eachpath,"rb").read()).hexdigest()
            if each_hash in hashdict.keys():
                hashdict[each_hash].append(eachpath)
                count_file_same=count_file_same+1
                # print(each_hash,hashdict[each_hash])
            else:
                hashdict[each_hash]=[eachpath]
    if count_file_same==len(dirlist_tmp):
        rmlist.append(eachdir)
fp.write("rmlist=")
fp.write(str(rmlist)+"\n\n")
rehashdict={}
for key,value in hashdict.items():
    if len(value)>1:
        rehashdict[key]=value

for each in rmlist:
    try:os.removedirs(each)
    except:
        traceback.print_exc()
for key,value in rehashdict.items():
    for each in value[1:]:
        if not Path(each).exists():
            rehashdict[key].remove(each)
    if len(rehashdict[key])<=1:
        rehashdict.pop(key)


for key,value in rehashdict.items():
        print(key,value)
        rehashdict[key]=value
        fp.write(str({key:value})+",\n")
fp.write("rehashdict=",str(rehashdict))

# --------------------codetransfer----------------------

# convertdict={}

# while i <len(dirlist):
#     dirlist_tmp=os.listdir(dirlist[i])
#     eachdir=dirlist[i]
#     for each in dirlist_tmp:
#         print(dirlist[i],"                 ",end="\r")
#         eachpath=f"{eachdir}\{each}"
#         each_path=Path(eachpath)
#         sign=0
#         if each in convertdict.keys():
#             after=convertdict[each]
#             sign=5
#         elif each.split(".")[0] in convertdict.keys():
#             leach=each.split(".")
#             if [convertdict[leach[0]]]:
#                 after=None
#             else:
#                 after="".join([convertdict[leach[0]]]+leach[1:])
#             sign=5
#         elif re.search("[ハ々ーぎトパンメイむすびかじりないすやぁカブぬえミニベッれどめロゴドラウタレス１２３６５４０クファのみラ対ゆモヤ応バリくげんにごノておきさけらよしシガャめツコねコナ剣]",each):sign=0
#         elif re.search("[ââôüëùÉòè]",each):sign=1
#         elif  re.search("[ﾌﾄﾋｼﾓﾎｲﾎｶｸﾟﾒｰｾｮﾇｧﾉｳｵﾇﾆｺﾏﾊﾖﾂﾅﾝﾒﾈГﾜﾁｹｾｩﾗ]",each):sign=3 
#         elif "&#" in each:sign=4
#         elif "姘" in each:sign=6
#         else:
#             for each1 in each:
#                 try:
#                     if b"\x81\x40"<=each1.encode("GBK")<=b"\xa0\xfe" or "姘" in each:
#                         sign=2
#                         break
#                 except:
#                     break
#         if sign:
#             try:
#                 if sign==2:
#                     after=each.encode("gbk").decode("shiftjis")
#                 elif sign==1:
#                     after=each.encode("cp437").decode("shiftjis")
#                 elif sign==3:
#                     after=each.encode("shiftjis").decode("gbk")
#                 elif sign==5:
#                     pass
#                 elif sign==6:
#                     after=each.encode("cp950").decode("euc-kr")
#                 elif sign==4:
#                     after=each
#                     while "&#" in after:
#                         code=after[after.find("&#")+2:after.find(";")]
#                         try:
#                             after=after.replace(f"&#{code};",chr(int(code)))
#                         except:
#                             pass
#             except:
#                 # print("[FAILED]",sign,":\t",each,"\t"*10)
#                 continue
#             if sign==5:
#                 if after!=None:
#                     key="Y"
#                 else:
#                     key="N"
#             elif re.search("[ハ々ーぎトパンメイむすびかじりないすやぁカブミニラクベロゴッぬれどめえドファウタレ１２３６５モヤ４げ０スのみラ対ゆ応バリくんにごノておきさけらよしめシガャツコねコナ]",after) or sign==4 or re.search("靴|旧版|強|発光|風野|西城|部分|圧縮|袖|移植|透過|髪|配置|服|文字|完成|獣耳|要石|傷痕|大和|腕|頭|脚部|装甲|掛布|了解|竜造寺椿|上着|事項|注意|読|設定|※|必須|構成|制服|水着|帽子|改変元|解説|説明|人妻|見本|背景|改造|量産|配布|黒子|白子|里美|変更|痴漢|連峰|体操|私服|学園|素材|赤|黄|白|黒|青|茶|桃|緑",after):
#                 key="Y"
#                 print(f"[DECODE] {sign}:\t{each}\t{after}","\t"*10)
#             elif re.search("[ﾌﾄﾋｼﾓﾎｲﾎｶｸﾟﾒｰｾｮﾇｧﾉﾊﾖｳｵﾇﾆｺﾏﾅﾝﾒﾈГﾂﾜﾁｹｾｩﾗ]",after) or re.search("帯|枡|通常|必須|廃広間|北方|制服|水着|帽子|改変元|解説|説明|人妻|見本|背景|改造|量産|配布|黒子|白子|里美|変更|痴漢|連峰|体操|私服|学園|素材|赤|黄|白|黒|青|茶|桃|緑|構成",each):
#                 # for each1 in after:
#                 #     try:
#                 #         if 0xb0<=each1.encode("GBK")[0]<=0xf7 and 0xa1<=each1.encode("GBK")[1]<=0xfe:
#                 #             key=input(f"[RENAME] {sign}:\t{each}\t{after}? [Y/N]")
#                 #             if key=="950":
#                 #                 after=each.encode("cp950").decode("euc-kr")
#                 #                 key=input(f"[RENAME] {sign}:\t{each}\t{after}? [Y/N]")
#                 #             break
#                 #     except:
#                 #         continue
#                 # else:
#                 key="N"
#                 print(f"[REJECT] {sign}:\t{each}\t{after}","\t"*10)
#             elif each in ["01_pre_ 夢夢_20160223153540.preset","3機","桜.png","ﾍ・ﾒmod","7251-263滝.mate","鉄柵","烏","錢湯","烏.preset","檻","番傘","28宍","07宍","pre_ﾇｷｪ腹Tﾇｷｪ腹T_20160826213706.preset"]:
#                 key="N"
#                 print(f"[AUTO] {sign}:\t{each}\t{after}","\t"*10)
#             # elif b"\xb0\xa1"<=each1.encode("GBK")<=b"\xf7\xfe":
#             #     key="Y"
#             else:key=input(f"[RENAME] {sign}:\t{each}\t{after}? [Y/N]")
#             try:
#                 if key in "Yy":
#                     if each_path.is_dir():
#                         dirlist.append(f"{eachdir}\{after}")
#                     os.rename(f"{eachdir}\{each}",f"{eachdir}\{after}")
#                     convertdict[each.split(".")[0]]=after.split(".")[0]
#                 else:
#                     if each_path.is_dir():
#                         dirlist.append(f"{eachdir}\{each}")
#                     convertdict[each.split(".")[0]]=None
#             except FileExistsError:
#                 try:os.remove(f"{eachdir}\{each}")
#                 except:
#                     fp.write(f"[FAILED] {eachdir}\{each} remove failed")
#                 else:
#                     fp.write("[SUCCESS]"+f"{eachdir}\{each} removed")
#             except:
#                 print(traceback.format_exception_only())
#             else:
#                 fp.write("[SUCCESS]"+f"{eachdir}\{each} -> {eachdir}\{after} renamed")
#         else:
            
#             if each_path.is_dir():
#                 dirlist.append(f"{eachdir}\{each}")
#     i+=1

open("converdict.py","w",encoding="utf-8").write("convertdict="+str(convertdict))
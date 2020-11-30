from hashlib import md5

fake_db = {"test@example.com": {"nickname":"admin","password":md5(b"123456").hexdigest(),"favor":None}}

def load_user(email: str):  # could also be an asynchronous function
    return fake_db.get(email)

def add_user(email:str,nickname:str,passwd:str):
    if fake_db.get(email):
        return False
    else:
        fake_db[email]={"nickname":nickname,"passwd":passwd,"favor":None}
        if fake_db[email]!={"nickname":nickname,"passwd":passwd,"favor":None}:
            return False
        return True


def update_user(email:str,nickname:str=None,passwd:str=None,favor:str=None):
    if fake_db.get(email):
        for key,value in {"nickname":nickname,"passwd":passwd,"favor":favor}:
            if value!=None:
                fake_db[key]=value
                if fake_db.get(key)!=value:
                    return False
        return True
    else:
        return False
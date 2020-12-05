$=function(data){return document.querySelector(data);};

window.onload=function(){
    var dp1=datepicker();
    dp1.init("#filter-end-date");
    var dp2=datepicker();
    dp2.init("#filter-begin-date");
    cookielogin();
}

function paneclose(){
    $("#usercenter-container").style.opacity="0";
    setTimeout(() => {
        $("#usercenter-container").style.display="none";
    }, 500);
    
    for (each of $("#usercenter-container").getElementsByTagName("div")){
        each.style.color="";
    }
}

userdata=null;

var lastswitcher=null;

panelswitcher=function(type){
    var displayparams=[["none","none","none","",""],["","","","none","none"]];
    $("#chgpwd-sector").style.display=displayparams[Number(type>1)][0];
    $("#avator-sector").style.display=displayparams[Number(type>1)][1];
    $("#chgfavor-sector").style.display=displayparams[Number(type>1)][2];
    $("#login-sector").style.display=displayparams[Number(type>1)][3];
    $("#register-sector").style.display=displayparams[Number(type>1)][4];
    switch(type){
        case 0:
            loginpanelanime(1,function(){
                $("#login-sector").style.color="red";
                $("#register-sector").style.color="";
                $("#opbtn").innerHTML="登录";
                $("#opbtn").setAttribute("onclick","op(0)");
                $("#nickname").style.display="none";
                $("#repasswd").style.display="none";
                $("#pwdopt").style.display="block";
                $("#email").style.display="";
            })
            break;
        case 1:
            loginpanelanime(0,function(){
                $("#register-sector").style.color="red";
                $("#login-sector").style.color="";
                $("#opbtn").innerHTML="注册";
                $("#opbtn").setAttribute("onclick","op(1)");
                $("#nickname").style.display="block";
                $("#repasswd").style.display="block";
                $("#email").style.display="";
                $("#pwdopt").style.display="none";
            })
            break;
        case 2:
            loginpanelanime(1,function(){
                $("#chgpwd-sector").style.color="red";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="修改密码";
                $("#opbtn").setAttribute("onclick","op(2)");
                $("#chgfavor-sector").style.color="";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="";
                $("#pwdopt").style.display="none";
            })
            lastswitcher=0;
            break;
        case 3:
            loginpanelanime(lastswitcher,function(){
                $("#chgpwd-sector").style.color="";
                $("#avator-sector").style.color="red";
                $("#opbtn").innerHTML="更新头像";
                $("#opbtn").setAttribute("onclick","op(3)");
                $("#chgfavor-sector").style.color="";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="";
                $("#pwdopt").style.display="none";
            });
            $("#avator-sector").style.color="red";
            break;
        case 4:
            loginpanelanime(0,function(){
                $("#chgpwd-sector").style.color="";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="保存修改";
                $("#opbtn").setAttribute("onclick","op(4)");
                $("#chgfavor-sector").style.color="red";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="";
                $("#pwdopt").style.display="none";
            })
            lastswitcher=1;
            
            break;
        default:;
    }
}


function op(opter){
    switch(opter){
        case 0:login();break;
        case 1:register();break;
        case 2:chgpwd();break;
        case 3:chgavator();break;
        case 4:chgfavor;break;
        default:;
    }
}

function loginpanelanime(direction,func){
    $("#login-panel").style.transition="all 0.5s";
    $("#login-panel").style.transform=direction?"translate(20px,0px)":"translate(-20px,0px)";
    $("#login-panel").style.opacity="0";
    setTimeout(() => {
        func();
        $("#login-panel").style.transition="all 0.001s";
        $("#login-panel").style.transform=direction?"translate(-20px,0px)":"translate(20px,0px)";
        setTimeout(() => {
            $("#login-panel").style.transition="all 0.5s";
            $("#login-panel").style.transform="translate(0px,0px)";
            $("#login-panel").style.opacity="1";
        }, 100);
    },500);
}

function paneopen(type){
    $("#usercenter-container").style.display="block";
    panelswitcher(type);
    setTimeout(() => {
        $("#usercenter-container").style.opacity="1";
    }, 1);
}

// Example POST method implementation:



function getData(url,data=null,method="GET",headers={}) {
    // Default options are marked with *
    return fetch(url, {
      credentials: 'same-origin',
      body:data,
      headers:headers,
      method:method
    })
    .then(response =>response.json().then(data=>({status:response.status,data:data})))// parses response to JSON
  }

function postData(url, data) {
    // Default options are marked with *
    return getData(url,JSON.stringify(data),"POST",{'content-type': 'application/json'});
}



userload=function(user){
    userdata=data;
}
function insertAfter(newElement,targetElement) {
    var parent = targetElement.parentNode;
     if (parent.lastChild == targetElement) {// 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
     } else {
      parent.insertBefore(newElement,targetElement.nextSibling);//如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面。
     }
  }
inputnormalize=function(objt){
    // console.log(objt);
    objt.style.background="";
    objt.className="";
    objt.setAttribute("placeholder",objt.getAttribute("defaultplaceholder"))
}


repwdchg=function(){
    if ($("input[name='repasswd']").value!=$("input[name='password']").value && $("input[name='repasswd']").value!=""){
        $("input[name=repasswd]").style.marginBottom="0";
        if($("#repwderr")==null){
        var err=document.createElement("div");
        err.id="repwderr";
        err.style=" color: red;height:20px;";
        err.innerHTML="密码不一致";
        insertAfter(err,$("input[name='repasswd']"));
        }
    }
    else{
        $("input[name=repasswd]").style.marginBottom="20px";
        if($("#repwderr")!=null){$("#repwderr").remove();}
    }
}

autorenew=function(){
    if(userdata==null){
        return
    }
    setTimeout(() => {
        getData('/token/renew?token='+userdata["token"])
        .then(
            res=>function(){
                if (res.status==200){
                    userdata=res.data;
                    autorenew();
                }
        });
    }, 3600000);
}

auth=function(token,func){    
    getData('/token/auth?token='+token)
    .then(
        res=>function(){
            if (res.status==200){
                func(res.data);
            }
            else{

                alert("登录失效，请重新登录");
                paneclose();
                logout();
            }
        }()
    )

}

cookielogin=function(){
    if(document.cookie==""){
        return
    }
    cookie=document.cookie.substring(document.cookie.indexOf("token")+6);
    cookie=cookie.substring(0,cookie.indexOf(";")==-1?cookie.length:cookie.indexOf(";"));
    auth(cookie,function(data){ userdata=data;loginanime();});
}

loginanime=function(){
    $("#login-button").style.transition="all 0.5s";
    $("#login-button").style.transform="translate(-200px,0px)";
    $("#login-button").style.opacity="0";
    $("#register-button").style.transition="all 0.5s";
    $("#register-button").style.transform="translate(-200px,0px)";
    $("#register-button").style.opacity="0";
    $("#usercenter-button").style.opacity="0";;
    $("#user-avator").style.transform="translate(-200px,0px)";
    $("#user-avator").style.transition="all 0.5s";
    $("#logout-button").style.opacity="0";
    setTimeout(() => {
        $("#user-avator").setAttribute("src",userdata.avator);
        $("#logout-button").style.display="";
        $("#usercenter-button").style.display="";
        $("#register-button").style.display="none";
        $("#login-button").style.display="none";
        $("#usercenter-button").style.transform="translate(200px,0px)";
        $("#logout-button").style.transform="translate(200px,0px)";
        $("#user-avator").style.transform="";
        $("#user-avator").style.transition="";
        setTimeout(() => {
            $("#logout-button").style.transition="all 0.5s";
            $("#usercenter-button").style.transform="translate(0px,0px)";
            $("#usercenter-button").style.transition="all 0.5s";
            $("#logout-button").style.transform="translate(0px,0px)";
            $("#usercenter-button").style.opacity="1";
            $("#logout-button").style.opacity="1";
        }, 10);

    }, 500);
}

login=function (){
    if(userdata!=null){
        alert("您已登录！");
        return
    }
    postData('login', {email: $("input[name='email']").value,password:hex_md5($("input[name='password']").value),remember:$("input[name='remember']").checked})
    .then(res => (function(res){
        if(res.status==200){
            userdata=res.data;
            if(!$("input[name='remember']").checked){
                autorenew()
            }
            paneclose();
            loginanime();
        }
        else{
            logout();
            if(res.data["detail"].search("User")>-1){
                $("input[name='email']").value="";
                $("input[name='email']").setAttribute("placeholder","用户不存在");
                $("input[name='email']").style.background="#ffd1d1";
                $("input[name='email']").className="inputerr";
            }
            else if(res.data["detail"].search("Password")>-1){
                $("input[name='password']").value="";
                $("input[name='password']").setAttribute("placeholder","密码错误");
                $("input[name='password']").style.background="#ffd1d1";
                $("input[name='password']").className="inputerr";
            }
        }
    })(res)) // JSON from `response.json()` call
    
}

logout=function(){
    if (userdata!=null){
        userdata=null;
        document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        $("#logout-button").style.transition="all 0.5s";
        $("#usercenter-button").style.transform="translate(200px,0px)";
        $("#usercenter-button").style.transition="all 0.5s";
        $("#logout-button").style.transform="translate(200px,0px)";
        $("#usercenter-button").style.opacity="0";
        $("#logout-button").style.opacity="0";
        $("#user-avator").style.transform="translate(200px,0px)";
        $("#user-avator").style.transition="all 0.5s";
        $("#user-avator").setAttribute("src","user.svg");
        setTimeout(() => {
            
            $("#logout-button").style.display="none";
            $("#usercenter-button").style.display="none";
            $("#register-button").style.display="";
            $("#login-button").style.display="";
            $("#login-button").style.transform="translate(-200px,0px)";
            $("#register-button").style.transform="translate(-200px,0px)";
            $("#user-avator").style.transform="";
            $("#user-avator").style.transition="";
            setTimeout(() => {
                $("#login-button").style.transition="all 0.5s";
                $("#login-button").style.transform="translate(0px,0px)";
                $("#login-button").style.opacity="1";
                $("#register-button").style.transition="all 0.5s";
                $("#register-button").style.transform="translate(0px,0px)";
                $("#register-button").style.opacity="1";

            }, 10);

        }, 500);
    }



}

avator=function(){
        paneopen(userdata?3:0);
}

register=function(){

}

chgpwd=function(){
    if (userdata!=null){
        auth(
            userdata["token"],
            function() {
                postData('chgpwd?token='+userdata["token"], {password:hex_md5($("input[name='password']").value),repasswd:hex_md5($("input[name='repasswd']").value)}).then(
                    data=>function(){
                        if(data.status==200){
                            alert("修改成功，请重新登录");
                            logout();
                            paneclose();
                        }
                        else if(data.status==400){
                            alert("两次密码不一致,请重试");
                        }
                        else{
                            alert("修改失败，未知错误");
                        }
                    }()
                )
            }
        );

    }

}
$=function(data){return document.querySelector(data);};

window.onload=function(){
    var dp1=datepicker();
    dp1.init("#filter-end-date");
    var dp2=datepicker();
    dp2.init("#filter-begin-date");
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
            $("#login-panel").style.transition="all 0.5s";
            $("#login-panel").style.transform="translate(20px,0px)";
            $("#login-panel").style.opacity="0";
            setTimeout(() => {
                $("#login-sector").style.color="red";
                $("#register-sector").style.color="";
                $("#login-panel").style.display="flex";
                $("#nickname").style.display="none";
                $("#repasswd").style.display="none";
                $("#login").style.display="block";
                $("#register").style.display="none";
                $("#pwdopt").style.display="block";
                $("#login-panel").style.transition="all 0.001s";
                $("#login-panel").style.transform="translate(-20px,0px)";
                
                setTimeout(() => {
                    $("#login-panel").style.transition="all 0.5s";
                    $("#login-panel").style.transform="translate(0px,0px)";
                $("#login-panel").style.opacity="1";
                
                }, 100);
                
            }, 500);
            
            break;
        case 1:
            $("#login-panel").style.transition="all 0.5s";
            $("#login-panel").style.transform="translate(-20px,0px)";
            $("#login-panel").style.opacity="0";
            setTimeout(() => {
                $("#register-sector").style.color="red";
                $("#login-sector").style.color="";
                $("#login-panel").style.display="flex";
                $("#nickname").style.display="block";
                $("#repasswd").style.display="block";
                $("#login").style.display="none";
                $("#register").style.display="block";
                $("#pwdopt").style.display="none";
                $("#login-panel").style.transition="all 0.001s";
                $("#login-panel").style.transform="translate(20px,0px)";
                
                setTimeout(() => {
                    $("#login-panel").style.transition="all 0.5s";
                    $("#login-panel").style.transform="translate(0px,0px)";
                $("#login-panel").style.opacity="1";
            
            }, 100);
            
        }, 500);
            break;
        case 2:$("#chgpwd-sector").style.color="red";break;
        case 3:;
        case 4:;
        default:;
    }
}


function paneopen(type){
    $("#usercenter-container").style.display="block";
    panelswitcher(type);
    setTimeout(() => {
        $("#usercenter-container").style.opacity="1";
    }, 1);
}

// Example POST method implementation:

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin' 
  })
  .then(response => (function(responese){return {"status": response.status, "data": response.json()}})(response)) // parses response to JSON
}

function getData(url) {
    // Default options are marked with *
    return fetch(url, {
      credentials: 'same-origin' 
    })
    .then(response => response.json()) // parses response to JSON
  }

userload=function(user){
    userdata=data;
}

inputnormalize=function(){
    console.log(this)
}

repwdchg=function(){
    if ($("input[name='repasswd']").value!=$("input[name='password']").value){
        $("#repwderr").style.display="block";
        $("#repasswd").style.marginBottom="0";
    }
    else{
        $("#repwderr").style.display="none";
        $("#repasswd").style.marginBottom="20px";
    }
}

login=function (){
    postData('login', {email: $("#email").value,password:hex_md5($("#password").value),remember:$("#remember").value==1?1:0})
    .then(res => (function(res){
        if(res.status==200){
            res.data.then(data => console.log(data));
        }
        else{
            res.data.then(data=>(function(data){
                if("User" in data["detail"]){
                    $("#email").setAttr("placeholder","用户不存在");
                    $("#email").style.background("red");
                }
                else if("Password" in data["detail"]){
                    $("#password").setAttr("placeholder","密码错误");
                    $("#password").style.background("red");
                }
            })(data))
        }
    })(res)) // JSON from `response.json()` call
    
}


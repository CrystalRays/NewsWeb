window.onload=function(){
    var dp1=datepicker();
    dp1.init("#filter-end-date");
    var dp2=datepicker();
    dp2.init("#filter-begin-date");
}

function paneclose(){
    document.getElementById("usercenter-container").style.opacity="0";
    setTimeout(() => {
        document.getElementById("usercenter-container").style.display="none";
    }, 500);
    
    for (each of document.getElementById("usercenter-container").getElementsByTagName("div")){
        each.style.color="";
    }
}

var lastswitcher=null;

panelswitcher=function(type){
    var displayparams=[["none","none","none","",""],["","","","none","none"]];
    document.getElementById("chgpwd-sector").style.display=displayparams[Number(type>1)][0];
    document.getElementById("avator-sector").style.display=displayparams[Number(type>1)][1];
    document.getElementById("chgfavor-sector").style.display=displayparams[Number(type>1)][2];
    document.getElementById("login-sector").style.display=displayparams[Number(type>1)][3];
    document.getElementById("register-sector").style.display=displayparams[Number(type>1)][4];
    switch(type){
        case 0:
            document.getElementById("login-panel").style.transition="all 0.5s";
            document.getElementById("login-panel").style.transform="translate(20px,0px)";
            document.getElementById("login-panel").style.opacity="0";
            setTimeout(() => {
                document.getElementById("login-sector").style.color="red";
                document.getElementById("register-sector").style.color="";
                document.getElementById("login-panel").style.display="block";
                document.getElementById("nickname").style.display="none";
                document.getElementById("repasswd").style.display="none";
                document.getElementById("login").style.display="block";
                document.getElementById("register").style.display="none";
                document.getElementById("pwdopt").style.display="block";
                document.getElementById("login-panel").style.transition="all 0.001s";
                document.getElementById("login-panel").style.transform="translate(-20px,0px)";
                
                setTimeout(() => {
                    document.getElementById("login-panel").style.transition="all 0.5s";
                    document.getElementById("login-panel").style.transform="translate(0px,0px)";
                document.getElementById("login-panel").style.opacity="1";
                
                }, 100);
                
            }, 500);
            
            break;
        case 1:
            document.getElementById("login-panel").style.transition="all 0.5s";
            document.getElementById("login-panel").style.transform="translate(-20px,0px)";
            document.getElementById("login-panel").style.opacity="0";
            setTimeout(() => {
                document.getElementById("register-sector").style.color="red";
                document.getElementById("login-sector").style.color="";
                document.getElementById("login-panel").style.display="block";
                document.getElementById("nickname").style.display="block";
                document.getElementById("repasswd").style.display="block";
                document.getElementById("login").style.display="none";
                document.getElementById("register").style.display="block";
                document.getElementById("pwdopt").style.display="none";
                document.getElementById("login-panel").style.transition="all 0.001s";
                document.getElementById("login-panel").style.transform="translate(20px,0px)";
                
                setTimeout(() => {
                    document.getElementById("login-panel").style.transition="all 0.5s";
                    document.getElementById("login-panel").style.transform="translate(0px,0px)";
                document.getElementById("login-panel").style.opacity="1";
            
            }, 100);
            
        }, 500);
            break;
        case 2:document.getElementById("chgpwd-sector").style.color="red";break;
        case 3:;
        case 4:;
        default:;
    }
}


function paneopen(type){
    document.getElementById("usercenter-container").style.display="block";
    panelswitcher(type);
    setTimeout(() => {
        document.getElementById("usercenter-container").style.opacity="1";
    }, 1);
    
    
    

}
$=function(data){return document.querySelector(data);};

newsposition=0
window.onload=function(){
    var dp1=datepicker();
    dp1.init("#filter-end-date");
    var dp2=datepicker();
    dp2.init("#filter-begin-date");
    category=window.location.hash.substr(1);
    chgcate($("a[name="+(category?category:"suggest")+"]"));
    cookielogin();
    // console.log(height,"feed的计算高度")
    $(".feed-list").onscroll = function(){
        pos=$(".feed-list").scrollTop+$(".feed-list").offsetHeight-$(".feed-list").scrollHeight
        // console.log(pos)
        if(pos<=5 && pos>=-5){
            // console.log("load")
            category=window.location.hash.substr(1);
            loadNews(category?category:"suggest",newsposition,10);
        }
    }
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
                $("form").setAttribute("action","javascript:op(0)");
                $("#nickname").style.display="none";
                $("#repasswd").style.display="none";
                $("#pwdopt").style.display="block";
                $("#email").style.display="";
                $("#password").style.display="";
                $("#uploadAvator").style.display="none";
            })
            break;
        case 1:
            loginpanelanime(0,function(){
                $("#register-sector").style.color="red";
                $("#login-sector").style.color="";
                $("#opbtn").innerHTML="注册";
                $("form").setAttribute("action","javascript:op(1)");
                $("#nickname").style.display="block";
                $("#repasswd").style.display="block";
                $("#email").style.display="";
                $("#pwdopt").style.display="none";
                $("#password").style.display="";
                $("#uploadAvator").style.display="none";
            })
            break;
        case 2:
            loginpanelanime(1,function(){
                $("#chgpwd-sector").style.color="red";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="修改密码";
                $("form").setAttribute("action","javascript:op(2)");
                $("#chgfavor-sector").style.color="";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="";
                $("#pwdopt").style.display="none";
                $("#uploadAvator").style.display="none";
                $("#password").style.display="";
            })
            lastswitcher=0;
            break;
        case 3:
            loginpanelanime(lastswitcher,function(){
                $("#chgpwd-sector").style.color="";
                $("#avator-sector").style.color="red";
                $("#opbtn").innerHTML="更新头像";
                $("form").setAttribute("action","javascript:op(3)");
                $("#chgfavor-sector").style.color="";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="none";
                $("#pwdopt").style.display="none";
                $("#uploadAvator").style.display="";
                $("#password").style.display="none";
                $("#uploadAvator").style.backgroundImage="url("+userdata.avator+")";
            });
            break;
        case 4:
            loginpanelanime(0,function(){
                $("#chgpwd-sector").style.color="";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="保存修改";
                $("form").setAttribute("action","javascript:op(4)");
                $("#chgfavor-sector").style.color="red";
                $("#nickname").style.display="none";
                $("#email").style.display="none";
                $("#repasswd").style.display="";
                $("#pwdopt").style.display="none";
                $("#uploadAvator").style.display="none";
                $("#password").style.display="";
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
        case 4:chgfavor();break;
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

function postData(url, data,headers={}) {
    // Default options are marked with *
    return getData(url,data,"POST",headers);
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
        getData('/user/renew?token='+userdata["token"])
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
    getData('/user/auth?token='+token)
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
        if(userdata.tags){
            userdata.tags.split(",").forEach(element => {
                var newli=$('li').cloneNode(true);
                var tag=element.replaceAll("'","")
                newli.querySelector("a").name="tag_"+tag;
                newli.querySelector("a").classList.add("tags");
                newli.querySelector("a").setAttribute("tag","#tag_"+tag);
                newli.querySelector("a").innerHTML=tag;
                $(".channel ul").insertBefore(newli,$(".channel-more"));
                $(".channel-more").style.display="None";
            });
        }
        else{
            $(".channel-more").setAttribute("onclick","paneopen(4)");
        }
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
    postData('/user/login', JSON.stringify({email: $("input[name='email']").value,password:hex_md5($("input[name='password']").value),remember:$("input[name='remember']").checked}),{'content-type': 'application/json'})
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
            else{
                alert(res.data.detail);
            }
        }
    })(res)) // JSON from `response.json()` call
    
}

logout=function(){
    document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (userdata!=null){
        userdata=null;
        
        $("#logout-button").style.transition="all 0.5s";
        $("#usercenter-button").style.transform="translate(200px,0px)";
        $("#usercenter-button").style.transition="all 0.5s";
        $("#logout-button").style.transform="translate(200px,0px)";
        $("#usercenter-button").style.opacity="0";
        $("#logout-button").style.opacity="0";
        $("#user-avator").style.transform="translate(200px,0px)";
        $("#user-avator").style.transition="all 0.5s";
        $("#user-avator").setAttribute("src","/image/user.svg");
        setTimeout(() => {
            document.querySelectorAll(".tags").forEach(element=>{
                element.remove();
            })
            $(".channel-more").setAttribute("onclick","panelopen(0)");
            $(".channel-more").style.display="";
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
    postData('/user/register', JSON.stringify({nickname: $("input[name='nickname']").value,email: $("input[name='email']").value,password:hex_md5($("input[name='password']").value),repasswd:hex_md5($("input[name='repasswd']").value)}),{'content-type': 'application/json'})
    .then(res=>{
        if(res.status==400){
            if(res.data.detail.search("User")!=-1){
                $("input[name='email']").value="";
                $("input[name='email']").setAttribute("placeholder","用户已存在");
                $("input[name='email']").className="inputerr";
            }
            else if(res.data["detail"].search("password")>-1){
                $("input[name='repasswd']").value="";
                $("input[name='repasswd']").setAttribute("placeholder","密码不一致");
                $("input[name='repasswd']").className="inputerr";
            }
        }
        else if(res.status==200){
            alert("注册成功，请登录");
            panelswitcher(0);
        }
        else{
            alert("注册失败，未知错误");
        }
    })
}

chgpwd=function(){
    if (userdata!=null){
        auth(
            userdata["token"],
            function() {
                postData('/user/chgpwd?token='+userdata["token"], JSON.stringify({password:hex_md5($("input[name='password']").value),repasswd:hex_md5($("input[name='repasswd']").value)}),{'content-type': 'application/json'}).then(
                    data=>function(){
                        if(data.status==200){
                            alert("修改成功，请重新登录");
                            logout();
                            paneclose();
                        }
                        else if(data.status==400){
                            $("input[name='repasswd']").value="";
                            $("input[name='repasswd']").setAttribute("placeholder","密码不一致");
                            $("input[name='repasswd']").className="inputerr";
                        }
                        else if(data.status==401){
                            logout();
                            alert("请先登录");
                        }
                        else{
                            alert("修改失败，未知错误");
                        }
                    }()
                )
            }
        );
    }
    else{
        logout();
        alert("请先登录");
    }
}


$('#uploadAvator').addEventListener('change', () => {
    console.log(this);
    if($('#uploadAvator').files[0]){
        $('#uploadAvator').style.backgroundImage="url("+window.URL.createObjectURL($('#uploadAvator').files.item(0))+")";
    }
    else{
        $('#uploadAvator').style.backgroundImage="url(/image/user.svg)";
    }
    
  })

chgavator=()=>{
    if(userdata==null){

        alert("请先登录");
        paneclose();
        logout();

        return
    }
   var formData = new FormData();
   var fileField =$('#uploadAvator');
   if(!fileField.files[0]){
       alert("请选择图像文件");
       return
   }
   formData.append('file', fileField.files[0]);
   
   postData('/user/uploadAvator?token='+userdata.token,formData)
   .then(response => {
    if(response.status==200){
        paneclose();
        $("#user-avator").setAttribute("src",response.data.avator);
    }
    else if(response.status==401){
        alert("请先登录");
        paneclose();
        logout();
    }
    else{
        alert("上传失败");
    }
   })
}

 
chgcate=(current)=>{
    $(".channel-item.active").classList.remove("active");
    current.classList.add("active");
    newsposition=0;
    $(".feed-list").innerHTML=" <div id=\"insertme\" >正在加载</div>";
    if(current.id=="search-tab"){
        current.style.height="";
    }
    else if(current.parentNode.className!="channel-more"){
        $("#search-tab").style.height="0px";
        loadNews(current.name?current.name:"suggest",newsposition,20);
    }
}

document.querySelectorAll(".channel-item").forEach(current=>{
    current.addEventListener("click",()=>(chgcate(current)))
})

fadeinanime=(element)=>{
    element.style.opacity="0";
    element.style.display="";
    setTimeout(() => {
        element.style.transition="all 0.5s";
        element.style.opacity="1";
    }, 10);
}

fadeoutanime=(element)=>{
    element.style.transition="all 0.5s";
    element.style.opacity="0";
    setTimeout(() => {
        element.style.display="none";
    }, 1000);
}

loadNews=(category,start,num)=>{
    token=""
    if(userdata!=null){
        token=userdata.token
    }
    (function (){
        if( category.search("tag_")==0){
            return getData("/news/tag?tag="+category.substr(4)+"&start="+start+"&num="+num+"&token="+token)
        }else if(category=="search"){
            return getData("/news/search?s="+encodeURIComponent($(".search-input").value)+"&start="+start+"&num="+num+"&token="+token)
        }
        else{
            return getData("/news/index?category="+category+"&start="+start+"&num="+num+"&token="+token)
        }
    })()
    .then(res=>{
        if(res.status==401){
            alert("请先登录");
        }
        else if(res.status==400){
            alert(res.data.detail);
        }
            else if(res.status==200){
            res.data.forEach(each => {
                //return id,title,time,category,summary,img,author,hit
                if(!each.img){
                    var newdiv= $(".no-mode").cloneNode(true);
                    
                }
                else{
                    var newdiv= $(".ugc-mode").cloneNode(true);
                    newdiv.querySelector(".img-wrap img").src=each.img;
                    newdiv.querySelector(".ugc-mode-content").innerHTML=each.summary;
                }
                newdiv.setAttribute("onclick","loadArticle("+each.id+")");
                newdiv.querySelector(".title-box").innerHTML=each.title;
                newdiv.querySelector(".source").innerHTML="&nbsp;"+each.author+"&nbsp;⋅";
                newdiv.querySelector(".time").innerHTML="&nbsp;⋅&nbsp;"+each.time;
                newdiv.querySelector(".tag").innerHTML=each.category;
                newdiv.querySelector(".hit").innerHTML="&nbsp;阅读&nbsp;"+each.hit;
                // document.insertBefore(newdiv,$("#insertme"))
                $(".feed-list").insertBefore(newdiv,$("#insertme"));
                fadeinanime(newdiv);
                
            })
            newsposition+=num
        }
        else{
            alert("未知错误");
        }
    })
}

//获取容器父元素

loadLikes=(label,num)=>{

}


loadArticle=(nid)=>{
    token=""
    if(userdata!=null){
        token=userdata.token
    }
    getData("/news/article?id="+nid+"&token="+token)
    .then(res=>{
        if(res.status==400){
            alert(res.data.detail);
        }
        else if(res.status==401){
            alert("登录失效，请重新登录");
        }
        else if(res.status==200){
            $(".popbox h1").innerHTML=res.data.title;
            $(".popbox center").innerHTML=res.data.author+"&nbsp;⋅&nbsp;"+res.data.time+"&nbsp;⋅&nbsp;热度 "+res.data.hit
            $("#article").innerHTML=res.data.context;
            fadeinanime($("#popup"))
        }
        else{
            alert("未知错误")
        }
    })
}

$("#close").addEventListener("click",()=>{
    fadeoutanime($("#popup"));
})

$(".search-btn").addEventListener("click",()=>{
    $("a[name=search]").click()
    loadNews("search",0,20);
})
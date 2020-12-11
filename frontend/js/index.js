$=function(data){return document.querySelector(data);};
loading=false
newsposition=0
window.onload=function(){
    var dp1=datepicker();
    dp1.init("#filter-end-date");
    var dp2=datepicker();
    dp2.init("#filter-begin-date");

    cookielogin();
    
    // console.log(height,"feed的计算高度")
    $(".feed-list").onscroll = function(){
        pos=$(".feed-list").scrollTop+$(".feed-list").offsetHeight-$(".feed-list").scrollHeight
        // console.log(pos)
        if(pos<=5 && pos>=-5 && !loading){
            
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
    for (each of $("#usercenter-container").querySelectorAll("input")){
        each.value=""
    }
}

setStyle=(elements,style,valueList)=>{
    if(typeof(valueList)=="string"){
        for(i=0;i<elements.length;i++){
            elements[i].style[style]=valueList
        }
    }
    else{
        for(i=0;i<elements.length;i++){
            elements[i].style[style]=valueList[i]
        }
    }
}

userdata=null;

var lastswitcher=null;

panelswitcher=function(type){
    var displayparams=[["none","none","none","",""],["","","","none","none"]];
    setStyle([$("#chgpwd-sector"),$("#avator-sector"),$("#chgfavor-sector"),$("#login-sector")],"display",displayparams[Number(type>1)])
    $("#register-sector").style.display=displayparams[Number(type>1)][4];
    var elements=[$("#nickname"),$("#repasswd"),$("#pwdopt"),$("#email"),$("#password"),$("#uploadAvator"),$("#tagSetter")];
    switch(type){
        case 0:
            loginpanelanime(1,function(){
                $("#login-sector").style.color="red";
                $("#register-sector").style.color="";
                $("#opbtn").innerHTML="登录";
                $("form").setAttribute("action","javascript:op(0)");
                setStyle(elements,"display",["none","none","block","","","none","none"])
            })
            break;
        case 1:
            loginpanelanime(0,function(){
                $("#register-sector").style.color="red";
                $("#login-sector").style.color="";
                $("#opbtn").innerHTML="注册";
                $("form").setAttribute("action","javascript:op(1)");
                setStyle(elements,"display",["block","block","none","","","none","none"]);
            })
            break;
        case 2:
            loginpanelanime(1,function(){
                $("#chgpwd-sector").style.color="red";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="修改密码";
                $("form").setAttribute("action","javascript:op(2)");
                $("#chgfavor-sector").style.color="";
                setStyle(elements,"display",["none","","none","none","","none","none"]);
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
                $("#uploadAvator").style.backgroundImage="url("+userdata.avator+")";
                setStyle(elements,"display",["none","none","none","none","none","","none"]);
            });
            break;
        case 4:
            loginpanelanime(0,function(){
                $("#chgpwd-sector").style.color="";
                $("#avator-sector").style.color="";
                $("#opbtn").innerHTML="保存修改";
                $("form").setAttribute("action","javascript:op(4)");
                $("#chgfavor-sector").style.color="red";
                $("input[name=tagedit]").value=userdata.tags;
                gentagview();
                
                setStyle(elements,"display",["none","none","none","none","none","none",""]);
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
        case 4:chgtag();break;
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


inputnormalize=function(objt){
    // console.log(objt);
    objt.style.background="";
    objt.className="";
    objt.setAttribute("placeholder",objt.getAttribute("defaultplaceholder"))
}

function inputERRORout(element,message){
    element.style.marginBottom="0";
    if($("#repwderr")==null){
    var err=document.createElement("div");
    err.id="repwderr";
    err.style=" color: red;height:20px;";
    err.innerHTML=message;
    element.parentNode.parentNode.insertBefore(err,element.parentNode.nextElementSibling);
    }
}
function outERRORremove(){
    
    if($("#repwderr")!=null){
        $("#repwderr").previousElementSibling.querySelector("input").style.marginBottom="20px";
        $("#repwderr").remove();}
}

repwdchg=function(){
    if ($("input[name='repasswd']").value!=$("input[name='password']").value && $("input[name='repasswd']").value!=""){
        inputERRORout($("input[name=repasswd]"),"密码不一致");
    }
    else{
        outERRORremove();
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
        category=decodeURI(window.location.hash.substr(1));
        chgcate($("a[name="+(category?category:"suggest")+"]"));
        return
    }
    cookie=document.cookie.substring(document.cookie.indexOf("token")+6);
    cookie=cookie.substring(0,cookie.indexOf(";")==-1?cookie.length:cookie.indexOf(";"));
    auth(cookie,function(data){ userdata=data;userSetup();loginanime();});
}

loadtags=()=>{
    if(userdata.tags){
        userdata.tags.split(",").forEach(element => {
            var newli=$('li').cloneNode(true);
            newli.querySelector("a").name="tag_"+element;
            newli.querySelector("a").classList.add("tags");
            newli.querySelector("a").setAttribute("href","#tag_"+element);
            newli.querySelector("a").innerHTML=element;
            newli.querySelector("a").addEventListener("click",()=>(chgcate(newli.querySelector("a"))));
            newli.querySelector("a").className="channel-item tags";
            $(".channel ul").insertBefore(newli,$(".channel-more"));
            $(".channel-more").style.display="None";
        });
    }
    else{
        $(".channel-more").setAttribute("onclick","paneopen(4)");
    }
}

userSetup=function(){
    $("#user-avator").setAttribute("src",userdata.avator);
    $("input[name=tagedit]").value=userdata.tags;
    loadtags();
    category=decodeURI(window.location.hash.substr(1));
    chgcate($("a[name="+(category?category:"suggest")+"]"));
}

loginanime=function(){
    elements=[$("#login-button"),$("#register-button"),$("#user-avator"),$("#usercenter-button"), $("#logout-button")]
    setStyle(elements,"transition","all 0.5s");
    $("#login-button").style.transform="translate(-200px,0px)";
    $("#register-button").style.transform="translate(-200px,0px)";
    $("#user-avator").style.transform="translate(-200px,0px)";
    setStyle(elements,"opacity",["0","0","1","0","0"]);
    setTimeout(() => {
        setStyle(elements,"display",["none","none","1","",""])
        $("#usercenter-button").style.transform="translate(200px,0px)";
        $("#logout-button").style.transform="translate(200px,0px)";
        $("#user-avator").style.transform="";
        $("#user-avator").style.transition="";
        setTimeout(() => {
            $("#usercenter-button").style.transform="translate(0px,0px)";
            $("#logout-button").style.transform="translate(0px,0px)";
            setStyle(elements,"opacity",["0","0","1","1","1"])
        }, 10);

    }, 500);
}

function inputERRORin(element,message){
    element.value="";
    element.setAttribute("placeholder",message);
    element.style.background="#ffd1d1";
    element.className="inputerr";
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
            userSetup();
            loginanime();
        }
        else{
            logout();
            if(res.data["detail"].search("User")>-1){
                inputERRORin($("input[name='email']"),"用户不存在");
            }
            else if(res.data["detail"].search("Password")>-1){
                inputERRORin($("input[name='password']"),"密码错误");
            }
            else{
                alert(res.data.detail);
            }
        }
    })(res)) // JSON from `response.json()` call
    
}

removetags=()=>{
    document.querySelectorAll(".tags").forEach(element=>{
        element.remove();
    })
}

logout=function(){
    document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    elements=[$("#login-button"),$("#register-button"),$("#user-avator"),$("#usercenter-button"), $("#logout-button")]
    if (userdata!=null){
        userdata=null;
        setStyle(elements,"opacity",["1","1","1","0","0"])
        setStyle(elements,"transtition","all 0.5s");
        $("#usercenter-button").style.transform="translate(200px,0px)";
        $("#logout-button").style.transform="translate(200px,0px)";
        $("#user-avator").style.transform="translate(200px,0px)";
        $("#user-avator").setAttribute("src","/image/user.svg");
        setTimeout(() => {
            removetags();
            $(".channel-more").setAttribute("onclick","paneopen(0)");
            setStyle(elements,"display",["","","","none","none"]);
            $(".channel-more").style.display="";
            $("#login-button").style.transform="translate(-200px,0px)";
            $("#register-button").style.transform="translate(-200px,0px)";
            $("#user-avator").style.transform="";
            $("#user-avator").style.transition="";
            setTimeout(() => {
                setStyle(elements,"opacity",["1","1","1","0","0"]);
                $("#login-button").style.transform="translate(0px,0px)";
                $("#register-button").style.transform="translate(0px,0px)";
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
                inputERRORin($("input[name='email']"),"用户已存在");
            }
            else if(res.data["detail"].search("password")>-1){
                inputERRORin($("input[name='repasswd']"),"密码不一致");
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

chgtag=()=>{
    if(userdata==null){
        alert("请先登录");
        paneclose();
        logout();
        return
    }
    postData('/user/chgtag?token='+userdata["token"], JSON.stringify({tags:$("input[name=tagedit]").value}),{'content-type': 'application/json'})
    .then(res=>{
        if(res.status==401){
            alert("请先登录");
            paneclose();
            logout();
        }
        else if(res.status==400){
            if(res.data.detail.search("Too many")!=-1){
                inputERRORout($("input[name=tagedit]"),"最多只能订阅10个标签哦")
            }
            else{
                alert(res.data.detail);
            }
        }
        else if(res.status==200){
            userdata.tags=$("input[name=tagedit]").value
            inputERRORout($("input[name=tagedit]"),"更新成功");
            removetags();
            loadtags();
            setTimeout(() => {
                outERRORremove();
            }, 5000);
        }
        else{
            alert("未知错误");
        }
    })


}
 
chgcate=(current)=>{
    if($(".channel-item.active")){
        $(".channel-item.active").classList.remove("active");
    }
    if(!current){
        $("#insertme").innerHTML="未找到相关内容，您可能无权访问";
        return
    }
    current.classList.add("active");
    newsposition=0;
    loading=false;
    $(".feed-list").innerHTML=" <div id=\"insertme\" >正在加载</div>";
    if(current.id=="search-tab"){
        current.style.height="";
        $("#insertme").innerHTML="(￣△￣；)";
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
    fetchcount=0;
    token=""
    if(userdata!=null){
        token=userdata.token
    }
    if(loading){return -1};
    loading=true;
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
            newsposition+=res.data.length;
            fetchcount=res.data.length;
            if(fetchcount<num){
                $("#insertme").innerHTML="(╯‵□′)╯︵┻━┻已经到底啦！";
            }
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
            
            loading=false;
        }
        else{
            alert("未知错误");
        }
    })
    return fetchcount;
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
            fadeinanime($("#popup"));
            $(".popbox").scrollTop=0;
            // pushState
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
    $("#insertme").innerHTML="加载更多";
    if(loadNews("search",0,20)<=0){
        $("#insertme").innerHTML="未找到相关结果";
    };
})

function gentagview(){
    $("#tagbox").innerHTML="";
    $("input[name=tagedit]").value=$("input[name=tagedit]").value.replaceAll("，",",");
    taglist=$("input[name=tagedit]").value.split(",")
    if(taglist.length>10){
        inputERRORout($("input[name=tagedit]"),"最多订阅10个标签哦")
    }
    else{
        outERRORremove();
        taglist.forEach(
            value=>{
                var adder=document.createElement("span");
                adder.className="tag";
                adder.innerHTML=value;
                $("#tagbox").appendChild(adder);
            })
    };
}
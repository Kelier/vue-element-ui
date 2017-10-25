localStorage.removeItem("isP");
var ckPwd_status=false;
var cfPwd_status=false;
var oldPwd_status=false;
//监听密码输入格式是否正确
function checkPwd() {
    var newPwd = $("#new-pwd").val();
    console.log("------------"+newPwd);
    //校验6~16位数字或字母；
    var reg = /^[A-Za-z0-9]{6,16}$/;

    if(reg.exec(newPwd)){
        ckPwd_status=true;
        $("#new-pwd-ok").css("display","inline-block");
        $("#new-pwd").css("border","1px solid #a0a0a0");
        $("#new-pwd-tip").hide();
    }else {
        cfPwd_status=false;
        $("#new-pwd-ok").css("display","none");
        $("#new-pwd").css("border","1px solid #FF4646");
        $("#new-pwd-tip").css("color","#FF4646");
        $("#new-pwd-tip").show();
    }
}

//监听两次密码是否输入一致
function confirmPwd() {
    var newPwd = $("#new-pwd").val();
    var cfPwd  = $("#confirm-pwd").val();
    console.log(cfPwd+"------------"+newPwd);
    //校验6~16位数字或字母；

    if(newPwd==cfPwd&&newPwd!=""){
        cfPwd_status=true;
        $("#cf-pwd-ok").css("display","inline-block");
        $("#confirm-pwd").css("border","1px solid #a0a0a0");
        $("#cf-pwd-tip").hide();
    }else {
        cfPwd_status=false;
        $("#cf-pwd-ok").css("display","none");
        $("#confirm-pwd").css("border","1px solid #FF4646");
        $("#cf-pwd-tip").css("color","#FF4646");
        $("#cf-pwd-tip").show();
    }
}

//判断旧密码是否正确
function checkOldPwd() {
    console.log($("#old-pwd").val());
    $.ajax({
        url: globalurl + 'login/0',
        method: 'post',
        data: {
            username: sessionStorage.getItem("stucode"),
            password: $("#old-pwd").val()
        },
        success: function (res) {
            if(res.success){
                oldPwd_status=true;
                $("#old-pwd-ok").css("display","inline-block");
                $("#old-pwd").css("border","1px solid #a0a0a0");
                $("#old-pwd-tip").hide();
            }else {
                oldPwd_status=false;
                $("#old-pwd-ok").css("display","none");
                $("#old-pwd").css("border","1px solid #FF4646");
                $("#old-pwd-tip").css("color","#FF4646");
                $("#old-pwd-tip").html("所输入的密码与当前用户不匹配");
                $("#old-pwd-tip").show();
            }
        },
        error: function (err) {
            toastr.warning('网络请求失败！')
            console.log(err);
        }
    });
}

//修改密码
function savePwd() {
    confirmPwd();
    checkPwd();
    if(!oldPwd_status){
        $("#old-pwd-ok").css("display","none");
        $("#old-pwd").css("border","1px solid #FF4646");
        $("#old-pwd-tip").css("color","#FF4646");
        $("#old-pwd-tip").html("请输入当前用户的登录密码");
        $("#old-pwd-tip").show();
    }
    console.log(cfPwd_status+"--"+ckPwd_status+"---"+oldPwd_status);
    if(!cfPwd_status||!ckPwd_status||!oldPwd_status){
        return;
    }
    $('body').loading({
        loadingWidth: 240,
        title: '修改密码中...',
        name: 'test',
        discription: '正在修改密码...',
        direction: 'row',
        type: 'origin',
        originBg: '#BF5A1F',
        originDivWidth: 30,
        originDivHeight: 30,
        originWidth: 4,
        originHeight: 4,
        smallLoading: false,
        titleColor: '#BF5A1F',
        loadingBg: '#2B2B2B',
        loadingMaskBg: 'rgba(0,0,0,0.6)'
    });
    $.ajax({
        url: globalurl + 'user/changePassword',
        method: 'post',
        data: {
            loginName: sessionStorage.getItem("stucode"),
            password: $("#new-pwd").val(),
            oldPassword: $("#old-pwd").val()
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        success: function (res) {
            if(res.success){
                $("#modify-success").css("display","inline-block");
                $(".mp-item").hide();
            }else {
                toastr.warning('修改密码失败:'+res.message);
            }
        },
        error: function (err) {
            toastr.warning('网络请求失败！')
            console.log(err);
        }
    });
}
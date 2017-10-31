/**
 * Created by John Yan on 8/7/2017.
 */
function loginIndex() {
    $('body').loading({
        loadingWidth: 240,
        title: '登录验证中...',
        name: 'login',
        discription: '这是一个登录请求提示...',
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
        url: globalurl + 'login/0',
        method: 'post',
        data: {
            username: $("#number").val(),
            password: $("#password").val()
        },
        success: function (res) {
            removeLoading('login');
            if (res.success) {
                var token = res.result.token;
                var realtoken = 'Bearer ' + token;
                if (res.result.roleCode == "1001") {
                    toastr.warning('您的用户名或密码不正确');
                    return;
                }
                sessionStorage.setItem("token", realtoken);
                sessionStorage.setItem("username", res.result.name);
                sessionStorage.setItem("role", res.result.roleCode);
                sessionStorage.setItem("avatar", res.result.headPic);
                sessionStorage.setItem("stucode", $("#number").val());
                localStorage.removeItem("chestatus");

                  window.location.href = 'index.html';
            } else {
                toastr.warning('您的用户名或密码不正确')
            }
        },
        error: function (err) {
            removeLoading('login');
            toastr.error('网络请求失败');
            console.log(err);
        }
    });
}

function keyLogin() {
    if (event.keyCode==13){
        loginIndex();
    }
}
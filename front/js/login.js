/**
 * Created by John Yan on 8/7/2017.
 */
function loginIndex() {

    $.ajax({
        url: globalurl + 'login/0',
        method: 'post',
        data: {
            username: $("#number").val(),
            password: $("#password").val()
        },
        success: function (res) {
            var token = res.result.token;
            var realtoken = 'Bearer ' + token;
            if (res.success) {
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
            console.log(err);
        }
    });
}
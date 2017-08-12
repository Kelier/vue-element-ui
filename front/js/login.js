/**
 * Created by John Yan on 8/7/2017.
 */
function loginIndex() {
    req(globalurl + 'login/0','post',{
        username: $("#number").val(),
        password: $("#password").val()
    },function (data) {
        if(data.success){
            //token串
            var token=data.result.token;
            var realtoken='Bearer '+token;
            $.ajax({
                url: globalurl + 'user/success',
                method: 'get',
                beforeSend: function (res) {
                    res.setRequestHeader("Authorization", realtoken);
                },
                success:function (res) {
                    if(res.success){
                        sessionStorage.setItem("token",realtoken);
                        sessionStorage.setItem("username",data.result.userId);
                        sessionStorage.setItem("role",data.result.roleCode);
                        window.location.href="index.html";
                    }
                    else
                        window.location.href="login.html";
                },
                error:function (err) {
                    console.log(err);
                }
            });
        }
    });


}
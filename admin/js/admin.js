//程序的入口
var sessionUser = sessionStorage.getItem("user");
var token=sessionStorage.getItem("token");

var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            username: '用户名'
        }
    },
    created: function () {
        console.log(token);
        if (sessionUser != null) {
            console.log(sessionUser);
            this.username = sessionUser;
        }else{
            // window.location.href="login.html";
        }

    },
    methods: {
        logout(){
            var that=this;
            this.$confirm('确定要退出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sessionStorage.removeItem("token");

                window.location.href = "login.html";
            }).catch((err) => {
                that.$notify({
                    title: '提示信息',
                    message: err.message,
                    type: type
                });
            });

        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        doThis(e) {
            var flag = $(e).attr('index');
            $.ajaxSetup({
                cache: false
            });
            var address=['1-1','1-2','1-3','2-1','2-2','2-3','3-1','3-2','3-3'];
            var routes=['term.html','course.html','launch.html'
                ,'teaManage.html','stuManage.html','classManage.html',
                'groomLau.html','',''];
            var path;
            for(var i=0;i<address.length;i++){
                if(flag==address[i]){
                    path=routes[i];
                }
            }

            $.ajax({
                url: path,
                async: false,
                success:function(res){
                    $("#page").html(res.toLocaleString());
                },
                err:function (err) {
                    console.log(err)
                }
            });

        }
    }
});


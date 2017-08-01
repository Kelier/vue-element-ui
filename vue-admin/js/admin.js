var sessionUser=sessionStorage.getItem("user");

//程序的入口
var vue=new Vue({
        el: '#app',
        data:function () {
            return{
                username:'用户名'
            }
        },
        methods: {
            logout(){

                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem("token");

                    window.location.href="login.html";
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });

            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            doThis(e, data) {
                let flag = $(e).attr('index');
                $.ajaxSetup({
                    cache: false
                });
                let address;
                switch (flag) {
                    case '1-1':
                        address = "term.html";
                        break;
                    case '1-2':
                        address = "course.html";
                        break;
                    case '1-3':
                        address = "launch.html";
                        break;
                    case '2-1':
                        address = "teaManage.html";
                        break;
                    case '2-2':
                        address = "stuManage.html";
                        break;
                    case '2-3':
                        address = "classManage.html";
                        break;
                    case '2-4':
                        address = "roleManage.html";
                        break;
                    default:
                        address = "404.html";
                }
                $("#page").load(address, function(result,status) {
//                    alert(status);
                    //将被加载页的JavaScript加载到本页执行
                    $("#page").html(result);
                });
            }
        }
    });
// console.log(sessionUser);
if(sessionUser)
vue.username=sessionUser;
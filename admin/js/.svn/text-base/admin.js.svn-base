//程序的入口
var sessionUser = sessionStorage.getItem("user");
var token = sessionStorage.getItem("token");
if(token==null){
    window.location.href="login.html";
}
var vue = new Vue({
    el: '#app',
    data: function () {
        var oldpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            } else {

                callback();
            }
        };
        var newpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if(value.length<6||value.length>16){
                    callback(new Error('密码请设置在6-16位'));
                }
                else{
                    this.$refs.passView.validateField('checkpass');
                }
                callback();
            }
        };
        var checkpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passView.newpass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            username: '用户名',
            changePassView: false,
            formLabelWidth: '80px',

            passView: {
                oldpass: '',
                newpass:'',
                checkpass:''
            },
            passrule: {
                oldpass: [
                    {validator: oldpass, trigger: 'blur'}
                ],
                newpass: [
                    {validator: newpass, trigger: 'blur'}
                ],
                checkpass: [
                    {validator: checkpass, trigger: 'blur'}
                ]
            }

        }
    },
    created: function () {
        console.log(token);
        if (sessionUser != null) {
            console.log(sessionUser);
            this.username = sessionUser;
        } else {
            // window.location.href="login.html";
        }

    },
    mounted: function () {
        $("#app").fadeIn();
    },
    methods: {
        logout(){
            var that = this;
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
            var address = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3'];
            var routes = ['term.html', 'course.html', 'launch.html', 'checkCourse.html'
                , 'teaManage.html', 'stuManage.html', 'classManage.html',
                'groomLau.html', 'newsTwitter.html', 'banner.html'];
            var path;
            for (var i = 0; i < address.length; i++) {
                if (flag == address[i]) {
                    path = routes[i];
                }
            }

            $.ajax({
                url: path,
                async: false,
                success: function (res) {
                    $("#page").hide();
                    $("#page").html(res.toLocaleString());
                    $("#page").fadeIn();
                },
                err: function (err) {
                    console.log(err)
                }
            });

        },
        bringPass(formName){
            console.log(formName)
            var that=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    that.changePassView = false;
                    let _formData = new FormData();
                    _formData.append('loginName', that.username);
                    _formData.append('password', that.passView.newpass);
                    _formData.append('oldPassword', that.passView.oldpass);
                    axios.post(globalurl + 'user/changePassword', _formData)
                        .then(function (response) {
                            // alert(JSON.stringify(response));
                            var type = response.data.success;
                            var message = response.data.message;
                            type = eduUtil.tip_custom(type);

                            if(type){

                                that.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: type
                                });
                                setTimeout(function () {
                                    sessionStorage.clear();
                                    window.location.href="login.html";
                                },1000);
                            }else{
                                that.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: type
                                });
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
});


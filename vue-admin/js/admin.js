//程序的入口
new Vue({
        el: '#app',

        methods: {
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
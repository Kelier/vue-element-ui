/**
 * Created by John Yan on 8/17/2017.
 */
$(function () {
    readyCheck();
});
function readyCheck(){
    /*判断token*/
    if (sessionStorage.getItem("token") != null) {
        $("#username").html(sessionStorage.getItem("username"));

        $("#avatar").attr("src", imagepath + sessionStorage.getItem("avatar"));
        var roleCode = sessionStorage.getItem("role");
        if (roleCode == '1002') {
            $("#role").html('我的教学');
            $("#lay-name").show();
        }
        else if (roleCode == '1003') {
            $("#role").html('我的课程');
            $("#lay-name").show();
        }
        $("#lay-role").show();
        $("#lay-hoggle").hide();

    }

    if (sessionStorage.getItem("token") == null) {

        $("#role").html('登录/注册');
        $("#lay-name").hide();
        $("#lay-role").show();
        $("#lay-hoggle").hide();
    }

}
function ToCoursePage() {
    //去课程页
    if ($("#role").html() == '我的教学') {
        window.location.href = 'teaClass.html';
    }
    if ($("#role").html() == '我的课程') {
        window.location.href = 'stuClass.html';
    }
    if ($("#role").html() == '登录/注册') {
        window.location.href = 'login.html';
    }
}

function exitCurrent() {
    $("#username").html(sessionStorage.clear());
    window.location.href = 'index.html';
}


function TabSwitch(obj) {
    $(obj).parent("div").children("div").each(function () {
        $(this).removeClass("is-selected");
    });
    $(obj).addClass("is-selected");
}
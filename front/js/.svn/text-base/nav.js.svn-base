/**
 * Created by John Yan on 7/27/2017.
 */
//加载foundation

$(function () {
    $(document).foundation();
    readyCheck();
});

function readyCheck() {
    /*判断token*/
    if (localStorage.getItem("token") != null) {
        $("#username").html(localStorage.getItem("username"));

        $("#avatar").attr("src", imagepath + localStorage.getItem("avatar"));
        var roleCode = localStorage.getItem("role");
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

    if (localStorage.getItem("role") == null) {

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
    $("#username").html(localStorage.clear());
    window.location.href = 'index.html';
}


function TabSwitch(obj) {
    $(obj).parent("div").children("div").each(function () {
        $(this).removeClass("is-selected");
    });
    $(obj).addClass("is-selected");
}



    /*
     * 我的设置悬浮
     * */
    function show_li() {
        $("#ul-my").css("display", "inline-block");
    }

    function hide_li() {
        $("#ul-my").css("display", "none");
    }

/**
 * 添加监听搜索
 */
// document.getElementById("search_course").addEventListener('click',function () {
//     var searchArea=document.getElementsByClassName("select-middle")[0].value;
//     req(globalurl + 'BLesson/queryBLessonsByPagination', 'post', {
//         page: 1,
//         rows: 99999,
//         lessonName:searchArea,
//         sort:'create_date desc'
//     },res=>{
//         console.log(res)
//     },err=>{
//        
//     });
// })


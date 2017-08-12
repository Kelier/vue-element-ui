/**
 * Created by John Yan on 7/27/2017.
 */



$(function () {
    /*判断token*/
    if (sessionStorage.getItem("token") != null) {
        $("#username").html(sessionStorage.getItem("username"));
        var roleCode = sessionStorage.getItem("role");
        if (roleCode == '1002' || roleCode == '1001') {
            $("#role").html('我的教学');
        }
        if (roleCode == '1003') {
            $("#role").html('我的课程');
        }
        $("#lay-name").show();
        $("#lay-role").show();
        $("#lay-hoggle").hide();
    }


//获取首页数据

    /*获取轮播图*/
    req(globalurl + 'BCarousel/queryBCarouselsByPaginationWithoutAuth', 'post', {
        page: 1,
        rows: 3
    }, function (res) {
        var banner = [];
        // console.log(JSON.stringify(result));
        var realpath, alt;
        for (var i = 0; i < res.rows.length; i++) {
            realpath = imagepath + res.rows[i].carouselUrl;
            alt = res.rows[i].carouselDes;
            banner.push({'img': realpath, 'alt': alt});
        }

        $("#silder").silder({
            data: banner,
            sideCtrl: true//是否需要侧边控制按钮
        });
    });


    /*获取精品课程*/
    req(globalurl + 'BSl/queryBSlWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 4
    }, function (res) {
        var courseRow = $("div").children("#course-twit").children().children();
        var copan = [];

        var panel = ["copan-1","copan-2","copan-3","copan-4"];
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows[i].slCoverUrl != null) {
                courseRow.eq(i).children().children().eq(0)[0].src = imagepath + res.rows[i].slCoverUrl;
            }
            courseRow.eq(i).children().children().eq(1).children()[0].innerHTML = res.rows[i].lessonCode;
            courseRow.eq(i).children().children().eq(1).children()[1].innerHTML = res.rows[i].lessonName;
            copan.push(res.rows[i].businessId);
        }
        // alert(copan[0]);
        for(var k=0;k<res.rows.length;k++){
            var temp=copan[k];
            $('#'+panel[k]).on('click', () => {
                window.location.href = 'stuCourse.html?id='+temp;
            });
        }

    });
    /*获取明星教师*/
    req(globalurl + 'BTeacher/queryTeacherWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 3
    }, function (res) {
        var courseRow = $("div").children("#tea-pro").children().children();
        var courseLen = courseRow.length;
        // console.log(result.rows)
        for (var i = 0; i < courseLen; i++) {
            if (res.rows[i].slCoverUrl != null) {
                courseRow.eq(i).children().children().eq(0)[0].src = imagepath + res.rows[i].slCoverUrl;
            }
            courseRow.eq(i).children().children().eq(1).children()[0].innerHTML = res.rows[i].code;
            courseRow.eq(i).children().children().eq(1).children()[1].innerHTML = res.rows[i].name;

        }
    });


    /*获取推荐学生*/
    req(globalurl + 'BStudent/queryStudentWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 6
    }, function (res) {
        var courseRow = $("div").children("#stu-pro").children();
        var courseLen = courseRow.length;
        // console.log(courseRow.eq(1).children().eq(1)[0].innerHTML)
        for (var i = 1, j = 0; i < courseLen && j < res.rows.length; i++) {
            if (res.rows[i].slCoverUrl != null) {
                courseRow.eq(i).children().eq(0).children()[0].src = imagepath + res.rows[j].slCoverUrl;
                courseRow.eq(i).children().eq(2).children()[0].src = imagepath + res.rows[j + 1].slCoverUrl;
            }
            courseRow.eq(i).children().eq(1)[0].innerHTML = res.rows[j].name;
            courseRow.eq(i).children().eq(3)[0].innerHTML = res.rows[j + 1].name;
            j = j + 2;

        }
    });

    /*$.ajax({
     url: globalurl + 'BStudent/queryStudentWithRecommendWithoutAuth',
     method: 'post',
     data: {
     page: 1,
     rows: 6
     },

     success: (result) => {
     // console.log(JSON.stringify(result));

     var courseRow = $("div").children("#stu-pro").children();
     var courseLen = courseRow.length;
     // console.log(courseRow.eq(1).children().eq(1)[0].innerHTML)
     for (var i = 1, j = 0; i < courseLen && j < result.rows.length; i++) {
     if (result.rows[i].slCoverUrl != null) {
     courseRow.eq(i).children().eq(0).children()[0].src = imagepath + result.rows[j].slCoverUrl;
     courseRow.eq(i).children().eq(2).children()[0].src = imagepath + result.rows[j + 1].slCoverUrl;
     }
     courseRow.eq(i).children().eq(1)[0].innerHTML = result.rows[j].name;
     courseRow.eq(i).children().eq(3)[0].innerHTML = result.rows[j + 1].name;
     j = j + 2;

     }
     },
     error: (err) => {
     console.log(err);
     }
     });*/


    /*获取头条新闻*/
    req(globalurl + 'url', 'post', {
        page: 1,
        rows: 6
    }, function (res) {

    });
});

function exitCurrent() {
    $("#username").html(sessionStorage.removeItem("token"));
    window.location.href = 'index.html';
}
function ToCoursePage() {
    //去课程页
    if ($("#role").html() == '我的教学') {
        window.location.href = 'teaClass.html';
    }
    if ($("#role").html() == '我的课程') {
        window.location.href = 'stuClass.html';
    }
}

function ToTabPage() {
    window.location.href = 'login.html';
}
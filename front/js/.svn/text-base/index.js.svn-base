/**
 * Created by John Yan on 7/27/2017.
 */


$(function () {

    localStorage.removeItem("isP");

    /***获取首页数据***/

    /*获取轮播图*/
    req(globalurl + 'BCarousel/queryBCarouselsByPaginationWithoutAuth', 'post', {
        page: 1,
        rows: 3,
        imageId: 'c148428a53fd4a6c9109cec14c8d8d4c',
        sort: 'carousel_sort',
        isOpen:'1'
    }, function (res) {
        var banner = [];
        // console.log(JSON.stringify(result));
        var realpath, alt;
        if (res.rows.length < 1) {
            realpath = imagepath + default_carousel_location;
            alt = "敬请期待";
            banner.push({'img': realpath, 'alt': alt,'title':alt});

        } else {
            for (var i = 0; i < res.rows.length; i++) {
                var path=res.rows[i].carouselUrl||default_carousel_location;
                realpath = imagepath + path;
                alt = res.rows[i].carouselDes;
                banner.push({'img': realpath, 'alt': alt,'title':alt});
            }

        }
        // console.log(JSON.stringify(banner))

        $("#silder").silder({
            data: banner,
            sideCtrl: true//是否需要侧边控制按钮
        });

        

        for(var i=0;i<res.rows.length;i++){
            $("#bantop"+i).attr("data-op",res.rows[i].isNewWindow);
            $("#bantop"+i).on('click',{toc:i},function (e) {
                var i=e.data.toc
                var banid='#'+$(this).attr("id");
               if($(banid).attr("data-op")=='1'){
                   window.open(res.rows[$(this).attr("id").match(/\d+/g)].linkUrl)
               }
                if($(banid).attr("data-op")=='0'){
                    window.location.href=res.rows[i].linkUrl;
                }
            });
        }


    });



    /*获取精品课程*/
    req(globalurl + 'BSl/queryBSlWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 4
    }, function (res) {
        var courseRow = $("div").children("#course-twit").children().children();
        var copan = [];
        // console.log(courseRow.eq(i).children().children())
        var panel = ["copan-1", "copan-2", "copan-3", "copan-4"];
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows[i].slCoverUrl != null) {
                courseRow.eq(i).children().children().children().eq(0)[0].src = imagepath + res.rows[i].slCoverUrl;
                courseRow.eq(i).children().children().children().eq(1)[0].innerHTML = res.rows[i].studyNum+"人在学";
            } else {
                console.log(i)
                courseRow.eq(i).children().children().children().eq(0)[0].src = imagepath + default_course_location;

            }
            var id = res.rows[i].businessId;
            $(courseRow.eq(i).children().eq(0)).attr('onclick', 'stuCourse("' + id + '")');
            courseRow.eq(i).children().children().eq(1).children()[0].innerHTML = res.rows[i].code;
            courseRow.eq(i).children().children().eq(1).children()[1].innerHTML = res.rows[i].lessonName;
            copan.push(res.rows[i].businessId);
        }

        for (var i = res.rows.length; i < courseRow.length; i++) {
            courseRow.eq(i).children().children().children().eq(0)[0].src = imagepath + default_course_location;
            // courseRow.eq(i).children().children().eq(1).children().removeChild(courseRow.eq(i).children().children().eq(1).children()[1]);
            var node=document.createElement('h5');
            $(courseRow.eq(i).children().children().eq(1)).append(node);
            courseRow.eq(i).children().children().eq(1).children()[2].innerHTML = "敬请期待";
            $(courseRow.eq(i).children().children().eq(1).children()[2]).css('cursor', 'default');
            $(courseRow.eq(i).children().children().eq(1).children()[2]).css('line-height', '2');
            $(courseRow.eq(i).children().children().eq(1).children()[2]).css('text-align', 'center');
            $(courseRow.eq(i).children()).attr('onclick', '#');
            $("#copan-"+(i+1)).children().find('.resizetxt')[0].remove()
        }

    });

    /*获取明星教师*/
    req(globalurl + 'BTeacher/queryTeacherWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 3
    }, function (res) {
        var courseRow = $("div").children("#tea-pro").children().children();
        var courseLen = courseRow.length;
        //  console.log(res.rows)
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows[i].headPic != null) {
                courseRow.eq(i).children().children().eq(0)[0].src = imagepath + res.rows[i].headPic;
            } else {
                courseRow.eq(i).children().children().eq(0)[0].src = imagepath + default_teacher_location;
            }
            courseRow.eq(i).children().children().eq(1).children()[0].innerHTML = res.rows[i].name;
            courseRow.eq(i).children().children().eq(1).children()[1].innerHTML = res.rows[i].recommendCourse;
            $(courseRow.eq(i).children().children().eq(1).children()).attr("title",res.rows[i].recommendCourse);

        }
        for (var i = res.rows.length; i < courseLen; i++) {
            courseRow.eq(i).children().children().eq(0)[0].src = imagepath + default_teacher_location;
            courseRow.eq(i).children().children().eq(1).children()[0].innerHTML = "XXX";
            courseRow.eq(i).children().children().eq(1).children()[1].innerHTML = "敬请期待";
            $(courseRow.eq(i).children().children()).css('cursor', 'default');
        }
    });

    /*获取推荐学生*/
    req(globalurl + 'BStudent/queryStudentWithRecommendWithoutAuth', 'post', {
        page: 1,
        rows: 6,
        sort: 'recommend_order'
    }, function (res) {
        var courseRow = $("div").children("#stu-pro").children();
        var courseLen = courseRow.length;
        // console.log(courseRow.eq(1).children().eq(1)[0].innerHTML)
        for (var i = 2, j = 0; i < courseLen; i++) {
            for (var k = 0; k < 2; k++) {
                if (j + k < res.rows.length) {
                    if (res.rows[j + k].headPic != null) {
                        courseRow.eq(i).children().eq(2 * k).children()[0].src = imagepath + res.rows[j + k].headPic;
                    } else {
                        courseRow.eq(i).children().eq(2 * k).children()[0].src = imagepath + default_student_location;
                    }
                    courseRow.eq(i).children().eq(2 * k + 1)[0].innerHTML = res.rows[j + k].name+ '(' + res.rows[j + k].code + ')';
                }
                else {
                    courseRow.eq(i).children().eq(2 * k).children()[0].src = imagepath + default_student_location;
                    courseRow.eq(i).children().eq(2 * k + 1)[0].innerHTML = "敬请期待";
                }
            }
            j = j + 2;
        }
        $("#stu-pro").fadeIn();
    });


    /*获取头条新闻*/
    req(globalurl + 'BNews/queryBNewssByPaginationWithoutAuth', 'post', {
        page: 1,
        rows: 6,
        isRelease: '1',
        attribute: '1',
        sort: 'attribute desc,release_time desc'
    }, function (res) {
        // console.log(res.rows[0].businessId)
        var str = '';
        for (var i = 0; i < res.rows.length; i++) {
           
            str += '<div class="rows">' +
                '<div class="medium-6 large-8 columns">' +
                '<i class="fi-clock clock-icon"></i>' +
                '<p><a href="publish.html?businessId=' + res.rows[i].businessId + '">' + res.rows[i].newsName  + '</a></p>' +
                '</div>' +
                '<div class="medium-6 large-4 columns">' + res.rows[i].releaseTime + '</div>' +
                '</div>';
            // newsRow.eq(i).children().eq(0).children()[1].innerHTML=res.rows[i].newsName;
        }
        for (var i = res.rows.length; i < 6; i++) {
            str += '<div class="rows">' +
                '<div class="medium-6 large-8 columns">' +
                '<i class="fi-clock clock-icon"></i>' +
                '<p>敬请期待</p>' +
                '</div>' +
                '<div class="medium-6 large-4 columns">2017-02-30 10:44:13</div>' +
                '</div>';
        }

        $('#news_pro').html(str);
        $("#news-pro").fadeIn();
    });

    /***获取首页数据结束***/
});


function stuCourse(id) {
    var p;
    if(localStorage.getItem("role")=="1003")
        p='stuCourse.html?id=' + id;
    else  p='stuCourse.html?id=' + id+'&isP=true';
    window.location.href = p;
}
function show_side() {
    $(".silder-ctrl-prev").css("display", "inline-block");
    $(".silder-ctrl-next").css("display", "inline-block");
}
function hide_side() {
    $(".silder-ctrl-prev").css("display", "none");
    $(".silder-ctrl-next").css("display", "none");

}


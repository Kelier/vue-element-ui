/**
 * Created by John Yan on 9/14/2017.
 */
/*
 * 切换tab
 * */
$(function () {
    loadData();

    $('.mylearn').fadeIn();
    $('.myclass').fadeIn();

    $("#learn-do").show();
    $("#learn-before").addClass("axis");

    $("#footer").fadeIn();

    $('.myclass li a[href^="#"]').click(function (e) {
        e.preventDefault();
    });

    $("#learn-before").on("click", function () {
        $("#learn-over").hide();
        $("#learn-do").show();
        $("#learn-before").addClass("axis");
        $("#learn-delay").removeClass("axis");
    });
    $("#learn-delay").on("click", function () {
        $("#learn-over").show();
        $("#learn-do").hide();
        $("#learn-delay").addClass("axis");
        $("#learn-before").removeClass("axis");
    });

});

function loadData() {
   
    $.ajax({
        url: globalurl + 'BSl/mySlByStudentCode',
        method: 'post',
        data: {
            page: 1,
            rows: 99999,

        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            tip.open('努力加载中')
        },
        success: function (result) {
            tip.close();
            // console.log(JSON.stringify(result));
            var list = result.rows;
            var learn_do = '';
            var learn_over = '';
            for (var i = 0; i < list.length; i++) {
                var item = '<a id="' + list[i].businessId + '" href="stuCourse.html?id=' + list[i].businessId + '" class="stuclass-course-img">' +
                    '<div class="card card-list">' +
                    '<img src="' + imagepath + list[i].slCoverUrl + '">' +
                    '<div class="card-section">' +
                    '<p>' + list[i].code + '</p>' +
                    '<h6>' + list[i].lessonName + '</h6>' +
                    '</div>' +
                    '</div>' +
                    '</a>';
                if (list[i].isStudy == '0') {
                    learn_do += item;
                }
                if (list[i].isStudy == '1') {
                    learn_over += item;
                }
            }
            $('#learn-do-list').html(learn_do);
            $('#learn-over-list').html(learn_over);
        },
        error: function (error) {
            alert('访问服务器失败');
            console.log(JSON.stringify(error));
        }
    })
}

/**
 * Created by John Yan on 9/14/2017.
 */
$(function () {

    localStorage.removeItem("isP");
    /*加载过渡*/
    $(".mylearn").fadeIn();
    $("#classlist-1").fadeIn();
    $("#learn-active").addClass("learn-a");

    $("#footer").fadeIn();

    /*阻止滚动*/
    $('.mylearn li a[href^="#"]').click(function(e){
        e.preventDefault();

    });
    $('.myclass li a[href^="#"]').click(function (e) {
        e.preventDefault();
    });

    /*
     * tab切换
     * */
    $("#learn-active").on("click", function () {
        $("#classlist-2").hide();
        $("#classlist-1").show();
        $("#learn-active").addClass("learn-a");
        $("#learn-apply").removeClass("learn-a");
        $("#learn-apply").attr("aria-selected",false);
        $("#learn-active").attr("aria-selected",true);
    });
    $("#learn-apply").on("click", function () {
        $("#classlist-1").hide();
        $("#classlist-2").show();
        $("#lauch-course").show();
        $("#learn-apply").addClass("learn-a");
        $("#learn-active").removeClass("learn-a");
        $("#learn-active").attr("aria-selected",false);
        $("#learn-apply").attr("aria-selected",true);
    });

    /*加载数据*/
    loadData();
});

$("#learn-eve").fadeIn();
$("#learn-all").addClass("axis");
$("#learn-all").on("click", function () {
    $("#learn-over").hide();
    $("#learn-do").hide();
    $("#learn-eve").show();
    $("#learn-all").addClass("axis");
    $("#learn-before").removeClass("axis");
    $("#learn-delay").removeClass("axis");
});
$("#learn-before").on("click", function () {
    $("#learn-over").hide();
    $("#learn-do").show();
    $("#learn-eve").hide();
    $("#learn-before").addClass("axis");
    $("#learn-delay").removeClass("axis");
    $("#learn-all").removeClass("axis");
});
$("#learn-delay").on("click", function () {
    $("#learn-over").show();
    $("#learn-do").hide();
    $("#learn-eve").hide();
    $("#learn-delay").addClass("axis");
    $("#learn-before").removeClass("axis");
    $("#learn-all").removeClass("axis");
});


function loadData() {
    $.ajax({
        url: globalurl + 'BSl/mySlByTeacherCode',
        method: 'post',
        data: {
            page: 1,
            rows: 99999,
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        success: function (result) {

            var list = result.rows;
            var learn_do = '';
            var learn_over = '';
            for (var i = 0; i < list.length; i++) {

                var item = '<a id="' + list[i].businessId + '" href="teaCourse.html?id=' + list[i].businessId + '" class="stuclass-course-img">' +
                    '<div class="card card-list">' +
                    '<img src="' + imagepath + list[i].slCoverUrl + '">' +
                    '<div class="card-section">' +
                    '<p>' + list[i].code + '</p>' +
                    '<h6>' + list[i].lessonName + '</h6>' +
                    '</div>' +
                    '</div>' +
                    '</a>';
                console.log(item)
                if (list[i].isOnline == '1') {
                    learn_do += item;
                }
                if (list[i].isOnline == '2') {
                    learn_over += item;
                }

            }

            $('#learn-eve-list').html(learn_do+learn_over);
            $('#learn-do-list').html(learn_do);
            $('#learn-over-list').html(learn_over);

        },
        error: function (error) {
            alert('访问服务器失败');
            console.log(JSON.stringify(error));
        }
    })
}
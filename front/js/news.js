/**
 * Created by John Yan on 8/16/2017.
 */
$(document).ready(function () {

    loadData();

});
function loadData() {
    loadContent();
}
function loadContent() {

    $.ajax({
        url: globalurl + 'BNews/oneWithoutAuth',
        method: 'post',
        data: {
            businessId: GetQueryString('businessId')
        },
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            tip.open('加载新闻中')
            },
        success: function (result) {
            tip.close();
            // console.log(JSON.stringify(result));
            if (result.success) {
              var obj=result.result;
              $(".news-page > h2").html(obj.newsName);
              $(".news-time").html(obj.releaseTime);
              $(".news-content > p").html(obj.newsContent);
            } else {
                alert(result.message);
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    })
}

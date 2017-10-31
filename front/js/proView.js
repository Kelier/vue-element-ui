/**
 * Created by John Yan on 9/14/2017.
 */
$(function () {

    /*加载任务书*/
    $.ajax({
        url: globalurl + 'BChapter/getMdFileById',
        method: 'post',
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            tip.open('加载项目任务书中')
        },
        data: {
            businessId: GetQueryString('businessId')
        },
        success: function (result) {
            
            if (result.success) {
                console.log(result);
                $(".book-title>p").html(decodeURI(decodeURI(GetQueryString('a'))));
                $(".book-left-content>h5").html("第"+(parseInt(GetQueryString('c'))+1)+"节        "+decodeURI(decodeURI(GetQueryString('b'))));
                $("#article").html(marked(result.result));
            } else {


            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    });

    /*加载课程信息*/
    $.ajax({
        url: globalurl + 'BSl/mySlDetailByIdWithoutAuth',
        method: 'post',
        data: {
            id: GetQueryString('d')
        },
        success: function (result) {
            tip.close();
            console.log("loadSLDetail成功")
            if (result.success) {
                if (result.result == null || result.result == '' || result == undefined) {
                    console.log('该课程不存在');
                } else {

                    $(".book-cover img")[0].src=imagepath+result.result.coverUrl;

                    $(".book-cover p")[0].innerHTML=result.result.lessonName;
                    $(".tea-panel img")[0].src=imagepath+result.result.teaPic;
                    $(".tea-info").find('label').eq(0)[0].innerHTML=result.result.teaName;
                    $(".tea-info").find('label').eq(1)[0].innerHTML="发布过"+result.result.teaSlNum+"门课程";
                    $("#wire-num").text(result.result.isTest);
                }
            } else {
                alert(result.message);
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    })

})

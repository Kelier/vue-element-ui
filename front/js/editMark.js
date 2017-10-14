/**
 * Created by John Yan on 9/14/2017.
 */
$(function () {
    localStorage.removeItem("isP");

    $("#lay-role").css("background", "#ff6d10");
    var editor = editormd("editormd", {
        path: "../../bower_components/editor.md/lib/", // Autoload modules mode, codemirror, marked... dependents libs path,
        saveHTMLToTextarea: true,

        emoji: true,
        taskList: true,
        tocm: true, // Using [TOCM]
        tex: true,// 开启科学公式TeX语言支持，默认关闭

        flowChart: true,//开启流程图支持，默认关闭
        sequenceDiagram: true,//开启时序/序列图支持，默认关闭,

        dialogLockScreen: false,//设置弹出层对话框不锁屏，全局通用，默认为true
        dialogShowMask: false,//设置弹出层对话框显示透明遮罩层，全局通用，默认为true
        dialogDraggable: false,//设置弹出层对话框不可拖动，全局通用，默认为true
        dialogMaskOpacity: 0.4, //设置透明遮罩层的透明度，全局通用，默认值为0.1
        dialogMaskBgColor: "#000",//设置透明遮罩层的背景颜色，全局通用，默认为#fff

        codeFold: true,

        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: globalurl + "BChapter/uploadMdFileWithoutAuth",

        onload: function () {
            console.log(this)

        },
    });
    var getInfo = JSON.parse(GetQueryString("courseinfo"));
    var str = decodeURI(decodeURI(getInfo.cname)) + "  " + decodeURI(decodeURI(getInfo.nodePid)) + " " + decodeURI(decodeURI(getInfo.nodePname)) + " " + decodeURI(decodeURI(getInfo.nodeCid)) + " " + decodeURI(decodeURI(getInfo.nodeCname));
    $(".course-info").find('h4').html(str);

    $.ajax({
        url: globalurl + 'BChapter/getMdFileById',
        method: 'post',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        data: {
            businessId: GetQueryString('businessId')
        },
        success: function (result) {
            // console.log(JSON.stringify(result));
            if (result.success) {
                $("#editormd textarea").val(result.result);
                setInterval(function () {
                    $(".sho_line").fadeIn();
                }, 1000);

            } else {
                alert(result.message);
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    });


});
function submitProBook() {
    $('body').loading({
        loadingWidth: 240,
        title: '提交中...',
        name: 'test',
        discription: '这是一个描述...',
        direction: 'row',
        type: 'origin',
        originBg: '#BF5A1F',
        originDivWidth: 30,
        originDivHeight: 30,
        originWidth: 4,
        originHeight: 4,
        smallLoading: false,
        titleColor: '#BF5A1F',
        loadingBg: '#2B2B2B',
        loadingMaskBg: 'rgba(0,0,0,0.6)'
    });
//        var markcontent=$(".markdown-body.editormd-preview-container").html();
    var markcontent = $("#editormd textarea").val();
    $.ajax({
        url: globalurl + 'BChapter/add',
        method: 'post',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        data: {
            slId: window.location.href.split('&')[1].split('=')[1],
            businessId: GetQueryString('businessId'),
            mdFile: markcontent
        },
        success: function (result) {
            // console.log(JSON.stringify(result));
            removeLoading('test');
            if (result.success) {
                setInterval(function () {
                    window.location.href = 'teaCourse.html?id=' + GetQueryString('id');
                }, 1000);
                toastr.success('提交成功');
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
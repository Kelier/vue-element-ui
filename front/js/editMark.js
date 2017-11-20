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
            console.log('1')
            $.ajax({
                url: globalurl + 'BChapter/getMdFileById',
                method: 'post',
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.getItem("token"));
                    tip.open('获取任务书中');
                },
                data: {
                    businessId: GetQueryString('businessId')
                },
                success: function (result) {
                    tip.close();
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

        },
    });
    var getInfo = JSON.parse(GetQueryString("courseinfo"));
    var str = decodeURI(decodeURI(getInfo.cname)) + "  " + decodeURI(decodeURI(getInfo.nodePid)) + " " + decodeURI(decodeURI(getInfo.nodePname)) + " " + decodeURI(decodeURI(getInfo.nodeCid)) + " " + decodeURI(decodeURI(getInfo.nodeCname));
    $(".course-info").find('h4').html(str);

   


});
function submitProBook() {
    
//        var markcontent=$(".markdown-body.editormd-preview-container").html();
    var markcontent = $("#editormd textarea").val();
    if(markcontent===null||markcontent===''||typeof markcontent==='undefined')
        toastr.warning('正文不能为空')
    else{
        $.ajax({
            url: globalurl + 'BChapter/add',
            method: 'post',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.getItem("token"));
                tip.open('提交中')
            },
            data: {
                slId: window.location.href.split('&')[1].split('=')[1],
                businessId: GetQueryString('businessId'),
                mdFile: markcontent
            },
            success: function (result) {
                tip.close();
                // console.log(JSON.stringify(result));
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
    
}

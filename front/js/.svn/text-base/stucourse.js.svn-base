/**
 * Created by John Yan on 8/9/2017.
 */

$(document).ready(function () {
    //Global变量
    var currentChapter = 0;
    var currentSection = 0;


    if (sessionStorage.getItem("role") == "1002") {
        if (GetQueryString("isP")||localStorage.getItem("isP")=="preview"){
            $('#a-setback').show();
            localStorage.setItem("isP","preview");
        }

    }
    //显示更多选项
    $('#trial_check').change(function () {
        if ($('#trial_check').is(':checked')) {
            $('#environment').show();
        } else {
            $('#environment').hide();
        }
    });
    $('#edit_trial_check').change(function () {
        if ($('#edit_trial_check').is(':checked')) {
            $('#edit_environment').show();
        } else {
            $('#edit_environment').hide();
        }
    });


    loadData();
});
var scoreList = [];
var cpName = '';

var teaCode, slCode, flag;

function toJudgeOpen(seId,e) {
    console.log(seId);
    var targetDom=e.target.parentNode.parentNode.parentNode.parentNode;
    var isC;

    if(targetDom.getAttribute('data-score')!=null){
        isC="right";
    }
    console.log(isC)
    /*第一次开车*/
    if(sessionStorage.getItem("role")=="1003"){
        if(localStorage.getItem("chestatus")=="waited"){
            toastr.warning("正在清理che空间，请等待1-2分钟");
        }
        if(localStorage.getItem("chestatus")=="open"){
            $.ajax({
                url: globalurl + 'BChapter/cheStart',
                method: 'post',
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
                },
                data: {
                    teaCode: teaCode,
                    stuCode: sessionStorage.getItem("stucode"),
                    slCode: slCode,
                    flag: (sessionStorage.getItem("role") == '1003' ? '1' : '0')
                },
                success: function (res) {
                    if (res.success) {
                        sessionStorage.setItem("timer",res.result.endTime);
                        window.open("eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + seId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + sessionStorage.getItem("stucode") + "&ccode=" + slCode + "&id=" + GetQueryString("id")+"&isC="+isC)
                    } else {
                        toastr.warning(res.message);
                    }

                }, error: function (err) {
                    console.log(err)
                }
            });
        }

        if(localStorage.getItem("chestatus")!="waited"){
            if(localStorage.getItem("chestatus")!="open"){
                $("#header").fadeOut();
                $("#content").fadeOut();
                $("#footer").fadeOut();
                $("#water").fadeIn();

                $.ajax({
                    url: globalurl + 'BChapter/cheStart',
                    method: 'post',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
                    },
                    data: {
                        teaCode: teaCode,
                        stuCode: sessionStorage.getItem("stucode"),
                        slCode: slCode,
                        flag: (sessionStorage.getItem("role") == '1003' ? '1' : '0')
                    },
                    success: function (res) {
                        if (res.success) {
                            if(localStorage.getItem("chestatus")=="waited"){
                                sessionStorage.setItem("address","eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + seId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + sessionStorage.getItem("stucode") + "&ccode=" + slCode + "&id=" + GetQueryString("id")+"&isC="+isC);
                                localStorage.setItem("chestatus","open");
                            }
                            if(localStorage.getItem("chestatus")==null){
                                sessionStorage.setItem("address","eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + seId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + sessionStorage.getItem("stucode") + "&ccode=" + slCode + "&id=" + GetQueryString("id")+"&isC="+isC);
                                localStorage.setItem("chestatus","open");
                                sessionStorage.setItem("timer",res.result.endTime);
                                $("#water").fadeOut();
                                $("#header").fadeIn();
                                $("#content").fadeIn();
                                $("#footer").fadeIn();
                                window.open(sessionStorage.getItem("address"));
                            }

                        } else {
                            toastr.warning(res.message);
                            $("#water").fadeOut();
                            $("#header").fadeIn();
                            $("#content").fadeIn();
                            $("#footer").fadeIn();
                        }

                    }, error: function (err) {
                        console.log(err)
                    }
                });
            }



        }

    }else{
        window.open("eclipse.html?businessId=" + seId  + "&scode=" + sessionStorage.getItem("stucode") + "&ccode=" + slCode + "&id=" + GetQueryString("id")+"&isC="+isC);

    }



}

/*返回界面*/
function returnMe() {
    $("#water").fadeOut();
    $("#header").fadeIn();
    $("#content").fadeIn();
    $("#footer").fadeIn();
    localStorage.setItem("chestatus", "waited");
}


/*
 * 创建元素
 * */
function create(ele) {
    return document.createElement(ele);
}

/*
 * 目录创建章
 * */
function create_chapter(chName, index, handle) {

    var em_dt = create("dt");
    var em_inline_chapter = create("div");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel = $(".catalog-content");
    panel.append(em_dt);
    $('dl.catalog-content dt:last-child').addClass("chapter");
    $('dl.catalog-content dt:last-child').append(em_inline_chapter);
    var currentCp = $('dl.catalog-content dt:last-child').children();
    currentCp.addClass("chapter-inline-stu");


    //创建容器
    for (var i = 0; i < 2; i++)
        currentCp.append("<div></div>");

    var css_inline = ["inline-index-stu", "inline-title-stu"];
    for (var k = 0; k < 2; k++)
        currentCp.find("div").eq(k).addClass(css_inline[k]);

    currentCp.find("div").eq(0).html('第' + (index + 1) + '章');
    currentCp.find("div").eq(1).html(chName);


    $(".reveal-overlay").hide();
}

/*
 * 目录创建节
 * */
function create_section(seName, seId, chIndex, seIndex, handle,vedioState,vedioUrl) {
    var em_dd = create("dd");
    var em_inline_section = create("div");
    var em_inline_item_trial = create("a");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel = $(".catalog-content");

    var patch_cht = panel.find("dt").eq(chIndex);
    patch_cht.after(em_dd);
    var patch_chd = patch_cht.next('dd');

    patch_chd.addClass("section");
    patch_chd.append(em_inline_section);
    patch_chd.children().addClass("section-inline-stu");
    var currentSt = patch_chd.children();


    if (handle == 'panel1load') {

        var exsit = false;
        var score = "";

        // console.log(scoreList);
        // console.log(seId + "新1" + "----" + scoreList[0].chapterId);
        for (var i = 0; i < scoreList.length; i++) {
            if (scoreList[i].chapterId == seId) {
                exsit = true;
                score = scoreList[i].score;
                patch_chd.attr('data-score',score);
            }
        }


        //创建容器
        for (var i = 0; i < 6; i++)
            currentSt.append("<div></div>");
        if (exsit&&score!="-1") {
            var css_inline = ["view_icon_stu", "view_code_stu", "view_preface_stu",  "view_pro_stu", "view_exp_stu_1","view_scheme_stu"];
        } else {
            var css_inline = ["view_icon_stu", "view_code_stu", "view_preface_stu",  "view_pro_stu", "view_exp_stu","view_scheme_stu"];
        }
        for (var k = 0; k < 6; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_edit);
        inline_tiral.push(em_inline_item_dele);

        var icon_demo = ["fi-check", "fi-error"];
        if (exsit) {
            find_item.eq(0).append("<img src='../image/selected.png'>");
        } else {
            find_item.eq(0).append("<img src='../image/noselected.png'>");
        }

        /* find_item.eq(0).children().addClass(icon_demo[0]);*/

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 3; j++) {
            if (j == 1) {
                if (exsit&&score!="-1") {
                    find_item.eq(j + 3).append("<span style='size: 13px;margin:0 3px 0 6px;display: inline-block;width: 45px;'>" + score + "分</span><a style='margin:0 5px'></a>");

                } else {
                    find_item.eq(j + 3).append("<a></a>");
                }

            } else {
                find_item.eq(j + 3).append("<a></a>");
            }

            /*  find_item.eq(j + 4).children().addClass(trial_demo[j]);*/

        }

        var lessonAbout={};
        lessonAbout.cname=encodeURI(encodeURI(cpName));
        lessonAbout.nodePid=encodeURI(encodeURI($("#catalog-content").find("dt").eq($("#catalog-content").find("dt").length-1)[0].children[0].children[0].innerHTML));
        lessonAbout.nodePname=encodeURI(encodeURI($("#catalog-content").find("dt").eq($("#catalog-content").find("dt").length-1)[0].children[0].children[1].innerHTML));
        lessonAbout.nodeCid=encodeURI(encodeURI('第' + (seIndex + 1) + '节'));
        lessonAbout.nodeCname=encodeURI(encodeURI(seName));
        var res=JSON.stringify(lessonAbout);
        find_item.eq(3).children().attr('href', 'proBook.html?businessId=' + seId + '&a=' + encodeURI(encodeURI(cpName)) + '&b=' + encodeURI(encodeURI(seName)) + '&c=' + seIndex + '&d=' + GetQueryString('id'));
        find_item.eq(4).find('a').attr('onclick', 'toJudgeOpen("' + seId + '",event)');
        find_item.eq(5).children().attr('href', 'seeVedio.html?businessId=' + seId +'&id=' + GetQueryString('id')+"&courseinfo="+res+"&vedioUrl="+encodeURI(encodeURI(vedioUrl)));
        if(vedioState=="2"||vedioState=="5"){
            find_item.eq(5).children().html("<img title='课程视频' src='../image/mv_icon.png'>");
        }else{
            find_item.eq(5).children().removeAttr('href');
            find_item.eq(5).children().css('cursor','default');
            find_item.eq(5).children().html("<img title='未开设视频' src='../image/mv_icon_no.png'>");
        }

        //往里塞值
        find_item.eq(1).html('第' + (seIndex + 1) + '节');
        find_item.eq(2).html(seName);
        find_item.eq(3).children().html("<img title='项目任务书' src='../image/pro.png'>");

        if (sessionStorage.getItem("role") == '1003')
            find_item.eq(4).children("a").html("<img title='实验' style='margin-bottom:6px' src='../image/exp.png'>");
    }

    if (handle == 'panel2load') {
        //创建容器
        for (var i = 0; i < 4; i++)
            currentSt.append("<div></div>");

        var css_inline = ["view_code_stu", "view_preface_stu", "view_pro_stu", "view_exp_stu"];
        for (var k = 0; k < 4; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_dele);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button"];
        for (var j = 0; j < 2; j++) {
            find_item.eq(j + 2).append("<a></a>");
            /* find_item.eq(j + 2).children().addClass(trial_demo[j]);*/

        }

        find_item.eq(2).children().attr('href', 'proBook.html?businessId=' + seId + '&a=' + encodeURI(encodeURI(cpName)) + '&b=' + encodeURI(encodeURI(seName)) + '&c=' + seIndex + '&d=' + GetQueryString('id'));
        find_item.eq(2).children().attr('class', 'light_off');
        find_item.eq(3).children().attr('onclick',  'toJudgeOpen("' + seId + '",event)');

        //往里塞值
        find_item.eq(0).html('第' + (seIndex + 1) + '节');
        find_item.eq(1).html(seName);
        find_item.eq(2).children().html("<img  src='../image/pro.png'>");
        find_item.eq(3).children().html("<img  src='../image/exp.png'>");
    }


}

function loadData() {
    $('body').loading({
        loadingWidth: 240,
        title: '整理课程信息中...',
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
    loadSlDetail();
    loadChapter();
}


function loadSlDetail() {
    // alert(GetQueryString('id'));
    $.ajax({
        url: globalurl + 'BSl/mySlDetailByIdWithoutAuth',
        method: 'post',
        data: {
            id: GetQueryString('id')
        },
        success: function (result) {
            console.log("loadSLDetail成功")
            if (result.success) {
                if (result.result == null || result.result == '' || result == undefined) {
                    // alert('该课程不存在');
                } else {
                    var obj = result.result;
                    $('#teaName').html(obj.teaName);
                    $('#teaSlNum').html(obj.teaSlNum);
                    teaCode = obj.teaCode;
                    $('#teaPic').attr('src', imagepath + obj.teaPic);
                    $('#lessonName').html(obj.lessonName);
                    $('#slCode').html(obj.slCode);
                    slCode = obj.slCode;
                    $('#course_info').html(obj.slNotes);
                    $('#coverUrl').attr('src', imagepath + obj.coverUrl);
                    cpName = obj.lessonName;
                    $(".stu-wireless").find("span")[0].innerHTML = obj.isTest;

                    $(".tea-wireless-mv").find("span")[0].innerHTML = obj.video;
                    $("#course_info").show(function () {
                        minify();
                    });
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
}

function loadChapter() {
    console.log("loadChapter-----------");
    $.ajax({
        url: globalurl + 'BChapter/queryBChaptersWithoutAuth',
        method: 'get',
        data: {
            slId: GetQueryString('id')
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", sessionStorage.getItem("token"));

        },
        success: function (res) {

            if (res.success) {
                if (res.result.chapterList.length < 1) {
                    //TODO 该课程还没有章节
                    $("#nocontent").css("display","inline-block");
                    $("#catalog-content").css("text-align","center");
                    removeLoading('test');
                } else {
                    $("#nocontent").fadeOut();
                    $("#catalog-content").css("text-align","left");
                    var list = res.result.chapterList;
                    //TODO 渲染章节列表
                    var panelType = sessionStorage.getItem("role") == "1003" ? "panel1load" : "panel2load";
                    if (panelType == "panel1load" && res.result.scoreList != "" && res.result.scoreList != null) {

                        scoreList = res.result.scoreList;
                    }
                    var allScore = 0;
                    for (var i = 0; i < scoreList.length; i++) {
                        if (scoreList[i].score != "-1") {
                            allScore += parseInt(scoreList[i].score);
                        }

                    }
                    if (scoreList.length > 0) {
                        $("#score_sum").html("课程总得分：" + allScore + "分");
                        $('#score_sum').show();
                    }

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].chapterLevel == 1) {
                            create_chapter(list[i].chapterName, i, panelType);
                        }

                        if (list[i].childList.length > 0) {
                            for (var j = list[i].childList.length - 1; j >= 0; j--) {

                                create_section(list[i].childList[j].chapterName, list[i].childList[j].businessId, i, j, panelType,list[i].childList[j].isTest,list[i].childList[j].videoUrl);
                                // create_section(list[i].childList[j].chapterName, i, j, 'panel2load');
                            }

                        }

                    }

                    removeLoading('test');
                }
            } else {
                alert(result.message);
            }
        },
        error: function (err) {
            console.log(JSON.stringify(err));
            // alert("访问服务器失败");
        }
    })
}

function backTeaSet() {
    if (sessionStorage.getItem("role") == "1002") {
        localStorage.removeItem("isP");
        window.location.href = "teaCourse.html?id=" + GetQueryString('id');
    }

}

/*
 * 点击“更多”，显示课程简介的详情；
 * */
function showCourseSummary() {
    var content = $("#course_info").text();
    console.log(content);
    $("#div_sum_detail").html(content);

}
/*
 * "更多按钮显示"
 * */
function minify() {
    var scrollHeight = $("#course_info").get(0).scrollHeight;
    var offsetHeight = $("#course_info").get(0).offsetHeight;
    if (scrollHeight != offsetHeight) {
        $("#mini_more").css("display", "inline-block");
    } else {
        $("#mini_more").css("display", "none");
    }
}







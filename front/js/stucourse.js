/**
 * Created by John Yan on 8/9/2017.
 */

$(document).ready(function () {
    //Global变量
    var currentChapter = 0;
    var currentSection = 0;


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
    currentCp.addClass("sc-chapter-inline");


    if (handle=='panel1load') {
        //创建容器
        for (var i = 0; i < 2; i++)
            currentCp.append("<div></div>");

        var css_inline = ["inline-index", "inline-title"];
        for (var k = 0; k < 2; k++)
            currentCp.find("div").eq(k).addClass(css_inline[k]);

            currentCp.find("div").eq(0).html('第' + (index + 1) + '章');
            currentCp.find("div").eq(1).html(chName);
    }


    $(".reveal-overlay").hide();
}

/*
 * 目录创建节
 * */
function create_section(seName, chIndex, seIndex, handle) {
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
    patch_chd.children().addClass("section-inline");
    var currentSt = patch_chd.children();


    if (handle == 'panel1load') {
        //创建容器
        for (var i = 0; i < 6; i++)
            currentSt.append("<div></div>");

        var css_inline = ["view_icon", "view_code", "view_preface", "view_scheme", "view_pro","view_exp"];
        for (var k = 0; k < 6; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_edit);
        inline_tiral.push(em_inline_item_dele);

        var icon_demo=["fi-check","fi-error"];
        console.log(find_item.eq(0))
        find_item.eq(0).append("<i></i>");
        find_item.eq(0).children().addClass(icon_demo[0]);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 2; j++) {
            find_item.eq(j + 4).append("<a></a>");
            find_item.eq(j + 4).children().addClass(trial_demo[j]);

        }
        find_item.eq(4).children().attr('href', 'proBook.html');
        find_item.eq(5).children().attr('href', 'markdown.html');

        //往里塞值
        find_item.eq(1).html('第' + (seIndex + 1) + '节');
        find_item.eq(2).html(seName);
        find_item.eq(4).children().html('项目任务书');
        find_item.eq(5).children().html('实验');
    }
    if (handle == 'panel2load') {
        //创建容器
        for (var i = 0; i < 4; i++)
            currentSt.append("<div></div>");

        var css_inline = ["view_code", "view_preface", "view_pro", "view_exp"];
        for (var k = 0; k < 4; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_dele);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button"];
        for (var j = 0; j < 2; j++) {
            find_item.eq(j + 2).append("<a></a>");
            find_item.eq(j + 2).children().addClass(trial_demo[j]);

        }

        find_item.eq(2).children().attr('href', 'proBook.html');
        find_item.eq(3).children().attr('href', 'markdown.html');

        //往里塞值
        find_item.eq(0).html('第' + (seIndex + 1) + '节');
        find_item.eq(1).html(seName);
        find_item.eq(2).children().html('项目任务书');
        find_item.eq(3).children().html('实验');
    }


}

function loadData() {
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
            // console.log(JSON.stringify(result));
            if (result.success) {
                if (result.result == null || result.result == '' || result == undefined) {
                    // alert('该课程不存在');
                } else {
                    var obj = result.result;
                    $('#teaName').html(obj.teaName);
                    $('#teaSlNum').html(obj.teaSlNum);
                    $('#teaPic').attr('src', imagepath + obj.teaPic);
                    $('#lessonName').html(obj.lessonName);
                    $('#slCode').html(obj.slCode);
                    $('#course_info').html(obj.slNotes);
                    $('#coverUrl').attr('src', imagepath + obj.coverUrl)
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

    $.ajax({
        url: globalurl + 'BChapter/queryBChaptersWithoutAuth',
        method: 'get',
        data: {
            slId: GetQueryString('id')
        },
        success: function (result) {
            console.log(JSON.stringify(result));
            if (result.success) {
                if (result.result.chapterList.length < 1) {
                    //TODO 该课程还没有章节
                    $("#nocontent").show();

                } else {
                    $("#nocontent").hide();
                    var list = result.result.chapterList;
                    //TODO 渲染章节列表
                    console.log(result.result)
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].chapterLevel == 1) {
                            create_chapter(list[i].chapterName, i, 'panel1load');
                        }

                        if (list[i].childList.length > 0) {
                            for (var j = 0; j < list[i].childList.length; j++) {

                                create_section(list[i].childList[j].chapterName, i, j, 'panel1load');
                                create_section(list[i].childList[j].chapterName, i, j, 'panel2load');
                            }

                        }

                    }


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







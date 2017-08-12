/**
 * Created by John Yan on 7/25/2017.
 */
$(document).ready(function () {
    //Global变量
    var currentChapter = 0;
    var currentSection = 0;

    //面板tab控制
    $(document).on("click", ".pencil-lay", function () {
        $("#save-image").hide().fadeOut();
        $("#change-image").css("display", "inherit").fadeIn();

    });
    $("#panelTab2").on("click", function () {
        $("#panel2").attr("aria-hidden", false);
        $(".span-add").hide();
        $("#catalog-content").hide();
        $("#score-content").show();
    });
    $("#panelTab1").on("click", function () {
        $("#panel1").attr("aria-hidden", false);
        $(".span-add").show();
        $("#score-content").hide();
        $("#catalog-content").show();
    });
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


    /*
     * 获取章节索引、删除
     * */

    $(document).on('click', '.chapter', function () {
        currentChapter = $(this).index();

    });
    $(document).on('click', '.section', function () {
        currentSection = $(this).index();
    });


    /*
     *删除章节
     * */
    $("#delete_section").click(function () {
        var list = document.getElementById("catalog-content");
        list.removeChild(list.children[currentSection]);

        $("#delete-section").hide();
        $(".reveal-overlay").hide();
    });
    $("#delete_chapter").click(function () {
        var list = document.getElementById("catalog-content");

        if ($("#catalog-content").children().eq(currentChapter).next())
            var element = $("#catalog-content").children().eq(currentChapter).next();
        if (element.length > 0) {
            if (element[0].nodeName.toLowerCase() != 'dd') {
                list.removeChild(list.children[currentChapter]);
                $("#delete-chapter").hide();
                $(".reveal-overlay").hide();
            }
        }
        if (element.length == 0) {
            list.removeChild(list.children[currentChapter]);
            $("#delete-chapter").hide();
            $(".reveal-overlay").hide();
        }

        else {
            alert("这一章仍有小节，不能删除");
        }
    });

    loadData();
});

/*
 * 课程面板相关配置
 * */
//    function switchLine() {
//        var launch = $("#tri-title").html();
//        var elem = $('#tri-label');
////            alert(launch);
//        if (launch == "已发布") {
//            $("#tri-label").fadeOut("slow");
//            $("#switchLine").html("上线");
//            $("#tri-label").css("border-color", "#F19EC2 #F19EC2 #F19EC2 transparent").fadeIn();
//            $("#tri-title").html("未发布");
//        } else {
//            $("#tri-label").fadeOut("slow");
//            $("#switchLine").html("下线");
//            $("#tri-label").css("border-color", "#7ECEF4 #7ECEF4 #7ECEF4 transparent").fadeIn();
//            $("#tri-title").html("已发布");
//        }
//
//    }
function switchPreview() {
    var flag = $("#switchPreview").html();
    if (flag == "预览") {
        var flag = $("#switchPreview").html("保存");
        $("#lay_pen").css("display", "none");
        $("#span_config").css("display", "none");
        $("#pre_setting").show();
    } else {
        var flag = $("#switchPreview").html("预览");
        $("#lay_pen").show();
        $("#span_config").show();
        $("#pre_setting").hide();
    }
}

/*
 * 编辑课程介绍
 * */
function echo_title() {

    $("#mini_more").css("display", "none");
    $("#course_info").css("display", "none");
    $("#title_edit").css("display", "inline-block");
    $("#title_edit").css("margin-top", "60px")
}

/*
 * 编辑文本域监听
 * */
function invokeHandle(e) {
    var key = e.keyCode;
    if (key == 13) {
        // alert("回车键");
        var content = $("#title_edit").val();
        $("#course_info").html(content);
        $("#title_edit").hide();
        $("#mini_more").css("display", "-webkit-box");
        $("#course_info").css("display", "-webkit-box");
        minify();

        //将内容替换为content
    }
    if (key == 27) {
//            alert("esc键");
        //退出编辑
        $("#mini_more").css("display", "-webkit-box");
        $("#course_info").css("display", "-webkit-box");
        $("#title_edit").css("display", "none");
    }
}


/*
 * 课程信息更多显示
 * */
function minify() {
    var line = $("#course_info").html().length;
//            alert(line);
    if (line > 115) {

        $("#mini_more").css("display", "inline-block");

    }
    else $("#mini_more").css("display", "none");
}

/*
 * 上传封面
 * */
function upload_cover() {
    $("#file_cover").click();
}
function change_cover() {
    var dom = document.getElementById("file_cover");
    var file = dom.files[0];

    //获取欲上传的文件路径
    var filepath = document.getElementById("file_cover").value;
//        alert(filepath);


    document.getElementById("cover_path").src = "../image/2.jpg";

    //初始化裁剪框
    $('.image-cover > img').cropper({
        aspectRatio: 16 / 9,
        built: function () {

        }
    });

    $("#change-image").hide().fadeOut();
    $("#save-image").css("display", "inherit").fadeIn();


}

/*
 * 裁剪
 * */
function tailor() {
    //裁剪框

    console.log($('.image-cover > img'));
    alert(JSON.stringify($('.image-cover > img').cropper('getData')));//获取裁剪后的真实尺寸

}

/*
 * 保存封面
 * */
function save_cover() {

    $("#save-image").attr("onclick", function () {
        tailor();
    });
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
    var chapterContent;
    if (handle == 'create') {
        chapterContent = $("#add_chapter_content").val();
    }


    var em_dt = create("dt");
    var em_inline_chapter = create("div");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel;
    if (handle == 'panel1load') {
        var panel1 = $(".catalog-content");
        panel1.append(em_dt);
        panel = '.catalog-content ';
    }
    if (handle == 'panel2load') {
        var panel2 = $(".score_content");
        panel2.append(em_dt);
        panel = '.score_content ';
    }
    // console.log('dl'+panel+'dt:last-child')
//        var chapter_count=$("dl").length;
    $('dl' + panel + 'dt:last-child').addClass("chapter");
    $('dl' + panel + 'dt:last-child').append(em_inline_chapter);
    var currentCp = $('dl' + panel + 'dt:last-child').children();
    handle == 'panel1load'?currentCp.addClass("chapter-inline"):currentCp.addClass("sc-chapter-inline");


    if (panel == '.catalog-content ' || handle == 'create') {
        //创建容器
        for (var i = 0; i < 4; i++)
            currentCp.append("<div></div>");

        var css_inline = ["inline-index", "inline-title", "inline-handle", "inline-delete"];
        for (var k = 0; k < 4; k++)
            currentCp.find("div").eq(k).addClass(css_inline[k]);
        var item_arrow = currentCp.find("div").eq(2);
        item_arrow.append(em_inline_item_edit);
        item_arrow.next().append(em_inline_item_dele);
        item_arrow.children().addClass("align-hollow hollow button");
        item_arrow.children().attr('data-open', 'edit-chapter');
        item_arrow.children().attr('onclick', 'edit_chapter_about(event)');

        item_arrow.next().children().addClass("align-hollow hollow button alert");
        item_arrow.next().children().attr('data-open', 'delete-chapter');

        //往里塞值
        if (handle == 'create') {
            var flag = $(".catalog-content").find('dt').length;
            currentCp.find("div").eq(0).html('第' + (flag) + '章');
            currentCp.find("div").eq(1).html(chapterContent);
        }
        if (handle == 'panel1load') {
            currentCp.find("div").eq(0).html('第' + (index + 1) + '章');
            currentCp.find("div").eq(1).html(chName);

        }
        currentCp.find("div").eq(2).children().html('编辑');
        currentCp.find("div").eq(3).children().html('删除');
    }
    if (panel == '.score_content ') {
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

    var panel1 = $(".catalog-content");
    var panel2 = $(".score_content");

    //假设章数为2
    /*   var chapter_index = 1;
     var patch_cht = panel1.find("dt").eq(chapter_index - 1);
     patch_cht.after(em_dd);
     var patch_chd = panel1.find("dd").eq(chapter_index - 1);
     patch_chd.addClass("section");
     patch_chd.append(em_inline_section);
     patch_chd.children().addClass("section-inline");
     var currentSt = patch_chd.children();*/
    var panel;
    if (handle == 'panel1load'||handle=='create') {
        panel = panel1;
    }
    if (handle == 'panel2load') {
        panel = panel2;
    }
    var patch_chd;
    var patch_cht = panel.find("dt").eq(chIndex);
    if(handle=='panel2load'||handle == 'panel1load'){
        patch_cht.after(em_dd);
        patch_chd = patch_cht.next('dd');

    }
    if(handle=='create'){
        var currentFind=$("#chapter-select").get(0).selectedIndex;
        console.log(panel.find('dt').eq(currentFind));
        //借助保存的id，寻找到插入的位置
    }
    patch_chd.addClass("section");
    patch_chd.append(em_inline_section);
    patch_chd.children().addClass("section-inline");
    var currentSt = patch_chd.children();


    if (handle == 'panel1load'||handle=='create') {
        //创建容器
        for (var i = 0; i < 5; i++)
            currentSt.append("<div></div>");

        var css_inline = ["line_code", "line_preface", "line_scheme", "line_handle", "line_delete"];
        for (var k = 0; k < 5; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_edit);
        inline_tiral.push(em_inline_item_dele);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 3; j++) {
            find_item.eq(j + 2).append("<a></a>");
            find_item.eq(j + 2).children().addClass(trial_demo[j]);

        }
        find_item.eq(2).children().attr('href', 'markdown.html');
        find_item.eq(3).children().attr('data-toggle', 'edit-section');
        find_item.eq(3).children().attr('onclick', 'edit_section_about(event)');
        find_item.eq(4).children().attr('data-toggle', 'delete-section');

        //往里塞值
        find_item.eq(0).html('第' + (seIndex + 1) + '节');
        find_item.eq(1).html(seName);
        find_item.eq(2).children().html('项目任务书');
        find_item.eq(3).children().html('编辑');
        find_item.eq(4).children().html('删除');
    }
    if (handle == 'panel2load') {
        //创建容器
        for (var i = 0; i < 4; i++)
            currentSt.append("<div></div>");

        var css_inline = ["line_code", "line_face","line_handle", "line_delete"];
        for (var k = 0; k < 4; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_dele);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 2; j++) {
            find_item.eq(j + 2).append("<a></a>");
            find_item.eq(j + 2).children().addClass(trial_demo[j]);

        }
        find_item.eq(2).children().attr('data-toggle', 'score-count');
        find_item.eq(2).children().attr('onclick', '');
        find_item.eq(3).children().attr('data-toggle', 'score-info');
        find_item.eq(3).children().attr('onclick', '');

        //往里塞值
        find_item.eq(0).html('第' + (seIndex + 1) + '节');
        find_item.eq(1).html(seName);
        find_item.eq(2).children().html('代打分');
        find_item.eq(3).children().html('查看');
    }



}
/*
 * 修改章
 * */
function edit_chapter_about(e) {
    var chName = e.target.parentNode.parentNode.childNodes[1].innerHTML;
    var chId = e.target.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1
    $("#edit_chapter_content").val(chName);
    $("#edit_chapter").off().click(function () {
        $("#catalog-content").find("dt").eq(chId).children().find("div").eq(1).html($("#edit_chapter_content").val());
    });


}

/*
 * 修改节
 * */
function edit_section_about(e) {
    // console.log(e.target.parentNode.parentNode.parentNode)
    //借助保存的id，寻找到插入的位置
    $("#chapter-select").empty();
    var chLen=$("#catalog-content").find("dt").length;
    for(var i=0;i<chLen;i++){
        $("#chapter-select").append("<option value='第"+(i+1)+"章'>第"+(i+1)+"章</option>");
    }
    var seName = e.target.parentNode.parentNode.childNodes[1].innerHTML;
    var seId = e.target.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1;
    $("#edit_section_content").val(seName);

    $("#edit_section").click(function () {
        var section_content = $("#edit_section_content").val();
        $("#catalog-content").find("dd").eq(seId).children().find("div").eq(1).html(section_content);
    });

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
                if (result.result.chapterList.length <1) {
                    //TODO 该课程还没有章节
                    $("#nocontent1").show();
                    $("#nocontent2").show();

                } else {
                    $("#nocontent1").hide();
                    $("#nocontent2").hide();
                    var list = result.result.chapterList;
                    //TODO 渲染章节列表

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].chapterLevel == 1) {
                            create_chapter(list[i].chapterName, i, 'panel1load');
                            create_chapter(list[i].chapterName, i, 'panel2load');
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







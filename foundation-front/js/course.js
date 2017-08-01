/**
 * Created by John Yan on 7/25/2017.
 */
$(document).ready(function () {
    //Global变量
    var currentChapter=0;
    var currentSection=0;

    //面板tab控制
    $(document).on("click", ".pencil-lay", function () {
        $("#save-image").hide().fadeOut();
        $("#change-image").css("display", "inherit").fadeIn();
    });
    $("#panelTab2").on("click", function () {
        $("#panel2").attr("aria-hidden", false);
        $(".span-add").hide();
    });
    $("#panelTab1").on("click", function () {
        $("#panel1").attr("aria-hidden", false);
        $(".span-add").show();
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
     *
     * */
    $("#course_info").show(function () {
        minify();
    });

    /*
     * 获取章节索引、删除
     * */

        $(document).on('click', '.chapter', function(){
            currentChapter=$(this).index();

        });
        $(document).on('click', '.section', function(){
            currentSection=$(this).index();
        });


    /*
     *删除章节
     * */
    $("#delete_section").click(function () {
        var list=document.getElementById("catalog-content");
        // console.log(list.children[currentSection]);
        list.removeChild(list.children[currentSection]);
    });
    $("#delete_chapter").click(function () {
        var list=document.getElementById("catalog-content");
        if($("#catalog-content").children().eq(currentChapter).next())
            var element=list.children[currentChapter+1].nodeName;
        if(element.toLowerCase()!='dd')
        list.removeChild(list.children[currentChapter]);
        else{
            console.log("不能删");
        }
    });


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
function create_chapter() {

    var chapterContent = $("#add_chapter_content").val();

    var em_dt = create("dt");
    var em_inline_chapter = create("div");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel1 = $(".catalog-content");
    panel1.append(em_dt);
//        var chapter_count=$("dl").length;
    $('dl.catalog-content dt:last-child').addClass("chapter");
    $('dl.catalog-content dt:last-child').append(em_inline_chapter);
    var currentCp = $('dl.catalog-content dt:last-child').children();
    currentCp.addClass("chapter-inline");

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
    item_arrow.next().children().addClass("align-hollow hollow button alert");

    //往里塞值
    currentCp.find("div").eq(0).html('第2章');
    currentCp.find("div").eq(1).html(chapterContent);
    currentCp.find("div").eq(2).children().html('编辑');
    currentCp.find("div").eq(3).children().html('删除');


    $(".reveal-overlay").hide();
}

/*
 * 目录创建节
 * */
function create_section() {
    var em_dd = create("dd");
    var em_inline_section = create("div");
    var em_inline_item_trial = create("a");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel1 = $(".catalog-content");

    //假设章数为2
    var chapter_index = 2;
    var patch_cht = panel1.find("dt").eq(chapter_index - 1);
    patch_cht.after(em_dd);
    var patch_chd = panel1.find("dd").eq(chapter_index - 1);
    patch_chd.addClass("section");
    patch_chd.append(em_inline_section);
    patch_chd.children().addClass("section-inline");
    var currentSt = patch_chd.children();

    //创建容器
    for (var i = 0; i < 5; i++)
        currentSt.append("<div></div>");

    var css_inline = ["line_code", "line_preface", "line_scheme", "line_handle", "inline-delete"];
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

    //往里塞值
    find_item.eq(0).html('第1节');
    find_item.eq(1).html('编程');
    find_item.eq(2).children().html('项目任务书');
    find_item.eq(3).children().html('编辑');
    find_item.eq(4).children().html('删除');

}
/*
 * 修改章
 * */
function edit_chapter_about() {
    var chapter_index = 0;
    $("#edit_chapter_content").val($("#catalog-content").find("dt").eq(chapter_index).children().find("div").eq(1).html());


    $("#catalog-content dt").click(function () {
        chapter_index = $(this).index();
    });
    $("#edit_chapter").click(function () {
        var chapter_content = $("#edit_chapter_content").val();
        $("#catalog-content").find("dt").eq(chapter_index).children().find("div").eq(1).html(chapter_content);
    });

}

/*
 * 修改节
 * */
function edit_section_about() {
    var section_index = 0;
    $("#edit_section_content").val($("#catalog-content").find("dd").eq(section_index).children().find("div").eq(1).html());


    $("#catalog-content dd").click(function () {
        section_index = $(this).index();
    });
    $("#edit_section").click(function () {
        var section_content = $("#edit_section_content").val();
        $("#catalog-content").find("dd").eq(section_index).children().find("div").eq(1).html(section_content);
    });

}





/**
 * Created by John Yan on 7/25/2017.
 */

    //Global变量
var currentChapter = 0;
var currentSection = 0;
var coursebusId = "";
var mapcount = new Map();
var chapMap = new Map();
var sectMap = new Map();
var stunum = 0;
var chapBusId;
var slCode;
var chBusId;
var codeS=[];
var paginationPage=1;



$(document).ready(function () {

    localStorage.removeItem("isP");

    $("#catalog-content").fadeIn();

    /*
     判断点击事件发生在区域外的条件是：
     1. 点击事件的对象不是目标区域本身
     2. 事件对象同时也不是目标区域的子元素
     */
    $(document).mouseup(function (e) {
        var _con = $('#title_edit');   // 设置目标区域
        console.log(e.target.id)
        if (!_con.is(e.target) && _con.has(e.target).length === 0&&$("#title_edit")[0].style.display=="inline-block") { // Mark 1
            $("#course_info").css("display", "-webkit-box");
            $("#title_edit").css("display", "none");
            $("#mini_more").css("display", "-webkit-box");
            minify();
            saveUpateInfo();
        }
    });



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


    loadData();
});

/*
 * 课程面板相关配置
 * */

function switchPreview() {
    localStorage.setItem("isP","preview")
    window.location.href="../html/stuCourse.html?id=" + GetQueryString('id')+"&isP=true";

}

/*
 * 编辑课程介绍
 * */
function echo_title() {
    /*隐藏掉不要的*/
    $("#mini_more").css("display", "none");
    $("#course_info").css("display", "none");
    $("#title_edit").css("display", "inline-block");
    $("#title_edit").css("margin-top", "76px");
    $("#title_edit").css("resize", "none");
    $("#title_edit").val($("#course_info")[0].innerText);


}

/*
 * 编辑文本域监听
 * */
function invokeHandle(e) {
    var key = e.keyCode;
    if(e.shiftKey&&e.keyCode==13){
        
    }
    // else if (key == 13) {
        // alert("回车键");

        // saveUpateInfo();

        // $("#title_edit").hide();
        // $("#mini_more").css("display", "-webkit-box");
        // $("#course_info").css("display", "-webkit-box");
        // minify();

        //将内容替换为content
    // }
    if (key == 27) {
//            alert("esc键");
        //退出编辑
        minify();
        $("#course_info").css("display", "-webkit-box");
        $("#title_edit").css("display", "none");
    }
}

/*
 * 点击“更多”，显示课程简介的详情；
 * */
function showCourseSummary() {
    var content = $("#course_info").html();
    console.log(content);
    $("#div_sum_detail").html(content);

}

function saveUpateInfo() {
    var content = $("#title_edit").val();
    $("#course_info").html(content.replace(/\n/g,"<br/>"));
    $.ajax({
        url: globalurl + 'BSl/updateNotes',
        method: 'post',
        data: {
            notes: $("#course_info").html(),
            id: coursebusId
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", localStorage.getItem("token"));
        }, success: function (res) {
            if (res.success) {
                toastr.success('课程简介修改成功');
            } else {
                toastr.error('课程简介修改失败，请稍后重试！');
            }
        }, error: function (err) {
            toastr.error('网络请求失败！');
            console.log(err)
        }
    });
}


/*
 * 课程信息更多显示
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
var addFileCount=0;
var uploader_cover = new plupload.Uploader({
    browse_button: 'btn_select_file', //触发文件选择对话框的按钮，为那个元素id
    url:  globalurl +'BSl/uploadCover', //服务器端的上传页面地址
    filters:{
        max_file_size:'10mb',
        prevent_duplicates:true,
        // mime_types : [ //只允许上传图片和zip文件
        //     { title : "Zip files", extensions : "zip" }
        //     ],
        prevent_duplicates : true //不允许选取重复文件
    },
    headers:{
        Authorization:localStorage.getItem("token"),
    },
    multipart_params:{
        id:GetQueryString('id')
    },
    flash_swf_url: './Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
    silverlight_xap_url: './Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
});
uploader_cover.init();
uploader_cover.bind('FilesAdded', function(uploader, files) {
    var fileName = uploader.getFile(files[0].id);
    $("#btn_select_file").html(files[files.length-1].name);
    addFileCount++;
    console.log("added");
    console.log(fileName);
});
uploader_cover.bind('UploadProgress', function(uploader, file) {
    //每个事件监听函数都会传入一些很有用的参数，
    //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    $("#prog_file").css("width",file.percent+"%");
});
uploader_cover.bind('UploadComplete', function(uploader, file) {
    //每个事件监听函数都会传入一些很有用的参数，
    //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    console.log("UploadComplete");
    addFileCount=0;
    toastr.success('课程封面上传成功！');
    location.reload(true);
    // window.location.reload();

});

/*
 * 上传封面
 * */
// function upload_cover() {
//     $("#file_cover").click();
// }
function change_cover() {
    var dom = document.getElementById("file_cover");
    console.log(dom.files);
    var file = dom.files[0];
    console.log(file);

    //获取欲上传的文件路径
    var filepath = document.getElementById("file_cover").value;
//        alert(filepath);

    console.log($(this).val());
    console.log(filepath);
    document.getElementById("cover_path").src = filepath;

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
    if(addFileCount==0){
        toastr.warning("请先添加一张图片！");
        return;
    }
    // if(uploader_cover.)
    uploader_cover.start();
    // $("#save-image").attr("onclick", function () {
    //     tailor();
    // });
}



var uploader_data = new plupload.Uploader({
    browse_button: 'btn_select_data', //触发文件选择对话框的按钮，为那个元素id
    url:  globalurl +'BVideo/uploadVideo', //服务器端的上传页面地址
    filters:{
        max_file_size:'10mb',
        prevent_duplicates:true,
        // mime_types : [ //只允许上传图片和zip文件
        //     { title : "Zip files", extensions : "zip" }
        //     ],
        prevent_duplicates : true //不允许选取重复文件
    },
    headers:{
        Authorization:localStorage.getItem("token"),
    },
    // multipart_params:{
    //     lessonId:"",
    //     chapterId:"",
    //     type:'1'
    // },
    flash_swf_url: './Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
    silverlight_xap_url: './Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
});
uploader_data.init();
uploader_data.bind('FilesAdded', function(uploader, files) {
    var fileName = uploader.getFile(files[0].id);
    $("#btn_select_data").html(files[files.length-1].name);
    addFileCount++;
    console.log("added");
    console.log(fileName);
});
uploader_data.bind('UploadProgress', function(uploader, file) {
    //每个事件监听函数都会传入一些很有用的参数，
    //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    $("#prog_data").css("width",file.percent+"%");
});
uploader_data.bind('UploadComplete', function(uploader, file) {
    //每个事件监听函数都会传入一些很有用的参数，
    //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    addFileCount=0;
    console.log("UploadComplete");
    toastr.success('文件上传成功！');
    location.reload(true);
    // window.location.reload();

});



/*上传资料*/
function upload_source(){
    if(addFileCount==0){
        toastr.warning("请先添加文件！");
        return;
    }
 console.log("开始上传！");
 uploader_data.start();
}
function cur_courseinfo(chapter,section,courseId,secId) {
 console.log(chapter+"---"+section);

 var params = {
    lessonId:courseId,
    chapterId:secId,
    type:"1"

 };
 uploader_data.setOption("multipart_params",params);
 $("#upload_courseInfo").html("资料上传(第"+(chapter+1)+"章--第"+(section+1)+"节)");

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
        if($("#add_chapter_content").val().trim()==""){
            toastr.warning("输入不能为空！");
            return;
        }
        chapterContent = $("#add_chapter_content").val();
    }


    var em_dt = create("dt");
    var em_inline_chapter = create("div");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel;
    if (handle == 'panel1load' || handle == 'create') {
        var panel1 = $(".catalog-content");
        panel1.append(em_dt);
        panel = '.catalog-content ';
    }
    if (handle == 'create') {
        $(".no-content").css("display","none");
        $("#panel1").css("display","none");

        $.ajax({
            url: globalurl + 'BChapter/add',
            method: 'post',
            data: {
                slId: coursebusId,
                chapterName: chapterContent,
                chapterLevel: 1,
                pid: '-1'

            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {

                    loadChapter();
                    toastr.success('成功');
                    $("#add_chapter_content").val('');
                } else {
                    toastr.error('创建章节失败，请联系管理员');
                }
            }, error: function (err) {
                console.log(err);
                return 0;
            }
        });
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
    (handle == 'panel1load' || handle == 'create') ? currentCp.addClass("chapter-inline") : currentCp.addClass("sc-chapter-inline");


    if (panel == '.catalog-content ') {
        //创建容器
        for (var i = 0; i < 4; i++)
            currentCp.append("<div></div>");

        var css_inline = ["inline-index", "inline-title", "inline-delete", "inline-handle"];
        for (var k = 0; k < 4; k++)
            currentCp.find("div").eq(k).addClass(css_inline[k]);
        var item_arrow = currentCp.find("div").eq(2);
        item_arrow.append(em_inline_item_dele);
        item_arrow.next().append(em_inline_item_edit);
        // item_arrow.children().addClass("align-hollow hollow button alert");
        item_arrow.children().attr('data-open', 'delete-chapter');
        item_arrow.children().attr('onclick', 'delete_chapter_about(event)');

        // item_arrow.next().children().addClass("align-hollow hollow button");
        item_arrow.next().children().attr('data-open', 'edit-chapter');
        item_arrow.next().children().attr('onclick', 'edit_chapter_about(event)');


        if (handle == 'panel1load') {
            currentCp.find("div").eq(0).html('第' + (index + 1) + '章');
            currentCp.find("div").eq(1).html(chName);

        }
        currentCp.find("div").eq(2).children().html("<img title='删除' src='../image/icon_del.png'>");
        currentCp.find("div").eq(3).children().html("<img title='编辑章' src='../image/edit3.png'>");
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
function create_section(seName, chIndex, seIndex, handle, parti,vedioState,vedioUrl,fileUrl) {
    var em_dd = create("dd");
    var em_inline_section = create("div");
    var em_inline_item_trial = create("a");
    var em_inline_item_edit = create("a");
    var em_inline_item_dele = create("a");

    var panel1 = $(".catalog-content");
    var panel2 = $(".score_content");

    var panel;
    if (handle == 'panel1load' || handle == 'create') {
        panel = panel1;
    }
    if (handle == 'panel2load') {
        panel = panel2;
    }
    var patch_chd, patch_cht;

    if (handle == 'panel2load' || handle == 'panel1load') {
        patch_cht = panel.find("dt").eq(chIndex);
        for (var i = 0; i < seIndex; i++) {
            patch_cht = patch_cht.next();
        }
        patch_cht.after(em_dd);
        patch_chd = patch_cht.next('dd');
        patch_chd.addClass("section");
        patch_chd.append(em_inline_section);
        patch_chd.children().addClass("section-inline");
        var currentSt = patch_chd.children();
    }
    if (handle == 'create') {
        if($("#add_section_title").val().trim()==""||$("#chapter_sum").val()==null){
            toastr.warning("输入不能为空！");
            return;
        }
        var chapter_index = $("#chapter_sum").val();
        var parentId = parseInt(chapter_index);
        seName = $("#add_section_title").val();
        var test_val;
        if ($('#trial_check').is(':checked')==true&&$('#video_check').is(':checked')==true&&$('#data_check').is(':checked')==true) {
            test_val = "1,2,3";
        }else if ($('#trial_check').is(':checked')==true&&$('#video_check').is(':checked')==false&&$('#data_check').is(':checked')==true) {
            test_val = "1,3";
        }else if ($('#trial_check').is(':checked')==false&&$('#video_check').is(':checked')==true&&$('#data_check').is(':checked')==true) {
            test_val = "2,3";
        }else if ($('#trial_check').is(':checked')==false&&$('#video_check').is(':checked')==false&&$('#data_check').is(':checked')==true) {
            test_val = "3";
        }else if ($('#trial_check').is(':checked')==true&&$('#video_check').is(':checked')==false&&$('#data_check').is(':checked')==false) {
            test_val = "1";
        }else if ($('#trial_check').is(':checked')==true&&$('#video_check').is(':checked')==true&&$('#data_check').is(':checked')==false) {
            test_val = "1,2";
        }else if ($('#trial_check').is(':checked')==false&&$('#video_check').is(':checked')==true&&$('#data_check').is(':checked')==false) {
            test_val = "2";
        }else {
            test_val = "0";
        }

        $.ajax({
            url: globalurl + 'BChapter/add',
            method: 'post',
            data: {
                slId: coursebusId,
                chapterName: seName,
                chapterLevel: 2,
                pid: chapMap.get(parentId),
                isTest: test_val
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {
                    $(".no-content").fadeOut();
                    loadChapter();
                    loadSlDetail();
                    $("#add_section_title").val('');

                    document.getElementById("video_check").checked=false;
                    document.getElementById("data_check").checked=false;
                    toastr.success('成功');
                } else {
                    toastr.error('创建章节失败，请联系管理员');
                }


            }, error: function (err) {
                console.log(err);
                return 0;
            }
        });

    }


    if (handle == 'panel1load') {
        //创建容器
        for (var i = 0; i < 7; i++)
            currentSt.append("<div></div>");

        var css_inline = ["line_index", "line_preface", "line_delete", "line_handle", "line_mv","line_upload","line_scheme"];
        for (var k = 0; k < 7; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_dele);
        inline_tiral.push(em_inline_item_edit);
        inline_tiral.push(em_inline_item_trial);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 5; j++) {
            find_item.eq(j + 2).append("<a></a>");
            // find_item.eq(j + 2).children().addClass(trial_demo[j]);

        }
        var lessonAbout={};
        lessonAbout.cname=encodeURI(encodeURI($('#lessonName').html()));
        lessonAbout.nodePid=encodeURI(encodeURI($("#catalog-content").find("dt").eq($("#catalog-content").find("dt").length-1)[0].children[0].children[0].innerHTML));
        lessonAbout.nodePname=encodeURI(encodeURI($("#catalog-content").find("dt").eq($("#catalog-content").find("dt").length-1)[0].children[0].children[1].innerHTML));
        lessonAbout.nodeCid=encodeURI(encodeURI('第' + (seIndex + 1) + '节'));
        lessonAbout.nodeCname=encodeURI(encodeURI(seName));
        var res=JSON.stringify(lessonAbout);
        find_item.eq(4).children().attr('href', 'uploadVedio.html?businessId=' + parti + '&courseId=' + coursebusId + '&id=' + GetQueryString('id')+"&courseinfo="+res+"&vedioUrl="+encodeURI(encodeURI(vedioUrl)));
        find_item.eq(4).children().attr('target', '_blank');
        find_item.eq(5).children().attr('data-open', 'file_modal');
        find_item.eq(5).children().attr('target', '_blank');
        find_item.eq(5).children().attr('onclick', 'cur_courseinfo('+chIndex+','+seIndex+',"'+coursebusId+'","'+parti+'")');

        find_item.eq(6).children().attr('href', 'markdown.html?businessId=' + parti + '&courseId=' + coursebusId + '&id=' + GetQueryString('id')+"&courseinfo="+res);
        find_item.eq(6).children().attr('target', '_blank');
        find_item.eq(3).children().attr('data-open', 'edit-section');
        find_item.eq(3).children().attr('onclick', 'edit_section_about(event)');
        find_item.eq(2).children().attr('data-open', 'delete-section');
        find_item.eq(2).children().attr('onclick', 'delete_section_about(event)');

        //往里塞值
        find_item.eq(0).html('第' + (seIndex + 1) + '节');
        find_item.eq(1).html(seName);
        console.log('第' + (seIndex + 1) + '节'+vedioState+vedioState.indexOf("2"));
        if(vedioState.indexOf("2")!=-1) {
            console.log("create");
            if(vedioUrl==""){
                find_item.eq(4).children().html("<img title='未上传视频' src='../image/mv_icon_no.png'>");
            }else{
                find_item.eq(4).children().html("<img title='上传视频' src='../image/mv_icon.png'>");
            }

            if(vedioState.indexOf("3")==-1) {
                find_item.eq(4).css("position","relative");
                find_item.eq(4).css("right","33px");
            }
        }else{
            console.log("no create");
        }
        if(vedioState.indexOf("3")!=-1) {
            if(fileUrl==""){
                find_item.eq(5).children().html("<img title='未上传资料' src='../image/icon_rar_no.png'>");
            }else{
                find_item.eq(5).children().html("<img title='上传资料' src='../image/icon_rar.png'>");
            }

        }
        // }else{
        //     find_item.eq(4).children().removeAttr('href');
        //     find_item.eq(4).children().css('cursor','default');
        //     find_item.eq(4).children().html("<img title='未开设视频' src='../image/mv_icon_no.png'>");
        // }

        find_item.eq(6).children().html("<img title='项目任务书' src='../image/icon_book.png'>");
        find_item.eq(3).children().html("<img title='编辑节' src='../image/edit3.png'>");
        find_item.eq(2).children().html("<img title='删除' src='../image/icon_del.png'>");
    }
    if (handle == 'panel2load') {
        //创建容器
        for (var i = 0; i < 4; i++){
            if(i==3){
                currentSt.append("<div title='待打分'></div>");
            }else{
                currentSt.append("<div></div>");
            }
        }

        var css_inline = ["line_index", "line_face", "line_delete", "line_handle line_see "];
        for (var k = 0; k < 4; k++)
            currentSt.find("div").eq(k).addClass(css_inline[k]);

        var find_item = currentSt.find("div");
        var inline_tiral = new Array();
        inline_tiral.push(em_inline_item_trial);
        inline_tiral.push(em_inline_item_dele);

        var trial_demo = ["align-hollow hollow button", "align-hollow hollow button alert"];
        for (var j = 0; j < 2; j++) {
            find_item.eq(j + 2).append("<a></a>");
            // find_item.eq(j + 2).children().addClass(trial_demo[j]);

        }
        find_item.eq(3).children().attr('data-open', 'score-count');
        find_item.eq(3).children().attr('onclick', 'seewait(event)');
        find_item.eq(2).children().attr('data-open', 'score-info');
        find_item.eq(2).children().attr('onclick', 'seeloan(event)');

        //往里塞值
        find_item.eq(0).html('<span style="display: inline-block">第' + (seIndex + 1) + '节</span>');
        find_item.eq(1).html(seName);
        var people=stunum==""?"0":stunum;
        find_item.eq(3).children().html(people+"人  <img  style='margin-bottom: 3px;' src='../image/icon_bit.png'>");
        find_item.eq(2).children().html("<img style='margin-bottom: 3px;'  title='查看分数' src='../image/icon_seeCore.png'>");
    }


}

//panel1 目录
/*
 * 修改章
 * */

function edit_chapter_about(e) {

    var chName = e.currentTarget.parentNode.parentNode.childNodes[1].innerHTML;
    var chId = e.currentTarget.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1;
    $("#edit_chapter_content").val(chName);
    $("#edit_chapter").off().click(function () {
        if($("#edit_chapter_content").val().trim()==""){
            toastr.warning("输入不能为空！");
            return;
        }
        $.ajax({
            url: globalurl + 'BChapter/add',
            method: 'post',
            data: {
                slId: coursebusId,
                businessId: chapMap.get(parseInt(chId)),
                chapterName: $("#edit_chapter_content").val(),
                chapterLevel: 1,
                pid: '-1'
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {

                if (res.success) {
                    loadChapter();
                    toastr.success('成功');
                } else {
                    toastr.error('修改信息失败，请联系管理员');
                }

            }, error: function (err) {
                console.log(err)
            }
        });

    });


}
/* 删除章*/
function delete_chapter_about(e) {
    var chId = e.currentTarget.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1;
    $("#delete_chapter").off().click(function () {
        $(".reveal-overlay").css("display","none");
        $.ajax({
            url: globalurl + 'BChapter/remove',
            method: 'post',
            data: {
                id: chapMap.get(parseInt(chId)),
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {

                    loadChapter();
                    loadSlDetail();

                    toastr.success('成功');
                } else {
                    toastr.error(res.message);
                }
            }, error: function (err) {
                console.log(err)
            }
        });

    });
}

/* 删除节*/
function delete_section_about(e) {
    console.log(e.currentTarget.parentNode.parentNode.parentNode.attributes[1].value);
   /* var chId = e.currentTarget.parentNode.parentNode.previousSibling.attributes[1].nodeValue;
    var seId = e.currentTarget.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1;*/
   var queryId=e.currentTarget.parentNode.parentNode.parentNode.attributes[1].value;

    $("#delete_section").off().click(function () {
        $.ajax({
            url: globalurl + 'BChapter/remove',
            method: 'post',
            data: {
                id: sectMap.get(queryId),
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {
                    loadChapter();
                    loadSlDetail();
                    toastr.success('成功');
                } else {
                    toastr.error(res.message);
                }
            }, error: function (err) {
                console.log(err)
            }
        });

    });
}
/*
 * 修改节
 * */
function edit_section_about(e) {
    // console.log(e.target.parentNode.parentNode.parentNode)
    //借助保存的id，寻找到插入的位置
    // console.log(e.target);

    $("#chapter-select").empty();
    var chLen = $("#catalog-content").find("dt").length;
    for (var i = 0; i < chLen; i++) {
        $("#chapter-select").append("<option value='" + i + "'>第" + (i + 1) + "章</option>");
    }
    var chId = e.currentTarget.parentNode.parentNode.parentNode.attributes[1].nodeValue;
    $("#chapter-select").val(chId.slice(0, 1));
    var seName = e.currentTarget.parentNode.parentNode.childNodes[1].innerHTML;
    var contentVideo = e.currentTarget.parentNode.parentNode.childNodes[4].firstChild.innerHTML;
    var contentData = e.currentTarget.parentNode.parentNode.childNodes[5].firstChild.innerHTML;
    console.log(contentVideo+"-----"+contentData);
    if(contentVideo!=""){
        console.log("contentVideo   check");
        document.getElementById('edit_video_check').checked=true;
        // $("#edit_video_check").attr("checked", true);
    }else{
        console.log("contentVideo   check false");
        document.getElementById("edit_video_check").checked=false;
        // $("#edit_video_check").removeAttr("checked");
    }
    if(contentData!=""){
        console.log("contentData  check");
        document.getElementById("edit_data_check").checked=true;
        // $("#edit_data_check").attr("checked", true);
    }else{
        console.log("contentData  check false");
        document.getElementById("edit_data_check").checked=false;
        // $("#edit_data_check").removeAttr("checked");
    }
    var seId = e.currentTarget.parentNode.parentNode.childNodes[0].innerHTML.match(/\d+/g)[0] - 1;
    // console.log(seId)
    $("#edit_section_content").val(seName);


    $("#edit_section").off().click(function () {
        if($("#edit_section_content").val().trim()==""){
            toastr.warning("输入不能为空！");
            return;
        }
        var test_val;
        if ($('#edit_trial_check').is(':checked')==true&&$('#edit_video_check').is(':checked')==true&&$('#edit_data_check').is(':checked')==true) {
            test_val = "1,2,3";
        }else if ($('#edit_trial_check').is(':checked')==true&&$('#edit_video_check').is(':checked')==false&&$('#edit_data_check').is(':checked')==true) {
            test_val = "1,3";
        }else if ($('#edit_trial_check').is(':checked')==false&&$('#edit_video_check').is(':checked')==true&&$('#edit_data_check').is(':checked')==true) {
            test_val = "2,3";
        }else if ($('#edit_trial_check').is(':checked')==false&&$('#edit_video_check').is(':checked')==false&&$('#edit_data_check').is(':checked')==true) {
            test_val = "3";
        }else if ($('#edit_trial_check').is(':checked')==true&&$('#edit_video_check').is(':checked')==false&&$('#edit_data_check').is(':checked')==false) {
            test_val = "1";
        }else if ($('#edit_trial_check').is(':checked')==true&&$('#edit_video_check').is(':checked')==true&&$('#edit_data_check').is(':checked')==false) {
            test_val = "1,2";
        }else if ($('#edit_trial_check').is(':checked')==false&&$('#edit_video_check').is(':checked')==true&&$('#edit_data_check').is(':checked')==false) {
            test_val = "2";
        }else {
            test_val = "0";
        }
        $.ajax({
            url: globalurl + 'BChapter/add',
            method: 'post',
            data: {
                slId: coursebusId,
                businessId: sectMap.get(parseInt(chId) + '-' + parseInt(seId)),
                chapterName: $("#edit_section_content").val(),
                chapterLevel: 2,
                pid: chapMap.get(chapBusId),
                isTest: test_val
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {
                    loadChapter();
                    loadSlDetail();
                    toastr.success('成功');
                } else {
                    toastr.error('修改节失败，请联系管理员');
                }
            }, error: function (err) {
                console.log(err)
            }
        });

    });

}

//panel2 成绩
var sid;
/*重新打分*/
function remove(e) {
    sid = e.target.parentNode.parentNode.getAttribute("id");
}
/*查看代码*/
function checkIt(e) {
    $(".reveal-overlay").fadeOut();
    var code=codeS[e.target.parentNode.parentNode.rowIndex-1];
    console.log(e.target)
    if(localStorage.getItem("role")=="1002"){
        if(localStorage.getItem("teache")=="waited"){
            toastr.warning("正在清理che空间，请等待1-2分钟");
        }
        if(localStorage.getItem("teache")=="open"){
            $.ajax({
                url: globalurl + 'BChapter/cheStart',
                method: 'post',
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.getItem("token"));
                },
                data: {
                    teaCode: localStorage.getItem("stucode"),
                    slCode: slCode,
                    flag: (localStorage.getItem("role") == '1003' ? '1' : '0')
                },
                success: function (res) {
                    if (res.success) {
                        localStorage.setItem("timer",res.result.endTime);
                        window.open("eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + chBusId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + code + "&ccode=" + slCode + "&id=" + GetQueryString("id"))
                    } else {

                        toastr.warning(res.message);
                    }

                }, error: function (err) {
                    console.log(err)
                }
            });
        }

        if(localStorage.getItem("teache")!="waited"){
            if(localStorage.getItem("teache")!="open"){
                $("#header").fadeOut();
                $("#content").fadeOut();
                $("#footer").fadeOut();
                $("#water").fadeIn();

                $.ajax({
                    url: globalurl + 'BChapter/cheStart',
                    method: 'post',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.getItem("token"));
                    },
                    data: {
                        teaCode: localStorage.getItem("stucode"),
                        slCode: slCode,
                        flag: (localStorage.getItem("role") == '1003' ? '1' : '0')
                    },
                    success: function (res) {
                        if (res.success) {
                            if(localStorage.getItem("teache")=="waited"){
                                localStorage.setItem("address","eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + chBusId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + code + "&ccode=" + slCode + "&id=" + GetQueryString("id"));
                                localStorage.setItem("teache","open");
                            }
                            if(localStorage.getItem("teache")==null){
                                localStorage.setItem("address","eclipse.html?uri=" + encodeURIComponent(res.result.url) + "&businessId=" + chBusId + "&pnum=" + encodeURIComponent(res.result.port) + "&scode=" + code + "&ccode=" + slCode + "&id=" + GetQueryString("id"));
                                localStorage.setItem("teache","open");
                                localStorage.setItem("timer",res.result.endTime);
                                $("#water").fadeOut();
                                $("#header").fadeIn();
                                $("#content").fadeIn();
                                $("#footer").fadeIn();
                                window.open(localStorage.getItem("address"));
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
        window.open("eclipse.html?businessId=" + chBusId  + "&scode=" + localStorage.getItem("stucode") + "&ccode=" + slCode + "&id=" + GetQueryString("id"));

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

/*未打分列表*/
function seewait(e) {

    var Id = e.currentTarget.parentNode.parentNode.parentNode.attributes[1].nodeValue;
    chBusId = sectMap.get(Id);
    getWaitList(1);

}
/*根据当前章节id和页数获得未打分列表*/
function getWaitList(page){
    paginationPage =page;
    var obj = [];
    $.ajax({
        url: globalurl + 'BChapter/queryScoreListByChapterId',
        method: 'get',
        data: {
            chapterId: chBusId,
            hasMark: 0,
            page:paginationPage,
            rows:10
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", localStorage.getItem("token"));
        }, success: function (res) {
                var list = res.rows;
                initPagination('pagination-yang', res.total, paginationPage, getWaitList);

                var table = '';
                if (list.length < 1) {
                    table = '<tr>' + '<td colspan="6" style="text-align: center">' + "当前数据为空" + '</td>' + '</tr>';
                } else {
                    codeS=[];
                    for (var i = 0; i < list.length; i++) {
                        codeS.push(list[i].code);
                        var item = '<tr id="' + list[i].sid + '">' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td>' + list[i].className + '</td>' +
                            '<td>' + list[i].code + '</td>' +
                            '<td>' + list[i].name + '</td>' +
                            '<td>' + '<input type="number" id="stu' + i + '"/>'  + '</td>' +
                            '<td>' + '<a onclick="checkIt(event)">' + "查看代码" + '</a>' + '</td>' +
                            '</tr>';
                        table += item;
                        obj.push({"chapterId": chBusId, "score": "", "studentId": list[i].sid});
                    }
                }

                $("#load-list").html(table)

        }, error: function (err) {
            console.log(err)
        }

    });

    $("#submitScore").off().click(function () {

        for (var i in obj) {
            obj[i].score = $("#stu" + i).val() == '' ? '-1' : $("#stu" + i).val();
        }

        $.ajax({
            url: globalurl + 'BChapter/markBatch',
            method: 'post',
            data: {
                scoreInfoList: JSON.stringify(obj)
            },
            beforeSend: function (res) {
                res.setRequestHeader("Authorization", localStorage.getItem("token"));
            }, success: function (res) {
                if (res.success) {
                    $("#score-count").css("display", "none");
                    toastr.success('成功');
                    loadChapter();
                } else {
                    $("#score-count").css("display", "none");
                    $(".reveal-overlay").css("display", "none");
                    toastr.error('打分失败，请联系管理员');
                }


            }, error: function (err) {
                console.log(err)
            }
        });
    })
}



/*打分列表*/
function seeloan(e) {
    var Id = e.currentTarget.parentNode.parentNode.parentNode.attributes[1].nodeValue;
    chBusId = sectMap.get(Id);
    getLoanList(1);
}

/*模糊查询已打分的学生信息*/
function searchScoreList(page) {
    var scorepage =page;
    $.ajax({
        url: globalurl + 'BChapter/queryScoreListByChapterId',
        method: 'get',
        data: {
            chapterId: chBusId,
            hasMark: 1,
            page:scorepage,
            rows:10,
            stuInfo: $("#score-name").val(),
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", localStorage.getItem("token"));
        }, success: function (res) {
            // console.log(res)
            initPagination( 'pagination-yang2', res.total, scorepage, getLoanList);
            var list = res.rows;
            var table = '';
            if (list.length < 1) {
                table = '<tr>' + '<td colspan="6" style="text-align: center">' + "当前数据为空" + '</td>' + '</tr>';
            } else {
                for (var i = 0; i < list.length; i++) {
                    var item = '<tr id="' + list[i].scoreId + '">' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + list[i].className + '</td>' +
                        '<td>' + list[i].code + '</td>' +
                        '<td>' + list[i].name + '</td>' +
                        '<td>' + (list[i].score == -1 ? '未打分' : list[i].score) + '</td>' +
                        '<td>' + '<a data-open="reset-score" onclick="remove(event)">' + "重新打分" + '</a>' + '</td>' +
                        '</tr>';
                    table += item;
                }
            }

            $("#mark-list").html(table)


        }, error: function (err) {
            console.log(err)
        }

    });
}

/*根据当前章节id和页数获得已打分列表*/
function getLoanList(page) {
    paginationPage=page;
    $.ajax({
        url: globalurl + 'BChapter/queryScoreListByChapterId',
        method: 'get',
        data: {
            chapterId: chBusId,
            hasMark: 1,
            page:paginationPage,
            rows:10
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", localStorage.getItem("token"));
        }, success: function (res) {
                var list = res.rows;
                initPagination( 'pagination-yang2', res.total, paginationPage, getLoanList);
                var table = '';
                if (list.length < 1) {
                    table = '<tr>' + '<td colspan="6" style="text-align: center">' + "当前数据为空" + '</td>' + '</tr>';
                } else {
                    for (var i = 0; i < list.length; i++) {
                        var item = '<tr id="' + list[i].scoreId + '">' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td>' + list[i].className + '</td>' +
                            '<td>' + list[i].code + '</td>' +
                            '<td>' + list[i].name + '</td>' +
                            '<td>' + (list[i].score == -1 ? '未打分' : list[i].score) + '</td>' +
                            '<td>' + '<a data-open="reset-score" onclick="remove(event)">' + "重新打分" + '</a>' + '</td>' +
                            '</tr>';
                        table += item;
                    }
                }


                $("#mark-list").html(table);

            $("#resetThis").off().click(function () {

                $.ajax({
                    url: globalurl + 'BChapter/reMark',
                    method: 'post',
                    data: {
                        id: sid
                    },
                    beforeSend: function (res) {
                        res.setRequestHeader("Authorization", localStorage.getItem("token"));
                    }, success: function (res) {

                        if (res.success) {
                            $("#score-count").css("display", "none");
                            toastr.success('成功');
                            loadChapter();
                        } else {
                            toastr.error('重置失败，请联系管理员');
                        }

                    }, error: function (err) {
                        console.log(err)
                    }
                });
            });
            /*搜索刷新列表*/
            // $("#search-score").click(searchScoreList(1));

        }, error: function (err) {
            console.log(err)
        }

    });
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

/*加载课程信息*/
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
                    $('#coverUrl').attr('src', imagepath + obj.coverUrl);
                    coursebusId = obj.businessId;
                    slCode=obj.slCode;
                    $(".tea-wireless").find('span')[0].innerHTML=obj.isTest;

                    $(".tea-wireless-mv").find('span')[0].innerHTML=obj.video;
                    $("#course_info").show(function () {
                        minify();
                    });
                }
            } else {
                removeLoading('test');
                alert(result.message);
            }
        },
        error: function (error) {
            removeLoading('test');
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    })
}
/*加载目录及成绩面板*/
function loadChapter() {
    $("#catalog-content").html('');
    $("#score-content").html('');
    $("#chapter_sum").empty();
    $(".reveal-overlay").fadeOut();
    $.ajax({
        url: globalurl + 'BChapter/queryBChaptersWithoutAuth',
        method: 'get',
        data: {
            slId: GetQueryString('id')
        },
        beforeSend: function (res) {
            res.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        success: function (result) {
            if(result==undefined){
                removeLoading('test');
                alert("访问服务器异常！");
                return;
            }
            // console.log(JSON.stringify(result));
            if (result.success) {
                if (result.result.chapterList.length < 1) {
                    //TODO 该课程还没有章节
                    $(".no-content").fadeIn();
                    $("#panel1").css("text-align","center");
                    $("#panel2").css("text-align","center");
                    $("#panel1").css("display","flex");
                    $("#panel2").css("display","flex");
                    removeLoading('test');
                } else {

                    $("#panel1").css("text-align","left");
                    $("#panel2").css("text-align","left");
                    $("#panel1").css("display","unset");
                    $("#panel2").css("display","unset");
                    var list = result.result.chapterList;
                    //TODO 渲染章节列表
                    var flag = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].chapterLevel == 1) {
                            create_chapter(list[i].chapterName, i, 'panel1load');
                            create_chapter(list[i].chapterName, i, 'panel2load');
                            $("#catalog-content").find('dt').eq(i).attr('data-chapter-id', i);
                            $("#score-content").find('dt').eq(i).attr('data-chapter-id', i);
                            $("#chapter_sum").append("<option value='" + i + "'>第" + (i + 1) + "章</option>");
                            chapMap.set(i, list[i].businessId);

                        }

                        if (list[i].childList.length > 0) {
                            for (var j = 0; j < list[i].childList.length; j++, flag++) {
                                stunum = list[i].childList[j].studentNum;
                                create_section(list[i].childList[j].chapterName, i, j, 'panel1load', list[i].childList[j].businessId,list[i].childList[j].isTest,list[i].childList[j].videoUrl,list[i].childList[j].fileUrl);
                                create_section(list[i].childList[j].chapterName, i, j, 'panel2load', list[i].childList[j].businessId,list[i].childList[j].isTest,list[i].childList[j].videoUrl,list[i].childList[j].fileUrl);
                                $("#catalog-content").find('dd').eq(flag).attr('data-section-id', i + '-' + j);
                                $("#score-content").find('dd').eq(flag).attr('data-section-id', i + '-' + j);
                                sectMap.set(i + '-' + j, list[i].childList[j].businessId);

                            }

                        }
                        mapcount.set(i, list[i].childList.length);

                    }

                    removeLoading('test');
                }
            } else {
                removeLoading('test');
                alert(result.message);
            }
        },
        error: function (error) {
            removeLoading('test');
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    })
}

/**
 * 初始化分页按钮
 * @param total 总页数
 * @param pageNu  当前页数
 */
function initPagination(pagination,pages,pageNu,twicePagination){
    if(0 == pages)
        pages = 1;
    pages = Math.ceil(pages/10);

    $('#'+pagination).empty();
    $('#'+pagination).removeData("twbs-pagination");
    $('#'+pagination).unbind("page");
    $('#'+pagination).twbsPagination({
        totalPages: pages,
        startPage: pageNu,
        visiblePages: 5,
        onPageClick: function (event, page) {
            paginationPage = page;
            if(twicePagination == null){
                twicePagination.call(this,page);
            }else{
                eval(twicePagination).call(this,page);
            }

        }
    });
}







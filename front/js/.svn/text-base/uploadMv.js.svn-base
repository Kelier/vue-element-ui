/**
 * Created by John Yan on 9/14/2017.
 */
$(function () {
    localStorage.removeItem("isP");
    $("#lay-role").css("background", "#ff6d10");
    var getInfo = JSON.parse(GetQueryString("courseinfo"));
    console.log(getInfo);
    var vedioUrl = GetQueryString("vedioUrl");
    var str ="《"+ decodeURI(decodeURI(getInfo.cname)) + "》&nbsp;&nbsp;&nbsp;&nbsp;" + decodeURI(decodeURI(getInfo.nodePid)) + "&nbsp; " + decodeURI(decodeURI(getInfo.nodePname)) + " &nbsp;——&nbsp;" + decodeURI(decodeURI(getInfo.nodeCid)) + " " + decodeURI(decodeURI(getInfo.nodeCname));
    console.log(str+vedioUrl);
    $("#cor_name").html("《"+ decodeURI(decodeURI(getInfo.cname)) + "》");
    $("#chp_name").html(decodeURI(decodeURI(getInfo.nodePid)) + "&nbsp; " + decodeURI(decodeURI(getInfo.nodePname)));
    var sectionInfo = decodeURI(decodeURI(getInfo.nodeCid)) + "&nbsp; " + decodeURI(decodeURI(getInfo.nodeCname));
    $("#sec_name").html(sectionInfo);
    $("#sec_name").attr("title",sectionInfo);
    var thePlayer = flowplayer(".player", {
        clip: {
            sources: [{
                type: "video/webm",
                src: imagepath+vedioUrl
            }, {
                type: "video/mp4",
                src:  imagepath+vedioUrl
            }]
        }
    });

    // $("#div_vedio").html('<div class="flowplayer" style="width: 60%;height: 300px;margin-left: 20%" data-swf="flowplayer.swf" data-ratio="0.4167"> <video> <source type="video/webm" id="video_source" src="https://edge.flowplayer.org/bauhaus.webm"> </video> </div>');
   /* $.ajax({
        url: globalurl + 'BChapter/getMdFileById',
        method: 'post',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.getItem("token"));
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
    });*/

    //实例化一个plupload上传对象
    var uploader = new plupload.Uploader({
        browse_button: 'browse', //触发文件选择对话框的按钮，为那个元素id
        url:  globalurl +'BVideo/uploadVideo', //服务器端的上传页面地址
        filters:{
            max_file_size:'1Gb',
            prevent_duplicates:true
        },
        headers:{
            Authorization:localStorage.getItem("token"),
        },
        multipart_params:{
            lessonId:GetQueryString('courseId'),
            chapterId:GetQueryString('businessId'),
            type:"0"
        },
        flash_swf_url: './Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
        silverlight_xap_url: './Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
    });

    //在实例对象上调用init()方法进行初始化
    uploader.init();

    //绑定各种事件，并在事件监听函数中做你想做的事
    uploader.bind('FilesAdded', function(uploader, files) {
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
        console.log(files);
        var fileName = uploader.getFile(files[0].id);
        $("#span_filename").html(files[files.length-1].name);
        $("#input_progress").css("width","0");
        $("#span_percent").html("");
        console.log("added");
        console.log(fileName);
    });
    uploader.bind('UploadProgress', function(uploader, file) {
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
        $("#input_progress").css("width",file.percent+"%");
        $("#span_percent").html(file.percent+"%");
    });
    uploader.bind('Error', function(uploader, errObject) {
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
        toastr.error('视频上传报错，请重试！错误信息:'+errObject.message);
    });

    uploader.bind('FileUploaded', function(uploader, file,responseObject) {
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
       console.log(responseObject.response);

       var vurl = imagepath+JSON.parse(responseObject.response).result;
       console.log(JSON.parse(responseObject.response).result);
       console.log(vurl);
        thePlayer.shutdown();
        thePlayer.unload();
        $(".player").html("");
        thePlayer = flowplayer(".player", {
            clip: {
                sources: [{
                    type: "video/webm",
                    src: vurl
                }, {
                    type: "video/mp4",
                    src: vurl
                }]
            }
        });
    });
    uploader.bind('UploadComplete', function(uploader, file) {
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
        console.log("UploadComplete");
        toastr.success('视频上传成功！');

    });
    //......
    //......

    //最后给"开始上传"按钮注册事件
    document.getElementById('start_upload').onclick = function() {
        $("#input_progress").css("width","0");
        uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
    }

});

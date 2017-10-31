$(function () {
    localStorage.removeItem("isP");

    $("#lay-role").css("background", "#ff6d10");
    var getInfo = JSON.parse(GetQueryString("courseinfo"));
    console.log(getInfo);
    var str = "《"+decodeURI(decodeURI(getInfo.cname)) + "》&nbsp;&nbsp;&nbsp;&nbsp;" + decodeURI(decodeURI(getInfo.nodePid)) + "   " + decodeURI(decodeURI(getInfo.nodePname)) + " --- " + decodeURI(decodeURI(getInfo.nodeCid)) + "   " + decodeURI(decodeURI(getInfo.nodeCname));
    console.log(str);
    $(".course-info-mv").find('h4').html(str);

    var vedioUrl = GetQueryString("vedioUrl");
    console.log(vedioUrl);
    var thePlayer = flowplayer(".player", {
        clip: {
            sources: [{
                type: "video/webm",
                src: imagepath+vedioUrl
            }, {
                type: "video/mp4",
                src: imagepath+vedioUrl
            }]
        }
    });

});
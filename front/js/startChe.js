/**
 * Created by John Yan on 9/14/2017.
 */
//处理全屏信息
function launchFullScreen(e) {
    if (e.requestFullScreen) {
        e.requestFullScreen();
    } else if (e.mozRequestFullScreen) {
        // 其次，检测Mozilla的方法
        e.mozRequestFullScreen();
    } else if (e.webkitRequestFullScreen) {
        // if 检测 webkit的API
        e.webkitRequestFullScreen();
    }

};

// 退出全屏,不用管具体是哪个元素，因为屏幕是唯一的。
function cancelFullscreen() {

    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    
};

function dumpFullscreen() {
    var d = document;
    var fullE = null;
    var fullEnable = "fullScreen is disable!";
    if (d.fullScreenElement) {
        fullE = d.fullScreenElement;
    } else if (d.mozFullScreenElement) {
        // 如果有问题，把mozFullscreenElement 改为 mozFullScreenElement,S大写
        fullE = d.mozFullScreenElement;
    } else if (d.webkitFullscreenElement) {
        // 本人的为chrome， Fullscreen 之中，s为小写。
        fullE = d.webkitFullscreenElement;
    }
    // 如果有问题，请切换 fullScreen 中 s 的大小写。
    if (d.fullScreenEnabled) {
        fullEnable = d.fullScreenEnabled;
    } else if (d.mozFullScreenEnabled) {
        fullEnable = d.mozFullScreenEnabled;
    } else if (d.webkitFullscreenEnabled) {
        // 注意 Fullscreen 的中间s大小写
        fullEnable = d.webkitFullscreenEnabled;
    }
    //
    if (window.console) {
        console.dir(fullE);
    } else if (fullE) {
        alert(fullE.tagName);
    } else {
        alert("全屏元素是:" + fullE);
    }
    //
    if (window.console) {
        console.info("允许全屏:" + fullEnable);
    } else if (fullEnable) {
        alert("允许全屏:" + fullEnable);
    } else {
        alert("允许全屏:" + fullEnable);
    }
};


$(function () {

    $(document).foundation();
        //左右拉伸


        var oBox = $("#container")[0], oTop = $("#probook")[0], oBottom = $("#lay")[0], oLine = $("#line")[0];

        oLine.onmousedown = function (e) {
            var disX = (e || event).clientX;
            oLine.left = oLine.offsetLeft;
            document.onmousemove = function (e) {
                var iT = oLine.left + ((e || event).clientX - disX);
                var e = e || window.event, tarnameb = e.target || e.srcElement;
                var maxT = oBox.clientWight - oLine.offsetWidth;
                oLine.style.margin = 0;
                iT < 0 && (iT = 0);
                iT > maxT && (iT = maxT);
                console.log(iT)
                oLine.style.left = oTop.style.width = iT>1421?(iT-30):iT + "px";
                oBottom.style.width = oBox.clientWidth - iT + "px";
                return false
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                oLine.releaseCapture && oLine.releaseCapture()
            };
            oLine.setCapture && oLine.setCapture();
            return false
        }



    var xiaoche, busId, pnum, scode, ccode, Id;
    if(GetQueryString("isC")=="right"){
        $("#check-it").attr("disabled","disabled");
    }
    if(localStorage.getItem("isP")!="preview"){
        $("#lay").append("<iframe id='this'></iframe>");
    }
    if(localStorage.getItem("isP")=="preview"&&sessionStorage.getItem("role")=="1002"){
        $("#lay").append("<img src='../image/screenshot.jpg' id='search'></img>");
    }


    /*学生该有的界面*/
    if (sessionStorage.getItem("role") == "1003") {
        $("#taido-it").fadeIn();
        $("#check-it").fadeIn();

    }
    /*获取地址栏参数*/
    if (sessionStorage.getItem("role") == "1002" || sessionStorage.getItem("role") == "1003") {
        xiaoche = decodeURIComponent(GetQueryString('uri'));
        busId = GetQueryString('businessId');
        pnum = decodeURIComponent(GetQueryString('pnum'));
        scode = GetQueryString('scode');
        ccode = GetQueryString('ccode');
        Id = GetQueryString('id');
        $("#this").attr("src", xiaoche);

    }
    /*检出代码*/
    if (sessionStorage.getItem("role") == "1002") {
        if (localStorage.getItem("isP") != "preview") {
            $.ajax({
                url: globalurl + 'BChapter/checkoutCode',
                method: 'post',
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
                },
                data: {
                    port: pnum,
                    stuCode: scode,
                    slCode: ccode
                },
                success: function (res) {
                    if (res.success)
                        toastr.success('检出成功');
                    else
                        toastr.error(res.message);

                }, error: function (err) {
                    console.log(err)
                }
            })
        }



    }
    /*
     * 不同身份跳转
     * */
    if(localStorage.getItem("isP")=="preview"||sessionStorage.getItem("role")=="1003")
        $("#gohis").attr('href', 'stuCourse.html?id=' + Id);

    if(sessionStorage.getItem("role")=="1002")
        $("#gohis").attr('href', 'teaCourse.html?id=' + Id);

    if (localStorage.getItem("timer") != null&&localStorage.getItem("isP")!="preview") {
        $(".count-title").fadeIn();
        $(".countdown").fadeIn();
        $("#delay-it").fadeIn();
        $("#close-it").fadeIn();
        var startTime = new Date();//设置开启时间
        startTime.setTime(parseInt(localStorage.getItem("timer")));
        var countTop = formatDate(startTime);
        $('.countdown').downCount({
            date: countTop,
            offset: +8
        }, function () {
            toastr.warning('che已关闭');
            localStorage.removeItem("chestatus");
            localStorage.removeItem("teache");
            if(sessionStorage.getItem("role")=="1003"){
                setTimeout(function () {
                    window.location.href = 'stuCourse.html?id=' + Id;
                },1000);
            }
            if(sessionStorage.getItem("role")=="1002"){
                setTimeout(function () {
                    window.location.href = 'teaCourse.html?id=' + Id;
                },1000);
            }

        });

    }
    /*格式化日期*/
    function formatDate(d) {
        var month = ((d.getMonth() + 1) > 10) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1));
        var date = d.getDate() > 10 ? d.getDate() : ('0' + d.getDate());
        var hour = d.getHours() > 10 ? d.getHours() : ('0' + d.getHours());
        var minute = d.getMinutes() > 10 ? d.getMinutes() : ('0' + d.getMinutes());
        var second = d.getSeconds() > 10 ? d.getSeconds() : ('0' + d.getSeconds());
        return month + '/' + date + '/' + d.getFullYear() + ' ' + hour + ':' + minute + ':' + second;
    }

    //设置全屏监听
    if(localStorage.getItem("isP")=="preview") {
        var doc = document.getElementById("search")
    }else{
        var doc = document.getElementById("this").contentDocument || document.frames["this"].document;
    }

    var che = document.getElementById("che-full");
    var content = document.getElementById("book-full");

    var book = document.getElementById("book");
    var r = document.getElementById("lay");


    if (sessionStorage.getItem("role") != "1003") {
        $("#gohis").attr('href', 'stuCourse.html?id=' + GetQueryString("id"));
        busId = GetQueryString("businessId");
    }


    //加载任务书
    $.ajax({
        url: globalurl + 'BChapter/getMdFileById',
        method: 'post',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        data: {
            businessId: busId
        },
        success: function (result) {

            if (result.success) {
                console.log(result);
                $("#markbook").html(marked(result.result));
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            alert("访问服务器失败");
        }
    });

    /*完成此节*/
    $("#archieve").click(function () {
        $(".reveal-overlay").fadeOut();
        $('body').loading({
            loadingWidth: 240,
            title: '关闭che空间中...',
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
        $.ajax({
            url: globalurl + 'BChapter/complete',
            method: 'post',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            data: {
                chapterId: busId
            },
            success: function (res) {
                removeLoading('test');
                if (res.success) {
                    setInterval(function () {
                        window.location.href = 'stuCourse.html?id=' + Id;
                    }, 1000);
                    $("#archieve-this").fadeOut();
                    $(".reveal-overlay").fadeOut();
                    toastr.success('你已完成当前章节练习');
                } else {
                    toastr.error('你已完成当前章节练习');
                }

            }, error: function (err) {
                console.log(err)
            }
        })
    });
    /*提交代码*/
    $("#taido-it").click(function () {
        $('body').loading({
            loadingWidth: 240,
            title: '提交代码中...',
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
        $.ajax({
            url: globalurl + 'BChapter/pushCode',
            method: 'post',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            data: {
                port: pnum,
                stuCode: scode,
                slCode: ccode
            },
            success: function (res) {
                removeLoading('test');
                if (res.success)
                    toastr.success('提交成功');
                else
                    toastr.error(res.message);

            }, error: function (err) {
                console.log(err)
            }
        })
    });

    /*延时*/
    $("#delay-it").click(function () {
        $.ajax({
            url: globalurl + ' BChapter/refreshChe',
            method: 'post',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            data: {
                port: pnum,
                stuCode: scode,
                slCode: ccode
            },
            success: function (res) {
                if (res.success) {
                    toastr.success(res.message);
                    var tempclock=globalclock;
                    clearInterval(tempclock);
                    var startTime = new Date();
                    startTime.setTime(parseInt(res.result));
                    localStorage.setItem("timer",res.result);
                    var countTop = formatDate(startTime);
                    $('.countdown').downCount({
                        date: countTop,
                        offset: +8
                    }, function () {
                        toastr.warning('che已关闭');
                        localStorage.removeItem("chestatus");
                        localStorage.removeItem("teache");
                        /*setTimeout(function () {
                         window.location.href='stuCourse.html?id=' + GetQueryString("id");
                         },1000);*/

                    });
                }

                else
                    toastr.error(res.message);

            }, error: function (err) {
                console.log(err)
            }
        })
    });

    /*关闭che*/
    $("#stop").click(function () {
        $(".reveal-overlay").fadeOut();
        $('body').loading({
            loadingWidth: 240,
            title: '关闭che空间中...',
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
        $.ajax({
            url:globalurl+'BChapter/cheStopWithoutAuth',
            method:'post',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            data:{
                port:pnum
            },
            success:function (res) {
                removeLoading('test');
                if(res.success){

                    toastr.success(res.message);
                    localStorage.removeItem("chestatus");
                    localStorage.removeItem("teache");

                    if(sessionStorage.getItem("role")=="1003"){
                        setTimeout(function () {
                            window.location.href = 'stuCourse.html?id=' + Id;
                        },1000);
                    }
                    if(sessionStorage.getItem("role")=="1002"){
                        setTimeout(function () {
                            window.location.href = 'teaCourse.html?id=' + Id;
                        },1000);
                    }

                }else{
                    toastr.error(res.message);
                }
            }
        });
    });



    che.addEventListener("click", function () {

        launchFullScreen(r);
        $("#lay").css("display", "none");
        $("#line").fadeOut();
        $("#lay").addClass("full");
        $("#lay").fadeIn("slow");
        $("#container").css("display","flex");


    });
    content.addEventListener("click", function () {
        $("#book").css("display", "none");
        $("#line").fadeOut();
        $("#book").fadeIn("slow");
        launchFullScreen(book);
        $("#book").addClass("full");
    });
    
});






function checkFull() {
    var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    if (isFull === undefined) isFull = false;
    return isFull;
}



// 全屏事件Events
document.addEventListener("fullscreenchange", function (e) {
    cancleFull()
});
document.addEventListener("mozfullscreenchange", function (e) {
    cancleFull()
});
document.addEventListener("webkitfullscreenchange", function (e) {
    cancleFull()
});

function cancleFull() {
    if (!checkFull()) {
        $("#lay").removeClass("full");
        $("#book").removeClass("full");
        $("#line").show();
        $("#container").css("display","");

    }
}

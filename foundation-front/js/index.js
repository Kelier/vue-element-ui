/**
 * Created by John Yan on 7/27/2017.
 */
$(function (){
    $("#silder").silder({
        data: [
            {
                "img": "../image/banner_4.jpg",
                "alt": "这是一张图片"
            },
            {
                "img": "../image/banner_2.jpg",
                "alt": "这还是刚才那张图片"
            },
            {
                "img": "../image/banner_3.jpg",
                "alt": "我将跳转到百度"
            }
        ],
        sideCtrl: true//是否需要侧边控制按钮
    });
});
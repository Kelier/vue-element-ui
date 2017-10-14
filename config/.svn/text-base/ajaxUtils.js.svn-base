/**
 * Created by John Yan on 8/7/2017.
 */
/*封装ajax请求*/
function req(realPath,idea,tail,fun) {
    $.ajax({
        url:realPath,
        method:idea,
        data:tail,
        success:(res)=>{
            fun(res);
        },
        error:(err)=>{
            console.log(err);
        }
    })

}

/**
 * 根据浏览器参数  获取值
 * @param     parameterName
 * @returns   value
 * @constructor
 */
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
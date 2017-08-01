/**
 * Created by lcy on 17/8/1.
 */
axios.defaults.headers.common['Authorization']=sessionStorage.getItem("token");


var eduUtil = {};

eduUtil.subString = function(source,len){
    if(!source)
        return "";
    return source.substring(0,len);
};

eduUtil.tip_custom = function (type) {
    return (type) ? "success" : "error";
}
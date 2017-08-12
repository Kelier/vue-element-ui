/**
 * Created by lcy on 17/8/1.
 */
Vue.prototype.$http = axios;//原型链


Vue.prototype.$http=axios;

axios.defaults.headers.common['Authorization']=sessionStorage.getItem("token");

var eduUtil = {};

eduUtil.substr = function(source,begin,len){
    if(!source)
        return "";
    return source.substr(begin,len);
};
/**
 * 提示
 * @param type
 * @returns {string}
 */
eduUtil.tip_custom = function (type) {
    return (type) ? "success" : "error";
};

eduUtil.formData = function(data){
    let _formData = new FormData();
    for(var i in data){
        _formData.append(i, data[i]);
    }
    return _formData;
};

/**
 * util
 */
eduUtil.ajaxPostUtil = function (url,param,thenFun,exeFun){
    var _formData = eduUtil.formData(param);
    axios.post(url,_formData).then(function (res) {
        if(!res.data.success && ('18' == res.data.result || '19' == res.data.result))
            window.location.href = "login.html";
        else
            thenFun.call(this,res);
    }).catch(function (error) {
        exeFun.call(this,error);
    });
};

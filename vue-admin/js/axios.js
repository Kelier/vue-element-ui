/**
 * Created by John Yan on 8/1/2017.
 */

new Vue({
    el:"#form",
    data:function () {
        return{
            yourId:'',
            yourPass:''
        }
    },
    methods:{
        login(e){
//                    e.preventDefault();
            let formData=new FormData();
            formData.append('username',this.yourId);
            formData.append('password',this.yourPass);
            let that=this;
            axios.post(globalurl + '/login', formData,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                        // console.log(JSON.stringify(response));
                if(response.data.success){
                    //token串
                    var token=response.data.result;
                    var realtoken='Bearer '+token;
                    //往header里扔token
                    axios.defaults.headers.common['Authorization'] =realtoken;
                    //保存这个token值
                    sessionStorage.setItem("token",realtoken);
                    sessionStorage.setItem("user",that.yourId);
                    axios.get(globalurl+'/user/success').then(function (res) {
                        console.log(res.data.success);
                        if(res.data.success)
                            window.location.href="admin.html";
                        else
                            window.location.href="login.html";
                    }).catch(function (err) {
                        console.log(err);
                    })
                }else{
                    that.$notify({
                        title: '提示信息',
                        message: response.data.message,
                        type: 'warning'
                    });
                }
            }).catch(function (err) {
                console.log(err);
            })
        }
    }
});
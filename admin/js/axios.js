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
        login(){

            let formData=new FormData();
            formData.append('username',this.yourId);
            formData.append('password',this.yourPass);
            let that=this;
            axios.post(globalurl + 'login/1', formData,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                        // console.log(JSON.stringify(response));
                if(response.data.success){
                    //token串
                    var token=response.data.result.token;
                    var realtoken='Bearer '+token;
                    //往header里扔token
                    axios.defaults.headers.common['Authorization'] =realtoken;
                    //保存这个token值

                    sessionStorage.setItem("token",realtoken);
                    sessionStorage.setItem("user",that.yourId)

                    window.location.href="admin.html";

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
        },

        keyLogin() {
            if (event.keyCode==13){
                     this.login();
            }
        }
    }
});
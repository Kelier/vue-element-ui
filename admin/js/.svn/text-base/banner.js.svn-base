/**
 * Created by John Yan on 8/23/2017.
 */

Vue.prototype.$http = axios;//原型链

var vue = new Vue({
    el: '#nav',
    data: function () {
        return {
            activeName: '0',
            form: {
                launch: '',
                des: '',
                url: '666',
                blank: '',
                filelist: [{
                    url: ''
                }],
                businessId: ''
            },
            currentFile: [],
            upload:''

        }
    },
    methods: {
        loadTab(index){
            var _this = this;
            var url = globalurl + 'BCarousel/queryBCarouselsByPaginationWithoutAuth';
            eduUtil.ajaxPostUtil(url, {
                    page: 1,
                    rows: 5,
                    imageId: 'c148428a53fd4a6c9109cec14c8d8d4c',
                    sort: 'carousel_sort'
                }, function (res) {
                    var data = res.data.rows;
                    if (data.length < 1) {
                        return false;
                    }

                    else {
                        if (data.length > index) {
                            _this.form.launch = data[index].isOpen;
                            _this.form.filelist[0].url = imagepath+data[index].carouselUrl;
                            _this.form.des = data[index].carouselDes;
                            _this.form.url = data[index].linkUrl;
                            _this.form.blank = data[index].isNewWindow;
                            _this.form.businessId = data[index].businessId;
                            _this.upload = data[index].carouselUrl;
                        } else {
                            _this.form.launch = '';
                            _this.form.filelist.url = '';
                            _this.form.des = '';
                            _this.form.url = '';
                            _this.form.blank = '';
                            _this.form.blank = '';
                            _this.form.businessId = '';
                        }


                    }

                }, function (error) {
                    console.log(error);
                }
            );

        },
        handleClick(){
            this.loadTab(parseInt(this.activeName));

        },

        uploadCustom(){


        },

        getUrl(file, fileList){

                this.form.filelist = [];
                this.form.filelist.push({url: file.url});
                this.currentFile = [];
                this.currentFile.push(file.raw);
                var cover = this.currentFile[0];
                var that = this;
                eduUtil.ajaxPostUtil(globalurl + 'BCarousel/upload', {
                    file: cover
                }, function (res) {
                    that.upload = res.data.result;
                }, function (err) {
                    console.log(err)
                });



        },
        saveBanner(){
            var that = this;

            eduUtil.ajaxPostUtil(globalurl + 'BCarousel/add', {
                imageType: "home_top_banner",
                imageId: "c148428a53fd4a6c9109cec14c8d8d4c",
                carouselDes: that.form.des,
                carouselUrl: that.upload,
                carouselSort:that.activeName,
                isOpen: that.form.launch,
                linkUrl: that.form.url,
                isNewWindow: that.form.blank,
                businessId: that.form.businessId

            }, function (res) {
                if(res.data.success){
                    vue.loadTab(parseInt(that.activeName));
                    that.$notify({
                        title: '提示信息',
                        message: '您的操作已成功',
                        type: 'success'
                    });
                }else{
                    that.$notify({
                        title: '提示信息',
                        message: '请联系管理员解决您的问题',
                        type: 'warning'
                    });
                }

            }, function (err) {
                console.log(err)
            });
        }

    }
});
vue.loadTab(parseInt(vue.activeName));
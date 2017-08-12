
var vue = new Vue({
    el: '#nav',
    data: function () {
        return {

            //对话框
            dialogFormVisible: false,
            dialogVisible: false,
            form: {
                id: '',
                name: '',


            },
            formLabelWidth: '80px',

            //表格
            tableData: [],

            lineindex: 0,
            teacode: '',

            //edit form
            labelPosition: 'right',
            formLabelAlign: {
                id: '',
                region: '',
            },

            //search area
            courseid: '',
            coursename: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            total: 0,

            actionUrl:'',
            filelist:[],

            bussid: []

        }
    },
    methods: {
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            let url = globalurl + 'BLesson/queryBLessonsByPagination';
            let _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: _this.courseid,
                    lessonName: _this.coursename
            },(function (res) {
                // alert(JSON.stringify(res));
                var pages = res.data.rows;//查询过来的每页数据
                _this.total = res.data.total;//总记录数
                for (let i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.id = i + 1;
                    obj.tcode = pages[i].code;
                    obj.tlessonName = pages[i].lessonName;
                    obj.tname = pages[i].name;
                    obj.tsex = (pages[i].sex == '1') ? '男' : '女';
                    obj.imageSrc=imagepath+pages[i].defaultUrl;
                    _this.bussid.push(pages[i].businessId);
                    // obj.imageSrc="http://imgsrc.baidu.com/image/c0%3Dshijue1%2C0%2C0%2C294%2C40/sign=60aeee5da74bd11310c0bf7132c6ce7a/72f082025aafa40fe3c0c4f3a164034f78f0199d.jpg";
                    data[i] = obj;
                }


                _this.tableData = data;


            }),(function (error) {
                console.log(error);
            })
            )
        },


        //新增课程
        createClass(){
            this.dialogFormVisible = false;
            let that = this;
            let _formData = new FormData();
            _formData.append('code', this.form.id);
            _formData.append('lessonName', this.form.name);
            axios.post(globalurl + 'BLesson/add', _formData)
                .then(function (response) {
                    // alert(JSON.stringify(response));
                    var type = response.data.success;
                    var message = response.data.message;
                    type = eduUtil.tip_custom(type);
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: type
                    });
                    that.loadData(that.currentPage, that.pagesize);
                })
                .catch(function (err) {
                    console.log(err);
                });

            //  this.loadData(this.currentPage, this.pagesize);

        },
        //上传
        importmould() {
            document.getElementById("btn_file").click();
        },

        fileupload() {

            var dom = document.getElementById("btn_file");

            var fileSize = dom.files[0].size; //文件的大小，单位为字节B
            if (fileSize > 5 * 1024 * 1024) {
                this.$notify({
                    title: '警告',
                    message: '上传文件大小不能超过5M',
                    type: 'warning'
                });
                return false;
            }


            //获取欲上传的文件路径
            //var filepath = document.getElementById("btn_file").value;
            var filepath = dom.value;
            // alert(filepath);
            var suf = filepath.split(".")[filepath.split(".").length - 1];
            // alert(suf);
            var tp = "xls";
            //返回符合条件的后缀名在字符串中的位置
            var rs = tp.indexOf(suf);
            if (rs >= 0) {
                var _formData = new FormData();
                _formData.append('importFile', dom.files[0]);
                var _config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                // console.log(dom.files);

                var that = this;

                axios.post(globalurl + 'BLesson/excelImport', _formData, _config)
                    .then(function (response) {
                        var type = eduUtil.tip_custom(response.data.success);
                        console.log(type);
                        if (type == "error") {
                            that.$notify({
                                title: '失败',
                                message: response.data.message,
                                type: type
                            });
                            $("#btn_file").val('');
                        } else {
                            that.$notify({
                                title: '成功',
                                message: '数据导入成功',
                                type: 'success'
                            });
                            $("#btn_file").val('');
                            that.loadData(that.currentPage, that.pagesize);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                $("#btn_file").val('');
                return true;
            } else {
                this.$notify.error({
                    title: '失败',
                    message: '请您注意上传的文件格式'
                });
                $("#btn_file").val('');
                return false;
            }

        },
        //下载模板
        exportmould(){


            window.location.href=globalurl+'excelWithoutAuth?type=6';

        },

        //test
        picturecover(index, row) {
            //  alert(index);
            this.dialogVisible = true;
            this.lineindex = index;
            this.teacode=this.tableData[index].tcode;
        },

        //confirm image
        confirm() {
            this.loadData(this.currentPage,this.pagesize);
            this.dialogVisible = false;

        },
        beforeUpload(file){
            // console.log(file);
            this.filelist=[];
            this.filelist.push(file);

        },
        uploadCustom(){
            var cover=this.filelist[0];
             eduUtil.ajaxPostUtil(globalurl+'BLesson/picImport',{
                 importFile:cover,
                 code:this.teacode,
             },res=>{
                 // console.log(res);

             },err=>{

                 console.log(err);
             })
        },

        //改变课程
        change_course(index) {

            // console.log(index)
            var that = this;
            eduUtil.ajaxPostUtil(globalurl + 'BLesson/add', {
                    businessId:that.bussid[index],
                    code:that.formLabelAlign.id ,
                    lessonName: that.formLabelAlign.region
                }, (function (response) {
                    // alert(JSON.stringify(response));
                    var type = response.data.success;
                    var message = response.data.message;
                    type = eduUtil.tip_custom(type);
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: type
                    });
                    that.loadData(that.currentPage,that.pagesize);
                })
                , (function (err) {
                    console.log(err);
                })
            )

        },
        bindThis(index){
            // console.log(index);
            this.formLabelAlign.id = this.tableData[index].tcode;
            this.formLabelAlign.region = this.tableData[index].tlessonName;
        },

        //打印页
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        //search




    }
});
/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);
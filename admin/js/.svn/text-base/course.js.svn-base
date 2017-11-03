var cover;
var vue = new Vue({
        el: '#nav',
        data: function () {
            var checkid = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('编号不能为空'));
                }
                var pattern = new RegExp(/^[A-Za-z0-9_-]*$/g);
                setTimeout(() => {

                    if (pattern.test(value) === false) {
                        return callback(new Error('仅支持字母、数字、下划线、-'));
                    } else {
                        if (value.length > 15) {
                            callback(new Error('编号不能大于15位'));
                        } else {
                            callback();
                        }
                    }

                }, 1000);


            };

            var validateName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入名称'));
                }
                var pattern = new RegExp(/^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/g);
                setTimeout(() => {
                    if (pattern.test(value) == false) {
                        callback(new Error('请不要输入特殊字符'));
                    } else {
                        callback();
                    }
                }, 1000);
            };


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

                actionUrl: '',
                filelist: [],

                bussid: [],

                formrule1: {
                    id: [
                        {validator: checkid, trigger: 'blur'}
                    ],
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ]
                },
                formrule2: {
                    region: [
                        {validator: validateName, trigger: 'blur'}
                    ]
                },
            fullscreenLoading:false

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
                        lessonName: _this.coursename,
                        sort:'create_date desc'
                    }, (function (res) {
                        
                        var pages = res.data.rows;//查询过来的每页数据
                        _this.total = res.data.total;//总记录数
                        _this.bussid = [];
                        for (let i = 0; i < pages.length; i++) {

                            var obj = {};
                            obj.id = i + 1;
                            obj.tcode = pages[i].code;
                            obj.tlessonName = pages[i].lessonName;
                            obj.tname = pages[i].name;
                            obj.tsex = (pages[i].sex == '1') ? '女' : '男';
                            obj.imageSrc = (pages[i].defaultUrl.toLocaleString().match(/\upload/)) ? imagepath + pages[i].defaultUrl : '../image/bg1.jpg';
                            _this.bussid.push(pages[i].businessId);
                            // obj.imageSrc="http://imgsrc.baidu.com/image/c0%3Dshijue1%2C0%2C0%2C294%2C40/sign=60aeee5da74bd11310c0bf7132c6ce7a/72f082025aafa40fe3c0c4f3a164034f78f0199d.jpg";
                            data[i] = obj;
                        }


                        _this.tableData = data;


                    }), (function (error) {
                        console.log(error);
                    })
                )
            },


            //新增课程
            createClass(formName){
                var that = this;
                that.fullscreenLoading=true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        
                        that.dialogFormVisible = false;
                        let _formData = new FormData();
                        _formData.append('code', that.form.id);
                        _formData.append('lessonName', that.form.name);
                        axios.post(globalurl + 'BLesson/add', _formData)
                            .then(function (response) {
                                that.fullscreenLoading=false;
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

                    } else {
                        that.fullscreenLoading=false;
                        console.log('error submit!!');
                        return false;
                    }
                });


                //  this.loadData(this.currentPage, this.pagesize);

            },
            callOf(formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            //上传
            importmould() {
                document.getElementById("btn_file").click();
            },

            fileupload() {
                this.fullscreenLoading=true;

                var dom = document.getElementById("btn_file");

                var fileSize = dom.files[0].size; //文件的大小，单位为字节B
                if (fileSize > 5 * 1024 * 1024) {
                    this.fullscreenLoading=false;
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
                            that.loadData(that.currentPage, that.pagesize);
                            that.fullscreenLoading=false;

                            $("#btn_file").val('');
                            var type = eduUtil.tip_custom(response.data.success);
                            // console.log(type);
                            if (type == "error") {

                                that.$notify({
                                    title: '失败',
                                    message: response.data.message,
                                    type: 'error'
                                });


                            } else {
                                that.$notify({
                                    title: '成功',
                                    message: '数据导入成功',
                                    type: 'success'
                                });


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

                    this.loadData(this.currentPage, this.pagesize);
                    this.fullscreenLoading = false;
                    return false;
                }

            },
            //下载模板
            exportmould(){


                window.location.href = globalurl + 'excelWithoutAuth?type=6';

            },

            //test
            picturecover(index, row) {
                //  alert(index);
                this.dialogVisible = true;
                this.lineindex = index;
                this.teacode = this.tableData[index].tcode;
            },
            resetcover(index) {
                //  alert(index);
                this.fullscreenLoading=true;
                var that = this;
                eduUtil.ajaxPostUtil(globalurl + 'BLesson/defaultUrl', {
                    code: that.tableData[index].tcode
                }, function (res) {
                    that.fullscreenLoading=false;
                    if (res.data.success) {
                        that.$notify({
                            title: '提示信息',
                            message: '您已恢复默认封面',
                            type: 'success'
                        });
                        that.loadData(that.currentPage, that.pagesize);
                    } else {
                        that.$notify({
                            title: '提示信息',
                            message: '请联系管理员解决您的问题',
                            type: 'warning'
                        });
                    }

                }, function (err) {
                    console.log(err)
                });

            },

            //confirm image
            confirm() {
                var _this = this;
                if(cover=="undefined"||cover==null){
                    _this.$notify({
                        title: '提示信息',
                        message: "上传文件不能为空",
                        type: "warning"
                    });
                }else{
                    _this.fullscreenLoading=true;
                    eduUtil.ajaxPostUtil(globalurl + 'BLesson/picImport', {
                        importFile: cover,
                        code: _this.teacode,
                    }, res => {
                        _this.fullscreenLoading=true;
                        _this.dialogVisible = false;
                        var type = res.data.success;
                        var message = res.data.message;
                        type = eduUtil.tip_custom(type);
                        _this.$notify({
                            title: '提示信息',
                            message: message,
                            type: type
                        });
                        _this.loadData(_this.currentPage, _this.pagesize);

                    }, err => {

                        console.log(err);
                    })

                }
                

            },
            beforeUpload(file){
                // console.log(file);
                this.filelist = [];
                this.filelist.push(file);

            },
            uploadCustom(){
                cover = this.filelist[0];

            },
            removeCover(file,fileList){
                console.log(fileList);
                cover=null;
            },

            //改变课程
            change_course(formName, index) {
                
                // console.log(index)
                var that = this;
                that.fullscreenLoading=true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        
                        eduUtil.ajaxPostUtil(globalurl + 'BLesson/add', {
                                businessId: that.bussid[index],
                                code: that.formLabelAlign.id,
                                lessonName: that.formLabelAlign.region
                            }, (function (response) {
                                that.fullscreenLoading=false;
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
                                $('.el-popover').css("display", "none");
                            })
                            , (function (err) {
                                console.log(err);
                            })
                        )
                    } else {
                        that.fullscreenLoading=false;
                        console.log('error submit!!');
                        return false;
                    }
                });

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
            removeCourse(index){
                var that=this;
                
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.fullscreenLoading=true;
                    eduUtil.ajaxPostUtil(globalurl + 'BLesson/remove',
                        {
                            id:that.bussid[index]

                        }
                        , (function (response) {
                            that.fullscreenLoading=false;
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
                        , (function (err) {
                            console.log(err);
                        })
                    );
                }).catch((err) => {
                    that.$notify({
                        title: '提示信息',
                        message: err.message,
                        type: type
                    });
                });

            }

        }
    })
;
/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);

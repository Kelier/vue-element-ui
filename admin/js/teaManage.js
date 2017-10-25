/*
 * 全局的一些配置
 * */
Vue.prototype.$http = axios;//原型链

/*
 * 定义返回提示框
 * */
function tip_custom(type) {
    return (type) ? "success" : "error";
}


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
                        if (value.length > 15||value.length <8) {

                            callback(new Error('编号应在8-15位之间'));
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

            var checkEmail = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入邮箱'));
                }
                var pattern = new RegExp(/^\w+@\w+\.(com|net|org|edu)$/i);
                setTimeout(() => {
                    if (pattern.test(value) == false) {
                        callback(new Error('邮箱格式错误'));
                    } else {
                        callback();
                    }
                }, 1000);
            };

            var validateSex = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请选择性别'));
                } else {
                    callback()
                }
            };

            return {
                //对话框
                dialogFormVisible: false,
                dialogVisible: false,
                form: {
                    id: '',
                    name: '',
                    mail:'',
                    sex: ''

                },
                formLabelWidth: '80px',

                options: [{
                    value: '1',
                    label: '男'
                }, {
                    value: '2',
                    label: '女'
                }],

                //表格
                tableData: [],
                search_id: '',
                search_name: '',

                //edit form
                labelPosition: 'right',

                //search area
                teaid: '',
                teaname: '',

                //pagination
                currentPage: 1,
                pagesize: 8,
                total: 0,

                bussid: [],
                isRecommend: [],

                area: {
                    tid: '',
                    tname: '',
                    tsex: ''
                },
                formrule1: {
                    id: [
                        {validator: checkid, trigger: 'blur'}
                    ],
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    mail:[
                        {validator:checkEmail,trigger:'blur'}
                    ],
                    sex: [
                        {validator: validateSex, trigger: 'blur'}
                    ]
                },
                formrule2: {
                    tname: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    tsex: [
                        {validator: validateSex, trigger: 'blur'}
                    ]
                },
                fullscreenLoading:false

            }
        },


        mounted: function () {
            this.loadData(this.currentPage, this.pagesize);
        },

        methods: {

            //分页查询
            loadData(page, rows){

                //列表渲染数据
                var data = [];
                var url = globalurl + 'BTeacher/queryBTeachersByPagination';
                var _this = this;
                var i = 0;
                eduUtil.ajaxPostUtil(url, {
                        page: page,
                        rows: rows,
                        code: _this.search_id,
                        name: _this.search_name,
                        sort:'create_date desc'
                    }, (function (res) {
                        //  console.log(JSON.stringify(res.data.rows))
                        var pages = res.data.rows;//查询过来的每页数据
                        _this.total = res.data.total;//总记录数

                    _this.bussid=[];
                    _this.isRecommend=[];
                        for (i = 0; i < pages.length; i++) {
                            var obj = {};
                            obj.id = i + 1;
                            obj.tid = pages[i].code;
                            obj.tname = pages[i].name;
                            obj.tmail = pages[i].email;
                            obj.tsex = (pages[i].sex == '1') ? '男' : '女';
                            obj.thandle = pages[i].isRecommend == '0' ? false : true;
                            _this.bussid.push(pages[i].businessId);
                            _this.isRecommend.push(pages[i].isRecommend);
                            data[i] = obj;
                        }

                        _this.tableData = data;


                    }), (function (error) {
                        console.log(error);
                    })
                );
            },

            toggle(index, row) {
                //     console.info(row.tcode);
                //                 alert(this.tableData[index].thandle);
                let _this = this;
                eduUtil.ajaxPostUtil(globalurl + 'BTeacher/add', {
                        businessId: _this.bussid[index],
                        isRecommend: _this.isRecommend[index] == '0' ? '1' : '0',
                    }, (function (response) {
                        //  alert(JSON.stringify(response.data.message));
                        var type = response.data.success;
                        var message = response.data.message;
                        type = tip_custom(type);
                        _this.$notify({
                            title: '提示信息',
                            message: message,
                            type: type
                        });
                        _this.loadData(_this.currentPage, _this.pagesize);
                    })
                    , (function (err) {
                        console.log(err);
                    })
                )

            },

            //新增用户
            createUser(formName){

                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.dialogFormVisible = false;
                        eduUtil.ajaxPostUtil(globalurl + 'BTeacher/add', {
                                code: that.form.id,
                                name: that.form.name,
                                email:that.form.mail,
                                sex: that.form.sex
                            }, (function (response) {
                                // alert(JSON.stringify(response));
                                var type = response.data.success;
                                var message = response.data.message;
                                type = tip_custom(type);
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
                        )

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            change_course(formName, index){
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        eduUtil.ajaxPostUtil(globalurl + 'BTeacher/add', {
                                businessId: that.bussid[index],
                                code: that.area.tid,
                                name: that.area.tname,
                                sex: that.area.tsex
                            }, (function (response) {
                                // alert(JSON.stringify(response));
                                var type = response.data.success;
                                var message = response.data.message;
                                type = tip_custom(type);
                                that.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: type
                                });
                                $('.el-popover').css("display", "none");
                                that.loadData(that.currentPage, that.pagesize);
                            })
                            , (function (err) {
                                console.log(err);
                            })
                        )
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            bindThis(index){
                // console.log(index);
                this.area.tid = this.tableData[index].tid;
                this.area.tname = this.tableData[index].tname;
                this.area.tsex = this.tableData[index].tsex;
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

                    this.$http.post(globalurl + 'BTeacher/excelImport', _formData, _config)
                        .then(function (response) {
                            // alert(JSON.stringify(response));
                            console.log(response.data.success + response.data.message);
                            var type = tip_custom(response.data.success);
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
                                    type: type
                                });
                                $("#btn_file").val('');
                                that.loadData(that.currentPage, that.pagesize);
                                that.fullscreenLoading=false;
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                    that.fullscreenLoading=false;

                    return true;
                } else {
                    this.$notify.error({
                        title: '失败',
                        message: '请您注意上传的文件格式'
                    });
                    $("#btn_file").val('');
                    this.loadData(this.currentPage, this.pagesize);
                    this.fullscreenLoading=false;
                    return false;
                }
            },
            downFile(blob, fileName) {
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            },

            //下载模板
            exportmould(){

                window.location.href = globalurl + 'excelWithoutAuth?type=2';


                /*   var that=this;
                 eduUtil.ajaxPostUtil(globalurl+'excel',{
                 type:'2'
                 },(res)=>{
                 console.log(res)
                 var buffer=new ArrayBuffer();
                 buffer=res.data;
                 var blob = new Blob([buffer], {type: 'application/vnd.ms-excel'}),
                 fileName = '教师模板';
                 that.downFile(blob, fileName);
                 },(err)=>{
                 console.log(err);
                 })*/

            },

//打印页
            handleSizeChange(val)
            {
                console.log(`每页 ${val} 条`);
                this.pagesize = val;
                this.loadData(this.currentPage, this.pagesize);
            }
            ,
            handleCurrentChange(val)
            {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.loadData(this.currentPage, this.pagesize);
            }
            ,

//重置密码
            reset(index)
            {
                // alert(this.tableData[index].tid);
                var that = this;
                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var code = this.tableData[index].tid;

                    eduUtil.ajaxPostUtil(globalurl + 'user/resetPasswordByAdmin', {
                            code: code
                        }, (function (response) {
                            // alert(JSON.stringify(response));
                            console.log(response.data.success + response.data.message);
                            var type = tip_custom(response.data.success);

                            that.$notify({
                                title: '成功',
                                message: response.data.message+',密码已重置为123456',
                                type: type
                            });
                        })
                        , (function (err) {
                            console.log(err);
                        }))
                    ;

                }).catch(() => {

                });
            }
            ,
//删除教师
            deleteTea(index)
            {
                var that = this;
                this.$confirm('此操作将删除该教师, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var code = this.tableData[index].tid;
                    eduUtil.ajaxPostUtil(globalurl + 'BTeacher/remove', {
                            id:that.bussid[index],
                        }, (function (response) {
                            var type = response.data.success;
                            var message = response.data.message;
                            type = tip_custom(type);
                            that.$notify({
                                title: '提示信息',
                                message: message,
                                type: type
                            });
                            if (response.data.success){
                                that.loadData(that.currentPage, that.pagesize);
                            }
                        })
                        , (function (err) {
                            console.log(err);
                        }))
                    ;

                }).catch(() => {

                });
            }

        }
    })
;


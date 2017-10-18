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
            courseId: 'ss',
            courseName: 'Java集合',
            //对话框
            dialogFormVisible: false,
            dialogVisible: false,
            dialogTableVisible: false,
            form: {
                id: '',
                name: ''

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
            tableData: [{
                id: '',
                cid: '',
                cname: '',
                people: ''
            }],
            inIndex:'',


            //edit form
            labelPosition: 'right',
            formLabelAlign: {
                cid: '',
                region: '',
                cnum:''
            },

            //search area
            classarea: '',
            people: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            total: 4,

            /*学生*/
            stucurrentPage:1,
            stupagesize:8,
            stutotal:4,


            //stu info
            //student info
            gridData: [],
            bussid: [],

            currentCid:'',
            currentName:'',

            stusum:'',



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
        //分页查询
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            this.bussid=[];
            var url = globalurl + 'BClass/queryBClasssByPagination';
            var _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    className: _this.classarea,
                    studentNum: _this.people,
                    sort:'create_date desc'
                }, (function (res) {
                      //console.log(JSON.stringify(res));
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (var i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.cid = pages[i].code;
                        obj.cname = pages[i].className;
                        obj.people = pages[i].studentNum;
                        _this.bussid.push(pages[i].businessId);
                        data[i] = obj;
                    }
                    _this.tableData = data;
                }), (function (error) {
                    console.log(error);
                })
            );
        },


        //新增用户
        createClasses(formName){

            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
            that.dialogFormVisible = false;
            eduUtil.ajaxPostUtil(globalurl + 'BClass/add', {
                    code: that.form.id,
                    className: that.form.name,
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
                }))
            ;
                    that.loadData(that.currentPage, that.pagesize);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
                $("#btn_file").val('');
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

                let that = this;

                this.$http.post(globalurl + 'BRClassStudent/excelImport', _formData, _config)
                    .then(function (response) {
                        //  alert(JSON.stringify(response));
                        console.log(response.data.success + response.data.message);
                        var type = tip_custom(response.data.success);
                        if (type == "error") {
                            that.$notify({
                                title: '失败',
                                message: response.data.message,
                                type: type
                            });

                        } else {
                            that.$notify({
                                title: '成功',
                                message: '数据导入成功',
                                type: type
                            });

                        }
                        that.loadData(that.currentPage, that.pagesize);
                        that.fullscreenLoading=false;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                that.loadData(that.currentPage, that.pagesize);
                that.fullscreenLoading=false;
                $("#btn_file").val('');
                return true;
            } else {
                this.$notify.error({
                    title: '失败',
                    message: '请您注意上传的文件格式'
                });
                this.loadData(this.currentPage, this.pagesize);
                this.fullscreenLoading=false;
                $("#btn_file").val('');
                return false;
            }
        },
        //下载模板
        exportmould(){


            window.location.href=globalurl+'excelWithoutAuth?type=4';

        },

        //改变课程
        change_course(formName,index) {

            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
            eduUtil.ajaxPostUtil(globalurl + 'BClass/add', {
                    businessId:that.bussid[index],
                    code:that.formLabelAlign.cid ,
                    className: that.formLabelAlign.region,
                    studentNum: that.formLabelAlign.cnum
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
                    $('.el-popover').css("display","none");
                    that.loadData(that.currentPage,that.pagesize);
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
            this.formLabelAlign.cid = this.tableData[index].cid;
            this.formLabelAlign.region = this.tableData[index].cname;
            this.formLabelAlign.cnum = this.tableData[index].people;
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handlestuSizeChange(val) {
            this.stupagesize = val;
            this.see_more(this.inIndex);
        },
        handlestuCurrentChange(val) {
            this.stucurrentPage = val;
            this.see_more(this.inIndex);
        },
        toggle(index, row) {

            this.tableData[index].thandle = !this.tableData[index].thandle;
        },

        //edit stu info
        see_more(index) {
            this.inIndex=index;
            this.dialogTableVisible = true;
            this.currentCid=this.tableData[index].cid;
            this.currentName=this.tableData[index].cname;
            //进行查询操作
            var data=[];
            var classCode=this.tableData[index].cid;
            var page=this.stucurrentPage;
            var rows=this.stupagesize;
            var that=this;
            eduUtil.ajaxPostUtil(globalurl+'BStudent/queryStudentByClassCode',{
                page:page,
                rows:rows,
                classCode:classCode
            },(res)=>{
                 // console.log(JSON.stringify(res));
                var pages = res.data.rows;//查询过来的每页数据
                that.stutotal = res.data.total;//总记录数
                for (var i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.sid = i + 1;
                    obj.snum = pages[i].code;
                    obj.sname = pages[i].name;
                    data[i] = obj;
                }

                that.gridData = data;
            },(err)=>{
                console.log(err);
            });

        },
        deleteRow(index, rows) {
            console.log(index+","+rows)
            var that=this;
            eduUtil.ajaxPostUtil(globalurl+'BRClassStudent/remove',{
                stuCode:that.gridData[index].snum,
                classCode:that.tableData[index+1].cid
            },(res)=>{
                if(res.data.success){
                    rows.splice(index, 1);
                    that.$notify({
                        title: '提示信息',
                        message: res.data.message,
                        type: 'success'
                    });
                    that.loadData(that.currentPage,that.pagesize);
                }

                else{
                    that.$notify({
                        title: '提示信息',
                        message: res.data.message,
                        type: 'error'
                    });
                }
            },(err)=>{
                console.log(err);
            });

        },
        //删除学生
        deleteClass(index)
        {
            var that = this;
            this.$confirm('此操作将删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                eduUtil.ajaxPostUtil(globalurl + 'BClass/remove', {
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
                        if(response.data.success){
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
});

/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);

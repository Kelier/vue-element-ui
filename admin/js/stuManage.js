/*
 * 定义返回提示框
 * */
function tip_custom(type) {
    return (type) ? "success" : "error";
}

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
            formLabelAlign: {
                sid: '',
                region: '',
                sex: ''
            },

            //search area
            stuid: '',
            stuname: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            total: 4,

            bussid: [],
            isRecommend: []

        }
    },
    methods: {
        //分页查询
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            let url = globalurl + 'BStudent/queryBStudentsByPagination';
            let _this = this;
            console.log(this.search_id);
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name
                }, (function (res) {
                    //   alert(JSON.stringify(res));
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (let i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.sid = pages[i].code;
                        obj.sname = pages[i].name;
                        obj.sex = (pages[i].sex == '1') ? '男' : '女';
                        obj.thandle = pages[i].isRecommend == '0' ? false : true
                        _this.bussid.push(pages[i].businessId);
                        _this.isRecommend.push(pages[i].isRecommend);
                        data[i] = obj;
                    }
                    _this.tableData = data;
                }), (function (error) {
                    console.log(error);
                })
            )
        },
        toggle(index, row) {
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            let _this = this;
            eduUtil.ajaxPostUtil(globalurl + 'BStudent/add', {
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
        createUser(){
            this.dialogFormVisible = false;
            //push 一条数据
            // this.tableData.push({id: this.tableData.length + 1, tid: 6666, tname: 'assdda', tsex: '女'});
            // console.log(this.tableData.length);
            // if (this.tableData.length / this.pagesize > this.currentPage - 1) {
            //     this.loadData(this.currentPage, this, pagesize);
            // }
            let that = this;
            eduUtil.ajaxPostUtil(globalurl + 'BStudent/add', {
                    code: this.form.id,
                    name: this.form.name,
                    sex: this.form.sex
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
                    that.loadData(vue.currentPage, vue.pagesize);
                })
                , (function (err) {
                    console.log(err);
                }));

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
            var filepath = dom.value;
            // alert(filepath);
            var suf = filepath.split(".")[filepath.split(".").length - 1];
            // alert(suf);
            var tp = "xls";
            //返回符合条件的后缀名在字符串中的位置
            var rs = tp.indexOf(suf);
            if (rs >= 0) {
                let _formData = new FormData();
                _formData.append('importFile', dom.files[0]);
                let _config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                // console.log(dom.files);

                let that = this;

                this.$http.post(globalurl + 'BStudent/excelImport', _formData, _config)
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
                            that.loadData(vue.currentPage, vue.pagesize);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });


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


            window.location.href=globalurl+'excelWithoutAuth?type=1';

        },

        //改变课程
        change_course(index) {
            // console.log(index)
            var that = this;
            eduUtil.ajaxPostUtil(globalurl + 'BStudent/add', {
                    businessId: that.bussid[index],
                    code: that.formLabelAlign.sid,
                    name: that.formLabelAlign.region,
                    sex: that.formLabelAlign.sex
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

        },
        bindThis(index){
            // console.log(index);
            this.formLabelAlign.sid = this.tableData[index].sid;
            this.formLabelAlign.region = this.tableData[index].sname;
            this.formLabelAlign.sex = this.tableData[index].sex;
        },

        //打印页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        },

        //重置密码
        reset(index) {
            // alert(this.tableData[index].tid);
            let that = this;
            this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var code = this.tableData[index].sid;

                eduUtil.ajaxPostUtil(globalurl + 'user/resetPasswordByAdmin', {
                        code: code
                    }, (function (response) {
                        // alert(JSON.stringify(response));
                        console.log(response.data.success + response.data.message);
                        var type = tip_custom(response.data.success);
                        that.$notify({
                            title: '成功',
                            message: response.data.message,
                            type: type
                        });
                    })
                    , (function (err) {
                        console.log(err);
                    }));

            }).catch(() => {

            });
        }

    }
});

vue.loadData(vue.currentPage, vue.pagesize);


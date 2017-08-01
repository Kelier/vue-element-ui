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
        return {
            //对话框
            dialogFormVisible: false,
            dialogVisible: false,
            form: {
                id: '',
                name: '',
                sex: ''

            },
            formLabelWidth: '120px',

            options: [{
                value: '1',
                label: '男'
            }, {
                value: '2',
                label: '女'
            }],

            //表格
            tableData: [/*{
                id: 1,
                tid: 1232,
                tname: '张晓波',
                tsex: '男'
            }, {
                id: 2,
                tid: 1324,
                tname: '王湾',
                tsex: '女'
            }*/],
            search_id:'',
            search_name:'',

            //edit form
            labelPosition: 'right',

            //search area
            teaid: '',
            teaname: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            pagesizes: [8, 16, 32, 64],
            total: 0

        }
    },



    created:function () {

            var page=this.currentPage;
            var rows=this.pagesize;
            //列表渲染数据
            var data = [];
            var url = globalurl + 'BTeacher/queryBTeachersByPagination';
            var _this = this;
            var i=0;
            this.$http.get(url, {
                params: {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name
                }
            }).then(function (res) {

                var pages = res.data.rows;//查询过来的每页数据
                _this.total = res.data.total;//总记录数
                for (i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.id = i + 1;
                    obj.tid = pages[i].code;
                    obj.tname = pages[i].name;
                    obj.tsex = (pages[i].sex == '1') ? '男' : '女';
                    data[i] = obj;
                }


                _this.tableData = data;


            }).catch(function (error) {
                console.log(error);
            });

    },

    methods: {

        //分页查询
        // loadData(page, rows){
        //
        //     //列表渲染数据
        //     var data = [];
        //     var url = globalurl + 'BTeacher/queryBTeachersByPagination';
        //     var _this = this;
        //     var i=0;
        //     this.$http.get(url, {
        //         params: {
        //             page: page,
        //             rows: rows,
        //             code: _this.search_id,
        //             name: _this.search_name
        //         }
        //     }).then(function (res) {
        //
        //         var pages = res.data.rows;//查询过来的每页数据
        //         _this.total = res.data.total;//总记录数
        //         for (i = 0; i < pages.length; i++) {
        //             var obj = {};
        //             obj.id = i + 1;
        //             obj.tid = pages[i].code;
        //             obj.tname = pages[i].name;
        //             obj.tsex = (pages[i].sex == '1') ? '男' : '女';
        //             data[i] = obj;
        //         }
        //         /*
        //          * 前台分页
        //          * */
        //         // for (let i = 0; i < rows; i++) {
        //         //     //规定页码范围，只渲染当前页
        //         //     var obj = {};
        //         //     if (res.data.tableData.length > i + (page - 1) * rows) {
        //         //         obj.id = res.data.tableData[i + (page - 1) * rows].id;
        //         //         obj.tid = res.data.tableData[i + (page - 1) * rows].tid;
        //         //         obj.tname = res.data.tableData[i + (page - 1) * rows].tname;
        //         //         obj.tsex = res.data.tableData[i + (page - 1) * rows].tsex;
        //         //         data[i] = obj;
        //         //     } else {
        //         //         continue;
        //         //     }
        //         // }
        //
        //         _this.tableData = data;
        //
        //
        //     }).catch(function (error) {
        //         console.log(error);
        //     })
        // },

        //新增用户
        createUser(){
            this.dialogFormVisible = false;
            //push 一条数据
            // this.tableData.push({id: this.tableData.length + 1, tid: 6666, tname: 'assdda', tsex: '女'});
            // console.log(this.tableData.length);
            // if (this.tableData.length / this.pagesize > this.currentPage - 1) {
            //     this.loadData(this.currentPage, this, pagesize);
            // }
            var that = this;
            axios.get(globalurl + 'BTeacher/add', {
                params: {
                    code: this.form.id,
                    name: this.form.name,
                    sex: this.form.sex
                }
            })
                .then(function (response) {
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
                .catch(function (err) {
                    console.log(err);
                });

            // this.loadData(this.currentPage, this.pagesize);

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
                        } else {
                            that.$notify({
                                title: '成功',
                                message: '您的模板已上传成功',
                                type: type
                            });
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
                return false;
            }
        },

        //下载模板
        exportmould(){
            //下载的导向操作
            axios.get('/ your url')
                .then(function (response) {
                    console.log(response.success + response.message);
                })
                .catch(function (err) {
                    console.log(err);
                });
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
            var that = this;
            this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var code = this.tableData[index].tid;

                this.$http.get(globalurl + 'user/resetPasswordByAdmin', {
                    params: {
                        code: code
                    }
                })
                    .then(function (response) {
                        // alert(JSON.stringify(response));
                        console.log(response.data.success + response.data.message);
                        var type = tip_custom(response.data.success);
                        that.$message({
                            type: type,
                            message: response.data.message
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重置'
                });
            });
        }

    }
});
// vue.loadData(vue.currentPage, vue.pagesize);

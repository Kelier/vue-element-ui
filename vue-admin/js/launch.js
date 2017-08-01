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
            dialogVisible: false,
            dialogTableVisible: false,
            formLabelWidth: '120px',
            dialogTeaTableVisible:false,
            tformLabelWidth:'180px',

            //教师表单
            teaform: [{
                name: ''
            }],
            //教师表格
            teaData: [{
                id: 1,
                wid: '#666',
                name: '王宝强'
            }],

            //表格
            tableData: [],


            //edit form
            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                region: '',
            },

            //search area
            coursename: '',
            teaname: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            pagesizes: [8, 16, 32, 64],
            total: 4,

            //select
            cities: [{
                value: '1',
                label: '2017-2018春'
            }, {
                value: '2',
                label: '2017-2018秋'
            }, {
                value: '3',
                label: '2016-2017春'
            }],

            status: [{
                value: '0',
                label: '待上线'
            }, {
                value: '1',
                label: '已上线'
            },{
                value: '2',
                label: '已下线'
            }, {
                value: 'all',
                label: '全部'
            }],


            select: '',
            mode: '',

            //student info
            gridData: [{
                sid: 1,
                snum: '14112222',
                sname: '王小虎'
            }, {
                sid: 2,
                snum: '14112433',
                sname: '陈国栋'
            }, {
                sid: 3,
                snum: '14113454',
                sname: '李大叔'
            }, {
                sid: 4,
                snum: '14116765',
                sname: '赵半天'
            }]

        }
    },
    methods: {
        //分页查询
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            var term_data = [];
            let url = globalurl + 'BSl/queryBSlsByPagination';
            let _this = this;
            this.$http.get(url, {
                params: {
                    page: page,
                    rows: rows,
                    lessonName: _this.coursename,
                    teacherName: _this.teaname,
                    teacherName: _this.mode,
                    termName:_this.select
                }
            }).then(function (res) {
               //    alert(JSON.stringify(res));
                var pages = res.data.rows;//查询过来的每页数据
                _this.total = res.data.total;//总记录数
                for (let i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.id = i + 1;
                    obj.cid = "#"+pages[i].code;
                    obj.cnum = pages[i].lessonCode;
                    obj.cname = pages[i].lessonName;
                    obj.tnum = pages[i].teacherCode;
                    obj.tname = pages[i].teacherName;
                    obj.thandle = pages[i].isOnline == '0'?false:true
                    data[i] = obj;
                }
                /*
                 * 前台分页
                 * */
                // for (let i = 0; i < rows; i++) {
                //     //规定页码范围，只渲染当前页
                //     var obj = {};
                //     if (res.data.tableData.length > i + (page - 1) * rows) {
                //         obj.id = res.data.tableData[i + (page - 1) * rows].id;
                //         obj.tid = res.data.tableData[i + (page - 1) * rows].tid;
                //         obj.tname = res.data.tableData[i + (page - 1) * rows].tname;
                //         obj.tsex = res.data.tableData[i + (page - 1) * rows].tsex;
                //         data[i] = obj;
                //     } else {
                //         continue;
                //     }
                // }

                _this.tableData = data;


            }).catch(function (error) {
                console.log(error);
            })

            this.$http.get(globalurl+'BTerm/queryBTerms', {
                params: {}
            }).then(function (res) {
                  //  alert(JSON.stringify(res));
                var pages = res.data.result;//查询过来的每页数据
                for (let i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.value = pages[i].code;
                    obj.label = pages[i].name;
                    term_data[i] = obj;
                }
                _this.cities = term_data;


            }).catch(function (error) {
                console.log(error);
            })
        },

        importmould1() {
            document.getElementById("file_stu").click();
        },

        importmould2() {
            document.getElementById("file_tea").click();
        },

        fileupload1() {
            var dom = document.getElementById("file_stu");
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

                this.$http.post(globalurl + 'BRSlStudent/excelImport', _formData, _config)
                    .then(function (response) {
                        // alert(JSON.stringify(response));
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

        fileupload2() {
            var dom = document.getElementById("file_tea");
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

                this.$http.post(globalurl + 'BSl/excelImport', _formData, _config)
                    .then(function (response) {
                      //   alert(JSON.stringify(response));
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


        //改变课程
        change_course(index) {

            // alert(index);

        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
        },
        toggle(index, row) {
            //                 alert(JSON.stringify(row));
            //                 alert(this.tableData[index].thandle);
            this.tableData[index].thandle = !this.tableData[index].thandle;
        },

        //choose stu info
        choose_tea(index) {
            // alert(index);
            //进行安排操作
            this.dialogTeaTableVisible = true;
        },

        //edit stu info
        edit_stu(index) {
            // alert(index);
            this.dialogTableVisible = true;
            //进行查询操作
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        }

    }
});

vue.loadData(vue.currentPage, vue.pagesize);

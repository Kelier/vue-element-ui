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
            dialogTeaTableVisible: false,
            tformLabelWidth: '180px',

            //教师表单
            teaform: [{
                name: ''
            }],
            //教师表格
            teaData: [],

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

            //开课
            currentPage: 1,
            pagesize: 8,
            total: 4,

            /*学生*/
            stucurrentPage:1,
            stupagesize:8,
            stutotal:4,

            /*教师*/
            teacurrentPage:1,
            teapagesize:8,
            teatotal:4,

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
            }, {
                value: '2',
                label: '已下线'
            }, {
                value: 'all',
                label: '全部'
            }],


            select: '',
            mode: '',

            //student info
            gridData: [],

            bussid: [],
            isRecommend: [],

            //更改教师，暂存数组
            tempData:[],
            tempIndex:'',
            tempslCode:''

        }
    },
    methods: {
        //分页查询
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            var term_data = [];
            var url = globalurl + 'BSl/queryBSlsByPagination';
            var _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    lessonName: _this.coursename,
                    teacherName: _this.teaname,
                    isOnline: _this.mode=='all'?'':_this.mode,
                    termName: _this.select
                }, (function (res) {
                    //    alert(JSON.stringify(res));

                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (var i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.cid = "#" + pages[i].code;
                        obj.cnum = pages[i].lessonCode;
                        obj.cname = pages[i].lessonName;
                        obj.tnum = pages[i].teacherCode;
                        obj.tname = pages[i].teacherName;
                        obj.thandle = pages[i].isOnline == '0' ? false : true
                        obj.thandle_recommend = pages[i].isRecommend == '0' ? false : true;
                        _this.isRecommend.push(pages[i].isRecommend);
                        _this.bussid.push(pages[i].businessId);
                        _this.tempData.push(pages[i].businessId);
                        data[i] = obj;
                    }
                    _this.tableData = data;
                }), (function (error) {
                    console.log(error);
                })
            )

            eduUtil.ajaxPostUtil(globalurl + 'BTerm/queryBTerms', {}, (function (res) {
                    //  alert(JSON.stringify(res));
                    var pages = res.data.result;//查询过来的每页数据
                    for (var i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.value = pages[i].code;
                        obj.label = pages[i].name;
                        term_data[i] = obj;
                    }
                    _this.cities = term_data;


                }), (function (error) {
                    console.log(error);
                })
            )
        },

        toggle_recommend(index, row) {
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            var _this = this;
            eduUtil.ajaxPostUtil(globalurl + 'BSl/add', {
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
                $("#btn_file").val();
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
                            $("#btn_file").val();

                        } else {
                            that.$notify({
                                title: '成功',
                                message: '数据导入成功',
                                type: type
                            });
                            $("#btn_file").val();
                            that.loadData(that.currentPage, that.pagesize);
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
                $("#btn_file").val();
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
                $("#btn_file").val();
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
                            $("#btn_file").val();
                        } else {
                            that.$notify({
                                title: '成功',
                                message: '您的模板已上传成功',
                                type: type
                            });
                            $("#btn_file").val();
                            that.loadData(that.currentPage, that.pagesize);
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
                $("#btn_file").val();
                return false;
            }
        },
        toggle(index, row) {
                 // console.info(row.cid);
            //                 alert(this.tableData[index].thandle);
            var _this = this;
            eduUtil.ajaxPostUtil(globalurl + 'BSl/updateIsOnline', {
                'code': row.cid.substring(1,row.cid.length)
            }, function (res) {
                var type = res.data.success;
                var message = res.data.message;
                type = eduUtil.tip_custom(type);
                _this.$notify({
                    title: '提示信息',
                    message: message,
                    type: type
                });
                // _this.loadData(_this.currentPage, _this.pagesize);
            }, function (error) {
                console.log(error);
            });

        },
        exportmould1(){


            window.location.href=globalurl+'excelWithoutAuth?type=7';

        },
        exportmould2(){


            window.location.href=globalurl+'excelWithoutAuth?type=5';

        },


        //改变课程
        change_course(index) {

            // alert(index);

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
            this.stucurrentPage = val;
            this.edit_stu();
        },
        handlestuCurrentChange(val) {
            this.stucurrentPage = val;
            this.edit_stu();
        },
        handleteaSizeChange(val) {
            this.teacurrentPage = val;
            this.choose_tea();
        },
        handleteaCurrentChange(val) {
            this.teacurrentPage = val;
            this.choose_tea();
        },
        toggle(index, row) {

            this.tableData[index].thandle = !this.tableData[index].thandle;
        },
        //choose stu info
        choose_tea(index) {
            this.tempIndex=index;
            //进行安排操作
            this.dialogTeaTableVisible = true;
            var page=this.teacurrentPage;
            var rows=this.teapagesize;
            //列表渲染数据
            var data = [];
            var url = globalurl + 'BTeacher/queryBTeachersByPagination';
            var _this = this;
            // console.log(this.tempData);
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,

                }, (function (res) {

                    var pages = res.data.rows;//查询过来的每页数据
                    _this.teatotal = res.data.total;//总记录数
                    for (var i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.tid = pages[i].code;
                        obj.tname = pages[i].name;
                        obj.tsex = (pages[i].sex == '1') ? '男' : '女';
                        data[i] = obj;
                    }

                    _this.teaData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },
        loadteaData(page,rows){
            //列表渲染数据

            var data = [];
            var url = globalurl + 'BTeacher/queryBTeachersByPagination';
            var _this = this;
            // console.log(_this.tableData[_this.tempIndex].tnum)
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: '',
                    name: _this.teaform.name
                }, (function (res) {
                    //  console.log(JSON.stringify(res.data.rows))
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (var i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.tid = pages[i].code;
                        obj.tname = pages[i].name;
                        data[i] = obj;
                    }

                    _this.teaData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },
        // change tea name
        changeTea(index){
            var businessId=this.tempIndex;
            var here=this;
            eduUtil.ajaxPostUtil(globalurl+'BSl/add', {
                businessId:businessId,
                teacherCode:here.teaData[index].tid
            },res=>{
                 console.log(res);
                if(res.data.success){
                    here.tableData[this.tempIndex].tnum=here.teaData[index].tid;
                    here.tableData[this.tempIndex].tname=here.teaData[index].tname;
                    here.$notify({
                        title: '提示信息',
                        message: res.data.message,
                        type: 'success'
                    });
                }else{
                    here.$notify({
                        title: '提示信息',
                        message: res.data.message,
                        type: 'error'
                    });
                }

            },err=>{
                console.log(err);
            });
        },

        //edit stu info
        edit_stu(index) {
            this.dialogTableVisible = true;
            //进行查询操作
            var data=[];
            var slCode=this.tableData[index].cid.split('#').join('');
            this.tempslCode=slCode;
            console.log(slCode);
            var page=this.stucurrentPage;
            var rows=this.stupagesize;
            var that=this;
            eduUtil.ajaxPostUtil(globalurl+'BStudent/queryStudentBySlCode',{
                    page:page,
                    rows:rows,
                    slCode:slCode
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
            var that=this;

            eduUtil.ajaxPostUtil(globalurl+'BRSlStudent/remove',{
                studentCode:that.gridData[index].snum,
                slCode:that.tempslCode
            },(res)=>{
                if(res.data.success)
                    rows.splice(index, 1);
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

        }

    }
});

vue.loadData(vue.currentPage, vue.pagesize);

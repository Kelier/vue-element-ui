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
            currentName:''

        }
    },
    methods: {
        //分页查询
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            var url = globalurl + 'BClass/queryBClasssByPagination';
            var _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    className: _this.classarea,
                    studentNum: _this.people
                }, (function (res) {
                      // console.log(JSON.stringify(res));
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
        createClasses(){
            this.dialogFormVisible = false;
            //push 一条数据
            // this.tableData.push({id: this.tableData.length + 1, tid: 6666, tname: 'assdda', tsex: '女'});
            // console.log(this.tableData.length);
            // if (this.tableData.length / this.pagesize > this.currentPage - 1) {
            //     this.loadData(this.currentPage, this, pagesize);
            // }
            var that = this;
            eduUtil.ajaxPostUtil(globalurl + 'BClass/add', {
                    code: this.form.id,
                    className: this.form.name,
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
            this.loadData(this.currentPage, this.pagesize);
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
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                that.loadData(that.currentPage, that.pagesize);
                $("#btn_file").val('');
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


            window.location.href=globalurl+'excelWithoutAuth?type=4';

        },

        //改变课程
        change_course(index) {

            // console.log(index)
            var that = this;
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
                    that.loadData(that.currentPage,that.pagesize);
                })
                , (function (err) {
                    console.log(err);
                })
            )

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
            this.stucurrentPage = val;
            this.edit_stu();
        },
        handlestuCurrentChange(val) {
            this.stucurrentPage = val;
            this.edit_stu();
        },
        toggle(index, row) {

            this.tableData[index].thandle = !this.tableData[index].thandle;
        },

        //edit stu info
        see_more(index) {
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
            var that=this;

            eduUtil.ajaxPostUtil(globalurl+'BStudent/remove',{
                id:that.gridData[index].snum
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

/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);

Vue.prototype.$http = axios;//原型链



    var vue =  new Vue({
        el: '#nav',
        data: function () {
            return {
                //对话框
                dialogFormVisible: false,
                form: {
                    id: '',
                    name: '',
                    date:''

                },

                //日期选择
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value6: '',
                formLabelWidth: '120px',

                //表格
                tableData: [/*{
                    id: 1,
                    tid: '3122',
                    tname: '春天',
                    tstart: '2014-2-2',
                    tend: '2016-2-1',
                    thandle: true
                }, {
                    id: 2,
                    tid: '4321',
                    tname: '夏天',
                    tstart: '2017-7-2',
                    tend: '2016-8-5',
                    thandle: true
                }*/],

                currentPage: 1,
                pagesize: 8,
                pagesizes: [8, 16, 32, 64],
                total: 0,

                tempRange:''

            }
        },
        methods: {
            loadData(page, rows){
                //列表渲染数据
                var data = [];
                let url = globalurl + 'BTerm/queryBTermsByPagination';
                let _this = this;
                this.$http.get(url, {
                    params: {
                        page: page,
                        rows: rows
                    }
                }).then(function (res) {
                    // alert(JSON.stringify(res));
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (let i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.tid = i + 1;
                        obj.tbusinessId = pages[i].businessId;
                        obj.tname = pages[i].name;
                        obj.tcode = pages[i].code;
                        obj.tstart = eduUtil.subString(pages[i].startDate,10);
                        obj.tend = eduUtil.subString(pages[i].endDate,10);
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
            },

            insert_term() {
                this.$prompt('请输入编号', '信息补录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    //  inputPattern: ,
                    //  inputErrorMessage:
                }).then(({
                    value
                }) => {
                    this.$message({
                        type: 'success',
                        message: '你的编号是: ' + value
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });


            },
            toggle(index, row) {
                //                 alert(JSON.stringify(row));
                //                 alert(this.tableData[index].thandle);
                this.tableData[index].thandle = !this.tableData[index].thandle;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            saveRange(val){
                this.tempRange=val;
            },

            createTerm(){

                this.dialogFormVisible = false;
                let that = this;

                //获取日期
                // this.tempRange

                /*axios.post(globalurl + 'BTerm/add', {
                        params: {
                            code: this.form.code,
                            name: this.form.name,
                            startDate:this.form.date,
                            endDate:this.form.endDate
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

                this.loadData(this.currentPage, this.pagesize);
                */
            }
        }

    });



vue.loadData(vue.currentPage, vue.pagesize);

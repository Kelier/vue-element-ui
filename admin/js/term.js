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
                if (value.length > 50) {
                    callback(new Error('名称不能超过50位'));
                }
                else if (pattern.test(value) == false) {

                    callback(new Error('请不要输入特殊字符'));
                } else {
                    callback();
                }
            }, 1000);
        };
        var validateDate = (rule, value, callback) => {

            if (Object.prototype.toString.call(value).slice(8, -1) == 'Undefined') {
                callback(new Error('请选择日期'));
            } else if (value[0] === null||value==='') {
                callback(new Error('请选择日期'));
                console.log('??')
            } else {
                callback();
            }
        };
        return {
            //对话框
            dialogFormVisible: false,
            fullscreenLoading:false,
            form: {
                id: '',
                name: '',
                date: ''

            },
            termAbort: {
                id: '',
                name: '',
                date: [new Date(), new Date()]
            },
            labelPosition: 'right',
            termstatus: [],
            formrule: {
                id: [
                    {validator: checkid, trigger: 'blur'}
                ],
                name: [
                    {validator: validateName, trigger: 'blur'}
                ],
                date: [
                    {validator: validateDate, trigger: 'change'}
                ]
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
            formLabelWidth: '80px',

            //表格
            tableData: [],

            currentPage: 1,
            pagesize: 8,
            total: 0,

            changerange: '',
            tempRange: ''    //日期
        }
    },


    methods: {
        loadData(page, rows) {
            //列表渲染数据

            var data = [];
            var url = globalurl + 'BTerm/queryBTermsByPagination';
            var _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    sort: 'create_date desc'
                }, (function (res) {
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    _this.termstatus = [];
                    for (let i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.tid = i + 1;
                        obj.tbusinessId = pages[i].businessId;
                        obj.tname = pages[i].name;
                        obj.tcode = pages[i].code;
                        obj.tstart = eduUtil.substr(pages[i].startDate, 0, 10);
                        obj.tend = eduUtil.substr(pages[i].endDate, 0, 10);
                        obj.thandle = pages[i].isStart == '0' ? false : true;
                        _this.termstatus.push(pages[i].isStart);
                        data[i] = obj;
                    }
                    _this.tableData = data;

                }), (function (error) {
                    console.log(error);
                })
            )
        },
        bindThis(index) {
            // console.log(index);
            this.termAbort.id = this.tableData[index].tcode;
            this.termAbort.name = this.tableData[index].tname;

            var start = this.tableData[index].tstart.split('-');
            var end = this.tableData[index].tend.split('-');

            this.termAbort.date = [new Date(start[0], start[1], start[2]), new Date(end[0], end[1], end[2])]
        },
        change_term(formName, index) {
            var that = this;
            that.fullscreenLoading=true;
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    //获取日期
                    //console.info(this.tempRange); 2017-08-11 - 2017-09-19


                    var tempDate = that.changerange;
                    var tempDateStart = eduUtil.substr(tempDate, 0, 10);
                    var tempDateEnd = eduUtil.substr(tempDate, 13, 10);
                    console.info(tempDateStart + tempDateEnd);

                    eduUtil.ajaxPostUtil(globalurl + 'BTerm/add',
                        {
                            code: that.termAbort.id,
                            name: that.termAbort.name,
                            startDate: tempDateStart,
                            endDate: tempDateEnd,
                            businessId: that.tableData[index].tbusinessId

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
                            $('.el-popover').css("display", "none");
                        })
                        , (function (err) {
                            console.log(err);
                        })
                    );

                    // that.loadData(that.currentPage, that.pagesize);
                } else {
                    that.fullscreenLoading=false;
                    // that.$notify({
                    //     title: '提示信息',
                    //     message: '请注意填写规范',
                    //     type: 'warning'
                    // });
                    return false;
                }
            });
        },


        toggle(index, row) {
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            let _this = this;
            eduUtil.ajaxPostUtil(globalurl + 'BTerm/changeIS', {
                'code': row.tcode
            }, function (res) {
                var type = res.data.success;
                var message = res.data.message;
                type = eduUtil.tip_custom(type);
                _this.$notify({
                    title: '提示信息',
                    message: message,
                    type: type
                });
                _this.loadData(_this.currentPage, _this.pagesize);
            }, function (error) {
                console.log(error);
            });

        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        saveRange(val) {
            this.tempRange = val;
        },
        changeRange(val) {
            if (Object.prototype.toString.call(val).slice(8, -1) == 'Undefined') {
                this.termAbort.date = [null, null]
            }
            this.changerange = val;
        },

        createTerm(formName) {
            this.fullscreenLoading=true;
            var that = this;
            console.log(that.form.id)
            this.$refs[formName].validate((valid) => {
                

                if (valid) {
                    that.dialogFormVisible = false;

                    //获取日期
                    //console.info(this.tempRange); 2017-08-11 - 2017-09-19
                    var tempDate = that.tempRange;
                    var tempDateStart = eduUtil.substr(tempDate, 0, 10);
                    var tempDateEnd = eduUtil.substr(tempDate, 13, 10);
                    console.info(tempDateStart + tempDateEnd);

                    eduUtil.ajaxPostUtil(globalurl + 'BTerm/add',
                        {
                            code: that.form.id,
                            name: that.form.name,
                            startDate: tempDateStart,
                            endDate: tempDateEnd,
                            isStart: '0'

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
                            that.$refs[formName].resetFields();
                            that.loadData(that.currentPage, that.pagesize);
                        })
                        , (function (err) {
                            console.log(err);
                        })
                    );

                    // that.loadData(that.currentPage, that.pagesize);
                } else {
                    this.fullscreenLoading=false;
                    return false;
                }
            });


        },
        callOf(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        removeTerm(index) {
            var that = this;
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.fullscreenLoading=true;
                eduUtil.ajaxPostUtil(globalurl + 'BTerm/remove',
                    {
                        id: that.tableData[index].tbusinessId

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

});


vue.loadData(vue.currentPage, vue.pagesize);

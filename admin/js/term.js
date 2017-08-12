var vue = new Vue({
    el: '#nav',
    data: function () {
        return {
            //对话框
            dialogFormVisible: false,
            form: {
                id: '',
                name: '',
                date: ''

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
            tempRange: ''    //日期
        }
    },
    methods: {
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            let url = globalurl + 'BTerm/queryBTermsByPagination';
            let _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows
                }, (function (res) {
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (let i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.tid = i + 1;
                        obj.tbusinessId = pages[i].businessId;
                        obj.tname = pages[i].name;
                        obj.tcode = pages[i].code;
                        obj.tstart = eduUtil.substr(pages[i].startDate, 0, 10);
                        obj.tend = eduUtil.substr(pages[i].endDate, 0, 10);
                        obj.thandle = pages[i].isStart == '0' ? false : true
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
        saveRange(val){
            this.tempRange = val;
        },

        createTerm(){

            this.dialogFormVisible = false;
            let that = this;

            //获取日期
            //console.info(this.tempRange); 2017-08-11 - 2017-09-19
            var tempDate = this.tempRange;
            var tempDateStart = eduUtil.substr(tempDate, 0, 10);
            var tempDateEnd = eduUtil.substr(tempDate, 13, 10);
            //console.info(tempDateStart + tempDateEnd);

            eduUtil.ajaxPostUtil(globalurl + 'BTerm/add',
                {
                    'code': this.form.code,
                    'name': this.form.name,
                    'startDate': tempDateStart,
                    'endDate': tempDateEnd,
                    'isStart': '0'

                }
                , (function (response) {
                    // alert(JSON.stringify(response));
                    var type = response.data.success;
                    var message = response.data.message;
                    type = eduUtil.tip_custom(type);
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: type
                    });
                    that.loadData(vue.currentPage, vue.pagesize);
                })
                , (function (err) {
                    console.log(err);
                })
            );

            this.loadData(this.currentPage, this.pagesize);

        }
    }

});


vue.loadData(vue.currentPage, vue.pagesize);

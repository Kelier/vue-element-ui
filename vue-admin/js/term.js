    new Vue({
        el: '#nav',
        data: function () {
            return {
                //对话框
                dialogFormVisible: false,
                form: {
                    id: '',
                    name: '',


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
                tableData: [{
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
                }],

                currentPage: 4
            }
        },
        methods: {
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
            }
        }

    });

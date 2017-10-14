/**
 * Created by John Yan on 8/11/2017.
 */
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


        var checkid = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('课序号不能为空'));
            }
            var pattern = new RegExp(/^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/g);
            setTimeout(() => {

                if (pattern.test(value) === false) {
                    return callback(new Error('请不要输入特殊字符'));
                } else {
                    if (value.length > 15) {
                        callback(new Error('课序号不能大于15位'));
                    } else {
                        callback();
                    }
                }

            }, 1000);
        };

        var validateName = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入拒绝理由'));
            } else if (value.toLocaleString().length > 200)
                return callback(new Error('输入字符不大于200'))
        };

        return {
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            formLabelWidth: '80px',
            activeName: '0',
            form1: {
                businessId: '',
                refuseCourse: ''
            },
            form2: {
                businessId: '',
                slCode: '',
                courseCode: ''
            },
            //表格
            tableData: [],
            search_id: '',
            search_name: '',
            coursename: '',
            teaname: '',
            //edit form
            labelPosition: 'right',
            //pagination
            currentPage: 1,
            pagesize: 8,
            total: 0,
            bussid: [],
            isRecommend: [],

            cities: [],
            select: '',
            refuseCourse:[],

            formrule2: {
                slCode: [
                    {validator: checkid, trigger: 'blur'}
                ],
                courseCode: [
                    {validator: checkid, trigger: 'blur'}
                ]
            },
            formrule1: {
                refuseCourse: [
                    {validator: validateName, trigger: 'blur'}
                ]
            }
        }
    },
    mounted: function () {
        this.Pending_approval_loadData(this.currentPage, this.pagesize);
        var term_data = [];
        var _this = this;
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
    methods: {
        //分页查询

        loadData(page, rows){
            if (this.activeName == '0') {
                this.Pending_approval_loadData(page, rows);
            } else if (this.activeName == '1') {
                this.refuse_loadData(page, rows);
            }
        },

        Pending_approval_loadData(page, rows){

            //列表渲染数据
            var data = [];
            var url = globalurl + 'BSlApply/queryBSlApplysByPagination';
            var _this = this;
            var i = 0;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    applyState: 0,
                    termCode: _this.select
                }, (function (res) {
                    //  console.log(JSON.stringify(res.data.rows))
                    _this.bussid = [];
                    _this.isRecommend = [];
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.applyCode = pages[i].applyCode;
                        obj.slName = pages[i].slName;
                        obj.teacher = "(" + pages[i].teacherCode + ")" + pages[i].teacherName;
                        obj.applyCourse = pages[i].applyCourse;
                        obj.createDate = pages[i].createDate;
                        obj.applyState = pages[i].applyState == '0' ? '待审批' : pages[i].applyState == '2' ? '已拒绝' : '';
                        _this.bussid.push(pages[i].businessId);
                        // _this.isRecommend.push(pages[i].isRecommend);
                        data[i] = obj;
                    }

                    _this.tableData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },

        refuse_loadData(page, rows){
            //列表渲染数据
            //列表渲染数据
            var data = [];
            var url = globalurl + 'BSlApply/queryBSlApplysByPagination';
            var _this = this;
            var i = 0;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    applyState: 2,
                    termCode: _this.select
                }, (function (res) {
                    console.log(JSON.stringify(res.data.rows));
                    _this.bussid = [];
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.applyCode = pages[i].applyCode;
                        obj.slName = pages[i].slName;
                        obj.teacher = "(" + pages[i].teacherCode + ")" + pages[i].teacherName;
                        obj.applyCourse = pages[i].applyCourse;
                        obj.createDate = pages[i].createDate;
                        obj.applyState = pages[i].applyState == '0' ? '待审批' : pages[i].applyState == '2' ? '已拒绝' : '';
                        _this.bussid.push(pages[i].businessId);
                        obj.refuseCourse=pages[i].refuseCourse;
                        // _this.refuseCourse.push(pages[i].refuseCourse);
                        data[i] = obj;
                    }

                    _this.tableData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },

        agree(formName){
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    eduUtil.ajaxPostUtil(globalurl + 'BSlApply/agree', {
                            businessId: _this.form2.businessId,
                            slCode: _this.form2.slCode,
                            courseCode: _this.form2.courseCode,
                        }, (function (response) {
                            var type = response.data.success;
                            var message = response.data.message;
                            _this.form2.slCode = '';
                            _this.form2.courseCode = '';
                            type = tip_custom(type);
                            _this.$notify({
                                title: '提示信息',
                                message: message,
                                type: type
                            });
                            _this.dialogFormVisible2 = false;
                            _this.Pending_approval_loadData(_this.currentPage, _this.pagesize);
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

        refuse(formName){
            console.log(formName)
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                console.log(valid);
                if (valid) {
                    eduUtil.ajaxPostUtil(globalurl + 'BSlApply/refuse', {
                            businessId: _this.form1.businessId,
                            refuseCourse: _this.form1.refuseCourse,
                        }, (function (response) {
                            var type = response.data.success;
                            var message = response.data.message;
                            _this.form1.refuseCourse = '';
                            type = tip_custom(type);
                            _this.$notify({
                                title: '提示信息',
                                message: message,
                                type: type
                            });
                            _this.dialogFormVisible1 = false;
                            _this.Pending_approval_loadData(_this.currentPage, _this.pagesize);
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

        toggle_agree(index, row) {
            let _this = this;
            _this.form2.businessId = _this.bussid[index];
            _this.dialogFormVisible2 = true
        },

        toggle_refuse(index, row) {
            let _this = this;
            _this.form1.businessId = _this.bussid[index];
            _this.dialogFormVisible1 = true
        },

        handleSizeChange(val)
        {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val;
            // console.log(this.activeName)
            if (this.activeName == '0') {
                this.Pending_approval_loadData(this.currentPage, this.pagesize);
            } else if (this.activeName == '1') {
                this.refuse_loadData(this.currentPage, this.pagesize);
            }
        }
        ,
        handleCurrentChange(val)
        {
            //   console.log(`当前页: ${val}`);
            this.currentPage = val;
            //  console.log(this.activeName)
            if (this.activeName == '0') {
                this.Pending_approval_loadData(this.currentPage, this.pagesize);
            } else if (this.activeName == '1') {
                this.refuse_loadData(this.currentPage, this.pagesize);
            }
        }
        ,

        handleClick(tab, event) {
            this.search_id = '';
            this.search_name = '';
            this.currentPage = 1;
            this.pagesize = 8;
            if (tab.index == 0) {
                this.activeName = '0';
                this.Pending_approval_loadData(this.currentPage, this.pagesize)
            } else if (tab.index == 1) {
                this.activeName = '1';
                this.refuse_loadData(this.currentPage, this.pagesize);
            }
        },


    }
});


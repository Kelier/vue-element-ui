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
                return callback(new Error('推荐序号不能为空'));
            }
            var pattern = new RegExp(/^[0-9]*$/g);
            setTimeout(() => {

                if (pattern.test(value) === false) {
                    return callback(new Error('仅支持数字'));
                } else {
                    if(value>999){
                        callback(new Error('推荐序号不能大于999'));
                    }else
                    if (value.length > 3) {
                        callback(new Error('推荐序号不能大于3位'));
                    } else {
                        callback();
                    }
                }

            }, 1000);


        };

        var validateName = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入理由'));
            } else if (value.toLocaleString().length > 200){
                return callback(new Error('输入字符不大于200'))
            } else{
                callback();
            }

        };

        return {
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            fullscreenLoading:false,
            formLabelWidth: '80px',
            activeName: '0',
            form: {
                businessId: '',
                isRecommend: '',
                recommendOrder: '',
                recommendCourse: ''
            },
            formtea: {
                businessId: '',
                isRecommend: '',
                recommendOrder: '',
                recommendCourse: ''
            },
            //表格
            tableData: [
              /*  {
                    id: 1,
                    tid: 1212,
                    tname: 'sad',
                    is_recommend: '未推荐',
                    recommend_order: '',
                    tsex: '男',
                    recommend: '推荐'
                }*/
            ],
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

            formrule2: {
                recommendOrder: [
                    {validator: checkid, trigger: 'blur'}
                ],
                recommendCourse: [
                    {validator: validateName, trigger: 'blur'}
                ]
            },
            formrule1: {
                recommendOrder: [
                    {validator: checkid, trigger: 'blur'}
                ]
            }
        }
    },
    mounted: function () {
        this.tea_loadData(this.currentPage, this.pagesize);
    },
    methods: {
        //分页查询
        tea_loadData(page, rows){

            //列表渲染数据
            var data = [];
            var url = globalurl + 'BTeacher/queryBTeachersByPagination';
            var _this = this;
            var i = 0;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name,
                    sort: 'recommend_order'
                }, (function (res) {
                    //  console.log(JSON.stringify(res.data.rows))
                    _this.bussid = [];
                    _this.isRecommend = [];
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.tid = pages[i].code;
                        obj.tname = pages[i].name;
                        obj.is_recommend = pages[i].isRecommend == '0' ? '未推荐' : '推荐';
                        obj.recommend_order = pages[i].recommendOrder == 999 ? '' : pages[i].recommendOrder;
                        obj.tsex = (pages[i].sex == '1') ? '女' : '男';
                        // obj.thandle = pages[i].isRecommend == '0' ? false : true;
                        obj.recommend = pages[i].isRecommend == '0' ? '推荐' : '取消推荐';
                        _this.bussid.push(pages[i].businessId);
                        _this.isRecommend.push(pages[i].isRecommend);
                        data[i] = obj;
                    }

                    _this.tableData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },

        stu_loadData(page, rows){
            //列表渲染数据
            var data = [];
            let url = globalurl + 'BStudent/queryBStudentsByPagination';
            let _this = this;
            _this.bussid = [];
            _this.isRecommend = [];
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name,
                    sort: 'recommend_order'

                }, (function (res) {
                    //   alert(JSON.stringify(res));
                    console.log(res)
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (let i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.sid = pages[i].code;
                        obj.sname = pages[i].name;
                        obj.sex = (pages[i].sex == '1') ? '女' : '男';
                        obj.is_recommend = pages[i].isRecommend == '0' ? '未推荐' : '推荐';
                        obj.recommend_order = pages[i].recommendOrder == 999 ? '' : pages[i].recommendOrder;
                        obj.recommend = pages[i].isRecommend == '0' ? '推荐' : '取消推荐';
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

        sl_loadData(page, rows){
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
                    sort: 'recommend_order'
                }, (function (res) {
                    //    alert(JSON.stringify(res));
                    _this.bussid = [];
                    _this.isRecommend = [];
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
                        obj.is_recommend = pages[i].isRecommend == '0' ? '未推荐' : '推荐';
                        obj.recommend_order = pages[i].recommendOrder == 999 ? '' : pages[i].recommendOrder;
                        obj.recommend = pages[i].isRecommend == '0' ? '推荐' : '取消推荐';
                        _this.bussid.push(pages[i].businessId);
                        _this.isRecommend.push(pages[i].isRecommend);
                        // _this.tempData.push(pages[i].businessId);
                        data[i] = obj;
                    }
                    _this.tableData = data;
                }), (function (error) {
                    console.log(error);
                })
            )
        },

        toggle(index, row) {
            let _this = this;
            _this.form.businessId = _this.bussid[index];
            _this.form.isRecommend = _this.isRecommend[index];
            if (_this.isRecommend[index] == '0') {
                _this.dialogFormVisible1 = true
            } else {
                _this.dialogFormVisible1 = false
                _this.form.recommendOrder = 999;
                _this.form.recommendCourse = "";

                _this.updateRecommendState();

            }
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            // let _this = this;


        },
        toggleTea(index, row) {
            let _this = this;
            _this.formtea.businessId = _this.bussid[index];
            _this.formtea.isRecommend = _this.isRecommend[index];
            if (_this.isRecommend[index] == '0') {
                _this.dialogFormVisible2 = true
            } else {
                _this.dialogFormVisible2 = false
                _this.formtea.recommendOrder = 999;
                _this.formtea.recommendCourse = "";


                _this.updateRecommendStateTea();
            }
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            // let _this = this;


        },

        updateRecommendState(formName){

            var _this = this;
            _this.fullscreenLoading=true;
            var url = '';
            if (_this.activeName == '0')
                url = 'BTeacher/add';
            else if (_this.activeName == '1')
                url = 'BStudent/add';
            else
                url = 'BSl/add';
            console.log(url);
            if(this.form.isRecommend=='0'){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        eduUtil.ajaxPostUtil(globalurl + url, {
                                businessId: _this.form.businessId,
                                recommendOrder: _this.form.recommendOrder,
                                recommendCourse: _this.form.recommendCourse,
                                isRecommend: _this.form.isRecommend == '0' ? '1' : '0',
                            }, (function (response) {
                                _this.fullscreenLoading=false;
                                var type = response.data.success;
                                var message = response.data.message;
                                _this.form.recommendOrder = '';
                                _this.form.recommendCourse = '';
                                type = tip_custom(type);
                                _this.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: type
                                });
                                _this.dialogFormVisible1 = false;
                                if (_this.activeName == '0') {
                                    _this.tea_loadData(_this.currentPage, _this.pagesize);
                                } else if (_this.activeName == '1') {
                                    _this.stu_loadData(_this.currentPage, _this.pagesize);
                                } else {
                                    _this.sl_loadData(_this.currentPage, _this.pagesize);
                                }
                            })
                            , (function (err) {
                                console.log(err);
                            })
                        )
                    } else {
                        _this.fullscreenLoading=false;
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
            if(this.form.isRecommend=='1'){
                eduUtil.ajaxPostUtil(globalurl + url, {
                        businessId: _this.form.businessId,
                        recommendOrder: _this.form.recommendOrder,
                        recommendCourse: _this.form.recommendCourse,
                        isRecommend: _this.form.isRecommend == '0' ? '1' : '0',
                    }, (function (response) {
                        _this.fullscreenLoading=false;
                        var type = response.data.success;
                        var message = response.data.message;
                        _this.form.recommendOrder = '';
                        _this.form.recommendCourse = '';
                        type = tip_custom(type);
                        _this.$notify({
                            title: '提示信息',
                            message: message,
                            type: type
                        });
                        _this.dialogFormVisible1 = false;
                        if (_this.activeName == '0') {
                            _this.tea_loadData(_this.currentPage, _this.pagesize);
                        } else if (_this.activeName == '1') {
                            _this.stu_loadData(_this.currentPage, _this.pagesize);
                        } else {
                            _this.sl_loadData(_this.currentPage, _this.pagesize);
                        }
                    })
                    , (function (err) {
                        console.log(err);
                    })
                )
            }

        },

        updateRecommendStateTea(formName){
            var _this = this;
            _this.fullscreenLoading=true;
            var url = '';
            if (_this.activeName == '0')
                url = 'BTeacher/add';
            else if (_this.activeName == '1')
                url = 'BStudent/add';
            else
                url = 'BSl/add';
            // console.log(url);
            if(_this.formtea.isRecommend == '0'){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        eduUtil.ajaxPostUtil(globalurl + url, {
                                businessId: _this.formtea.businessId,
                                recommendOrder: _this.formtea.recommendOrder,
                                recommendCourse: _this.formtea.recommendCourse,
                                isRecommend: _this.formtea.isRecommend == '0' ? '1' : '0',
                            }, (function (response) {
                                _this.fullscreenLoading=false;
                                var type = response.data.success;
                                var message = response.data.message;
                                _this.formtea.recommendOrder = '';
                                _this.formtea.recommendCourse = '';
                                type = tip_custom(type);
                                _this.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: type
                                });
                                _this.dialogFormVisible2 = false;
                                if (_this.activeName == '0') {
                                    _this.tea_loadData(_this.currentPage, _this.pagesize);
                                } else if (_this.activeName == '1') {
                                    _this.stu_loadData(_this.currentPage, _this.pagesize);
                                } else {
                                    _this.sl_loadData(_this.currentPage, _this.pagesize);
                                }
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
            }
            if(_this.formtea.isRecommend == '1'){
                eduUtil.ajaxPostUtil(globalurl + url, {
                        businessId: _this.formtea.businessId,
                        recommendOrder: _this.formtea.recommendOrder,
                        recommendCourse: _this.formtea.recommendCourse,
                        isRecommend: _this.formtea.isRecommend == '0' ? '1' : '0',
                    }, (function (response) {
                        _this.fullscreenLoading=false;
                        var type = response.data.success;
                        var message = response.data.message;
                        _this.formtea.recommendOrder = '';
                        _this.formtea.recommendCourse = '';
                        type = tip_custom(type);
                        _this.$notify({
                            title: '提示信息',
                            message: message,
                            type: type
                        });
                        _this.dialogFormVisible2 = false;
                        if (_this.activeName == '0') {
                            _this.tea_loadData(_this.currentPage, _this.pagesize);
                        } else if (_this.activeName == '1') {
                            _this.stu_loadData(_this.currentPage, _this.pagesize);
                        } else {
                            _this.sl_loadData(_this.currentPage, _this.pagesize);
                        }
                    })
                    , (function (err) {
                        console.log(err);
                    })
                )
            }

        },

        handleSizeChange(val)
        {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val;
            // console.log(this.activeName)
            if (this.activeName == '0') {
                this.tea_loadData(this.currentPage, this.pagesize);
            } else if (this.activeName == '1') {
                this.stu_loadData(this.currentPage, this.pagesize);
            } else {
                this.sl_loadData(this.currentPage, this.pagesize);
            }
        }
        ,
        handleCurrentChange(val)
        {
            //   console.log(`当前页: ${val}`);
            this.currentPage = val;
            //  console.log(this.activeName)
            if (this.activeName == '0') {
                this.tea_loadData(this.currentPage, this.pagesize);
            } else if (this.activeName == '1') {
                this.stu_loadData(this.currentPage, this.pagesize);
            } else {
                this.sl_loadData(this.currentPage, this.pagesize);
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
                this.tea_loadData(this.currentPage, this.pagesize)
            } else if (tab.index == 1) {
                this.activeName = '1';
                this.stu_loadData(this.currentPage, this.pagesize);
            } else {
                this.activeName = '2';
                this.sl_loadData(this.currentPage, this.pagesize);
            }
        },
        callOf(formName) {
            this.dialogFormVisible1 = false;
            this.$refs[formName].resetFields();
        },

    }
});


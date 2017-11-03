/**
 * Created by John Yan on 8/15/2017.
 */

var editor = Vue.component('editormd', {
    template: '<textarea id="handlebar" v-model="content" @change="boomThis"></textarea>',
    data: function () {

        return {
            content: ''

        }
    },
    beforeMount: function () {

    },
    mounted: function () {
        var editor = new Simditor(
            {
                textarea: $('#handlebar'),
                toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent'],
                pasteImage: true,
                upload: {
                    url: globalurl+'BCarousel/upload',
                    params: null,
                    fileKey: "file",
                    connectionCount: 1,
                    leaveConfirm: "正在上传,确定要取消上传文件吗?"
                },
                success:function (data) {
                    alert(data)
                }
            }
            //optional options
        );

        $(".simditor-body").html(vue.area);
    },


    methods: {
        boomThis(){
            console.log(this.content);
        }
    },


});

var vue = new Vue({
    el: '#nav',
    data: function () {
        var checkTitle = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('标题不能为空'));
            }
            var pattern = new RegExp(/^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/g);
            setTimeout(() => {

                if (pattern.test(value) === false) {
                    return callback(new Error('请不要输入特殊字符'));
                } else {
                    if (value.length > 15) {
                        callback(new Error('编号不超过15个字符'));
                    } else {
                        callback();
                    }
                }

            }, 1000);


        };
        var validateEtext = (rule, value, callback) => {
            value = $(".simditor-body")[0].innerText;
            if (value.match(/^\s*$/)) {
                return callback(new Error('请输入正文'));
            } else {
                callback()
            }
        };
        return {
            dialogFormVisible: false,
            fullscreenLoading:false,
            form: {
                caption: '',
                checked: false,

            },
            formLabelWidth: '80px',

            toutiao: [{
                value: '0',
                label: '非头条'
            }, {
                value: '1',
                label: '头条'
            }],
            status: [{
                value: '0',
                label: '未发布'
            }, {
                value: '1',
                label: '已发布'
            }, {
                value: '2',
                label: '回收站'
            }],

            labelName: '',
            selectattr: '',
            selectstatus: '',
            formrule1: {
                caption: [
                    {validator: checkTitle, trigger: 'blur'}
                ],
                editor: [
                    {validator: validateEtext, trigger: 'blur'}
                ]
            },

            tableData: [],
            currentPage: 1,
            pagesize: 8,
            total: 0,

            bussid: [],
            newscode: [],
            news: [],
            createnews: '',
            area: '',
            newsId: ''


        }
    },

    methods: {

        loadData(page, rows){
            //列表渲染数据
            var data = [];
            var url = globalurl + 'BNews/queryBNewssByPaginationWithoutAuth';
            var _this = this;
            var i;
            var releasecode = this.selectattr;
            var butecode = this.selectstatus;

            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    isRelease: releasecode,
                    attribute: butecode
                }, (function (res) {
                    // console.log(JSON.stringify(res.data.rows))
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    var status = ["未发布", "已发布", "回收站"];

                _this.bussid=[];
                _this.newscode=[];
                _this.news=[];

                    for (i = 0; i < pages.length; i++) {
                        var obj = {};
                        obj.id = i + 1;
                        obj.title = pages[i].newsName;
                        obj.updatetime = pages[i].updateDate;
                        obj.launchtime = pages[i].releaseTime;
                        obj.pipe = pages[i].attribute == '0' ? false : true;
                        obj.launchstatus = status[parseInt(pages[i].isRelease, 10)];
                        if (obj.launchstatus == "未发布") {
                            obj.otherfork1 = '编辑';
                            obj.otherfork2 = '发布';
                            obj.otherfork3 = '回收站';
                        }
                        // console.log(obj.status)
                        if (obj.launchstatus == "已发布")
                            obj.otherfork2 = '取消发布';
                        if (obj.launchstatus == "回收站") {
                            obj.otherfork3 = '撤销删除';
                        }

                        _this.bussid.push(pages[i].businessId);
                        _this.newscode.push(pages[i].newsCode);
                        _this.news.push(pages[i].newsContent);
                        data[i] = obj;
                    }

                    _this.tableData = data;


                }), (function (error) {
                    console.log(error);
                })
            );
        },
        handleSizeChange(val)
        {
            this.pagesize = val;
            this.bussid = [];
            this.loadData(this.currentPage, this.pagesize);


        }
        ,
        handleCurrentChange(val)
        {
            this.currentPage = val;
            this.bussid = [];
            this.loadData(this.currentPage, this.pagesize);
        },
        createNews(formName){
            var createnews = $(".simditor-body").html();
            // console.log($(".simditor-body").find('p').html())
            var that = this;
            that.fullscreenLoading=true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                    that.dialogFormVisible = false;
                    eduUtil.ajaxPostUtil(globalurl + 'BNews/add', {
                            businessId: that.newsId,
                            newsName: that.form.caption,
                            newsContent: createnews,
                            attribute: that.form.checked ? '1' : '0'
                        }, (function (response) {
                            that.fullscreenLoading=false;
                            // alert(JSON.stringify(response));
                            var type = response.data.success;
                            var message = response.data.message;
                            if (type) {
                                that.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: 'success'
                                });
                            } else {
                                that.$notify({
                                    title: '提示信息',
                                    message: message,
                                    type: 'warning'
                                });
                            }

                            that.loadData(that.currentPage, that.pagesize);
                        })
                        , (function (err) {
                            console.log(err);
                        })
                    )

                } else {
                    that.fullscreenLoading=false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        callOf(formName) {
            this.dialogFormVisible1 = false;
            this.$refs[formName].resetFields();
        },
        editnews(index){
            console.log("edit");
            var that = this;
            this.newsId = that.bussid[index];
            eduUtil.ajaxPostUtil(globalurl + 'BNews/oneWithoutAuth', {
                businessId: that.bussid[index]
            }, function (res) {
                var type = res.data.success;
                if (type) {
                    var obj = res.data.result;
                    that.dialogFormVisible = true;
                    that.form.caption = obj.newsName;
                    that.form.checked = obj.attribute == '1' ? true : false;
                    that.area = obj.newsContent;
                    $(".simditor-body").html(obj.newsContent);
                    // console.log(res)
                }
            }, function (err) {
                console.log(err)
            })
        },
        launchnews(index){
            var statuscode = this.tableData[index].launchstatus;

            var that = this;
            var status = ["未发布", "已发布", "回收站"];
            var realtop;
            for (var i = 0; i < status.length; i++) {
                if (status[i] == statuscode) {
                    realtop = i;
                }

            }
            eduUtil.ajaxPostUtil(globalurl + 'BNews/add', {
                isRelease: realtop == '0' ? '1' : '0',
                businessId: that.bussid[index]
            }, res => {
                var type = res.data.success;
                if (type) {
                    var message = res.data.message;
                    type = eduUtil.tip_custom(type);
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: type
                    });
                    that.loadData(that.currentPage, that.pagesize);
                }

            }, err => {

            })
        },
        rabbish(index){
            /*回收站*/
        },
        touchnews(index){
            /*跳转新闻详情页*/
            var that = this;
            window.location.href = "../../front/html/publish.html?businessId=" + that.bussid[index];

        },
        toggle_pipe(index){
            // console.log(this.tableData[index].pipe == false)
            var that = this;
            var attribute = (this.tableData[index].pipe == false) ? '1' : '0';
            eduUtil.ajaxPostUtil(globalurl + 'BNews/add', {
                attribute: attribute,
                businessId: that.bussid[index]
            }, res => {
                var type = res.data.success;
                var message = res.data.message;
                if (type) {
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: 'success'
                    });
                } else {
                    that.$notify({
                        title: '提示信息',
                        message: message,
                        type: 'warning'
                    });
                }
            }, err => {
                console.log(err)
            })

        }

    }
});


vue.loadData(vue.currentPage, vue.pagesize);

Vue.prototype.$http = axios;//原型链
var vue = new Vue({
    el: '#nav',
    data: function () {
        return {

            //对话框
            dialogFormVisible: false,
            dialogVisible: false,
            form: {
                id: '',
                name: '',


            },
            formLabelWidth: '120px',

            //表格
            tableData: [/*{
                id: 1,
                cid: 1232,
                cname: 'Java',
                imageSrc: 'http://pic44.nipic.com/20140717/12432466_121957328000_2.jpg'
                }, {
                id: 2,
                cid: 3243,
                cname: 'C',
                imageSrc: 'http://pic44.nipic.com/20140717/12432466_121957328000_2.jpg'
                }*/],

            lineindex: 0,

            //edit form
            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                region: '',
            },

            //search area
            courseid: '',
            coursename: '',

            //pagination
            currentPage: 1,
            pagesize: 8,
            pagesizes: [8, 16, 32, 64],
            total: 0

        }
    },
    methods: {
        loadData(page, rows){
            //列表渲染数据
            var data = [];
            let url = globalurl + 'BLesson/queryBLessonsByPagination';
            let _this = this;
            console.log(this.search_id);
            this.$http.get(url, {
                params: {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name
                }
            }).then(function (res) {
                // alert(JSON.stringify(res));
                var pages = res.data.rows;//查询过来的每页数据
                _this.total = res.data.total;//总记录数
                for (let i = 0; i < pages.length; i++) {
                    var obj = {};
                    obj.id = i + 1;
                    obj.tcode = pages[i].code;
                    obj.tlessonName = pages[i].lessonName;
                    obj.tname = pages[i].name;
                    obj.tsex = (pages[i].sex == '1') ? '男' : '女';
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
        importmould() {
            document.getElementById("btn_file").click();
        },

        //新增课程
        createClass(){
            this.dialogFormVisible = false;
            //push 一条数据
            // this.tableData.push({id: this.tableData.length + 1, tid: 6666, tname: 'assdda', tsex: '女'});
            // console.log(this.tableData.length);
            // if (this.tableData.length / this.pagesize > this.currentPage - 1) {
            //     this.loadData(this.currentPage, this, pagesize);
            // }
            let that = this;
            let _formData = new FormData();
            _formData.append('code', this.form.id);
            _formData.append('lessonName', this.form.name);
            axios.post(globalurl + 'BLesson/add', _formData)
                .then(function (response) {
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
                .catch(function (err) {
                    console.log(err);
                });

            //  this.loadData(this.currentPage, this.pagesize);

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
                return false;
            }


            //获取欲上传的文件路径
            var filepath = document.getElementById("btn_file").value;
            // alert(filepath);
            var suf = filepath.split(".")[filepath.split(".").length - 1];
            // alert(suf);
            var tp = "xls,xlsx,xlsm";
            //返回符合条件的后缀名在字符串中的位置
            var rs = tp.indexOf(suf);
            if (rs >= 0) {
                this.$notify({
                    title: '成功',
                    message: '您的模板已上传成功',
                    type: 'success'
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

        //test
        editcover(index, row) {
            //  alert(index);
            this.dialogVisible = true;
            this.lineindex = index;
        },

        //confirm image
        confirm() {
            let num = this.lineindex;
            this.tableData[num].imageSrc = 'http://img.sc.chinaz.com/upload/2015/09/01/2015090117074871.jpg';
            this.dialogVisible = false;
        },

        //改变课程
        change_course(index) {

            // alert(index);

        },
        //打印页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        }



    }
});
/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);
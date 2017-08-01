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
             formLabelWidth: '120px',

             options: [{
                 value: '1',
                 label: '男'
                }, {
                 value: '2',
                 label: '女'
                }],

             //表格
             tableData: [{
                 id: 1,
                 cid: 'csxfs',
                 cname: '软件2班',
                 people: 15
                }, {
                 id: 2,
                 cid: 'sadxc',
                 cname: '马克思1班',
                 people: 23
                }],



             //edit form
             labelPosition: 'right',
             formLabelAlign: {
                 name: '',
                 region: '',
             },

             //search area
             classarea: '',
             people: '',

             //pagination
             currentPage: 1,
             pagesize: 8,
             pagesizes: [8, 16, 32, 64],
             total: 4,

             //stu info
             //student info
             gridData: [{
                 sid: 1,
                 snum: '14112222',
                 sname: '王小虎'
                }, {
                 sid: 2,
                 snum: '14112433',
                 sname: '陈国栋'
                }, {
                 sid: 3,
                 snum: '14113454',
                 sname: '李大叔'
                }, {
                 sid: 4,
                 snum: '14116765',
                 sname: '赵半天'
                }]

         }
     },
     methods: {
         //分页查询
         loadData(page, rows){
             //列表渲染数据
             var data = [];
             let url = globalurl + 'BClass/queryBClasssByPagination';
             let _this = this;
             this.$http.get(url, {
                 params: {
                     page: page,
                     rows: rows,
                     className: _this.classarea,
                     studentNum: _this.people
                 }
             }).then(function (res) {
                //  alert(JSON.stringify(res));
                 var pages = res.data.rows;//查询过来的每页数据
                 _this.total = res.data.total;//总记录数
                 for (let i = 0; i < pages.length; i++) {
                     var obj = {};
                     obj.id = i + 1;
                     obj.cid = pages[i].code;
                     obj.cname = pages[i].className;
                     obj.people = pages[i].studentNum;
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

         

         //新增用户
         createClasses(){
             this.dialogFormVisible = false;
             //push 一条数据
             // this.tableData.push({id: this.tableData.length + 1, tid: 6666, tname: 'assdda', tsex: '女'});
             // console.log(this.tableData.length);
             // if (this.tableData.length / this.pagesize > this.currentPage - 1) {
             //     this.loadData(this.currentPage, this, pagesize);
             // }
             let that = this;
             axios.get(globalurl + 'BClass/add', {
                 params: {
                     code: this.form.id,
                     className: this.form.name,
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
                 let _formData = new FormData();
                 _formData.append('importFile', dom.files[0]);
                 let _config = {
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
                                 message: '您的模板已上传成功',
                                 type: type
                             });
                             that.loadData(vue.currentPage, vue.pagesize);
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
                 return false;
             }
         },



         //改变课程
         change_course(index) {

             // alert(index);

         },
         handleSizeChange(val) {
             console.log(`每页 ${val} 条`);
         },
         handleCurrentChange(val) {
             console.log(`当前页: ${val}`);
         },

         //see more stu info
         see_more(index) {
             this.dialogTableVisible = true;
         },
         deleteRow(index, rows) {
             rows.splice(index, 1);
         }

     }
 });

/*
 * 初次渲染
 **/
vue.loadData(vue.currentPage, vue.pagesize);

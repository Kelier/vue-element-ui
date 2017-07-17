 new Vue({
     el: '#nav',
     data: function () {
         return {
             dialogVisible: false,
             dialogTableVisible: false,
             formLabelWidth: '120px',

             //表格
             tableData: [{
                 id: 1,
                 cid: '#1232',
                 cnum: 166223,
                 cname: 'Java',
                 tnum: 20134232,
                 tname: '张十大',
                 thandle: true
                }, {
                 id: 2,
                 cid: '#4233',
                 cnum: 163242,
                 cname: 'C',
                 tnum: 20153123,
                 tname: '王书记',
                 thandle: false
                }],


             //edit form
             labelPosition: 'right',
             formLabelAlign: {
                 name: '',
                 region: '',
             },

             //search area
             coursename: '',
             teaname: '',

             //pagination
             currentPage: 4,

             //select
             cities: [{
                 value: '1',
                 label: '2017-2018春'
                }, {
                 value: '2',
                 label: '2017-2018秋'
                }, {
                 value: '3',
                 label: '2016-2017春'
                }],

             status: [{
                 value: 'on',
                 label: '上线'
                }, {
                 value: 'off',
                 label: '下线'
                }, {
                 value: 'all',
                 label: '全部'
                }],


             select: '',
             mode: '',

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
         importmould1() {
             document.getElementById("file_stu").click();

         },

         importmould2() {
             document.getElementById("file_tea").click();

         },

         fileupload() {
             var dom = document.getElementById("file_stu");
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
             var filepath = document.getElementById("file_stu").value;
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
         toggle(index, row) {
             //                 alert(JSON.stringify(row));
             //                 alert(this.tableData[index].thandle);
             this.tableData[index].thandle = !this.tableData[index].thandle;
         },

         //edit stu info
         edit_stu(index) {
             // alert(index);
             this.dialogTableVisible = true;
             //进行查询操作
         },
         deleteRow(index, rows) {
             rows.splice(index, 1);
         }

     }
 });

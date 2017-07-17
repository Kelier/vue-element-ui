 new Vue({
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
             currentPage: 4,

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

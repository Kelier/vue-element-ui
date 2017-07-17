 new Vue({
     el: '#nav',
     data: function () {
         return {

             //对话框
             dialogFormVisible: false,
             dialogVisible: false,
             form: {
                 id: '',
                 name: '',
                 sex: ''

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
                 sid: 1232,
                 sname: '张晓波',
                 sex: '男'
                }, {
                 id: 2,
                 sid: 1324,
                 sname: '王湾',
                 sex: '女'
                }],



             //edit form
             labelPosition: 'right',
             formLabelAlign: {
                 name: '',
                 region: '',
             },

             //search area
             stuid: '',
             stuname: '',

             //pagination
             currentPage: 4

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

         //重置密码
         reset(index) {
             // alert(index);
             this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning'
             }).then(() => {
                 this.$message({
                     type: 'success',
                     message: '密码已重置为123456!'
                 });
             }).catch(() => {
                 this.$message({
                     type: 'info',
                     message: '已取消重置'
                 });
             });
         }

     }
 });

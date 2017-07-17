var vue=new Vue({
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
                tid: 1232,
                tname: '张晓波',
                tsex: '男'
            }, {
                id: 2,
                tid: 1324,
                tname: '王湾',
                tsex: '女'
            }],



            //edit form
            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                region: '',
            },

            //search area
            teaid: '',
            teaname: '',

            //pagination
            currentPage: 1,
            pagesize: 2,
            pagesizes:[2,4],
            totals: 4

        }
    },

    // created: function () {
    //
    // },

    methods: {



        loadData(page,rows){
            //列表渲染数据
            var data = []
            let url = '../js/test.json'
            Vue.prototype.$http = axios;
            let _this = this
            this.$http.post(url, {}).then(function (res) {

                for (let i = 0; i < rows; i++) {
                    //规定页码范围，只渲染当前页
                    var obj = {}
                     if(res.data.tableData.length>i+(page-1)*rows){
                         obj.id = res.data.tableData[i+(page-1)*rows].id
                         obj.tid = res.data.tableData[i+(page-1)*rows].tid
                         obj.tname = res.data.tableData[i+(page-1)*rows].tname
                         obj.tsex = res.data.tableData[i+(page-1)*rows].tsex
                         data[i] = obj
                     }else{
                         continue;
                     }



                }

                _this.tableData = data

            }).catch(function (error) {
                console.log(error);
            })
        },

//creat user
        createUser(){
            this.dialogFormVisible = false;
            this.tableData.push({id: this.tableData.length+1, tid: 6666, tname: 'assdda', tsex: '女'});
            console.log(this.tableData.length);
            if(this.tableData.length/this.pagesize>this.currentPage-1){
                loadData(this.currentPage,this,pagesize);
            }


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
            var filepath = document.getElementById("btn_file").value;
            // alert(filepath);
            var suf = filepath.split(".")[filepath.split(".").length - 1];
            // alert(suf);
            var tp = "xls";
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
        //下载模板
        exportmould(){
          //下载的导向操作
          //   axios.get('/ your url')
          //       .then(function(response){
          //           console.log(response);
          //       })
          //       .catch(function(err){
          //           console.log(err);
          //       });
        },


        //改变课程
        change_course(index) {

            // alert(index);

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize=val;
            this.loadData(this.currentPage,this.pagesize);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage=val;
            this.loadData(this.currentPage,this.pagesize);
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
//初次渲染
vue.loadData(vue.currentPage,vue.pagesize);

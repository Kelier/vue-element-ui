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


            },
            formLabelWidth: '120px',

            //表格
            tableData: [{
                id: 1,
                cid: 1232,
                cname: 'Java',
                imageSrc: 'http://pic44.nipic.com/20140717/12432466_121957328000_2.jpg'
                }, {
                id: 2,
                cid: 3243,
                cname: 'C',
                imageSrc: 'http://pic44.nipic.com/20140717/12432466_121957328000_2.jpg'
                }],

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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }



    }
});

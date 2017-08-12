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

var vue=new Vue({
    el:'#nav',
    data:function () {
        return{
            dialogFormVisible: false,
            formLabelWidth: '120px',
            activeName: 'first',
            form: {
                businessId:'',
                isRecommend:'',
                recommendOrder: '',
                recommendCourse: ''
            },
            //表格
            tableData: [],
            search_id: '',
            search_name: '',
            //edit form
            labelPosition: 'right',
            //pagination
            currentPage: 1,
            pagesize: 8,
            total: 0,
            bussid: [],
            isRecommend: [],
        }
    },
    methods: {
        //分页查询
        loadData(page, rows){

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
                    sort:'recommend_order'
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
                        obj.is_recommend = pages[i].isRecommend== '0'?'未推荐':'推荐';
                        obj.recommend_order = pages[i].recommendOrder;
                        obj.tsex = (pages[i].sex == '1') ? '男' : '女';
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

        toggle(index, row) {
            let _this = this;
            _this.form.businessId = _this.bussid[index];
            _this.form.isRecommend = _this.isRecommend[index];
            console.log(index,_this.isRecommend[index])
            if( _this.isRecommend[index] == '0'){
                _this.dialogFormVisible=true
            }else{
                _this.dialogFormVisible=false
                _this.form.recommendOrder = 999;
                _this.form.recommendCourse = "";
                _this.updateRecommendState();
            }
            //     console.info(row.tcode);
            //                 alert(this.tableData[index].thandle);
            // let _this = this;


        },

        updateRecommendState(){
            let _this = this;
            eduUtil.ajaxPostUtil(globalurl + 'BTeacher/add', {
                    businessId: _this.form.businessId,
                    recommendOrder: _this.form.recommendOrder,
                    recommendCourse:_this.form.recommendCourse,
                    isRecommend: _this.form.isRecommend == '0' ? '1' : '0',
                }, (function (response) {
                    //  alert(JSON.stringify(response.data.message));
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
                    _this.dialogFormVisible=false;
                    _this.loadData(_this.currentPage, _this.pagesize);
                })
                , (function (err) {
                    console.log(err);
                })
            )
        },

        handleSizeChange(val)
        {
            console.log(`每页 ${val} 条`);
            this.pagesize = val;
            this.loadData(this.currentPage, this.pagesize);
        }
        ,
        handleCurrentChange(val)
        {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.loadData(this.currentPage, this.pagesize);
        }
        ,

        handleClick(tab, event) {
            if(tab.index==0){
                console.log(this.currentPage,this.pagesize);
                this.loadData(this.currentPage,this.pagesize)
            }
    }
}
});
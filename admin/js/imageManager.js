/**
 * Created by gaowenfeng on 2017/8/16.
 */
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
            //表格
            tableData: [],

            bussid: [],
            imagetype:[]

        }
    },
    methods: {
        //分页查询
        loadData(){
            //列表渲染数据
            var page=1, rows=100;
            var data = [];
            let url = globalurl + 'BImage/queryBImagesByPagination';
            let _this = this;
            eduUtil.ajaxPostUtil(url, {
                    page: page,
                    rows: rows,
                    code: _this.search_id,
                    name: _this.search_name
                }, (function (res) {
                    //   alert(JSON.stringify(res));
                _this.bussid=[];
                _this.imagetype=[];
                    var pages = res.data.rows;//查询过来的每页数据
                    _this.total = res.data.total;//总记录数
                    for (let i = 0; i < pages.length; i++) {

                        var obj = {};
                        obj.id = i + 1;
                        obj.imageCode = pages[i].imageCode;
                        obj.imageName = pages[i].imageName;
                        obj.updateDate = pages[i].updateDate;
                        _this.bussid.push(pages[i].businessId);
                        _this.imagetype.push(pages[i].imageCode);
                        data[i] = obj;
                    }
                    _this.tableData = data;
                }), (function (error) {
                    console.log(error);
                })
            )
        },

        //编辑界面
        edit(index) {
            if(this.imagetype[index]=='home_top_banner'){

                $("#page").fadeOut();

                $.ajax({
                    url: 'banner.html',
                    async: false,
                    success:function(res){
                        $("#page").fadeOut();
                        $("#page").html(res.toLocaleString());
                        $("#page").fadeIn();
                    },
                    err:function (err) {
                        console.log(err)
                    }
                });
            }

        }
    }
});

vue.loadData();


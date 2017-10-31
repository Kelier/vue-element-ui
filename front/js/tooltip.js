var tip={};
(function () {
   
   tip.open=function (title) {
       $('body').loading({
           loadingWidth: 240,
           title: title,
           name: 'test',
           discription: '这是一个描述...',
           direction: 'row',
           type: 'origin',
           originBg: '#BF5A1F',
           originDivWidth: 30,
           originDivHeight: 30,
           originWidth: 4,
           originHeight: 4,
           smallLoading: false,
           titleColor: '#BF5A1F',
           loadingBg: '#2B2B2B',
           loadingMaskBg: 'rgba(0,0,0,0.6)'
       });
   };
   
   tip.close=function () {
       removeLoading('test');
   };
   
   
})();

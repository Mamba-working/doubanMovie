define([
    'top250',
    'hot',
    "search",
    "jquery"
], function(top250, hot,search,$) {
    var app = {
        init: function () {
            this.$tabs = $('footer>span')
            this.$panels = $('section')
            this.bind()
            this.arr =[top250,hot,search]
            top250.init()
            hot.init()
            search.init()
    
        },
        bind: function () {
            var _this = this
            this.$tabs.on('click', function () {
                $(this).addClass('active').siblings().removeClass('active')
                _this.$panels.eq($(this).index()).fadeIn().siblings().hide();
                _this.arr[$(this).index()].now=true;
                let indx = $(this).index()
                _this.arr.forEach(function(n,index){
                    if(index !== indx){
                        n.now=false;
                    }
                })
                $("main").scrollTop(0);
            })
        }
    
    }
    return app
});

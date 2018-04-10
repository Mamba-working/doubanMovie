define([
    'jquery',
    
], function($) {
    var hot = {
        init: function () {
            this.now = true;
            this.index = 0;
            this.id = 2;
            this.url = "/v2/movie/in_theaters";
            this.isfinish = false;
            this.total = 15;
            this.count = 15;
            this.start();
        },
        start: function () {
            this.getData.bind(this)();
        },
        getData: getData,
        setData: setData,
        lazyLoad: function () {
            var that = this;
            $('main').scroll(function () {
                if (that.clock) {
                    clearTimeout(that.clock);
                }
                that.clock = setTimeout(function () {
                    if ($('section').eq(1).height() - 10 <= $('main').scrollTop() + $(
                            'main').height()) {
                        that.getData();
                    }
                }, 300)
    
            })
        }
    }
    function getData() {
        if(this.now){
            if (this.isfinish) {
            return
        }
        if (this.$input) {
            this.data = this.$input.val()
        }
        // if(this.clear){
        //     this.clear()
        // }
        $("main .loading").fadeIn('slow')
        console.log("out:",this.index)
        $.ajax({
            url: `https://api.douban.com/${this.url}`,
            dataType: "jsonp",
            method: "GET",
            data: {
                start: this.index,
                count: this.count,
                q: this.data
            }
        }).done(function (ret) {
            ret.subjects.forEach(this.setData.bind(this));
            this.index += this.count;
            if (this.index + this.count >= this.total) {
                this.isfinish = true;
            };
            console.log("in:",this.index)
        }.bind(this)).fail(function () {
        }).always(function () {
            $("main .loading").fadeOut("slow")
        })
        }
        
    }
    
    function setData(data) {
        let template =
            `
        <div class="item">
            <a href="#">
                <div class="img">
                    <img src="" >
                </div>
                <div class="detail">
                    <div>
                        <h2></h2>
                    </div>
                    <div>
                        <span class="rate"></span> / 收藏:
                        <span class="collect"></span>
                    </div>
                    <div>
                        <span class="year"></span>
                        <span class="type"> </span>
                    </div>
                    <div>导演:
                        <span class="director"> </span>
                    </div>
                    <div>主演:
                        <span class="actor"></span>
                    </div>
                </div>
            </a>
        </div>
        `
        let node = $(template);
    try{
        node.find("img").attr("src", data.images.medium);
        node.find("h2").text(data.title);
        node.find(".rate").text(data.rating.average)
        node.find(".collect").text(data.collect_count)
        node.find(".director").text(data.directors[0].name)
        node.find(".actor").text(setStr(data.casts))
        node.find(".year").text(data.year + '/')
        node.find(".type").text(data.genres.join("/"));
        $(`section:nth-child(${this.id})>.layout`).append(node);
        this.lazyLoad();
    }catch(e){
        console.log("maybe a mistake")
    }
       
    }
    
    function setStr(arr) {
        let array = []
        arr.forEach(function (n) {
            array.push(n.name);
        })
        return array.join('、')
    }
    return hot
});

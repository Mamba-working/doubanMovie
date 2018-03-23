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
var top250 = {
    init: function () {
        this.now = true;
        this.index = 0;
        this.count = 20;
        this.total = 250;
        this.movie = {};
        this.isfinish = false;
        this.clock = undefined;
        this.id = 1;
        this.url = "v2/movie/top250";
        this.start.bind(this)();
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
                if ($('section').eq(0).height() - 10 <= $('main').scrollTop() + $(
                        'main').height()) {
                    that.getData();
                }
            }, 300)

        })
    }

}
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
var search = {
    init: function () {
        this.now = false;
        this.index = 0;
        this.id = 3;
        this.url = "/v2/movie/search";
        this.isfinish = false;
        this.total = 60;
        this.count = 15;
        this.$input = $("section input")
        this.$search = $("section:nth-child(3) .input a")
        this.data = ''
        this.start();
    },
    start: function () {
        console.log(this.$search[0])
        this.$search.on("click", getData.bind(this));
        this.$search[0].addEventListener("click", function () {
            this.clear();
            console.log("ok")
        }.bind(this))
    },
    getData: getData,
    setData: setData,
    clear: function () {
        $("section:nth-child(3) .layout").children().remove();
    },
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
                    console.log(that)
                }
            }, 300)

        })
    }
}
app.init()
//公共复用函数 
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
    }.bind(this)).fail(function () {
        console.log(`erro:${this.id}`)
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
}

function setStr(arr) {
    let array = []
    arr.forEach(function (n) {
        array.push(n.name);
    })
    return array.join('、')
}
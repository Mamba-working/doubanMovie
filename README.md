# doubanMovie
[预览地址](https://mamba-working.github.io/doubanMovie/movie1.html)

## 技术
  jquery
## 介绍
  使用了豆瓣的api获取数据top250每次下拉到底会懒加载后续的电影,热映电影没有加入懒加载只提供15个电影,最后的搜索功能在第一次搜索
  的时候正常，第二次搜索也就是删除现有搜索结果加入新的时候会出现bug,懒加载会出现重复数据，应该是get数据的时候索引未更新(更新了一次bug解决了这个问题，
  并且对错误进行了处理，应该是豆瓣返回的数据格式并不是全部一致，导致部分数据会出现缺失)


![](https://ws1.sinaimg.cn/large/b17846e9gy1fpscjk9jguj20jx0q3dly.jpg)
![](https://ws1.sinaimg.cn/large/b17846e9gy1fpscke8vglj20r10raagy.jpg)

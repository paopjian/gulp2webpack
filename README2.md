# gulp2webpack

# 前端远古项目现代化改造进程记录--03 阶段2

第二阶段,处理全局引入的文件,
1. 全局使用的var变量,代码里使用window. 进行调用
2. 引入的mixins代码引用方式调整


### 1.将script引用改为import引用
旧代码:类似于 ```<script type="text/javascript" src="../../common-source/js/data/data.js" ></script>```, 内部只有一个var变量,
直接引入的时候浏览器就会自动注册,window.dataTable这样就可以引入,但是如果import引用,则不会自动注册上去,需要改动原代码,前面加入export,
在js代码中需要import {}引入后再window手动注册.
```js
import {dataTable} from '../../js/data/data.js'
window.dataTable = dataTable;
```
import引用后就不需要用CopyPlugin复制文件了.

### 2.mixins类引用
同1的script引入,mixins类也是script注册全局的,但是vue2在mixins里不用写window就可以解析引入,
我们的项目里使用了比较trick的方法合并多个js文件,每个文件都是js写的vue配置,```tplMixin=Vue.util.mergeOptions(tplMixin,{..})```,
..内写vue的options,最后由总js的vue使用```mixins:[tplMixin]```实现引入. 这样HTML文件里可以引入N个js文件,生效在一个vue上.

这里需要注意的问题是线性mixins,比如A引入了B,main引入了A,如果在A.js内没有import B,就会报错,在之前HTML引用的时候是没有问题的,因为都是window全局变量.
所以改造的时候需要注意每个文件是有多余的mixins,考虑是直接删除,且放弃Vue.util.mergeOptions技术


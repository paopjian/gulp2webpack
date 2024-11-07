# gulp2webpack

前端远古项目现代化改造进程记录--02阶段1

第一阶段,去除gulp的打包流程,gulp打包流程包含三大主要流程:

    1. 移动第三方库代码/图片到common-source
    2. 使用gulp的
    <!-- build:js js/index.js --><!-- endbuild -->
    <!-- build:css index.css --><!-- endbuild -->
    语句将特定HTML内引用的<script><link> js和CSS打包到index.js index.css文件内,实现其他页面可以直接引用这些公共代码,并在文件名加入hash,最后在HTML中相关位置修改文件名
    3. 将每个pages下文件夹单独打包, 每个文件夹作为一个独立页面, 将js|css|html打包后移动到dist.

### 0 入口
本次项目认为pages下每个文件夹都是入口,webpack可以传入数组作为entry,同时每个entry可以设置import和filename单独控制输出
```js
const fs = require('fs')
let pages = []; 
fs.readdirSync(path.join(__dirname, '../src/pages')).forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
        pages.push(file)
    }
})

let entry =  {}
for (const page of pages) {
        entry[page] = {
            import: `./src/pages/${page}/index.js`,
        };
    }
// module.exports
{
    enrty: entry,
}
```

### 一 移动第三方库
使用copy-webpack-plugin插件,这个插件可以直接移动文件到指定位置, 由from和to控制
```js
const CopyPlugin = require('copy-webpack-plugin');
// module.exports
{
    plugins: [
        new CopyPlugin({
            patterns: {
                from: './src/js/lib',
                to: 'common-source/js/lib'
            }
        })]
}
```

### 二 打包通用JS和CSS文件
这一步有争议, 如果由webpack从entry进入进行打包, 得到的js文件是由webpack处理的IIFE立即执行函数, 原js会被包入代码块内执行, 之前使用gulp打包时只是拼接js, 如果html直接引用, 所有变量都是全局的, 其他代码如果经过webpack处理可能会无法获取, 如果不大改源代码, 就无法继续, 所以选择使用第三方插件. webpack-concat-files-plugin 插件可以实现文件拼接需求, 传入src和dest即可得到结果.这里用当前时间作为hash (经调研,@mcler/webpack-concat-plugin效果近似,但文本最后一行没有换行,可能出现问题故放弃)
```js
const WebpackConcatPlugin = require("webpack-concat-files-plugin");
// module.exports
{
    plugins: [
        new WebpackConcatPlugin({
                bundles: [{
                    src: ['./src/js/app/common/*.js'],
                    dest: `dist/common-source/js/app/common/index-${dateNow}.js`
                    }
                ]
            }
        )
    ]
}
```
公共CSS可以用上面相同的方法,也可以用mini-css-extract-plugin实现提取css单独文件, 问题在于每个entry都会执行这个插件,导致其他的页面也会出现在奇怪的位置,需要在filename处通过chunk.name判断entry来源来控制导出位置. 还需要在entry处设置filename不让无用js跑到pages下
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// common和common2入口进入的,导出css时放入common-source/css, 其他放入pages/[name]/
function MiniCssExtractPluginFilename({ chunk }) {
    if (['common', 'common2'].includes(chunk.name)) {
        return `common-source/css/[name]/index-${dateNow}.css`
    }
    return `pages/[name]/style-${dateNow}.css`
}
entry = Object.assign(entry,{
    'common': {
            import: './src/build/css_page.js',
            filename: `common-source/css/common/index-${dateNow}.js`,
        },
})
// module.exports
{
    entry:entry,
    module:{
        rulse:[
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: MiniCssExtractPluginFilename,
            }
        )
    ]
}

```

### 三 页面单独打包

多页面应用,每个文件夹都视为一个文件,所以每个文件夹里都用index.js作为入口文件, 这里的问题同二, 部分代码可以通过修改源文件满足ESModule规则,大部分代码是使用的全局变量,所以同样用webpack-concat-files-plugin直接拼接, CSS可以直接引用,因为会被mini-css-extract-plugin提取到文件夹下. 旧HTML中对公共js等是 `<script type="text/javascript" src="../../common-source/js/config/index-1730988137027.js"></script>`
这样引入的, 我们可以使用html-webpack-plugin的模板语法<%%>对文本进行修改,上面我们使用时间作为hash就是这个原因
```html 
<!-- index.html -->
<body>
<script type="text/javascript" src="<%= htmlWebpackPlugin.options.templateURL.appJs %>"></script>
</body>
```
```js
const dateNow = Date.now().toString();

let templateURL = {
    commonJs: `../../common-source/js/common/index-${dateNow}.js`,
    appJS: `../../common-source/js/app/index-${dateNow}.js`
}
// module.exports
{
    plugins: [
        // 每一个路径都是一个入口,每个入口设置chunks只负责当前的页面,不然页面会混乱
        ...pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    template: `./src/pages/${page}/index.html`,
                    filename: `pages/${page}/index.html`,
                    chunks: [page],
                    templateURL: templateURL,
                    inject: 'body',
                    scriptLoading: 'blocking'
                })
        )
    ]
}
```



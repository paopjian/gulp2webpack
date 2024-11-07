const WebpackConcatPlugin = require("webpack-concat-files-plugin");

function getConcatPlugins(dateNow) {
    if (!dateNow) {
        throw new Error("没有生成日期");
    }
    return [
        new WebpackConcatPlugin({
            bundles:[
                {
                    src:['./src/js/app/common/*.js'],
                    dest: `dist/common-source/js/app/common/index-${dateNow}.js`
                },
            ]
        })
    ]
}

// console.log(getConcatPlugins(Date.now().toString()))

module.exports = getConcatPlugins;

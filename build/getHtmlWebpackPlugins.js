const HtmlWebpackPlugin = require('html-webpack-plugin');
const { pages } = require('./getFolders');

// 生成公共模板路径,直接写入到html的静态路径中
function getTemplateURL(dateNow) {
    if (!dateNow) {
        throw new Error("没有生成日期");
    }
    const appJs = `../../common-source/js/app/common/index-${dateNow}.js`
    const commonCSS = `../../common-source/css/common/index-${dateNow}.css`
    const templateURL = {
        appJs, commonCSS
    }
    return templateURL;
}
// 生成多个HtmlWebpackPlugin实例,用chunks控制入口,每个入口生成一个HTML页面,生成的js脚本放入body最后,最后加载
function getHtmlWebpackPlugins(dateNow) {
    if (!dateNow) {
        throw new Error("没有生成日期");
    }
    const templateURL = getTemplateURL(dateNow)
    return pages.map(
        (page) =>
            new HtmlWebpackPlugin({
                template: `./src/pages/${page}/index.html`,
                filename: `pages/${page}/index.html`,
                chunks: [page],
                templateURL: templateURL,
                inject: 'body',
                scriptLoading: 'blocking'
            })
    );
}

module.exports = getHtmlWebpackPlugins;

/*
* 生成CopyPlugin插件需要的patterns
* 复制 公共库|配置文件|pages下文件夹的template
*/

let patterns = [];

// 公共库
patterns = [
    {
        from: './src/js/lib',
        to: 'common-source/js/lib'
    },
    // {
    //     from: './src/js/data',
    //     to: 'common-source/js/data',
    // },
    // {
    //     from: './src/js/mixins',
    //     to: 'common-source/js/mixins'
    // }
];

// 生成复制指令数组
function getCopyPatterns(dateNow) {
    if (!dateNow) {
        throw new Error("没有生成日期");
    }
    patterns = [...patterns];
    return patterns;
}
// console.log(getCopyPatterns(Date.now().toString()));

module.exports = getCopyPatterns;

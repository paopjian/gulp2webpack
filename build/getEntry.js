/*
* 获取所有入口
* 自动生成pages下所有文件夹入口
* 拼接公共模块入口
* */

const {pages} = require('./getFolders.js');

function getEntryFromPages() {
    let entry = {};

    for (const page of pages) {
        entry[page] = {
            import: `./src/pages/${page}/index.js`,
        };
    }

    return entry;
}

let entry = getEntryFromPages();

function getEntry(dateNow) {
    if (!dateNow) {
        throw new Error("没有生成日期");
    }
    // 公共库需要放入common-source
    // 拼接公共库入口, 需要日期
    entry = Object.assign(entry, {
        'common': {
            import: './src/build/css_page.js',
            filename: `common-source/css/common/index-${dateNow}.js`,
        }
    })
    return entry;
}
// console.log(getEntry(Date.now().toString()));

module.exports = getEntry;

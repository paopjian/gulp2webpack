/*
* 获取pages下所有文件夹
* 获取所有带template的文件夹
* */
const fs = require('fs')
const path = require('path')
// 获取pages下所有文件夹
function getPages() {
    let pages = []
    const dirPath = path.join(__dirname, '../src/pages')
    console.log(dirPath);

    const files = fs.readdirSync(dirPath)
    files.forEach((file) => {
        pages.push(file)
    })
    return pages
}


const pages = getPages();
// const route = getRoute(templatePages)

module.exports = {pages};

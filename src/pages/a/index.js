import './index.css'

console.log('这里是页面A')

import {dataTable} from '../../js/data/data.js'

window.dataTable = dataTable;
console.log('测试全局dataTable', window.dataTable.tableA);

import {mixinsA} from '../../js/mixins/mixinsA'
import {mixinsB} from '../../js/mixins/mixinsB'
var tplMixin = {};
tplMixin = Vue.util.mergeOptions(tplMixin,mixinsA)
tplMixin = Vue.util.mergeOptions(tplMixin,mixinsB)
console.log(tplMixin);
var vm = new Vue({
    el: '#app',
    mixins:[
        tplMixin,
        // mixinsA,
        // mixinsB
    ],
    created:function(){
        console.log('vue启动');
    }
})
window.vm = vm;

// var mixinsA
import {mixinsB} from "./mixinsB";
export var mixinsA = {
    created: function(){
        console.log('mixinsA创建成功');
    },
    data:function(){
        return {
            mixinsAData:{
                name:'mixinsA',
            }
        }
    },
    mixins:[
        mixinsB
    ]
}

// var dataTable;
export var dataTable = {
    tableA:{
        name:'tableA'
    },
    tableB:{
        name:'tableB'
    },
    getData: function(category){
        return this['table'+category]
    }
}

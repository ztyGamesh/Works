/**
 * operator module js
 */
var _taskpage = {
    init: function(){
        this.$table = $(TaskTableConfig.tableId);
        this.$table.bootstrapTable(TaskTableConfig.table);
    }
}
$(function(){
    _taskpage.init();
});

function doFormatter(v, n) {
    var id = n[TaskTableConfig.tableIndexCol];
    var v = n.status;
    return '<a href="javascript:;" title="暂停/恢复任务" onclick="taskOnoff('+id+',\''+v+'\')"><span class="glyphicon glyphicon-play-circle" style="font-size:20px;"></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" title="跳过任务" onclick="taskDel()"><span class="glyphicon glyphicon-ban-circle" style="font-size:20px;"></span></a>';
}

/**
 * 暂停/恢复任务
 * @param {int} v 1恢复，0暂停
 * @returns {undefined}
 */
function taskOnoff(id, v) {
    var url = TaskTableConfig.do.url;
    console.log( url );
    $.getJSON(url, {id:id, status:v}, function(res){
        if (res.status == 1){
            $('#table-task').bootstrapTable('refresh');
        } else {
            Comm.error(res.msg);
        }
    });
}

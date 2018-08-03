/**
 * 批量操作
 */

/* 批量启用，暂停，删除操作 **/
function initBatchUpdateStatus({id, name, url}){
    $('#' + id).on('click', 'a', function(){
        var data = $('#table').bootstrapTable('getSelections');
        var length = data.length;
        if(!length){
            layer.msg('请选择一个或多个' + name + '后再进行该操作');
            return;
        }
        var status = $(this).attr('data-status');
        if('delete' === status && !confirm('已选中' + length + '个' + name + '，删除后将不能恢复，确定删除吗？')){
            return;
        }
        http_post_data(url, 'post', {
            type: 'status',
            ids: data.map(t=>t.id),
            status: status,
        }, function(res){
            if(1 === res.status){
                $('#table').bootstrapTable('refresh');
            }else{
                layer.msg(res.msg);
            }
        })
    });
}

/* 选择批量操作 **/
function initBatchUpdateOperation({id, name, title, url, purpose, init, query, success}){
    var $open = $('#' + id + '-open');
    var $modal = $('#' + id + '-modal');
    var $submit = $('#' + id);
    var purposeType = null;

    /* 打开批量操作 **/
    $open.on('click', function(){
        purposeType = null;
        var data = $('table').bootstrapTable('getSelections');
        var length = data.length;
        if(!length){
            layer.msg('请选择一个或多个' + name + '后再进行该操作');
            return;
        }
        if(purpose){
            var purposes = Array.from(new Set(data.map(t => t.purpose)));
            if(1 == purposes.length){
                purposeType = purposes[0];
            }else{
                layer.msg('推广目的必须一致！');
                return;
            }
        }
        $modal.modal('show');
        $modal.find('.modal-title').html(title.replace(/#length/g, length));
        init && init($modal, purposeType);
    });

    /* 批量提交 **/
    $submit.on('click', function(){
        var data = $('table').bootstrapTable('getSelections');
        var param = query($modal, data.map(t=>t.id), purposeType);
        if(false === param){
            return;
        }
        $("#Deepleaper_loading").show();
        http_post_data(url, 'post', param, function(res){
            if(1 === res.status){
                if(success){
                    success($modal, param);
                }else{
                    $('#table').bootstrapTable('refresh');
                }
            }else{
                layer.msg(res.msg);
            }
            $("#Deepleaper_loading").hide();
            $modal.modal('hide');
        });
    });
}
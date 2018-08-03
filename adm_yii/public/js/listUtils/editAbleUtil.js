/**
 * 列表上可编辑模板 
 **/
var tableEditTemplate = {
    open: function (value){
        var parent = $(this).parent();
        var input = parent.find('input');
        input.val(value);
        parent.find('.ad-table-edit').removeClass('hidden').siblings().addClass('hidden');
        input.focus();
    },
    submit: function (id, validate, msg, url, query, min, max, decial){
        var parent = $(this).parents('.ad-table-edit:first').parent();
        var input = parent.find('input');
        // parent.find('.ad-table-edit').addClass('hidden').siblings().removeClass('hidden');
        var newValue = input.val();
        if(!validateString(newValue, validate, min, max, decial)){
            layer.msg(msg);
            return;
        }
        var data = query({id: id, value: newValue});
        http_post_data(url, 'post', data, function(res){
            if(1 === res.status){
                $('#table').bootstrapTable('refresh');
            }else{
                layer.msg(res.msg);
            }
        })
    },
    close: function (){
        var parent = $(this).parents('.ad-table-edit:first').parent();
        parent.find('.ad-table-edit').addClass('hidden').siblings().removeClass('hidden');
    },
    content: `<i class="glyphicon glyphicon-edit ad-table-edit-open" style="cursor: pointer;color: #666;margin-left: 3px;"></i>
        <div class="ad-table-edit hidden" style="height: 43px;width: 100%;">
            <div style="position: relative;z-index: 50;">
                <div style="position: absolute">
                    <div class="input-group" style="padding: 6px;">
                        <input type="text" class="form-control" style="width: 150px;">
                        <div class="input-group-addon btn btn-primary">确定</div>
                        <div class="input-group-addon btn btn-default">取消</div>
                    </div>
                </div>
            </div>
        </div>`,
    getEvents: function({validate, msg, url, query, min, max, decial, field}){
        return {
            'click .ad-table-edit-open': function (e, value, row, index){
                if(field){
                    value = value[field];
                }
                tableEditTemplate.open.bind(this)(value);
            },
            'click .ad-table-edit .btn-primary': function (e, value, row, index){
                tableEditTemplate.submit.bind(this)(row.id, validate, msg, url, query, min, max, decial);
            },
            'click .ad-table-edit .btn-default': function (e, value, row, index){
                tableEditTemplate.close.bind(this)();
            },
            'keydown .ad-table-edit input': function(e, value, row, index){
                if(13 === e.keyCode){
                    tableEditTemplate.submit.bind(this)(row.id, validate, msg, url, query, min, max, decial);
                }
            }
        }
    }
};

/* 表格表头浮动 **/
function positionTableHeader(){
    var head = $('#table thead');
    var body = $('#table tbody');
    var items = $('#table th, #table td');
    var height = head.innerHeight();
    head.removeClass('thead-position');
    body.removeClass('tbody-block');
    var allWidth = $('#table thead')[0].scrollWidth;
    $('#table thead, #table tbody').innerWidth(allWidth);
    [].slice.call(items).forEach(function(t){
        $(t).innerWidth($(t).innerWidth());
    });
    $('#table').css({
        marginTop: height,
    });
    head.addClass('thead-position');
    body.addClass('tbody-block');
    if(!window.onresize){
        window.onresize = function(e){
            positionTableHeader();
        }
    }
    var tableParent = $('#table').parent()[0];
    if(!tableParent.onscroll){
        tableParent.onscroll = function(e){
            var left = $(this).scrollLeft();
            $('#table thead').css({
                left: -left,
            });
        }
    }
}
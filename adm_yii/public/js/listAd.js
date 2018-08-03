function queryParams(params) {//定义请求数据时附加带的参数(toolbar中的所有input，select)
    $('.toolbar').find('input, select').each(function (i, n) {
        var name = $(n).attr('name');
        if (name != undefined) {
            params[name] = $(n).val();
        }
    });
    return params;
}
// bootstrap-table-cookie.js 重写cookieIdTable
if (ListPageConfig.table.cookieIdTable) {
    var href = window.location.href;
    var pathname = window.location.pathname;
    ListPageConfig.table.cookieIdTable = href.substring(7, 9) + pathname;
}
var List = {
    dialogOpen: false,
    htmlConfig: {
        // edit: ['<a class="edit" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">修改</a>'],
        // detail: ['<a class="detail" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">详情</a>'],
        // info: ['<a class="info" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">查看</a>'],
        del: ['<a class="remove" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">删除</a>'],
        copy: ['<a class="copy" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">复制</a>'],
        materialConnect: ['<a class="materialConnect" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">创意关联</a>'],
        pause0: ['<a class="pause" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">启用</a>'],
        pause1: ['<a class="pause" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">冻结</a>'],
        statusP: ['<a class="status" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">暂停</a>'],
        statusA: ['<a class="status" style="color: #3d5d9f;padding: 0 3px;cursor: pointer;">有效</a>'],
        multi: {
            main: '<a title="已暂停" href="#"><span class="glyphicon glyphicon-pause"></span></a>',
            cell: '<a title="绘图" href="#"><span class="glyphicon glyphicon-picture"></span></a><a title="详情" href="#"><span class="glyphicon glyphicon-list"></span></a><a title="编辑" href="#"><span class="glyphicon glyphicon-pencil"></span></a><a title="归档" href="#"><span class="glyphicon glyphicon-log-in"></span></a>'
        },
        detail: ['<div class="detail dl-list-action-btn-wrapper"  title="详情">',
            '<img src="../img/icon/icon_detail.png" class="dl-list-action-btn">',
            '</div>'],
        info: ['<div class="info dl-list-action-btn-wrapper"  title="查看">',
            '<img src="../img/icon/icon_detail.png" class="dl-list-action-btn">',
            '</div>'],
        edit: ['<div class="edit dl-list-action-btn-wrapper"  title="修改">',
            '<img src="../img/icon/icon_edit.png" class="dl-list-action-btn">',
            '</div>'],

    },
    $table: null,
    addHtml: '',
    editValidate: false,
    editableRow: '',
    editableIndex: '',
    modifyUid: '',
    init: function () {
        //合并htmlConfig
        if (ListPageConfig.htmlConfig) {
            List.htmlConfig = $.extend({}, List.htmlConfig, ListPageConfig.htmlConfig);
        }
        //合并operateEvents
        if (ListPageConfig.operateEvents) {
            List.operateEvents = $.extend({}, List.operateEvents, ListPageConfig.operateEvents);
        }

        //显示列表
        List.$table = $(ListPageConfig.tableId);
        List.$table.bootstrapTable(ListPageConfig.table);

        //初始化工具栏和多选功能
        this.toolbar();
        if(ListPageConfig.toolbar){
            ListPageConfig.toolbar();
        }
        this.multiAction();
        $('.iconList-wrap').on("mouseover mouseout", function (event) {
            if (event.type == "mouseover") {
                $('.iconList div').css('display', 'block');
                $(this).addClass('functionalHover');
            } else if (event.type == "mouseout") {
                $('.iconList div').css('display', 'none');
                $(this).removeClass('functionalHover');
            }
        });
        List.searchKeywordEnter();


        setTimeout(function () {

            var xm = List.$table.bootstrapTable('getOptions');

            ListPageConfig.func(xm);
        }, 1000);
    },
    addItem: function () {
        window.location.href = ListPageConfig.url.add;
    },
    detailItem: function (indexId) {//详情
        var editHtmlUrl = ListPageConfig.url.detail + '?' + ListPageConfig.tableIndexCol + '=' + indexId;
        window.location.href = editHtmlUrl;
    },
    infoItem: function (indexId) {//查看

        if (List.dialogOpen) {
            return false
        } else {
            List.dialogOpen = true;
        }
        //载入 编辑 html
        var editHtmlUrl = ListPageConfig.url.info + '?' + ListPageConfig.tableIndexCol + '=' + indexId;
        var addValdation = false;

        var width = ListPageConfig['dialogWidth'] ? ListPageConfig['dialogWidth'] : 600;
        var dia = dialog({
            title: ListPageConfig.title.infoTitle,
            //content: data,
            width: width,
            //okValue: '提交',
            cancelValue: '关闭',
            onshow: function () {
                $.ajax({
                    type: "get",
                    url: editHtmlUrl,
                    cache: false,
                    async: true,
                    success: function (data) {
                        $('.ui-dialog-content').html(data);
                        List.dialogOpen = false;
                        $('.ui-dialog-content form').find('.selectpicker').each(function () {
                            $(this).selectpicker();
                        });
                        dia.reset();
                    }
                });
            },
            cancel: function () {
                this.close();
            }

        }).showModal();

        //获取 添加 html

    },
    editItem: function (indexId) {//编辑


        //载入 编辑 html
        var editHtmlUrl = ListPageConfig.url.edit + '?' + ListPageConfig.tableIndexCol + '=' + indexId;
        // window.location.href=window.location.host+editHtmlUrl;


        window.location.href = editHtmlUrl;

        return;
        if (ListPageConfig.actionJump && ListPageConfig.actionJump.edit) {
            window.location.href = editHtmlUrl;
            return;
        }
        var addValdation = false;

        var width = ListPageConfig['dialogWidth'] ? ListPageConfig['dialogWidth'] : 600;
        var dia = dialog({
            title: ListPageConfig.title.editTitle,
            //content: data,
            width: width,
            okValue: '提交',
            cancelValue: '取消',
            onshow: function () {
                $.ajax({
                    type: "get",
                    url: editHtmlUrl,
                    cache: false,
                    async: true,
                    success: function (data) {
                        $('.ui-dialog-content').html(data);
                        List.dialogOpen = false;
                        $('.ui-dialog-content form').find('.selectpicker').each(function () {
                            $(this).selectpicker();
                        });
                        dia.reset();
                    }
                });
            },
            ok: function () {
                Comm.loading();
                var $form = $('.ui-dialog-content form');
                if (false == addValdation) {
                    $form.validation();
                }
                if (false == $form.valid()) {
                    Comm.hideLoading();
                    return false;
                } else {
                    $form.ajaxSubmit({
                        beforeSubmit: function () {
                            if (!$form.valid())
                                return false;
                        },
                        dataType: 'json',
                        success: function (data) {
                            Comm.hideLoading();
                            if (data.status) {
                                List.$table.bootstrapTable('refresh');
                            } else {
                                Comm.error(data.msg);
                                return false;
                            }
                        }
                    });
                }
            },
            cancel: function () {
                this.close();
            }

        }).showModal();

        //获取 添加 html

    },
    //删除
    delItem: function (indexIds, obj) {

        var postData = {};
        postData[ListPageConfig.tableIndexCol] = indexIds;
        $.ajax({
            type: "post",
            url: ListPageConfig.url.del,
            cache: false,
            data: postData,
            success: function (data) {
                if (data.status) {
                    if (indexIds.length == 1 && obj != undefined) {
                        $(obj).remove();
                    } else {
                        // 可批量删除
                        List.$table.bootstrapTable('remove', {
                            field: ListPageConfig.tableIndexCol,
                            values: indexIds
                        });
                    }
                    if ($('.switch').length > 0) {
                        List.switchLoading();
                    }
                } else {
                    Comm.error(data.msg);
                }
            },
            dataType: "json"
        });

        $('#dropdown').prop('disabled', !$table.bootstrapTable('getSelections').length);
    },
    //多项操作
    batchModify: function (indexIds, col, val) {
        var postData = {};
        postData[ListPageConfig.tableIndexCol] = indexIds;
        postData['field'] = col;
        postData['val'] = val;
        $.ajax({
            type: "post",
            url: ListPageConfig.url.colModify,
            cache: false,
            data: postData,
            success: function (data) {
                if (data.status) {
                    window.location.reload();
                } else {
                    Comm.error(data.msg);
                }
            },
            dataType: "json"
        });

        $('#dropdown').prop('disabled', !$table.bootstrapTable('getSelections').length);
    },
    //列表多项操作
    multiAction: function () {
        //删除多行
        $('.batch').click(function () {
            if ($(this).data('col') == 'pause') {
                var content = ['确认启用?', '确认停用?'], col = $(this).data('col'), val = $(this).data('val');
                dialog({
                    title: '提示信息',
                    content: content[val],
                    width: 200,
                    height: 10,
                    okValue: '确认',
                    cancelValue: '取消',
                    ok: function () {
                        var ids = List.getIdSelections();
                        List.batchModify(ids, col, val)
                    },
                    cancel: function () {
                        this.close();
                    }
                }).showModal();
            }
        });
    },
    //获取已选数据uid
    getIdSelections: function () {
        return $.map(List.$table.bootstrapTable('getSelections'), function (row) {
            return row[ListPageConfig.tableIndexCol];
        });
    },
    //工具栏
    toolbar: function () {
        //添加操作
        $('#plus').click(function () {
            List.addItem();
        });
        $('.plus').click(function () {
            List.addItem();
        });
        // 搜索
        $('#ok').click(function () {
            //筛选清除页码cookie
            List.$table.bootstrapTable('deleteCookie', ['pageNumber']);
            //跳到第一页
            List.$table.bootstrapTable('selectPage', 1);
            //列表刷新
            List.$table.bootstrapTable('refresh', {
                query: {offset: 0}
            });
        });

        // 开始日期 结束日期 推广目的 状态
        $("#begin_date,#end_date,#purpose,#state").change(function () {
            //筛选清除页码cookie
            List.$table.bootstrapTable('deleteCookie', ['pageNumber']);
            //跳到第一页
            List.$table.bootstrapTable('selectPage', 1);
            List.$table.bootstrapTable('refresh', {
                query: {offset: 0}
            });
        });

        // 修改广告投放状态
        $('#adUpdatePause').click(function () {
            var ids = List.getIdSelections().join(",");
            if (List.getIdSelections().length == 0) {
                layer.msg('请选择需要修改的广告投放项');
                return false;
            }
            var pause = $("input[name=update]:checked").val();
            updateadstatus(ids, pause, updateadstatusSuccess);
            function updateadstatusSuccess(result) {
                var req = JSON.parse(result);
                if (req.status == '1') {
                    layer.msg("广告投放状态修改成功");
                    List.$table.bootstrapTable('refresh');
                } else {
                    layer.msg("广告投放状态修改失败：" + decodeURI(result.msg));
                }
            }
        });
    },
    operateFormatter: function (value, row, index) {// 列表操作列格式器
        if(0 == row.usable){
            return '创意失效';
        }
        var action = ListPageConfig.action;
        if (action.pause) {//将pause转化为pause0与pause1，pause在List.htmlConfig中不参与按钮渲染
            if (row.pause && (0 == parseInt(row.pause))) {//处理状态（冻结/启用）
                action.pause0 = false;
                action.pause1 = true;
            } else {
                action.pause0 = true;
                action.pause1 = false;
            }
        }
        if (action.status) {
            if (row.status && ('active' == row.status)) {//处理状态（暂停/有效）
                action.statusP = true;
                action.statusA = false;
            } else {
                action.statusP = false;
                action.statusA = true;
            }
        }
        // if (action.creativeStatus) {//创意列表状态修改
        //     if (row.status && ('active' == row.status)) {//处理状态（暂停/有效）
        //         action.creativeStatusP = true;
        //         action.creativeStatusA = false;
        //     } else {
        //         action.creativeStatusP = false;
        //         action.creativeStatusA = true;
        //     }
        // }
        var html = '';
        for (key in  action) {
            if (action[key] && List.htmlConfig[key]) {
                html += List.htmlConfig[key].join('');
            }
        }
        action = '';
        return html;
    },
    operateEvents: {//单元格事件监听器
        'click a': function (e, value, row, index) {
            List.modifyUid = row.uid;
        },
        'click .info': function (e, value, row, index) {
            var indexId = row[ListPageConfig.tableIndexCol];
            List.infoItem(indexId);
        },
        'click .detail': function (e, value, row, index) {
            var indexId = row[ListPageConfig.tableIndexCol];
            List.detailItem(indexId);
        },
        'click .edit': function (e, value, row, index) {
            var indexId = row[ListPageConfig.tableIndexCol];
            List.editItem(indexId);
        },
        'click .copy': function (e, value, row, index) {
            var copyurl = ListPageConfig.url.copy + '?uid=' + row.uid;
            if (ListPageConfig.actionJump && ListPageConfig.actionJump.copy) {
                window.location.href = copyurl;
                return true;
            }
        },
        'click .materialConnect': function (e, value, row, index) {
            window.location.href = '/dsp/creativeadd?unit=' + row.uid;
        },
        'mousedown .switch-mini': function (e, value, row, index) {

            if (0 == parseInt(row.pause)) {
                row.pause = 1;
            } else {
                row.pause = 0;
            }
            List.modifyUid = row.uid;
            List.editable('pause', row.pause);
        },
        'click .pause': function (e, value, row, index) {//pause开关

            if (0 == parseInt(row.pause)) {
                row.pause = 1;
            } else {
                row.pause = 0;
            }
            List.modifyUid = row.uid;
            List.editable('pause', row.pause);
        },
        'click .status': function (e, value, row, index) {//status开关
            if ('active' == row.status) {
                row.status = 'pause';
            } else {
                row.status = 'active';
            }
            List.modifyUid = row.id;
            List.changeStatus(row.status);
        },
        'click .remove': function (e, value, row, index) {
            var $tr = $(e.target).parents('tr:eq(0)');
            dialog({
                title: '提示信息',
                content: '确认删除?',
                width: 200,
                height: 10,
                okValue: '确认',
                cancelValue: '取消',
                ok: function () {
                    var indexId = row[ListPageConfig.tableIndexCol];
                    List.delItem([indexId], $tr);
                },
                cancel: function () {
                    this.close();
                }

            }).showModal();
        }
    },
    //表格内编辑
    editable: function (field, value) {
        var postData = {
            'uid': List.modifyUid,
            'val': value,
            'field': field
        };
        $.ajax({
            type: 'POST',
            url: ListPageConfig.url.colModify,
            cache: false,
            async: true,
            data: postData,
            success: function (data) {
                if (!data.status) {
                    Comm.error(data.msg);
                } else {
                    // 刷新页面显示修改的内容
                    window.location.reload();
                }
            },
            dataType: 'json'
        });
    },
    changeStatus: function (value) {
        var postData = {
            'ids': List.modifyUid,
            'status': value
        };
        ListPageConfig.api.colModify(ListPageConfig.url.colModify, postData, function (result) {
            var req = JSON.parse(result);
            if (req.status == 1) {
                // 刷新页面显示修改的内容
                List.$table.bootstrapTable('refresh');
            } else {
                Comm.error(data.msg);
            }
        });
    },
    exchangeFormatter: function (value) {
        var html = '';
        html += '<img width="30px;" style="display: inline-block" src="/img/application/plant-logo-list-' + value + '.png" title="' + value + '" />';
        return html;
    },
    materialFormatter: function (value, row) {
        var html = '';
        var title = '类型：' + row.adTypeName + '，名称：' + row.name + '，大小：' + row.w + '*' + row.h;
        var valueType = value.split('.')[1];
        if (valueType != 'swf') {
            html += '<a href="' + value + '" data-lightbox="roadtrip"><img  height="30" style="display: inline-block" src="' + value + '" title="' + title + '" /></a>';
        } else {
            html += '<div>' +
                '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="30">' +
                '<param name="movie" value="' + value + '">' +
                '<param name="quality" value="high">' +
                '<param name="wmode" value="transparent">' +
                '<param name="swfversion" value="9.0.45.0">' +
                '<object type="application/x-shockwave-flash" data="' + value + '" height="30" title="' + title + '">' +
                '<param name="quality" value="high">' +
                '<param name="wmode" value="transparent">' +
                '<param name="swfversion" value="9.0.45.0">' +
                '</object>' +
                '</object>' +
                '</div>'
        }
        List.lightbox(title);
        return html;
    },
    lightbox: function (title) {
        lightbox.option({
            'albumLabel': title,
            'resizeDuration': 500
        })
    },
    pauseFormatter: function (value) {
        var html = '';
        if (value == 1) {
            html += '<span class="glyphicon glyphicon-stop">已暂停</span>';
        } else {
            html += '<span class="glyphicon glyphicon-play">投放中</span>';
        }
        return html;
    },
    progressCentFormatter: function (value, row) {

        var html = '';
        var title = '已完成:' + parseInt(row.imp / 1000) + 'CPM';
        if (row.progressDailyCent) {
            html += '<div class="progress" style="margin-bottom: 5px; height: 10px; cursor: pointer" title="' + title + '">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="' + value + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + value + '%;">' +
                '<span class="sr-only">' + value + '%</span>' +
                '</div>' +
                '</div>';
            title = '已完成:' + parseInt(row.imp_today / 1000) + 'CPM';
            html += '<div class="progress" style="margin-bottom: 0px; height: 10px; cursor: pointer" title="' + title + '">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="' + row.progressCent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + row.progressDailyCent + '%;">' +
                '<span class="sr-only">' + row.progressDailyCent + '%</span>' +
                '</div>' +
                '</div>';
        } else {
            html += '<div class="progress" style="margin-bottom: 0px; height: 10px; cursor: pointer" title="' + title + '">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="' + value + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + value + '%;">' +
                '<span class="sr-only">' + value + '%</span>' +
                '</div>' +
                '</div>';
        }
        return html;
    },
    switchLoading: function () {
        $('.switch input').bootstrapSwitch();
    },
    thousandth: function (value) {
        if (0 == value) {
            return value
        }
        value = (value - 0).toFixed(2);
        value = value.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
            return s1.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,") + s2;
        });
        return value
    },
    searchKeywordEnter: function () {
        $('#searchKeyword').keyup(function (event) {
            if (event.keyCode == "13") {
                $('#ok').click();
            }
        });
    }
};
$(function () {
    List.init();
});


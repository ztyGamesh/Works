function queryParams(params) {
    $('#toolbar').find('input, select').each(function (i, n) {
        var name = $(n).attr('name');
        if (name != undefined) {
            params[name] = $(n).val();
        }
    });
    return params;
}

if (ListPageConfig.table.cookieIdTable) {
    var href = window.location.href;
    var pathname = window.location.pathname;
    var cookieId = href.substring(7, 9) + pathname;
    ListPageConfig.table.cookieIdTable = cookieId;
}
var List = {
    dialogOpen: false,
    htmlConfig: {
        // edit: ['<button class="edit btn btn-xs btn-primary btn-group-xs btn-default" title="修改">',
        //     '<i class="glyphicon glyphicon-edit"></i>',
        //     '</button>'],
        // detail: ['<button class="detail btn btn-xs btn-info btn-group-xs btn-default"  title="查看">',
        //     '<i class="glyphicon glyphicon-th"></i>',
        //     '</button>'],
        del: ['<button class="remove btn btn-xs btn-danger btn-group-xs btn-default"  title="删除">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</button>'],
        copy: ['<button class="copy btn btn-xs btn-warning btn-group-xs btn-default" title="复制"><i class="glyphicon glyphicon-file"></i></button>'],
        materialConnect: ['<button class="materialConnect  btn btn-xs btn-info  btn-group-xs btn-default"  title="创意关联">',
            '<i class="glyphicon glyphicon-th-list"></i>',
            '</button>'],
        pause: ['<div class="switch switch-mini"> <input type="checkbox" checked /> </div>'],
        play: ['<div class="switch switch-mini"> <input type="checkbox" /> </div>'],
        multi: {
            main: '<a title="已暂停" href="#"><span class="glyphicon glyphicon-pause"></span></a>',
            cell: '<a title="绘图" href="#"><span class="glyphicon glyphicon-picture"></span></a><a title="详情" href="#"><span class="glyphicon glyphicon-list"></span></a><a title="编辑" href="#"><span class="glyphicon glyphicon-pencil"></span></a><a title="归档" href="#"><span class="glyphicon glyphicon-log-in"></span></a>'
        },
        detail: ['<div class="detail dl-list-action-btn-wrapper"  title="详情">',
            '<img src="../img/icon/icon_detail.png" class="dl-list-action-btn">',
            '</div>'],
        info: ['<button class="info dl-list-action-btn-wrapper"  title="查看">',
            '<img src="../img/icon/icon_detail.png" class="dl-list-action-btn">',
            '</button>'],
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
        //如果外面自定义了  操作的html  就合并
        if (ListPageConfig.htmlConfig) {
            List.htmlConfig = $.extend({}, List.htmlConfig, ListPageConfig.htmlConfig);
        }

        //显示列表
        this.$table = $table = $(ListPageConfig.tableId);
        this.$table.bootstrapTable(ListPageConfig.table);
        //初始化工具栏和多选功能
        this.toolbar();
        this.multiAction();
        this.addOperater();
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
    },
    addItem: function () {
        if (List.dialogOpen) {
            return false
        } else {
            List.dialogOpen = true;
        }
        var addValdation = false;

        var width = ListPageConfig['dialogWidth'] ? ListPageConfig['dialogWidth'] : 600;
        var dia = dialog({
            title: ListPageConfig.title.addTitle,
            //content: data,
            width: width,
            okValue: '提交',
            cancelValue: '取消',
            onshow: function () {

                $.ajax({
                    type: "get",
                    url: ListPageConfig.url.add,
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
                var $form = $('.ui-dialog-content form');
                if (false == addValdation) {
                    var status = $form.validation();
                }
                if (false == $form.valid()) {
                    return false;
                } else {
                    // Comm.loading();
                    $form.ajaxSubmit({
                        beforeSubmit: function () {
                            // if (!$form.valid())
                            //     return false;
                            if (ListPageConfig.validate !== undefined && !ListPageConfig.validate.add()){
                                return false;
                            }
                        },
                        dataType: 'json',
                        success: function (data) {
                            Comm.hideLoading();
                            if (data.status) {
                                dia.close().remove();
                                List.$table.bootstrapTable('refresh');
                            } else {
                                Comm.error(data.msg);
                                return false;
                            }
                        }
                    });
                }
                return false;
            },
            cancel: function () {
                this.close();
            }

        }).reset().showModal();


    },
    //编辑数据
    editItem: function (indexId) {
        if (List.dialogOpen) {
            return false
        } else {
            List.dialogOpen = true;
        }
        //载入 编辑 html
        var editHtmlUrl = ListPageConfig.url.edit + '?' + ListPageConfig.tableIndexCol + '=' + indexId;
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
                if (ListPageConfig.validate !== undefined && !ListPageConfig.validate.edit()){
                    return false;
                }
                // Comm.loading();
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
                            // if (!$form.valid())
                            //     return false;
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
        this.$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
            $('#dropdown').prop('disabled', !$table.bootstrapTable('getSelections').length);
        });
        //删除多行
        $('.allremove').click(function () {
            dialog({
                title: '提示信息',
                content: '确认删除?',
                width: 200,
                height: 10,
                okValue: '确认',
                cancelValue: '取消',
                ok: function () {
                    var ids = List.getIdSelections();
                    List.delItem(ids);
                },
                cancel: function () {
                    this.close();
                }
            }).showModal();
        });

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

        //$('.allstart').click(function() {
        //    dialog({
        //        title: '提示信息',
        //        content: '确认启用?',
        //        width:200,
        //        height:10,
        //        okValue:'确认',
        //        cancelValue:'取消',
        //        ok:function () {
        //            var ids = List.getIdSelections();
        //            List.batchModify(ids, 'pause', 0)
        //        },
        //        cancel:function(){
        //            this.close();
        //        }
        //    }).showModal();
        //});
        //
        //$('.allend').click(function() {
        //    dialog({
        //        title: '提示信息',
        //        content: '确认停用?',
        //        width:200,
        //        height:10,
        //        okValue:'确认',
        //        cancelValue:'取消',
        //        ok:function () {
        //            var ids = List.getIdSelections();
        //            List.batchModify(ids, 'pause', 1)
        //        },
        //        cancel:function(){
        //            this.close();
        //        }
        //    }).showModal();
        //});
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
        $('.plus').click(function () {
            List.addItem();
        });

        // 搜索
//        var $table = $('#table');
        $('#ok').click(function () {
            //筛选清除页码cookie
            List.$table.bootstrapTable('deleteCookie', ['pageNumber']);
            //跳到第一页
            List.$table.bootstrapTable('selectPage', 1);
            List.$table.bootstrapTable('refresh', {
                query: {offset: 0}
            });
        });

    },
    // 列表操作列
    operateFormatter: function (value, row, index) {
        var html = '';
        //为了兼容旧的代码,最初考虑不全,后期抽时间统一修改,妈蛋
        if (ListPageConfig.action) {
            var action = $.extend(true, {}, ListPageConfig.action);
        } else {
            var action = {
                edit: true,
                del: true
            }
        }
        if (ListPageConfig.showDetail) {
            action.detail = true;
        }
        if (ListPageConfig.action) {
            if (ListPageConfig.action.pause) {
                if (1 == parseInt(row.pause)) {
                    action.pause = false;
                    action.play = true;
                } else {
                    action.pause = true;
                    action.play = false;
                }
            }
        }
        var html = '';
        for (key in  action) {
            if (action[key]) {
                html += List.htmlConfig[key].join('');
            }
        }
        return html;
    },
    operateEvents: {
        //用于  表格内字段编辑
        'click a': function (e, value, row, index) {
            List.modifyUid = row.uid;
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
        'click .switch': function (e, value, row, index) {

            if (0 == parseInt(row.pause)) {
                row.pause = 1;
            } else {
                row.pause = 0;
            }
            List.modifyUid = row.uid;
            List.editable('pause', row.pause);
        },
        'click .remove': function (e, value, row, index) {
//            console.log( e.target );
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
    addOperater: function () {
        if (ListPageConfig.showDetail) {
            List.operateEvents['click .detail'] = function (e, value, row, index) {
                var indexId = row[ListPageConfig.tableIndexCol];
                if (ListPageConfig.url.detail) {
                    var url = ListPageConfig.url.detail;
                } else {
                    var url = ListPageConfig.url.edit;
                }
                url += '?' + ListPageConfig.tableIndexCol + '=' + indexId;

                $.ajax({
                    type: "get",
                    url: url,
                    cache: false,
                    async: true,
                    success: function (data) {
                        dialog({
                            title: ListPageConfig.title.detailTitle,
                            content: data,
                            cancelValue: '关闭',
                            width: 600,
                            onshow: function () {
                                //将输入框所有输入不可写
                                $("#edit").find('.form-control').each(function () {
                                    $(this).attr('readonly', 'readonly');
                                });
                                $("#edit").find('.selectpicker').each(function () {
                                    $(this).selectpicker();
                                });

                            },
                            cancel: function () {
                                this.close();
                            }

                        }).showModal();
                    }
                });
            }
        }
    },
    //表格内编辑
    editable: function (field, value) {
        var postData = {
            'uid': List.modifyUid,
            'val': value,
            'field': field,
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
                }
            },
            dataType: 'json'
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


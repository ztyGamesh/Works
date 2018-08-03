/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/vitalets/x-editable
 */

!function ($) {


    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        editable: true,
        onEditableInit: function () {
            return false;
        },
        onEditableSave: function (field, row, oldValue, $el) {
            return false;
        },
        onEditableShown: function (field, row, $el, editable) {
            return false;
        },
        onEditableHidden: function (field, row, $el, reason) {
            return false;
        }
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'editable-init.bs.table': 'onEditableInit',
        'editable-save.bs.table': 'onEditableSave',
        'editable-shown.bs.table': 'onEditableShown',
        'editable-hidden.bs.table': 'onEditableHidden'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initTable = BootstrapTable.prototype.initTable,
        _initBody = BootstrapTable.prototype.initBody;

    BootstrapTable.prototype.initTable = function () {
        var that = this;
        _initTable.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.editable) {
            return;
        }
        var share_edit = 1; //媒体分成比例是否可修改, 1为可修改，0为不可修改
        var price_edit = 1; //低价是否可修改
        var share_default = 0; //媒体分成比例默认值，在固定价格、CPM合约、公开竞价模式下默认为0，在技术服务费下，默认是100%
        var profit_rate = 1; //最低利润率
        $.each(this.columns, function (i, column) {

            if (!column.editable) {
                return;
            }

            var editableOptions = {}, editableDataMarkup = [], editableDataPrefix = 'editable-';

            var processDataOptions = function(key, value) {
              // Replace camel case with dashes.
              var dashKey = key.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
              if (dashKey.slice(0, editableDataPrefix.length) == editableDataPrefix) {
                var dataKey = dashKey.replace(editableDataPrefix, 'data-');
                editableOptions[dataKey] = value;
              }
            };

            $.each(that.options, processDataOptions);

            var _formatter = column.formatter;
            column.formatter = function (value, row, index) {
                var result = _formatter ? _formatter(value, row, index) : value;

                // start
                // 修改字段内数字内容
                // value 获取字段内数字
                // word  字段内需修改数字两端文字
                // 86行源代码为： ' data-value="' + result + '"',
                // var value = result.replace(/[^0-9/.]/ig,"");
                // var word = result.replace(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/, "");
                // var word = result.split(value);
                // end

                $.each(column, processDataOptions);

                $.each(editableOptions, function (key, value) {
                    editableDataMarkup.push(' ' + key + '="' + value + '"');
                });
                //第一版修改，不知道谁改的
                // return [word[0] + '<a href="javascript:void(0)"',
                //     ' data-name="' + column.field + '"',
                //     ' data-pk="' + row[that.options.idField] + '"',
                //     ' data-value="' + value + '"',
                //     editableDataMarkup.join(''),
                //     '>' + '</a>' + word[1]
                // ].join('');



                //第二版修改，跃盟内部合作模式配置页面根据需求说明进行的修改。底价和媒体分成比例如果为0，则不支持修改，当不为0时，支持手动修改。
                if(column.field == 'cooperate_mode') {
                    if(result == 0 || result == 4 || result == 5) { //当合作模式为，固定价格 | 公开竞价 | CPM合约
                        share_edit = 0;     //媒体分成比例不可修改
                        price_edit = 1;     //底价可修改
                        share_default = 0;  //媒体分成比例默认是0
                        profit_rate = 1;
                    }else if(result == 1) {  //当合作模式为 分成
                        share_edit = 1;     //媒体分成比例可修改
                        price_edit = 0;     //底价不可修改
                        share_default = result;  //媒体分成比例默认为原始数据，但这一步，其实什么也没改变
                        profit_rate = 1;
                    }else if(result == 3) { //当合作模式为技术服务费
                        share_edit = 0;     //媒体分成比例不可修改
                        price_edit = 1;     //底价可修改
                        share_default = 100;//媒体分成比例默认为100%
                        profit_rate = 0;//最低利润率不可修改
                    }
                    else {          //当为其他合作模式
                        share_edit = 1;     //媒体分成比例可修改
                        share_default = result;  //不会改变什么
                        price_edit = 1;     //底价可修改
                        profit_rate = 1;
                    }
                }

                if(column.field == 'media_share') {
                    if(share_edit == 0) { //当媒体分成比例不可修改
                        return share_default;
                    }
                }
                if(column.field == 'price') {
                    if(price_edit == 0){    //当底价不可修改
                        return 0;       //底价默认为0
                    }
                }
                if(column.field == 'profit_rate') {
                    if(profit_rate == 0){    //最低利润率
                        return 0;       //最低利润率默认为0
                    }
                }
                return ['<a href="javascript:void(0)"',
                    ' data-name="' + column.field + '"',
                    ' data-pk="' + row[that.options.idField] + '"',
                    // ' data-value="' + value + '"',
                    ' data-value="' + result + '"',
                    editableDataMarkup.join(''),
                    '>' + '</a>'
                ].join('');
            };
        });
    };

    BootstrapTable.prototype.initBody = function () {
        var that = this;
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.editable) {
            return;
        }

        $.each(this.columns, function (i, column) {
            if (!column.editable) {
                return;
            }

            that.$body.find('a[data-name="' + column.field + '"]').editable(column.editable)
                .off('save').on('save', function (e, params) {
                    var data = that.getData(),
                        index = $(this).parents('tr[data-index]').data('index'),
                        row = data[index],
                        oldValue = row[column.field];

                    $(this).data('value', params.submitValue);
                    row[column.field] = params.submitValue;
                    that.trigger('editable-save', column.field, row, oldValue, $(this));
                });
            that.$body.find('a[data-name="' + column.field + '"]').editable(column.editable)
                .off('shown').on('shown', function (e, editable) {
                    var data = that.getData(),
                        index = $(this).parents('tr[data-index]').data('index'),
                        row = data[index];
                    
                    that.trigger('editable-shown', column.field, row, $(this), editable);
                });
            that.$body.find('a[data-name="' + column.field + '"]').editable(column.editable)
                .off('hidden').on('hidden', function (e, reason) {
                    var data = that.getData(),
                        index = $(this).parents('tr[data-index]').data('index'),
                        row = data[index];
                    
                    that.trigger('editable-hidden', column.field, row, $(this), reason);
                });
        });
        this.trigger('editable-init');
    };

}(jQuery);

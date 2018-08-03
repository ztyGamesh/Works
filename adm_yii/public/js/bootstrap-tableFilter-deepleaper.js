/**
 * Created by liuchangyu on 17/3/30.
 * 使用说明：
 * 渲染列表字段筛选器
 * columns: [{
                field: 'slot_class_name',
                title: '广告形式' + jointTableFilter('slotclass', slotclass)
            }, {
                field: 'media_name',
                title: '所属媒体' + jointTableFilter('media', media)
            }］
 *  绑定事件
 *  func: function (data) {
            bindTableFilterAction('slotclass');
            bindTableFilterAction('media');
        },
 */


//组装data to html片段
//@params:id  字段名
//@params:data  数据
//@params:default_select  默认值  可选，不填则默认全部
//default_select="true"  为默认项属性标识
function jointTableFilter(id, data, default_select) {
    var default_key = '';//默认为空
    if (default_select !== undefined) {
        default_key = default_select;
    }
    var html = '<div class="deepleaper-radio-wrapper"  id="' + id + '"><img src="/img/funnel.png" class="deepleaper-list-funnel"><div class="deepleaper-radio-box-wrapper">' +
        '<div class="deepleaper-radio-box-head"></div>' +
        '<div class="deepleaper-radio-box"><ul>';
    if (default_key == '') {
        html += '<li><div class="radio radio-deepleaper" style="margin-top: 2px;margin-bottom: 2px;">';
        html += '<input type="radio" id="' + id + 'All" value="" name="' + id + '"' + ' checked="checked" default_select="true"/><label for="' + id + 'All" style="line-height: 17px;">全部';
        html += '</label></div></li>';
    } else {
        html += '<li><div class="radio radio-deepleaper" style="margin-top: 2px;margin-bottom: 2px;">';
        html += '<input type="radio" id="' + id + 'All" value="" name="' + id + '"' + ' /><label for="' + id + 'All" style="line-height: 17px;">全部';
        html += '</label></div></li>';
    }
    for (var i in data) {
        html += '<li><div class="radio radio-deepleaper" style="margin-top: 2px;margin-bottom: 2px;">';
        if (i == default_key) {
            html += '<input type="radio" id="' + id + i + '" value="' + i + '" name="' + id + '" checked="checked" default_select="true" /><label for="' + id + i +'" style="line-height: 17px;">' + data[i];
        } else {
            html += '<input type="radio" id="' + id + i + '" value="' + i + '" name="' + id + '"/><label for="' + id + i +'" style="line-height: 17px;">' + data[i];
        }
        html += '</label></div></li>';
    }
    html += '</ul>' +
        // '<input class="btn deepleaper-radio-submit" type="button" value="筛选">' +
        '<input class="btn deepleaper-radio-close" type="button" value="取消"></div></div></div>';
    return html;
}
//绑定tablefilter单选框选择事件
function bindTableFilterAction(id) {
    //为默认选中项绑定选中属性
    $(".deepleaper-radio-wrapper input[name=" + id + "][checked=checked]").prop('checked', 'checked');
    $("#" + id + " .deepleaper-list-funnel").bind({
        mouseover: function () {
            $(this).siblings(".deepleaper-radio-box-wrapper").show();
            $(this).addClass('opacity_1');
        }
    });

    $(".deepleaper-radio-wrapper input[name=" + id + "]").bind('change', function () {
        $("#" + id + " .deepleaper-radio-box-wrapper").hide();
        if ($("#" + id + " input[name=" + id + "]:checked").val() !== $("#" + id + " input[name=" + id + "][default_select=true]").val()) {//如果是默认选项，去掉漏斗高亮
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").addClass('opacity_1');
        } else {
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").removeClass('opacity_1');
        }
        //筛选清除页码cookie
        List.$table.bootstrapTable('deleteCookie', ['pageNumber']);
        //跳到第一页
        List.$table.bootstrapTable('selectPage', 1);
        //列表刷新
        List.$table.bootstrapTable('refresh', {
            query: {offset: 0}
        });
    });

    //点击关闭按钮关闭
    $("#" + id + " .deepleaper-radio-close").bind('click', function () {
        $(this).parents('.deepleaper-radio-box-wrapper').hide();
        if ($("#" + id + " input[name=" + id + "]:checked").val() !== $("#" + id + " input[name=" + id + "][default_select=true]").val()) {//如果是默认选项，去掉漏斗高亮
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").addClass('opacity_1');
        } else {
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").removeClass('opacity_1');
        }
    });

    //筛选内容框鼠标移除即消失
    $("#" + id + " .deepleaper-radio-box-wrapper").bind('mouseleave', function () {
        $(this).hide();
        if ($("#" + id + " input[name=" + id + "]:checked").val() !== $("#" + id + " input[name=" + id + "][default_select=true]").val()) {//如果是默认选项，去掉漏斗高亮
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").addClass('opacity_1');
        } else {
            $(this).parents(".deepleaper-radio-wrapper").children(".deepleaper-list-funnel").removeClass('opacity_1');
        }
    });
    //bootstraptable内容列下拉框 隐藏继承的筛选漏斗 在bootstrap-table.js中修改
}
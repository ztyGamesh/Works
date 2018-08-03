/**
 * Created by liuchangyu on 16/11/14.
 * echarts图标对比字段控制器插件
 */
function comparisionInit(obj, array) {//无上限的checkbox类型
    var comparision = array;
    var comparisionNode = '';
    for (var i = 0; i < comparision.length; i++) {
        if (comparision[i].checked) {
            comparisionNode += '<label  style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;" type="checkbox" name="echartsCtl" checked field="' + comparision[i].field + '" value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        } else {
            comparisionNode += '<label style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;"  type="checkbox" name="echartsCtl" field="' + comparision[i].field + '"  value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        }
    }
    obj.html(comparisionNode);
}
function comparisionRadioInit(obj, array) {//无上限的radio类型
    var comparision = array;
    var comparisionNode = '';
    for (var i = 0; i < comparision.length; i++) {
        if (comparision[i].checked) {
            comparisionNode += '<label style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;"  type="radio" name="echartsCtl" checked field="' + comparision[i].field + '" value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        } else {
            comparisionNode += '<label style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;"  type="radio" name="echartsCtl" field="' + comparision[i].field + '"  value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        }
    }
    obj.html(comparisionNode);
}
function comparisionCheckedMaxInit(obj, array, max) {//有上限的checkbox类型
    var comparision = array;
    var comparisionNode = '';
    for (var i = 0; i < comparision.length; i++) {
        if (comparision[i].checked) {
            comparisionNode += '<label  style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;" type="checkbox" name="echartsCtl" checked field="' + comparision[i].field + '" value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        } else {
            comparisionNode += '<label style="line-height: 20px; display: inline-block;padding-right: 20px;margin-bottom: 0;font-weight: 400;vertical-align: middle;cursor: pointer;">' +
                '<input style="margin: 9px 7px 0 0;"  type="checkbox" name="echartsCtl" field="' + comparision[i].field + '"  value="' + comparision[i].name + '">' + comparision[i].name +
                '</label>'
        }
    }
    obj.html(comparisionNode);
    $("input[type='checkbox'][name='echartsCtl']").on('click', function () {
        if ($("input[type='checkbox'][name='echartsCtl']:checked").length > max) {
            layer.msg('最多可选2个指标');
            $(this).removeProp('checked');
        }
    });
}

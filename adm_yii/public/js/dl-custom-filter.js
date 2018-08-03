/**
 * Created by liuchangyu on 17/4/10.
 * 自定义选择器
 * 可选全部／自定义选项
 *
 */
// 示例  全部／自定义
// <div class="row" style="margin-top: 10px">
//     <div class="form-inline" role="form">
//     <div class="btn-group dl-custom-filter" role="group">
//     <button type="button" class="btn dl-btn-primary dl-custom-filter-all active">全部</button>
//     <div class="btn-group dl-custom-filter-custom" role="group">
//     <select id="slot_template" class="selectpicker" data-width="100%" multiple
// title="选择广告位模板">
//     </select>
//     </div>
//     </div>
//     </div>
//     </div>
// 示例  全部／自定义1/自定义2

$(document).ready(function () {
    $('.dl-custom-filter-custom select').bind('change', function () {//自定义或者自定义2
        if ($(this).val() == null) {//自定义无选择
            $(this).parents('.dl-custom-filter').children('.dl-custom-filter-all').addClass('active');
            $(this).parents('.dl-custom-filter').find('.btn.dropdown-toggle').removeClass('active');
        } else {//自定义有选择
            try {
                $(this).parents('.dl-custom-filter').children('.dl-custom-filter-custom-middle').find('.selectpicker').selectpicker('deselectAll');
            }catch (e){
                console.log('error in dl-custom-filter.js');
            }
            $(this).parents('.dl-custom-filter').find('.btn').removeClass('active');
            $(this).parents('.dl-custom-filter').children('.dl-custom-filter-custom').find('.btn').addClass('active');
        }
    });
    $('.dl-custom-filter-all').bind('click', function () {//全部
        $(this).addClass('active');
        $(this).parents('.dl-custom-filter').find('.btn.dropdown-toggle').removeClass('active');
        $(this).parents('.dl-custom-filter').find('.selectpicker').selectpicker('deselectAll');
    });
    $('.dl-custom-filter-custom-middle select').bind('change', function () {//自定义1
        if ($(this).val() == null) {//自定义无选择
            $(this).parents('.dl-custom-filter').children('.dl-custom-filter-all').addClass('active');
            $(this).parents('.dl-custom-filter').find('.btn.dropdown-toggle').removeClass('active');
        } else {//自定义有选择
            $(this).parents('.dl-custom-filter').children('.dl-custom-filter-custom').find('.selectpicker').selectpicker('deselectAll');
            $(this).parents('.dl-custom-filter').find('.btn').removeClass('active');
            $(this).parents('.dl-custom-filter').children('.dl-custom-filter-custom-middle').find('.btn').addClass('active');
        }
    });
});
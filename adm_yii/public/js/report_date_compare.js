/**
 * Created by liuchangyu on 17/1/17.
 * bootstrap-daterangepicker-master
 * 报表查询、比较日期插件初始化
 */
var lastTime = new Object();
var nowTime = {
    "start": moment().format('YYYY/MM/DD'),//刚进入页面时获取当前时间
    "end": moment().format('YYYY/MM/DD')
};
lastTime = transfer(nowTime);//根据当前时间，获取昨天时间
var clientsessiontimeStart = window.sessionStorage.getItem('clientsessiontimeStart');
var clientsessiontimeEnd = window.sessionStorage.getItem('clientsessiontimeEnd');
var clientsessiontimeLastStart = window.sessionStorage.getItem('clientsessiontimeLastStart');
var clientsessiontimeLastEnd = window.sessionStorage.getItem('clientsessiontimeLastEnd');

if(clientsessiontimeStart != null){
    nowTime.start = clientsessiontimeStart;
}
if(clientsessiontimeEnd != null){
    nowTime.end = clientsessiontimeEnd;
}
if(clientsessiontimeLastStart != null){
    lastTime.start = clientsessiontimeLastStart;
}
if(clientsessiontimeLastEnd != null){
    lastTime.end = clientsessiontimeLastEnd;
}
init();
function transfer(option) {
    //获取查询时间毫秒
    var curDateStart = new Date(option.start);
    var curDateEnd = new Date(option.end);
    var deltaTime;
    //如果是同一天
    if (option.start === option.end) {
        deltaTime = 3600 * 24 * 1000;
    } else {
        //计算查询时间的时间间隔
        deltaTime = curDateEnd.getTime() - curDateStart.getTime();
    }
    //计算上一个阶段的时间节点
    var prevDateStart = curDateStart.getTime() - deltaTime;
    var prevDateEnd = curDateEnd.getTime() - deltaTime;
    //将上一个阶段的时间节点转化为时间对象
    var preStart = new Date(prevDateStart);
    var preEnd = new Date(prevDateEnd);

    var preStartArr = [];
    var preEndArr = [];
    preStartArr[0] = preStart.getFullYear();
    preStartArr[1] = preStart.getMonth() + 1;
    preStartArr[2] = preStart.getDate();

    preEndArr[0] = preEnd.getFullYear();
    preEndArr[1] = preEnd.getMonth() + 1;
    preEndArr[2] = preEnd.getDate();

    //格式处理
    for (var i = 0; i < 3; i++) {
        preStartArr[i] = preStartArr[i].toString();
        preEndArr[i] = preEndArr[i].toString();
        if (preStartArr[i].length === 1) {
            preStartArr[i] = '0' + preStartArr[i];
        }
        if (preEndArr[i].length === 1) {
            preEndArr[i] = '0' + preEndArr[i];
        }
    }

    //将结果包装成对象
    return {
        start: preStartArr.join('/'),
        end: preEndArr.join('/')
    };
}

function searchDate_daterangepicker(startDate, endDate, maxDate) {
    $('#searchDate').daterangepicker({
        startDate: startDate,
        endDate: endDate,
        maxDate: maxDate, //最大时间
        minDate: moment('1970-01-01'), //最小时间
        dateLimit: {
            days: 365
        }, //起止时间的最大间隔
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周
        timePicker: false, //是否显示小时和分钟
        timePickerIncrement: 60, //时间的增量，单位为分钟
        timePicker12Hour: false, //是否使用12小时制来显示时间
        ranges: {
            '今日': [moment().startOf('day'), moment()],
            '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
            '过去7天': [moment().subtract('days', 7), moment().subtract('days', 1)],
            '过去14天': [moment().subtract('days', 14), moment().subtract('days', 1)],
            '过去30天': [moment().subtract('days', 30), moment().subtract('days', 1)],
            '上个月': [new Date()
                .setFullYear(new Date().getMonth() == 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(), new Date().getMonth() == 0 ? 11 : new Date().getMonth() - 1, 1),
                moment().subtract('days', new Date().getDate())]
        },
        showCustomRangeLabel:false,
        alwaysShowCalendars:true,
        linkedCalendars:false,

        opens: 'right', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',

        separator: ' to ',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '起始时间',
            toLabel: '结束时间',
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1,
            format: 'YYYY/MM/DD' //控件中from和to 显示的日期格式
        }
    }, function (start, end, label) {
        window.sessionStorage.setItem('clientsessiontimeStart', start.format('YYYY/MM/DD'));
        window.sessionStorage.setItem('clientsessiontimeEnd', end.format('YYYY/MM/DD'));

        $('#searchDate').val(start.format('YYYY/MM/DD') + ',' + end.format('YYYY/MM/DD'));
        var diff = end.diff(start, 'days');
        var startDiff = diff + 1;
        var paramS = moment(start);
        var paramE = moment(start);
        $('#compareDate').unbind('change');//防止重复请求
        $('#compareDate').data('daterangepicker').setStartDate(paramS.subtract('days', startDiff));
        $('#compareDate').data('daterangepicker').setEndDate(paramE.subtract('days', 1));
        dayOrHourState(diff);
    });
}
function compareDate_daterangepicker(startDate, endDate, maxDate) {
    $('#compareDate').daterangepicker({
        startDate: startDate,
        endDate: endDate,
        maxDate: maxDate, //最大时间
        minDate: moment('1970-01-01'), //最小时间
        dateLimit: {
            days: 365
        }, //起止时间的最大间隔
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周
        timePicker: false, //是否显示小时和分钟
        timePickerIncrement: 60, //时间的增量，单位为分钟
        timePicker12Hour: false, //是否使用12小时制来显示时间
        ranges: {
            '今日': [moment().startOf('day'), moment()],
            '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
            '过去7天': [moment().subtract('days', 7), moment().subtract('days', 1)],
            '过去14天': [moment().subtract('days', 14), moment().subtract('days', 1)],
            '过去30天': [moment().subtract('days', 30), moment().subtract('days', 1)],
            '上个月': [new Date()
                .setFullYear(new Date().getMonth() == 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(), new Date().getMonth() == 0 ? 11 : new Date().getMonth() - 1, 1),
                moment().subtract('days', new Date().getDate())]
        },
        showCustomRangeLabel:false,
        alwaysShowCalendars:true,
        linkedCalendars:false,

        opens: 'left', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',

        separator: ' to ',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '起始时间',
            toLabel: '结束时间',
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1,
            format: 'YYYY/MM/DD' //控件中from和to 显示的日期格式
        }
    }, function (start, end, label) {//格式化日期显示框
        window.sessionStorage.setItem('clientsessiontimeLastStart', start.format('YYYY/MM/DD'));
        window.sessionStorage.setItem('clientsessiontimeLastEnd', end.format('YYYY/MM/DD'));
        $('#compareDate').val(start.format('YYYY/MM/DD') + ',' + end.format('YYYY/MM/DD'));
        //比较日期应与查询日期长度一致
        var diff = end.diff(start, 'days');
        var searchDate = $('#searchDate').val().replace(' - ', ',').split(',');
        if (diff !== moment(searchDate[1]).diff(moment(searchDate[0]), 'days')) {
            layer.msg('比较日期与查询日期长度不一致，请重新选择');

        }
    });
}
function init() {
    searchDate_daterangepicker(nowTime.start, nowTime.end, nowTime.end);

    // searchDate_daterangepicker(moment(), moment(), moment());
    compareDate_daterangepicker(lastTime.start, lastTime.end, moment());

    // compareDate_daterangepicker(moment().subtract('days', 1), moment().subtract('days', 1), moment());
}

$('#compare_date').bind('change', function () {//比较单选框
    if ($('#compare_date').prop('checked')) {
        $('#compareDate').removeAttr('disabled');
    } else {
        $('#compareDate').attr('disabled', 'disabled');
    }
});

function dayOrHourState(diff) {//更新分日分时选择状态
    if (diff == 0) {//查询日期段为1天，可分日分时
        if ($('#compare_date').prop('checked')) {//如果有比较，两个日期都校验
            if ($('#searchDate').val() == moment().format('YYYY/MM/DD') + ',' + moment().format('YYYY/MM/DD') || $('#compareDate').val() == moment().format('YYYY/MM/DD') + ',' + moment().format('YYYY/MM/DD')) {//并且为今天，不能分日
                if($('input[name="report_type"]:checked').val()=='daily'){
                    $("#report_type_hourly").button('toggle');//切换为分时
                }else{
                    ListPageConfig.reRequest();
                    ListPageConfig.func();//重新渲染echarts图
                }
                $("#report_type_daily").addClass('disabled');//分日不可选
                $("#report_type_hourly").removeClass('disabled');//分时可选
                //变成分时时，日历控件可选今天   (逻辑：今天一直可以选择，选择日期为今天时，不可以分日。 原因：选一段时间，此时不可选分时，同时又不可选今天，今天就一直无法选中)
                // var searchDate = $('#searchDate').val().replace(' - ', ',').split(',');
                // var compareDate = $('#compareDate').val().replace(' - ', ',').split(',');
                // searchDate_daterangepicker(moment(searchDate[0]), moment(searchDate[1]), moment());
                // compareDate_daterangepicker(moment(compareDate[0]), moment(compareDate[1]), moment());
            } else {//1天，有比较，不是今天
                $("#report_type_hourly").removeClass('disabled');//分时可选
                $("#report_type_daily").removeClass('disabled');//分日可选
                ListPageConfig.reRequest();
                ListPageConfig.func();//重新渲染echarts图
            }
        } else if ($('#searchDate').val() == moment().format('YYYY/MM/DD') + ',' + moment().format('YYYY/MM/DD')) {//没有比较，并且为今天，不能分日
            if($('input[name="report_type"]:checked').val()=='daily'){
                $("#report_type_hourly").button('toggle');//切换为分时
            }else{
                ListPageConfig.reRequest();
                ListPageConfig.func();//重新渲染echarts图
            }
            $("#report_type_daily").addClass('disabled');//分日不可选
            $("#report_type_hourly").removeClass('disabled');//分时可选
            //变成分时时，日历控件可选今天
            // var searchDate = $('#searchDate').val().replace(' - ', ',').split(',');
            // var compareDate = $('#compareDate').val().replace(' - ', ',').split(',');
            // searchDate_daterangepicker(moment(searchDate[0]), moment(searchDate[1]), moment());
            // compareDate_daterangepicker(moment(compareDate[0]), moment(compareDate[1]), moment());
        } else {//没有比较，不是今天，可分日可分时
            $("#report_type_hourly").removeClass('disabled');//分时可选
            $("#report_type_daily").removeClass('disabled');//分日可选
            ListPageConfig.reRequest();
            ListPageConfig.func();//重新渲染echarts图
        }
    } else {//查询日期不是1天  只能分日
        if($('input[name="report_type"]:checked').val()=='hourly'){
            $("#report_type_daily").button('toggle');//切换为分日
        }else{
            ListPageConfig.reRequest();
            ListPageConfig.func();//重新渲染echarts图
        }
        $("#report_type_daily").removeClass('disabled');//分日可选
        $("#report_type_hourly").addClass('disabled');//分时不可选

        //变成分日时，日历控件不可选今天
        // var searchDate = $('#searchDate').val().replace(' - ', ',').split(',');
        // var compareDate = $('#compareDate').val().replace(' - ', ',').split(',');
        // searchDate_daterangepicker(moment(searchDate[0]), moment(searchDate[1]), moment().subtract('days', 1));
        // compareDate_daterangepicker(moment(compareDate[0]), moment(compareDate[1]), moment().subtract('days', 1));
    }
    $('#compareDate').on('change', function () {//对比日期改变时请求数据
        var searchDate = $('#searchDate').val().replace(' - ', ',').split(',');
        var compareDate = $('#compareDate').val().replace(' - ', ',').split(',');
        if ($('#compare_date').prop('checked') && moment(compareDate[1]).diff(moment(compareDate[0]), 'days') !== moment(searchDate[1]).diff(moment(searchDate[0]), 'days')) {
            console.log('比较日期与查询日期长度不一致，请重新选择');
        }else{
            ListPageConfig.reRequest();
            ListPageConfig.func();//重新渲染echarts图
        }
    });
}
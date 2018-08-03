/**
 * Created by liuchangyu on 16/11/9.
 * 常用工具类
 */


// 获取json长度
function getJsonLength(jsonData) {

    var jsonLength = 0;

    for (var item in jsonData) {

        jsonLength++;

    }

    return jsonLength;

}

//取json中的key值并返回数组
function getJsonKey(jsonData) {
    var keyArray = [];
    for (var item in jsonData) {
        keyArray.push(item);
    }
    return keyArray;
}

//取json中的value值并返回数组
function getJsonValue(jsonData) {
    var keyArray = [];
    for (var item in jsonData) {
        keyArray.push(jsonData[item]);
    }
    return keyArray;
}

function addDate(date, offset) {
    return new Date(date.valueOf() + offset * 24 * 60 * 60 * 1000);
}

// 起始结束日期的绑定和联动效果
function bindRangeDatepicker(startObj, endObj, startDate, endDate) {
    startObj.datepicker({
        autoclose: true,//选中之后自动隐藏日期选择框
        format: "yyyy-mm-dd",//日期格式;
    });

    if (startDate) {
        startObj.datepicker('setDate', startDate);
    }

    endObj.datepicker({
        autoclose: true,
        format: "yyyy-mm-dd",
    });

    if (endDate) {
        endObj.datepicker('setDate', endDate);
    }

    startObj.click(function () {
        $(".datepicker").css("z-index", "1125");
    });

    endObj.click(function () {
        $(".datepicker").css("z-index", "1125");
    });

    // 起始和终止日期的联动
    startObj.change(function () {
        endObj.datepicker('setStartDate', startObj.val());
    });

    endObj.change(function () {
        startObj.datepicker('setEndDate', endObj.val());
    });

    // 初始化
    if (startDate && endDate) {
        startObj.change();
        endObj.change();
    }
}
// 初始化日期范围选择器
function initdaterangepicker(dateObj, startDate, endDate, maxDate, minDate) {
    dateObj.daterangepicker({
        startDate: startDate,
        endDate: endDate,
        maxDate: maxDate, //最大时间
        minDate: minDate, //最小时间
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
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        linkedCalendars: false,

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
    }, function (start, end, label) {
        dateObj.val(start.format('YYYY/MM/DD') + ',' + end.format('YYYY/MM/DD'));
        //筛选清除页码cookie
        List.$table.bootstrapTable('deleteCookie', ['pageNumber']);
        //跳到第一页
        List.$table.bootstrapTable('selectPage', 1);
        List.$table.bootstrapTable('refresh', {
            query: {offset: 0}
        });
    });
}

//采用正则表达式获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
//对象的深拷贝
function deepCopy(source) {
    var result = {};
    for (var key in source) {
        result[key] = (typeof source[key] === 'object' ? deepCopy(source[key]) : source[key]);
    }
    return result;
}
// 获取随机字符串
function generateMixed(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}

/**
 * js获取字符串长度，中英文都能用
 * @param str：需要计算的字符串
 */
function getCharLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

/**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
function cutstrbyChar(str, len) {
    var str_length = 0;
    var str_cut = "";
    var str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        var str_cut_before = str_cut;
        str_cut = str_cut.concat(a);
        if (str_length > len) {
            str_cut = str_cut_before.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length <= len) {
        return str;
    }
}
/**
 * 数字转换为百分数形式
 * @param str：需要转换的数字
 */
function strToPercent(str) {
    return accMul(str, 100) + '%';
}
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以 arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m
}
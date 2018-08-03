import moment from 'moment';
import {
	message,
} from 'antd';
/*
1.计算时间函数
 */
function todaySubtract(x) {
	return moment().subtract(x, 'days').format('YYYY/MM/DD');
}
/*
2. 账户报表页面请求任务管理器
功能: 对页面进行展示前所有的请求做管理
list: 所有请求函数的集合:数组
x: x是前端给请求传递的参数，可以任意扩展，请求函数需要什么参数，自己去x里面获取
 */
function addTasks(list) {
    return function(x) {
        let tasks = list.map((func) => {
            return func(x)
        })
    	return Promise.all(tasks);
    }
}
/*
3. 请求管理任务 报错处理器
如果在页面展示前的所有请求中出现错误，则会执行这个函数
 */
function handleResponseError(reason) {
	console.log("mediadashboardError", reason)
	message.error("服务器忙，请稍后重试")
}


/**
 * js获取字符串长度，中英文都能用
 * //@param str：需要计算的字符串
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
 * //@param str：需要截取的字符串
 * //@param len: 需要截取的长度
 */
function cutstrbyChar(str, len) {
    var str_length = 0;
    var str_cut = "";
    var str_len;
    if(str == null || str == '')
    {
        str_len = 0;
    }else {
        str_len = str.length;
    }
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
 * //@param str：需要转换的数字
 */
function strToPercent(str) {
    // return accMul(str, 100) + '%';
    return accMul(str, 100);
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
// function accDiv(arg1, arg2) {
//     var t1 = 0, t2 = 0, r1, r2;
//     try {
//         t1 = arg1.toString().split(".")[1].length
//     } catch (e) {
//     }
//     try {
//         t2 = arg2.toString().split(".")[1].length
//     } catch (e) {
//     }
//     with (Math) {
//         r1 = Number(arg1.toString().replace(".", ""));
//         r2 = Number(arg2.toString().replace(".", ""));
//         return (r1 / r2) * pow(10, t2 - t1);
//     }
// }
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

/**
 * 数字千位符处理函数，带小数的也可以处理
 * //@param num
 */
function splitK(num) {
    var decimal = String(num).split('.')[1] || '';//小数部分
    var tempArr = [];
    var revNumArr = String(num).split('.')[0].split("").reverse();//倒序
    for (i in revNumArr){
        tempArr.push(revNumArr[i]);
        if((i+1)%3 === 0 && i != revNumArr.length-1){
            tempArr.push(',');
        }
    }
    var zs = tempArr.reverse().join('');//整数部分
    return decimal?zs+'.'+decimal:zs;
}

export {
    todaySubtract,
    addTasks,
    handleResponseError,
	strToPercent
};

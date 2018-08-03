/**
 * Desc: 格式验证类库
 * 如果符合格式,返回true
 * 如果不符合格式,返回false
 */

/**
 * 校验失败样式控制 依赖jq
 * @param obj
 * 传入验证元素
 * @param msg
 * 显示错误信息
 */

// Dl-require：必填字段;拥有此class的元素在失去焦点时触发
$('.dl-notNull').bind('blur', function () {
    if (!vaIsNotNull($(this).val())) {
        vaError($(this), '此字段不能为空');
    } else {
        vaSuccess($(this));
    }
});


//url校验
$('.dl-urlVal').bind('blur', function () {
    if (!vaIsUrl($(this).val())) {
        vaError($(this), '地址格式错误');
    } else {
        vaSuccess($(this));
    }
});

//金额校验
$('.dl-moneyVal').bind('blur', function () {
    if (!vaIsMoney($(this).val())) {
        vaError($(this), '金额格式错误，金额最多支持小数点后两位');
    } else {
        vaSuccess($(this));
    }
});
//金额校验（非空）
$('.dl-moneyNotNullVal').bind('blur', function () {
    if (!vaIsMoneyNotNull($(this).val())) {
        vaError($(this), '金额格式错误，金额不能为空且最多支持小数点后两位');
    } else {
        vaSuccess($(this));
    }
});

// 输入框只能输入数字
// Todo 需要完善，当前在中间删除后，鼠标自动移到最后
$('.dl-number').bind('keyup', function () {
    $(this).val($(this).val().replace(/\D/g, ''));
});
// 输入框不能输入空格
// Todo 需要完善，当前在中间删除后，鼠标自动移到最后
$('.dl-noSpace').bind('keyup', function () {
    $(this).val($(this).val().replace(/\s/g, ''));
});

function vaError(obj, msg) {
    obj.closest('.form-group').addClass('has-error');
    obj.closest('.form-group').find('.help-block').html(msg);
}
// 校验成功样式控制  依赖jq
function vaSuccess(obj) {
    obj.closest('.form-group').removeClass('has-error');
    obj.closest('.form-group').find('.help-block').html("");
}

// 判断传入参数是否为非空
// 空 return false
// 非空 return true
function vaIsNotNull(arg) {
    return !(arg == '' || arg == 'null');
}

/**
 * 判断传入的字符串是不是手机号
 * 如果符合手机号格式,返回true
 * 如果不符合手机号格式,返回false
 */
function validatePhoneNum(phoneNum) {
    var myreg = /^1\d{10}$/;
    return myreg.test(phoneNum);
}

/**
 * 判断传入的字符串是不是银行卡号
 * 如果符合银行卡号格式,返回true
 * 如果不符合银行卡号格式,返回false
 */
function validateBankCard(phoneNum) {
    var myreg = /^\d{16,19}$/;
    return myreg.test(phoneNum);
}


/**
 * 判断传入的网址是否以http://或者https://开头
 * 如果网址格式,返回true
 * 如果不符合网址格式,返回false
 */
function vaIsUrl(url) {
    // var myreg = /^(http:\/\/|https:\/\/){1}/;
    var myreg = /^(http:\/\/|https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
    return myreg.test(url);
}
// 验证可以为空的url
function vaIsUrlorNull(url) {
    if (url == '') {
        return true;
    } else {
        // var myreg = /^(http:\/\/|https:\/\/){1}/;
        var myreg = /^(http:\/\/|https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
        return myreg.test(url);
    }
}
// 金额校验
function vaIsMoney(money) {
    if (money == '') {
        return true;
    } else {
        var regexp_money = /(^[1-9]\d{0,9}$)|(^0\.\d{1,2}$)|(^[1-9]\d{0,9}\.\d{1,2}$)/;
        return regexp_money.test(money);
    }
}
// 金额校验(不含非空检验，非空校验使用vaIsNotNull)
function vaIsMoneyNotNull(money) {
    var regexp_money = /(^[1-9]\d{0,9}$)|(^0\.\d{1,2}$)|(^[1-9]\d{0,9}\.\d{1,2}$)/;
    return regexp_money.test(money);
}

//计算两个日期天数差的函数，通用
function diffDays(s1)//计算相差的天数
{
    s1 = s1.replace(/-/g, "/");
    s1 = new Date(s1);
    s2 = new Date();

    var days = s1.getTime() - s2.getTime();
    return parseInt(days / (1000 * 60 * 60 * 24));
}
function getFormatDate() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1; // 记得当前月是要+1的
    var dt = d.getDate();
    var today = year + "-" + month + "-" + dt;
    return today;
}
// checkbox必须选择至少一个
function selectOne(obj) {
    var flag = false;//标记判断是否选中一个
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            flag = true;
            break;
        }
    }
    if (!flag) {
        return false;
    }
}


/**
 * 判断传入的字符串是不是电话号码(5-11位数字)
 * 如果符合格式,返回true
 * 如果不符合格式,返回false
 */

function vatelephone(str) {
    var card = /^[0-9]{5,11}$/;
    return card.test(str);
}


/**
 * The validateEmailAddress method of the paramValidate.
 * 判断传入的字符串是不是邮箱地址
 * @param request
 * emailAddress 字符串
 * @param response
 * 如果符合邮箱地址格式,返回true
 * 如果不符合邮箱地址格式,返回false
 */
function validateEmailAddress(emailAddress) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(emailAddress);
}


/**
 * The trim method of the paramValidate.
 * 去掉传入字符串的前后空格
 * @param request
 * string 字符串
 * @param response
 * 去掉前后空格的字符串
 */
function trim(string) {
    return string.replace(/(^\s*)|(\s*$)/g, '');
}

function trimSpace(str) {
    return str.replace(/[ ]/g, "");
}
/**
 * The pwd method of the paramValidate.
 * 验证密码格式
 * @param request
 * string 字符串
 * @param response
 * 如果符合密码格式,返回true
 * 如果不符合密码格式,返回false
 */
function validatePassword(pwd) {
    var strExp = /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{2,})$/;
    if (!strExp.test(pwd) || pwd.length < 6) {
        return false;
    }
    else {
        return true;
    }
}


function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = '';
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (encodeURI(a).length > 8) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}


/**
 * 验证收款人姓名
 * @param request
 * receiptName 收款人姓名
 * @param response
 * 如果符合,返回true
 * 如果不符合,返回false
 */
function validateReceiptName(receiptName) {
    var strReg = /^([a-zA-Z0-9\u4e00-\u9fa5]{1,})$/;
    if (strReg.test(receiptName)) {
        return true;
    }
    else {
        return false;
    }
}


function validateUserPwd(pwd) {
    var reg = /^(?=[a-zA-Z0-9]*(?:[a-zA-Z][0-9]|[0-9][a-zA-Z]))[a-zA-Z0-9]{6,15}$/;
    return reg.test(pwd);
}

function CheckIdCard(CardNo, Sex, Birthday) {
    //性别　1：男　0：女
    //生日　19811010
    if ((trim(CardNo) == "") || (!(isNumber(CardNo)) && (CardNo.length == 15)) || (!(isNumber(CardNo.substr(0, 17))) && (CardNo.length == 18)) || ((CardNo.length != 15) && (CardNo.length != 18))) {
        return false;
    }
    else if (CardNo.length == 15) {
        if (CardNo.substr(8, 2) > 12 || CardNo.substr(8, 2) < 1) {
            return false;
        }
        if (CardNo.substr(10, 2) > 31 || CardNo.substr(10, 2) < 1) {
            return false;
        }
        if (Birthday != "" && ("19" + CardNo.substr(6, 6)) != Birthday) {
            return false;
        }
        if (Sex != "" && CardNo.charAt(14) % 2 != Sex) {
            return false;
        }
        return true;
    }
    else if (CardNo.length == 18) {
        if (CardNo.substr(6, 4) < 1900 || CardNo.substr(6, 4) > 2100) {
            return false;
        }
        if (CardNo.substr(10, 2) > 12 || CardNo.substr(10, 2) < 1) {
            return false;
        }
        if (CardNo.substr(12, 2) > 31 || CardNo.substr(12, 2) < 1) {
            return false;
        }
        if (Birthday != "" && CardNo.substr(6, 8) != Birthday) {
            return false;
        }
        if (Sex != "" && CardNo.charAt(16) % 2 != Sex) {
            return false;
        }

        var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        var Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');

        if (CardNo.charAt(17) == 'x') {
            CardNo = CardNo.replace("x", "X");
        }

        var checkDigit = CardNo.charAt(17);
        var cardNoSum = 0;

        for (var i = 0; i < CardNo.length - 1; i++) {
            cardNoSum = cardNoSum + CardNo.charAt(i) * Wi[i];
        }

        var seq = cardNoSum % 11;
        var getCheckDigit = Ai[seq];

        if (checkDigit != getCheckDigit) {
            return false;
        }
        return true;
    }
    else {
        return true;
    }
}

/**
 * The isChinese method of the paramValidate.
 * 判断传入的是不是数字
 * @param request
 * string 字符串
 * @param response
 * 如果符合,返回true
 * 如果不符合,返回false
 */
function isNumber(str) {
    if (str == null || str == "")
        return false;
    for (var i = 0; i < str.length; i++) {
        var cI = str.charAt(i);
        if (cI < '0' || cI > '9')
            return false;
    }
    return true;
}
//数字校验，可以为空
function isNumberAndNull(str) {
    var flag = true;
    for (var i = 0; i < str.length; i++) {
        var cI = str.charAt(i);
        if (cI < '0' || cI > '9')
            flag = false;
    }
    return flag;
}

function ischarsinbag(s, bag) {
    var i, c;
    for (i = 0; i < s.length; i++) {
        c = s.charAt(i);//字符串s中的字符 
        if (bag.indexOf(c) > -1) {
            return c;
        }
    }
    return "";
}

/**
 * The isChinese method of the paramValidate.
 * 判断传入的是不是中文
 * @param request
 * string 字符串
 * @param response
 * 如果符合,返回true
 * 如果不符合,返回false
 */
function isChinese(s) {
    var errorchar;
    var badchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789><,[]{}?/+=|\\'\":;%~!#$%()`.？%@！#$%^&*()-.";
    errorchar = ischarsinbag(s, badchar);
    if (errorchar != "") {
        report = "用户姓名只能输入中文";
        showAlert(report, function () {
        });
        return false;
    }
    return true;
}

function isChineseReg(str) {
    var reg = /^[\u4E00-\u9FA5]+$/;
    return reg.test(str);
}

function isUserName(str) {
    var user = /[^$]{2,15}/;
    if (user.test(str)) {
        return true;
    } else {
        showAlert("请您输入中文姓名", function () {
        });
        return false;
    }
}


function convertToChinese(num) {
    var N = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var str = num.toString();
    var len = num.toString().length;
    var C_Num = [];
    for (var i = 0; i < len; i++) {
        C_Num.push(N[str.charAt(i)]);
    }
    return C_Num.join('');
}

/**
 * 根据指定字数区间，校验长度合法性
 * @param str
 * 传入验证字符串
 * @param begin
 * 最小字符数
 *  * @param end
 * 最大字符数
 */
function vaWordNumberLimit(str, begin, end) {
    var wordLength = str.replace(/[^x00-xFF]/g, '**').length;
    return (wordLength >= begin && wordLength <= end);
}
// 校验输入字符数为1-50个字符
function vaWordNumberLimit1_25(str) {
    var trimStr = str.replace(/(^\s*)|(\s*$)/g, '');//去掉空格
    var wordLength = trimStr.replace(/[^x00-xFF]/g, '**').length;
    return (wordLength >= 1 && wordLength <= 50);
}

//验证输入是否为正确的IP地址，校验IPV4的地址
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}
//匹配正整数
function isPositiveInt(str) {
    var reg = /^[1-9]\d*$/;
    return reg.test(str);
}
/**
 * 发送请求
 * @param
 */
function http_post_data(url, type, data, onSuccess, onError) {
    var type = type.toLocaleLowerCase();
    if('post' === type){
        $.ajax({
            url: url,
            type: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: onSuccess,
            error: onError,
        });
        return;
    }
    if('filepost' === type) {
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            contentType: false,
            processData: false,
            success: onSuccess,
            error: onError,
        });
        return;
    }
    $.ajax({
        url: url,
        type: 'get',
        data: data,
        success: onSuccess,
        error: onError,
    });
}

/**
 * 验证字符串格式
 * @param
 */
function validateString(str, type, min, max, decial){
    var str = (str + '').trim();
    var min = min || 0;
    var max = max || '';
    var decial = decial || 0;
    switch(type){
        /* 验证数值 **/
        case 'num':
            return !!str && !isNaN(str);
            break;
        /* 验证数值(允许为空) **/
        case 'numIsNull':
            return !str || !isNaN(str);
            break;
        /* 验证字符串长度 **/
        case 'size':
            var length = str.length;
            return length >= min && (!max || length <= max);
            break;
        /* 验证字符串长度(允许为空) **/
        case 'sizeIsNull':
            var length = str.length;
            return !str || (length >= min && (!max || length <= max));
            break;
        /* 验证字符串长度(一个中文占两个字符) **/
        case 'charSize':
            var length = str.replace(/[^x00-xFF]/g, '**').length;
            return length >= min * 2 && (!max || length <= max * 2);
            break;
        /* 验证字符串长度(一个中文占两个字符)(允许为空) **/
        case 'charSizeIsNull':
            var length = str.replace(/[^x00-xFF]/g, '**').length;
            return !str || (length >= min * 2 && (!max || length <= max * 2));
            break;
        /* 验证数字长度 **/
        case 'numSize':
            var reg = new RegExp('^[0-9]{' + min + ',' + max + '}$');
            return reg.test(str);
            break;
        /* 验证数字长度(允许为空) **/
        case 'numSizeIsNull':
            var reg = new RegExp('^[0-9]{' + min + ',' + max + '}$');
            return !str || reg.test(str);
            break;
        /* 验证数字长度(包括小数) **/
        case 'numSizeDecial':
            var reg = new RegExp('^[0-9]{1,' + max + '}(|\\.[0-9]{0,' + decial + '})$');
            return +str >= min && reg.test(str);
        /* 验证数字长度(包括小数)(允许为空) **/
        case 'numSizeDecialIsNull':
            var reg = new RegExp('^[0-9]{1,' + max + '}(|\\.[0-9]{0,' + decial + '})$');
            return !str || (+str >= min && reg.test(str));
        /* 验证URL **/
        case 'url':
            var reg = /^(http:\/\/|https:\/\/){1}/;
            return reg.test(str);
            break;
        /* 验证URL(允许为空) **/
        case 'urlIsNull':
            var reg = /^(http:\/\/|https:\/\/){1}/;
            return !str || reg.test(str);
            break;
        /* 验证App链接 **/
        case 'androidApp':
            var reg = /^(http:\/\/|https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
            return reg.test(str);
            break;
        case 'iosApp':
            var reg = /^(https:\/\/itunes.apple.com){1}/;
            return reg.test(str);
            break;
        /* 验证App链接(允许为空) **/
        case 'androidAppIsNull':
            var reg = /^(http:\/\/|https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
            return !str || reg.test(str);
            break;
        case 'iosAppIsNull':
            var reg = /^(https:\/\/itunes.apple.com){1}/;
            return !str || reg.test(str);
            break;
        /* 验证为空 **/
        case 'empty':
            return !!str;
            break;
        /* default **/
        default:
            return true;
            break;
    }
}
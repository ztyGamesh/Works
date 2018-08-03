/**
 * Created by liuchangyu on 16/11/8.
 * 接口请求函数
 * @param action_url - 请求的控制器地址
 * @param type - 请求类型get/post
 * @param reqData - 参数
 * @param onSuccess - 请求成功回调
 */
function http_post(action_url, type, reqData, onSuccess) {
    var xhr = createXHR();
    var ret_data = null;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                // console.log("请求成功，响应数据如下：" + xhr.responseText);
                if (JSON.parse(xhr.responseText).status == -1) {
                    layer.confirm('登录已超时，请重新登录！', {
                        btn: ['确认', '取消'],
                        title: '超时重新登录'
                    }, function () {
                        sessionStorage.clear();
                        window.location.href = '/index/logout';
                    }, function () {
                        sessionStorage.clear();
                    })
                } else {
                    ret_data = onSuccess(xhr.responseText);
                }
            } else {
                console.log("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    // var url = "http://adm.deepleaper.com";//正式地址
    // var url = "http://dev.deepleaper.com";//测试地址
    var url = "";
    url += action_url;
    // 判断请求方式

    if (type == 'get') {
        var data = JSON.parse(reqData);
        for (var i in data) {
            url += (url.indexOf("?") == -1 ? "?" : "&");
            url += i + "=" + data[i];
        }
        // console.log("发送get请求：" + url);
        xhr.open("get", url, false);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(null);
        return ret_data;
    } else if (type == 'post') {
        // console.log("发送post请求，地址：" + url);
        // console.log("发送post请求，数据：" + reqData);
        xhr.open("post", url, false);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(reqData);
        return ret_data;
    } else {
        console.log('Error：type 请求方式有误');
    }
}
// post提交(模拟表单序列化) 特殊接口使用此方式
function http_post_past(action_url, type, reqData, onSuccess) {
    var xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                console.log("请求成功，响应数据如下：" + xhr.responseText);
                onSuccess(xhr.responseText);
            } else {
                console.log("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    var url = "";
    url += action_url;
    // 判断请求方式
    var data = JSON.parse(reqData);
    if (type == 'get') {
        for (var i in data) {
            url += (url.indexOf("?") == -1 ? "?" : "&");
            url += i + "=" + data[i];
        }
        console.log("发送get请求：" + url);
        xhr.open("get", url, false);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(null);
    } else if (type == 'post') {
        console.log("发送post请求，地址：" + url);
        console.log("发送post请求，数据：" + data);
        xhr.open("post", url, false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(serialize(data));
    } else {
        console.log('Error：type 请求方式有误');
    }
}
function serialize(data) {
    console.log(data);
    var parts = [];
    for (var i in data) {
        parts.push(i + '=' + data[i]);
    }
    return parts.join("&");
}
function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available.")
    }
}

function media_slotinventory(slot, ad, start, end, onSuccess) {
    var action_url = "/media/slotinventory";
    var type = 'get';
    var reqData = {
        "slot": slot, //广告位id
        "ad": ad, //广告投放id,添加页面传空
        "start": start,
        "end": end
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 投放报表级联菜单获取
function reportGetList(onSuccess) {
    var action_url = "/report/menu";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 媒体报表级联菜单获取
function statGetList(onSuccess) {
    var action_url = "/stat/menu";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 订单状态修改
function updateorderstatus(uid, pause, onSuccess) {
    var action_url = "/order/updateorderstatus";
    var type = 'post';
    var reqData = {
        "uid": uid,
        "pause": pause
    };
    reqData = JSON.stringify(reqData);
    http_post_past(action_url, type, reqData, onSuccess);
}
// 广告投放状态修改
function updateadstatus(uid, pause, onSuccess) {
    var action_url = "/order/updateadstatus";
    var type = 'post';
    var reqData = {
        "uid": uid,
        "pause": pause
    };
    reqData = JSON.stringify(reqData);
    http_post_past(action_url, type, reqData, onSuccess);
}
// 根据uid查询订单数据
function getorderinfoAPI(uid, onSuccess) {
    var action_url = "/order/getorderinfo";
    var type = 'get';
    var reqData = {
        "uid": uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 添加广告位
function feedsslotaddAPI(obj, onSuccess) {
    var action_url = "/media/feedsslotadd";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 广告位以及广告位模板信息
function fetchslotAPI(uid, onSuccess) {
    var action_url = "/media/fetchslot";
    var type = 'get';
    var reqData = {
        "uid": uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 查询素材
function getmaterialbytemplateAPI(uid, onSuccess) {
    var action_url = "/materiel/getmaterialbytemplate";
    var type = 'get';
    var reqData = {
        "uid": uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 根据模板id进行素材添加控制
function fetchtemplateAPI(uid, onSuccess) {
    var action_url = "/media/fetchtemplate";
    var type = 'get';
    var reqData = {
        "uid": uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//登录
function loginAPI(role, platform_role, username, password, onSuccess) {
    var action_url = "/index/login";
    var type = 'post';
    var reqData = {
        "role": role,
        "platform_role": platform_role,
        "username": username,
        "password": password
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加媒体账户
function adduserAPI(obj, onSuccess) {
    var action_url = "/user/adduser";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//修改媒体账户
function updateuserAPI(obj, onSuccess) {
    var action_url = "/user/updateuser";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加广告主账户
function addclientuserAPI(obj, onSuccess) {
    var action_url = "/user/addclientuser";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取当前登录用户权限下的媒体列表
function medialistAIP(data_type, onSuccess) {
    var action_url = "/media/medialist";
    var type = 'post';
    var reqData = {
        'data_type': data_type
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

// 获取当前登录用户权限下的媒体列表(广告位添加/修改页  新增加接口)
function medialistforcurrentuserAPI(onSuccess) {
    var action_url = "/media/medialistforcurrentuser";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

// 获取用户信息
function getcurrentuserauthorityAPI(onSuccess) {
    var action_url = "/user/getcurrentuserauthority";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 帐号切换角色 联盟／自营
// function changecurrentuserplatformroleAPI(platform_role, onSuccess) {
//     var action_url = "/user/changecurrentuserplatformrole";
//     var type = 'post';
//     var reqData = {
//         'platform_role': platform_role
//     };
//     reqData = JSON.stringify(reqData);
//     http_post(action_url, type, reqData, onSuccess);
// }
// 查询媒体／广告主账户
function userdetailAPI(uid, onSuccess) {
    var action_url = "/user/userdetail";
    var type = 'get';
    var reqData = {
        'uid': uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取当前账户名称、余额、今日花费
function clientaccountAPI(onSuccess) {
    var action_url = "/client/clientaccount";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加广告组
function adgroupsaveAPI(name, purpose, budget, onSuccess) {
    var action_url = "/promotion/adgroupsave";
    var type = 'post';
    var reqData = {
        'name': name,
        'purpose': purpose,
        'budget': budget
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//修改广告组
function adgroupsaveeditAPI(id, name, purpose, budget, onSuccess) {
    var action_url = "/promotion/adgroupsave";
    var type = 'post';
    var reqData = {
        'id': id,
        'name': name,
        'purpose': purpose,
        'budget': budget
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//修改status状态接口(广告组,广告计划etc)
function adgroupupdatestatusAPI(url, obj, onSuccess) {
    var action_url = url;
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加广告计划
function adplansaveAPI(planName, group_id, area, platform, network, media_slot_target, key_word, channel_class, s, e, budget, bid_type, price, frequency_status, frequency, speed, tagTarget, userInterestTarget, hour_target, app_pkg, download_link, app_store_id, onSuccess) {
    var action_url = "/promotion/adplansave";
    var type = 'post';
    var reqData = {
        'name': planName,
        'group_id': group_id,
        // 'class': slot_class,
        'area': area,
        'platform': platform,
        'network': network,
        'media_slot_target': media_slot_target,
        'key_word': key_word,
        'channel_class': channel_class,
        's': s,
        'e': e,
        'budget': budget,
        'bid_type': bid_type,
        'price': price,
        'frequency_status': frequency_status,
        'frequency': frequency,
        'speed': speed,
        'tag_target':tagTarget,
        'category_target': userInterestTarget,
        'hour_target':hour_target,
        'app_pkg':app_pkg,
        'download_link':download_link,
        'app_store_id':app_store_id,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//修改广告计划
function adplansaveeditAPI(id, planName, group_id, area, platform, network, media_slot_target, key_word, channel_class, s, e, budget, bid_type, price, frequency_status, frequency, speed, tagTarget, categoryTarget, hour_target, app_pkg, download_link, app_store_id, onSuccess) {
    var action_url = "/promotion/adplansave";
    var type = 'post';
    var reqData = {
        'id': id,
        'name': planName,
        'group_id': group_id,
        // 'class': slot_class,
        'area': area,
        'platform': platform,
        'network': network,
        'media_slot_target': media_slot_target,
        'key_word': key_word,
        'channel_class': channel_class,
        's': s,
        'e': e,
        'budget': budget,
        'bid_type': bid_type,
        'price': price,
        'frequency_status': frequency_status,
        'frequency': frequency,
        'speed': speed,
        'tag_target':tagTarget,
        'category_target': categoryTarget,
        'hour_target':hour_target,
        'app_pkg':app_pkg,
        'download_link':download_link,
        'app_store_id':app_store_id,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取频道定向分类
function getchannelclassAPI(onSuccess) {
    var action_url = "/user/getchannelclass";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取频道定向分类(二级列表形式)
function getchannelclassformattedAPI(onSuccess) {
    var action_url = "/user/getchannelclassformatted";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取地域数据
function geoAPI(onSuccess) {
    var action_url = "/promotion/geo";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 提取用户权限的媒体定向列表
function fetchusermediatargetAPI(onSuccess) {
    var action_url = "/promotion/fetchusermediatarget";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加广告创意
function adcreativesaveAPI(adcreativesaveObj, onSuccess) {
    var action_url = "/promotion/adcreativesave";
    var type = 'post';
    var reqData = adcreativesaveObj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//修改广告创意
function adcreativeeditAPI(adcreativeeditObj, onSuccess) {
    var action_url = "/promotion/adcreativesave";
    var type = 'post';
    var reqData = adcreativeeditObj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//查看单个广告组
function fetchadgroupAPI(id, onSuccess) {
    var action_url = "/promotion/fetchadgroup";
    var type = 'get';
    var reqData = {
        'id': id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//查看单个广告计划
function fetchadplanAPI(id, onSuccess) {
    var action_url = "/promotion/fetchadplan";
    var type = 'get';
    var reqData = {
        'id': id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//查看单个广告创意
function fetchcreativeAPI(id, onSuccess) {
    var action_url = "/promotion/fetchcreative";
    var type = 'get';
    var reqData = {
        'id': id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 修改审核状态（支持批量）
function adcreativeupdateauditstatusAPI(id, audit_status, comment, tag, onSuccess) {
    var action_url = "/audit/adcreativeupdateauditstatus";
    var type = 'post';
    var reqData = {
        'ids': id,
        'audit_status': audit_status,
        'comment': comment,
        'tag': tag
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 修改外部审核状态（支持批量）
function adcreativeupdateauditstatusothersAPI(id, medium, audit_status, comment, onSuccess) {
    var action_url = "/audit/adcreativeupdateauditstatusothers";
    var type = 'post';
    var reqData = {
        'ids': id,
        'medium': medium,
        'audit_status': audit_status,
        'comment': comment
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取账户名称、公司名称
function clientlistAPI(onSuccess) {
    var action_url = "/charge/clientlist";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//添加充值记录
function adchargeAPI(client, charge_money, onSuccess) {
    var action_url = "/charge/adcharge";
    var type = 'post';
    var reqData = {
        'client': client,
        'charge_money': charge_money
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//当前用户权限下广告组、计划、创意三层结构接口
function fetchuseradstructAPI(query_date, onSuccess) {
    var action_url = "/promotion/fetchuseradstruct";
    var type = 'get';
    var reqData = {
        'query_date': query_date
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//当前用户权限下指定基础模版的创意
function fetchusertemplateadsAPI(template_class,query_date, onSuccess) {
    var action_url = "/promotion/fetchusertemplateads";
    var type = 'get';
    var reqData = {
        'template_class': template_class,
        'query_date': query_date
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//当前角色下广告位类型
function currentroleslotclassAPI(onSuccess) {
    var action_url = "/user/currentroleslotclass";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//提取媒体、广告位、模板三级结构
function fetchmediaslotstructAPI(onSuccess) {
    var action_url = "/media/fetchmediaslotstruct";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 更新广告位模板状态(信息流)
function updateslottemplatestatusAPI(uid, status, onSuccess) {
    var action_url = "/media/updateslottemplatestatus";
    var type = 'post';
    var reqData = {
        'uid': uid,
        'status': status
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//删除广告位模板
function deleteslottemplateAPI(uid, onSuccess) {
    var action_url = "/media/deleteslottemplate";
    var type = 'post';
    var reqData = {
        'uid': uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 获取目标客户
function clientmenuAPI(onSuccess) {
    var action_url = "/user/clientmenu";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//获取当前账户累计收入、账户余额、可提现余额
function getaccountfinanceinfoAPI(onSuccess) {
    var action_url = "/charge/getaccountfinanceinfo";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//媒体查看自己账户信息接口
function mediaaccountAPI(onSuccess) {
    var action_url = "/user/mediaaccount";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//申请提现
function applydrawAPI(amount, comment, onSuccess) {
    var action_url = "/charge/applydraw";
    var type = 'post';
    var reqData = {
        'amount': amount,
        'comment': comment
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//媒体提现详情
function drawdetailAPI(id, onSuccess) {
    var action_url = "/charge/drawdetail";
    var type = 'get';
    var reqData = {
        'id': id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//检查申请提现按钮是否合法
function checkdrawAPI(onSuccess) {
    var action_url = "/charge/checkdraw";
    var type = 'post';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// 付款操作
function paytomediaAPI(id, pay_time, comment, onSuccess) {
    var action_url = "/charge/paytomedia";
    var type = 'post';
    var reqData = {
        'id': id,
        'pay_time': pay_time,
        'comment': comment
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// dashboard广告组top
function adgrouptopAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/adgrouptop";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
// dashboard广告计划top
function adplantopAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/adplantop";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}


//dashboard折线图顶部数据展示 广告主
function clientsumAPI(begin, end, onSuccess) {
    var action_url = "/dashboard/clientsum";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//dashboard折线图 广告主
function clientdashboarddailyAPI(begin, end, dimension, onSuccess) {
    var action_url = "/dashboard/clientdashboarddaily";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'dimension': dimension
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
function clientdashboardhourlyAPI(begin, end, dimension, onSuccess) {
    var action_url = "/dashboard/clientdashboardhourly";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'dimension': dimension
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard媒体收入
function mediaincomereportAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/mediaincomereport";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//dashboard折线图顶部数据展示 媒体
function mediasumAPI(begin, end, onSuccess) {
    var action_url = "/dashboard/mediasum";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//dashboard折线图 媒体
function mediadashboarddailyAPI(begin, end, dimension, onSuccess) {
    var action_url = "/dashboard/mediadashboarddaily";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'dimension': dimension
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
function mediadashboardhourlyAPI(begin, end, dimension, onSuccess) {
    var action_url = "/dashboard/mediadashboardhourly";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'dimension': dimension
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard媒体收入占比
function mediaincomeoccupyAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/mediaincomeoccupy";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard广告位收入
function slotincomereportAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/slotincomereport";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard广告位收入占比
function slotincomeoccupyAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/slotincomeoccupy";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard基础模板收入排行TOP5
function basetemplateincometopAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/basetemplateincometop";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//dashboard基础模板点击率排行TOP5
function basetemplatectrAPI(begin, end, top, onSuccess) {
    var action_url = "/dashboard/basetemplatectr";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'top': top
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}

//申请注册/免费试用
function sendemailAPI(name, kind, email, tel, onSuccess) {
    var action_url = "/index/sendemail";
    var type = 'post';
    var reqData = {
        'company': name,
        'kind': kind,
        'email': email,
        'phone': tel
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}

//查询媒体信息
function fetchmediainfoAPI(uid, onSuccess) {
    var action_url = "/media/fetchmediainfo";
    var type = 'get';
    var reqData = {
        'uid': uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//报表页面接口大全
//推广组报表
function promotegrouopAPI(condition, onSuccess) {
    var action_url = "/alliancereport/adgroupreport";
    var type = "get";
    var reqData = {
        "order": "desc",
        "limit": 50,
        "offset": 0,
        "condition": condition
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//媒体账户
function getmediumAPI(onSuccess) {
    var action_url = "/media/getmedium";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//媒体账户修改，根据uid获得选中信息的id
function getmediumbyuidAPI(uid, onSuccess) {
    var action_url = "/media/getmedium";
    var type = 'get';
    var reqData = {
        'uid': uid
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}
//获取广告形式 广告形式：动态信息流|固定信息流
function fetchmediaadtypeAPI(onSuccess) {
    var action_url = "/media/fetchmediaadtype";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}

//根据广告形式获取相对应的用户媒体定向
function getusermediabyadtypeAPI(slot_class, onSuccess) {
    var action_url = "/media/getusermediabyadtype";
    var type = 'get';
    var reqData = {
        'slot_class': slot_class
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);


}

//获取全部审核渠道信息
function getallmediumAPI(onSuccess) {
    var action_url = "/media/getallmedium";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//创意列表页 媒体审核状态 详情弹出框
function adcreativeauditotherlistAPI(creative_id, onSuccess) {
    var action_url = "/audit/adcreativeauditotherlist";
    var type = 'get';
    var reqData = {
        'ids': creative_id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}
//在修改广告位时判断当前广告形式是否是固定信息流，是固定信息流为TRUE
function isSlotFixedFeedsAPI(id, onSuccess) {
    var action_url = "/media/isSlotFixedFeeds";
    var type = 'get';
    var reqData = {
        'id': id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}

//动态信息流系统－广告计划形式为固定信息流－创建创意获取支持的样式数据
// function fetchplantemplatesAPI(id, onSuccess) {
//     var action_url = "/promotion/fetchplantemplates";
//     var type = 'get';
//     var reqData = {
//         'id': id
//     };
//     reqData = JSON.stringify(reqData);
//     http_post(action_url, type, reqData, onSuccess);
//
// }

//当广告形式为固定信息流时，可单一更改广告位名称
function slotUpdateNameAPI(uid, name, onSuccess) {
    var action_url = "/media/slotUpdateName";
    var type = 'post';
    var reqData = {
        'uid': uid,
        'name': name
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//添加媒体
function mediaaddAPI(obj, onSuccess) {
    var action_url = "/media/mediaadd";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//修改媒体
function mediaeditAPI(obj, onSuccess) {
    var action_url = "/media/mediaedit?uid=" + obj.uid;
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//添加、修改媒体前验证接口
function checkAddMediaFormValidAPI(obj, onSuccess) {
    var action_url = "/media/checkAddMediaFormValid";
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//广告主账户详情页获得全部的配置媒体名单（不选默认为全选）
function getAllMediaAPI(onSuccess) {
    var action_url = "/media/getAllMedia";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//查询创意属于固定还是动态广告形式
function isCreativeFixedAPI(id, onSuccess) {
    var action_url = "/promotion/isCreativeFixedFeeds";
    var type = 'get';
    var reqData = {
        "id": id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//添加广告计划页面，广告行为定向打标签，两级菜单
function tagAPI(onSuccess) {
    var action_url = "/promotion/tag?level=2";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    return http_post(action_url, type, reqData, onSuccess);
}
//添加广告计划页面，用户兴趣标签定向打标签，两级菜单
function articleCategoryAPI(onSuccess) {
    var action_url = "/promotion/articleCategory?level=2";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    return http_post(action_url, type, reqData, onSuccess);
}
//跃盟设置内部合作模式页面，状态变换接口
function slotpriceviewAPI(url, obj, onSuccess) {
    var action_url = url;
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//跃盟设置内部合作模式页面，状态变换接口
function slotpriceviewAPI(url, obj, onSuccess) {
    var action_url = url;
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//内容合作页面新增
function storeAPI(obj, onSuccess) {
    var action_url = '/feeds/store';
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//内容合作页获取所属应用选项
function getMediaListAPI(onSuccess) {
    var action_url = "/media/getMediaList?type=3";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//媒体管理，修改媒体页面，获取数据接口
function getMediaAPI(uid, onSuccess) {
    var action_url = " /media/getMedia";
    var type = 'get';
    var reqData = {
        'uid': uid,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//推广创意报表获取创意样式列表
function templatesAPI(onSuccess) {
    var action_url = "/template/templates";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}
/************内容合作报表接口  start*************/

//内容合作报表，热门文章分类项
function articleTagsAPI(begin, end, onSuccess) {
    var action_url = " /contentreport/articleTags?top=50";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//内容合作，筛选媒体列表
function mediaAPI(onSuccess) {
    var action_url = "/contentreport/media";
    var type = 'get';
    var reqData = {};
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);

}
//内容合作报表，汇总数据接口
function sumAPI(begin, end, begin_cmp, end_cmp, uid, onSuccess) {
    var action_url = " /contentreport/sum";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'begin_cmp': begin_cmp,
        'end_cmp': end_cmp,
        'uid': uid,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//内容合作报表，折线图数据
function chartAPI(begin, end, begin_cmp, end_cmp, uid, onSuccess) {
    var action_url = " /contentreport/chart";
    var type = 'get';
    var reqData = {
        'begin': begin,
        'end': end,
        'begin_cmp': begin_cmp,
        'end_cmp': end_cmp,
        'uid': uid,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

/***********************内容合作报表接口 end*******************/

//淘宝PID关联智荐id 添加修改
function saveTbPidAPI(obj, onSuccess) {
    var action_url = '/feeds/saveTbPid';
    var type = 'post';
    var reqData = obj;
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//获取内容合作列表数据
function getFeedsAPI(uid, onSuccess) {
    var action_url = " /feeds/getFeeds";
    var type = 'get';
    var reqData = {
        'uid': uid,
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//获取全部广告组及广告计划信息
function groupsAndplansAPI(purpose, onSuccess) {
    var action_url = "/adgroup/groups?plan=1&purpose="+purpose;
    var type = 'get';
    var reqData = {
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//获取全部广告组信息
function groupsAPI(onSuccess) {
    var action_url = "/adgroup/groups?plan=0";
    var type = 'get';
    var reqData = {
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//查询广告位白名单
function getWhiteListAPI(slot_id, onSuccess) {
    var action_url = "/slot/getWhiteList";
    var type = 'get';
    var reqData = {
        'slot_id':slot_id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
//广告位添加白名单
function addWhiteListAPI(slot_id, client_id, onSuccess) {
    var action_url = '/slot/addWhiteList';
    var type = 'post';
    var reqData = {
        'slot_id': slot_id,
        'client_id': client_id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}

//广告位定向-广告位有效性检查
function getSlotNamesAPI(slot_id, bundle_id, onSuccess) {
    var action_url = "/slot/getSlotNames";
    var type = 'get';
    var reqData = {
        'slot_id':slot_id,
        'bundle_id':bundle_id
    };
    reqData = JSON.stringify(reqData);
    http_post(action_url, type, reqData, onSuccess);
}
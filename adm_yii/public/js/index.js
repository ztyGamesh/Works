var cookiesObj = {
    'de/media/company': "bs.table.pageNumber",
    'de/media/media': "bs.table.pageNumber",
    'de/media/slot': "bs.table.pageNumber",
    'de/client/agency': "bs.table.pageNumber",
    'de/client/client': "bs.table.pageNumber",
    'de/promotion/adgrouplistview': "bs.table.pageNumber",
    'de/promotion/adplanlistview': "bs.table.pageNumber",
    'de/promotion/adcreativelistview': "bs.table.pageNumber",
    'de/order/order': "bs.table.pageNumber",
    'de/order/ad': "bs.table.pageNumber",
    'de/materiel/materiel': "bs.table.pageNumber",
    'de/order/targeting': "bs.table.pageNumber",
    'de/stat/hour': "bs.table.pageNumber",
    'de/stat/day': "bs.table.pageNumber",
    'de/stat/geo': "bs.table.pageNumber",
    'de/report/hour': "bs.table.pageNumber",
    'de/report/day': "bs.table.pageNumber",
    'de/report/geo': "bs.table.pageNumber",
    'de/bill/bill': "bs.table.pageNumber",
    'de/user/userpermissionview': "bs.table.pageNumber",
    'de/user/clientuserlistview': "bs.table.pageNumber",
    'de/audit/adcreativeauditlistview': "bs.table.pageNumber",
    'de/charge/chargelistview': "bs.table.pageNumber",
    'de/alliancereport/allianceclientview': "bs.table.pageNumber",
    'de/alliancereport/allianceadgroupview': "bs.table.pageNumber",
    'de/alliancereport/allianceadplanview': "bs.table.pageNumber",
    'de/alliancereport/allianceadcreativeview': "bs.table.pageNumber",
    'de/alliancereport/alliancewordview': "bs.table.pageNumber",
    'de/alliancereport/alliancegeoview': "bs.table.pageNumber",
    'de/alliancereport/allianceaccountview': "bs.table.pageNumber",
    'de/alliancereport/alliancemediaview': "bs.table.pageNumber",
    'de/alliancereport/allianceslotview': "bs.table.pageNumber",
    'de/alliancereport/alliancetemplateview': "bs.table.pageNumber"
};
// 手动删除bootstrap-table-cookie的cookie存储记录

function hasCookie(cookieName) {
    if (!cookieName) {
        return false;
    }
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(cookieName).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
}

function deleteBootstrapTableCookies(cookieIdTable, cookieName, sPath) {
    if ((cookieName === '') || (!cookieIdTable === '')) {
        return;
    }
    cookieName = cookieIdTable + '.' + cookieName;
    if (!hasCookie(cookieName)) {
        return false;
    }
    document.cookie = encodeURIComponent(cookieName) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sPath ? '; path=' + sPath : '');
    return true;
}

function actionBeforeLogout(obj) {
    for (var i in obj) {
        deleteBootstrapTableCookies(i, obj[i], '/');
    }
}


$(function () {
    $(".passchange").css("left", ($(window).width() - $(".passchange").width()) / 2);
    $(".passchange").css("top", ($(window).height() - $(".passchange").height()) / 2);

    //修改密码
    $(".set").hover(function () {
        $(".settan").show();
    }, function () {
        $(".settan").hide();
    });


    //弹出密码修改
    $(".pass").click(function () {
        $(".shadow").show();
        $(".passchange").show();
    });

    $(".pass-close").click(function () {
        $(".shadow").hide();
        $(".passchange").hide();
    });

    $(".collapsed").click(function () {
        $(".panel-collapse").each(function () {
            $(this).attr("aria-expanded", "false")
        })
    });

    $("#logout").click(function () {
        layer.confirm('是否确认退出当前帐号？', function () {
            actionBeforeLogout(cookiesObj);
            sessionStorage.clear();
            window.location.href = '/index/logout';
        })
    });

    $(".menuli").bind("click", function () {
        //菜单跳转时清除所有列表cookie缓存,保证是第一页
        actionBeforeLogout(cookiesObj);
        window.location.href = $(this).attr('id');
    });


    var platform_role = '';
    getcurrentuserauthorityAPI(getcurrentuserauthorityAPIonSuccessFun);
    function getcurrentuserauthorityAPIonSuccessFun(result) {//写入用户信息
        var req = JSON.parse(result);
        if (req.status == 1) {
            var user = req.user;
            var role = user.role;
            platform_role = user.platform_role;
            $("#usernameplace").html(user.name);
            if(user.power == 'admin'){
                $("#headlink").hide();
            }
            if (role == 'media') {
                $("#platform_roleplace").html('媒体联盟 &nbsp;&nbsp;');
                $("#headlink").hide();
            }  else  if (role == 'client') { //广告主不显示悬浮菜单
                $("#personalInfo_box").hide();
                $("#logout").show();
                clientaccountAPI(clientaccountAPIonSuccess);
            }
        } else {
            console.log('getcurrentuserauthorityAPI返回错误');
        }
    }
    $("#personalInfo_roleplace").bind('mouseover', function () {
        $("#personalInfo_menu").show();
        $("#headlink").hide();
    });

    $("#personalInfo_menu").bind('mouseleave', function () {
        $("#personalInfo_menu").hide();
        $("#headlink").hide();
    });
    $("#account").bind('mouseleave', function () {
        $("#personalInfo_menu").hide();
        // $("#headlink").hide();
    });
    $("#safe_layout").bind('mouseover', function() {
        $("#safe_layout").addClass('change_safe_layout');
    });
    $("#safe_layout").bind('mouseleave', function() {
        $("#safe_layout").removeClass('change_safe_layout');
    });

    $("#safe_layout").click(function () {
        $("#personalInfo_menu").hide();
        layer.confirm('是否确认退出当前帐号？', function () {
            actionBeforeLogout(cookiesObj);
            sessionStorage.clear();//退出时清空会话存储数据
            window.location.href = '/index/logout';
        })
    });

    // 获取账户花费信息
    function clientaccountAPIonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            $("#accountBalance").html(req.data.remain_budget);
            $("#accountExpend").html(req.data.today_spend_budget);
            $("#headlink").show();
        }
    }
    // 表单提交按钮交互绑定
    $(".submit_box .submit_btn").bind({
        mouseover: function () {
            $(this).removeClass('submit_btn_unactive');
            $(this).addClass('submit_btn_active');
            $(this).siblings('.submit_btn').removeClass('submit_btn_active');
            $(this).siblings('.submit_btn').addClass('submit_btn_unactive');
        },
        mouseout: function () {
            $(this).removeClass('submit_btn_active');
            $(this).siblings('.submit_btn').removeClass('submit_btn_unactive');
        }
    });
    // var firefox = navigator.userAgent.indexOf('Firefox') != -1;
    // function MouseWheel(e){//阻止事件冒泡
    //     e = e||window.event;
    //     if (e.stopPropagation) {
    //         e.stopPropagation();
    //     } else{
    //         e.cancelBubble = true;
    //     }
    // }
    // var layoutnav = document.getElementById('layoutnav');
    // firefox ? layoutnav.addEventListener('DOMMouseScroll',MouseWheel,false) : (layoutnav.onmousewheel = MouseWheel);
});


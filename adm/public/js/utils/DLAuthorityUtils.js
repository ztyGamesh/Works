// 从后台获取权限信息
function getAuthority() {
    var data = {};
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: false,
        url: '/user/getcurrentuserauthority',
        success: function (ret) {
            if (ret.status && ret.data) {
                data = ret.data;
            } else {
                console.log('error!');
            }
        }
    });
    return data;
}

// 获取指定url的权限信息
function getAuthorityTreeByUrl(url) {
    var auth = getAuthority();
    for (var i = 0; i < auth.length; i++) {
        if (url.toLocaleLowerCase() == auth[i].url.toLocaleLowerCase()) {
            return auth[i];
        }
    }
}

// 根据url获得用户的权限
function getAuthorityByUrl(url) {
    return getAuthorityTreeByUrl(url).authority;
}

// 将用户的添加和批量删除的按钮隐藏
function hideAddBtn() {
    $('#for_change').hide();
    $('#plus').hide();
}

// 用户强行进入没有权限的页面，触发返回404错误
function return404() {
    window.location.href = '/error/404';
}

function toFirstLegalPage() {
    var isFind = false;
    var auth = getAuthority();
    for (var i = 0; i < auth.length; i++) {
        if (auth[i].pid != '/' && auth[i].authority > 0) {
            window.location.href = auth[i].url;
            isFind = true;
            break;
        }
    }
    if (!isFind) {
        // 这是个没有任何权限的账号
        return404();
    }
}

function checkActionAuth(url, minAuth) {
    if (getAuthorityByUrl(url) < minAuth) {
        return404();
    }
}

function hideChangeBtnIfNeed(auth) {
    if (auth == 1) {
        hideAddBtn();
    }
}
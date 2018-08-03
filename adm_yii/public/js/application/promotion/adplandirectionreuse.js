/**
 * Created by wangqi on 2017/11/24.
 * 定向复用
 */

var planDetailData;
var planDetailHtml = '';
var planSelected ;
//填充数据

function directRender(data) {
    fun_direct_left(data);
    //控制菜单展开收起的箭头图标绑定事件
    $('.unfold-img').on('click', function (event) {
        if($(this).parent().hasClass("active")){
            $(this).parent().removeClass("active");
            $("img[class='unfold-img']", $(this).parent()).attr('src','/img/multiMenu/unfold.png');

        }else{
            $(this).parent().addClass("active");
            $("img[class='unfold-img']", $(this).parent()).attr('src','/img/multiMenu/fold.png');
        }
        if ($(this).parent().parent().hasClass('has-children')){
            $(this).parent().parent().children('ul').slideToggle(300);
        }
        event.stopPropagation();
    });

//鼠标悬浮在每条数据上的突出显示效果
    $('.each-childrendata-div').on('mouseover', function () {
        $(this).addClass('mouseover-style');
    });
    $('.each-childrendata-div').on('mouseleave', function () {
        $(this).removeClass('mouseover-style');
    });
    //每条计划点击触发查询相关定向信息
    $(".each-childrendata-div").on('click', function () {
        $(".each-childrendata-div").removeClass('each-childrendata-div-active');
        $(this).addClass('each-childrendata-div-active');
        purpose = $("#groupname").find("option:selected").attr("data-purpose");
        var planId = $(this).attr('plan-id');
        planSelected = planId;
        fetchadplanAPI(planId, refetchadplanonSuccess);
    });
    function refetchadplanonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1){
            planDetailData = req.data;
            directPlanData(req.data);
        }else {
            layer.msg(req.msg);
        }
    }
    function directPlanData(data) {
        $("#directional-right-body").html('');
        //    通过ID 请求数据，对右侧内容框进行渲染
        fun_direct_right(data);
    }

    $("#save_btn").on('click', function () {
        $("#direct-container").modal('hide');
        purpose = $("#groupname").find("option:selected").attr("data-purpose");

        if($("#directional-right-body").html() != ''){
            //刷新定向配置
            directRefresh(planDetailData);
        }
        planDetailHtml = $("#directional-right-body").html();
    });

    $("#cancel_btn").on('click', function () {
        $("#directional-right-body").html('');
    });
}
function fun_direct_left(dataTemp) {
    //基本一些元素的创建
    var newDiv = document.createElement('div');
    var newUl = document.createElement('ul');
    var newLi = document.createElement('li');
    var newLabel = document.createElement('label');
    var newImg = document.createElement('img');

    var listIdLeft = document.getElementById('directional-left-body');

// 左侧
    var areaLeft = newDiv.cloneNode(true);
    areaLeft.setAttribute('class', 'plan-left'); // 把这部分插入到  directional-left-body  中
    areaLeft.setAttribute('width', '100%');
    listIdLeft.appendChild(areaLeft);

    var areaP = newDiv.cloneNode(true); //一条数据的盒子
    areaP.setAttribute('class', 'plan-list-left');
    areaLeft.appendChild(areaP);

    var ul_sum = newUl.cloneNode(true);
    ul_sum.setAttribute('class', 'cd-accordion-menu animated');
    areaP.appendChild(ul_sum);

    for(var i = 0; i < dataTemp.length; i++)
    {
        if(dataTemp[i].child)
        {
            var li = newLi.cloneNode(true);
            li.setAttribute('class', 'li-class has-children');
            ul_sum.appendChild(li);
            var div = newDiv.cloneNode(true);
            div.setAttribute('class', 'has-children each-data-div');
            div.setAttribute('group-id', dataTemp[i].group_id);
            div.setAttribute('name', 'div-data');
            li.appendChild(div);

            var img = newImg.cloneNode(true);
            img.setAttribute('src','/img/multiMenu/unfold.png');
            img.setAttribute('class','unfold-img');
            div.appendChild(img);
            var label = newLabel.cloneNode(true);
            label.setAttribute('class','left-label-parent');
            label.innerHTML = dataTemp[i].group_name;
            div.appendChild(label);

            var ul = newUl.cloneNode(true);
            li.appendChild(ul);
            var dataTempChild = dataTemp[i].child;
            for(var j = 0; j < dataTempChild.length; j++)
            {
                var li = newLi.cloneNode(true);
                li.setAttribute('class', 'li-class');
                ul.appendChild(li);
                var div = newDiv.cloneNode(true);
                div.setAttribute('class', 'each-childrendata-div');
                div.setAttribute('plan-id', dataTempChild[j].plan_id);
                div.setAttribute('name', 'div-data');
                li.appendChild(div);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class','left-label-child');

                label.innerHTML = dataTempChild[j].plan_name;
                label.style.marginLeft = '30px';

                div.appendChild(label);
            }
        }
    }
}
function fun_direct_right(data) {
    //基本一些元素的创建
    var newDiv = document.createElement('div');
    var newLabel = document.createElement('label');

    var listIdRight = document.getElementById('directional-right-body');
// 右侧
    var areaRight = newDiv.cloneNode(true);
    areaRight.setAttribute('class', 'detail-right'); // 把这部分插入到  directional-right-body  中
    // areaRight.setAttribute('width', '100%');
    listIdRight.appendChild(areaRight);

    var areaR = newDiv.cloneNode(true); //一条数据的盒子
    areaR.setAttribute('class', 'plan-detail-right');
    areaRight.appendChild(areaR);

    var hasData = false;//用来标识当前计划下是否所有定向都为不限

    //地域定向
    if(data.area != null && data.area != '') {
        hasData = true;

        var div_area_box = newDiv.cloneNode(true);
        div_area_box.setAttribute('class', 'each-data-div-box');
        div_area_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_area_box);

        var div_area_box_title = newDiv.cloneNode(true);
        div_area_box_title.setAttribute('class', 'each-data-div-title');
        div_area_box_title.setAttribute('name', 'div-data');
        div_area_box_title.innerHTML = '地域定向：';
        div_area_box.appendChild(div_area_box_title);

        var areaHtml = showArea(data);
        var div_area_box_body = newDiv.cloneNode(true);
        div_area_box_body.setAttribute('class', 'each-data-div-body');
        div_area_box_body.setAttribute('name', 'div-data');
        div_area_box_body.innerHTML = areaHtml; //数据要转换成汉字再显示
        div_area_box.appendChild(div_area_box_body);
    }

    if(purpose == 'landing'){
        //平台定向 仅落地页
        if(data.platform != null && data.platform != '') {
            hasData = true;

            var div_platform_box = newDiv.cloneNode(true);
            div_platform_box.setAttribute('class', 'each-data-div-box');
            div_platform_box.setAttribute('name', 'div-data');
            areaR.appendChild(div_platform_box);

            var div_platform_box_title = newDiv.cloneNode(true);
            div_platform_box_title.setAttribute('class', 'each-data-div-title');
            div_platform_box_title.setAttribute('name', 'div-data');
            div_platform_box_title.innerHTML = '平台定向：';
            div_platform_box.appendChild(div_platform_box_title);

            var platformHtml = showPlatform(data);
            var div_platform_box_body = newDiv.cloneNode(true);
            div_platform_box_body.setAttribute('class', 'each-data-div-body');
            div_platform_box_body.setAttribute('name', 'div-data');
            div_platform_box_body.innerHTML = platformHtml; //数据要转换成汉字再显示， 注意区分何种推广目的
            div_platform_box.appendChild(div_platform_box_body);
        }
    }


    //网络定向
    if(data.network != null && data.network != '') {
        hasData = true;

        var div_net_box = newDiv.cloneNode(true);
        div_net_box.setAttribute('class', 'each-data-div-box');
        div_net_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_net_box);

        var div_net_box_title = newDiv.cloneNode(true);
        div_net_box_title.setAttribute('class', 'each-data-div-title');
        div_net_box_title.setAttribute('name', 'div-data');
        div_net_box_title.innerHTML = '网络定向：';
        div_net_box.appendChild(div_net_box_title);

        var networkHtml = showNetwork(data);
        var div_net_box_body = newDiv.cloneNode(true);
        div_net_box_body.setAttribute('class', 'each-data-div-body');
        div_net_box_body.setAttribute('name', 'div-data');
        div_net_box_body.innerHTML = networkHtml; //数据要转换成汉字再显示
        div_net_box.appendChild(div_net_box_body);
    }

    //媒体定向
    if(data.media_slot_target != null && data.media_slot_target != '' && data.media_slot_target.length != 0) {
        hasData = true;

        var div_meida_box = newDiv.cloneNode(true);
        div_meida_box.setAttribute('class', 'each-data-div-box');
        div_meida_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_meida_box);

        var div_media_box_title = newDiv.cloneNode(true);
        div_media_box_title.setAttribute('class', 'each-data-div-title');
        div_media_box_title.setAttribute('name', 'div-data');
        div_media_box_title.innerHTML = '媒体广告位定向：';
        div_meida_box.appendChild(div_media_box_title);

        var mediaHtml = showMedia(data);
        var div_media_box_body = newDiv.cloneNode(true);
        div_media_box_body.setAttribute('class', 'each-data-div-body');
        div_media_box_body.setAttribute('name', 'div-data');
        div_media_box_body.innerHTML = mediaHtml; //数据要转换成汉字再显示
        div_meida_box.appendChild(div_media_box_body);
    }

    //关键词定向
    if(data.key_word != null && data.key_word != '') {
        hasData = true;

        var div_keywords_box = newDiv.cloneNode(true);
        div_keywords_box.setAttribute('class', 'each-data-div-box');
        div_keywords_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_keywords_box);

        var keywordsHtml = showKeywords(data);

        if(keywordsHtml.forwardKeyword != ''){
            var div_keywords_box_title = newDiv.cloneNode(true);
            div_keywords_box_title.setAttribute('class', 'each-data-div-title');
            div_keywords_box_title.setAttribute('name', 'div-data');
            div_keywords_box_title.innerHTML = '关键词定向：';
            div_keywords_box.appendChild(div_keywords_box_title);

            var div_keywords_box_body = newDiv.cloneNode(true);
            div_keywords_box_body.setAttribute('class', 'each-data-div-body');
            div_keywords_box_body.setAttribute('name', 'div-data');
            div_keywords_box_body.innerHTML = keywordsHtml.forwardKeyword; //数据要转换成汉字再显示
            div_keywords_box.appendChild(div_keywords_box_body);
        }

        if(keywordsHtml.denyKeyword != ''){
            var div_notkeywords_box_title = newDiv.cloneNode(true);
            div_notkeywords_box_title.setAttribute('class', 'each-data-div-title');
            div_notkeywords_box_title.setAttribute('name', 'div-data');
            div_notkeywords_box_title.innerHTML = '否定关键词定向：';
            div_keywords_box.appendChild(div_notkeywords_box_title);

            var div_notkeywords_box_body = newDiv.cloneNode(true);
            div_notkeywords_box_body.setAttribute('class', 'each-data-div-body');
            div_notkeywords_box_body.setAttribute('name', 'div-data');
            div_notkeywords_box_body.innerHTML = keywordsHtml.denyKeyword; //数据要转换成汉字再显示
            div_keywords_box.appendChild(div_notkeywords_box_body);
        }
    }

    //频道分类定向
    if(data.channel_class != null && data.channel_class != '') {
        hasData = true;

        var div_channel_box = newDiv.cloneNode(true);
        div_channel_box.setAttribute('class', 'each-data-div-box');
        div_channel_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_channel_box);

        var div_channel_box_title = newDiv.cloneNode(true);
        div_channel_box_title.setAttribute('class', 'each-data-div-title');
        div_channel_box_title.setAttribute('name', 'div-data');
        div_channel_box_title.innerHTML = '频道分类定向：';
        div_channel_box.appendChild(div_channel_box_title);

        var channelHtml = showChannel(data);
        var div_channel_box_body = newDiv.cloneNode(true);
        div_channel_box_body.setAttribute('class', 'each-data-div-body');
        div_channel_box_body.setAttribute('name', 'div-data');
        div_channel_box_body.innerHTML = channelHtml; //数据要转换成汉字再显示
        div_channel_box.appendChild(div_channel_box_body);
    }

    //广告行为定向
    if(data.tag_target != null && data.tag_target != '') {
        hasData = true;

        var div_ad_box = newDiv.cloneNode(true);
        div_ad_box.setAttribute('class', 'each-data-div-box');
        div_ad_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_ad_box);

        var div_ad_box_title = newDiv.cloneNode(true);
        div_ad_box_title.setAttribute('class', 'each-data-div-title');
        div_ad_box_title.setAttribute('name', 'div-data');
        div_ad_box_title.innerHTML = '广告行为定向：';
        div_ad_box.appendChild(div_ad_box_title);
        var advertisingBehaviorHtml = $('#advertising-behavior-orientation').multiMenu('getReuseTargetString', data.tag_target);
        var div_ad_box_body = newDiv.cloneNode(true);
        div_ad_box_body.setAttribute('class', 'each-data-div-body');
        div_ad_box_body.setAttribute('name', 'div-data');
        div_ad_box_body.innerHTML = advertisingBehaviorHtml; //数据要转换成汉字再显示
        div_ad_box.appendChild(div_ad_box_body);
    }

    //用户兴趣标签定向
    if(data.category_target != null && data.category_target != '') {
        hasData = true;

        var div_ad_box = newDiv.cloneNode(true);
        div_ad_box.setAttribute('class', 'each-data-div-box');
        div_ad_box.setAttribute('name', 'div-data');
        areaR.appendChild(div_ad_box);

        var div_ad_box_title = newDiv.cloneNode(true);
        div_ad_box_title.setAttribute('class', 'each-data-div-title');
        div_ad_box_title.setAttribute('name', 'div-data');
        div_ad_box_title.innerHTML = '用户兴趣标签定向：';
        div_ad_box.appendChild(div_ad_box_title);
        var advertisingBehaviorHtml = $('#user-interest-label').multiMenu('getReuseTargetString', data.category_target);
        var div_ad_box_body = newDiv.cloneNode(true);
        div_ad_box_body.setAttribute('class', 'each-data-div-body');
        div_ad_box_body.setAttribute('name', 'div-data');
        div_ad_box_body.innerHTML = advertisingBehaviorHtml; //数据要转换成汉字再显示
        div_ad_box.appendChild(div_ad_box_body);
    }

    if(!hasData){
        var div_box = newDiv.cloneNode(true);
        div_box.setAttribute('class', 'each-data-div-box');
        div_box.setAttribute('name', 'div-data');
        div_box.innerHTML = '无定向';
        areaR.appendChild(div_box);
    }
}



//显示地域定向信息字符串
function showArea(data) {
    var showAreaHtml = [];
    var t = 0;
    var showArea = {};
    if (data.area !== '') {
        var area = data.area.split(',');
        for (var i = 0; i < area.length; i++) {
            showArea[area[i]] = true;
        }
    }
    // 渲染地域
    geoAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            var data = req.data;
            for (var i in data) {
                if (showArea[i]) {
                    if(data[i].parent){
                        var parentId = data[i].parent;
                        showAreaHtml[t++] = data[parentId].name + '●' + data[i].name;
                    }
                    else {
                        showAreaHtml[t++] = data[i].name;
                    }
                }
            }
        } else {
            layer.msg(req.msg);
        }
    });
    return showAreaHtml.join('、');
}
//显示平台定向信息字符串
function showPlatform(data) {
    var showPlatformHtml = [];
    var t = 0;
    if (data.platform !== '') {
        switch (purpose) {
            case 'download':
                showPlatformHtml[t++] = data.platform;
                break;
            case 'landing':
                var platformChecked = data.platform.split(',');
                for (var i = 0; i < platformChecked.length; i++) {
                    showPlatformHtml[t++] = platformChecked[i];
                    $("#customplatCheck option[value=" + platformChecked[i] + "]").prop('selected', 'selected');
                }
                break;
        }
    }
    return showPlatformHtml.join('、');
}

//显示网络定向信息字符串
function showNetwork(data) {
    var showNetworkHtml = [];
    var t = 0;
    if (data.network !== '') {
        var networkChecked = data.network.split(',');
        for (var i = 0; i < networkChecked.length; i++) {
            showNetworkHtml[t++] = $("#customnetwork option[value=" + networkChecked[i] + "]").html();
        }
    }
    return showNetworkHtml.join('、');
}
//显示媒体定向信息字符串
function showMedia(data) {
    var showMediaHtml = [];

    for(var i = 0; i < data.media_slot_target.length; i++){
        var showMediaName = [];
        if(data.media_slot_target[i].slots.length != 0){
            for(var j = 0; j < data.media_slot_target[i].slots.length; j++){
                showMediaName[j] = data.media_slot_target[i].slots[j].slot_name;
            }
            showMediaHtml[i] = data.media_slot_target[i].media_name + ": " + showMediaName.join(',');
        }else {
            showMediaHtml[i] = data.media_slot_target[i].media_name;
        }

    }

    return showMediaHtml.join(';&nbsp;&nbsp;</br>');
}

//显示关键词定向信息字符串
function showKeywords(data) {
    var showWordHtml = {};
    if (data.key_word.length !== 0) {//写入关键词
        var key_word = data.key_word;
        var forwardKeyword = [];//正向关键词
        var denyKeyword = [];//反向关键词
        for (var i = 0; i < key_word.length; i++) {
            if (key_word[i].target_type == 1) {
                forwardKeyword.push(key_word[i]);
            } else {
                denyKeyword.push(key_word[i]);
            }
        }
        var forwardKeyword_word = '';
        for (var i = 0; i < forwardKeyword.length; i++) {
            if (i == forwardKeyword.length - 1) {
                forwardKeyword_word += forwardKeyword[i].word;
            } else {
                forwardKeyword_word += forwardKeyword[i].word + '、';
            }
        }
        // if(forwardKeyword_word == ''){
        //     showWordHtml.forwardKeyword = '无';
        // }else {
            showWordHtml.forwardKeyword = forwardKeyword_word;
        // }

        var denyKeyword_word = '';
        for (var i = 0; i < denyKeyword.length; i++) {
            if (i == denyKeyword.length - 1) {
                denyKeyword_word += denyKeyword[i].word;
            } else {
                denyKeyword_word += denyKeyword[i].word + '、';
            }
        }
        // if(denyKeyword_word == ''){
        //     showWordHtml.denyKeyword = '无';
        // }else {
            showWordHtml.denyKeyword = denyKeyword_word;
        // }
    }
    return showWordHtml;

}

//显示频道分类定向信息字符串
function showChannel(data) {
    var showChannelHtml = [];
    var t = 0;
    var checkedchannel = {};//已选定向

    if (data.channel_class !== '') {
        var channel = data.channel_class.split(',');
        for (var i = 0; i < channel.length; i++) {
            checkedchannel[channel[i]] = true;
        }
    }

    // 渲染频道分类定向
    getchannelclassAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            var data = req.data;
            for (var i in data) {
                if (checkedchannel[i]) {
                    if(data[i].parent){
                        var parentId = data[i].parent;
                        showChannelHtml[t++] = data[parentId].name + '●' + data[i].name;
                    }
                    else {
                        showChannelHtml[t++] = data[i].name;
                    }
                }
            }
        } else {
            layer.msg(req.msg);
        }
    });
    return showChannelHtml.join('、');
}

//显示广告行为定向
function showAdvertisingBehavior(data) {
    var showAdvertisingBehaviorHtml = [];
    var t = 0;
    var lastAdTarget = [];
    //广告行为定向选中部分
    if (data.tag_target !== '' && data.tag_target !== null) {
        lastAdTarget = data.tag_target;
    }
    //广告行为定向，获取总数据
    tagAPI(tagAPIonSuccess);
    function tagAPIonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            for (var i = 0; i < lastAdTarget.length; i++) {
                showAdvertisingBehaviorHtml[t++] = $('#' + lastAdTarget[i].level1).attr('name') + '●' + $('#' + lastAdTarget[i].level2).attr('name');
            }
        }
        else
        {
            layer.msg(req.msg);
        }
    }
    return showAdvertisingBehaviorHtml.join('、');
}

//重新渲染全部定向
function directRefresh(data) {
    refreshArea(data);
    refreshPlatform(data);
    refreshNetwork(data);
    refreshMedia(data);
    refreshKeywords(data);
    refreshChannel(data);
    refreshAdvertisingBehavior(data);
    refreshUserInterestLabelBehavior(data);
}

//推广目的
var purpose = 'landing';
var group_id = GetQueryString('groupId');
fetchadgroupAPI(group_id, function (result) {
    var req = JSON.parse(result);
    purpose = req.data.purpose;
});

//刷新地域定向
function refreshArea(data) {
    var checkedArea = {};
    document.getElementById("area").parentNode.removeChild(document.getElementById("area"));
    document.getElementById('area-div').innerHTML =["<select id=\"area\" multiple=\"multiple\">",
        "                </select>"].join("");
    if (data.area !== '') {
        $("#areaCheck option[value = 1]").prop('selected', 'selected');
        var area = data.area.split(',');
        for (var i = 0; i < area.length; i++) {
            checkedArea[area[i]] = true;
        }
        $("#area-group").show();
    }
    else {
        $("#areaCheck option[value = 0]").prop('selected', 'selected');
        $('#areaCheck').selectpicker('refresh');
        $("#area-group").hide();
    }
    // 渲染地域
    geoAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            var data = req.data;
            var html = '';
            for (var i in data) {
                var parent = '';
                var isSelected = '';
                if (data[i].parent !== undefined) {
                    parent = 'parent-id=' + data[i].parent;
                }
                if (checkedArea[i]) {
                    isSelected = 'selected = "selected" checked = "checked" ';
                }
                html += '<option value=' + i + '  ' + parent + ' ' + isSelected + '>' + data[i].name + '</option>'
            }
            $("#area").html(html);
            regionList('area');
        } else {
            layer.msg(req.msg);
        }
    });
}



//刷新平台定向
function refreshPlatform(data) {
    if (data.platform !== '') {
        switch (purpose) {
            case 'download':
                //注意一下
                $("#setDownload").show();
                $("#platCheck-landing").hide();
                if($("#app-store-id").val() == "ios"){
                    $("#appStore").show();
                }
                else {
                    $("#appStore").hide();
                }
                break;
            case 'landing':
                $("#setDownload").hide();
                $("#platCheck-landing").show();
                $("#platCheck option[value = 1]").prop('selected', 'selected');
                var platformChecked = data.platform.split(',');
                $("#plat-group").show();
                for (var i = 0; i < platformChecked.length; i++) {
                    $("#customplatCheck option[value=" + platformChecked[i] + "]").prop('selected', 'selected');
                }
                $('#customplatCheck').selectpicker('refresh');

                break;
        }
    }else {
        switch (purpose) {
            case 'download':
                $("#setDownload").show();
                $("#platCheck-landing").hide();
                if($("#app-store-id").val() == "ios"){
                    $("#appStore").show();
                }
                else {
                    $("#appStore").hide();
                }
                break;
            case 'landing':
                $("#setDownload").hide();
                $("#platCheck-landing").show();
                $("#platCheck option[value = 0]").prop('selected', 'selected');
                $("#plat-group").hide();
                $('#platCheck').selectpicker('refresh');
                break;
        }
    }
}
//刷新网络定向
function refreshNetwork(data) {
    if (data.network !== '') {
        $("#networkCheck option[value = 1]").prop('selected', 'selected');
        var networkChecked = data.network.split(',');
        $("#network-group").show();
        for (var i = 0; i < networkChecked.length; i++) {
            $("#customnetwork option[value=" + networkChecked[i] + "]").prop('selected', 'selected');
        }
        $('#customnetwork').selectpicker('refresh');
    }else {
        $("#networkCheck option[value = 0]").prop('selected', 'selected');
        $("#network-group").hide();
        $('#networkCheck').selectpicker('refresh');
    }
}

//刷新媒体广告位定向
function refreshMedia(data) {
    if (data.media_slot_target.length !== 0) {
        $("#media option[value = 1]").prop('selected', 'selected');
        $("#media_ad_orientation").show();
        clearAll();
        renderMediaAd(data.media_slot_target);
    }else {
        $("#media option[value = 0]").prop('selected', 'selected');
        $("#media_ad_orientation").hide();

    }
}

//刷新关键词设置
function refreshKeywords(data) {
    if (data.key_word.length !== 0) {//写入关键词
        var key_word = data.key_word;
        var forwardKeyword = [];//正向关键词
        var denyKeyword = [];//反向关键词
        for (var i = 0; i < key_word.length; i++) {
            if (key_word[i].target_type == 1) {
                forwardKeyword.push(key_word[i]);
            } else {
                denyKeyword.push(key_word[i]);
            }
        }
        $("#keywordstatus").val("已有" + forwardKeyword.length + "个关键词，" + denyKeyword.length + "个否定关键词");
        var forwardKeyword_word = '';
        var forwardKeyword_match_type = '1';
        for (var i = 0; i < forwardKeyword.length; i++) {
            if (i == forwardKeyword.length - 1) {
                forwardKeyword_word += forwardKeyword[i].word;
            } else {
                forwardKeyword_word += forwardKeyword[i].word + '\n';
            }
            forwardKeyword_match_type = forwardKeyword[i].match_type;
        }
        $('#ctrl-group-keyword').val(forwardKeyword_word).keyup();
        $("input[name = 'keywordmatch'][value = " + forwardKeyword_match_type + "]").prop("checked", "checked");

        var denyKeyword_word = '';
        var denyKeyword_match_type = '1';
        for (var i = 0; i < denyKeyword.length; i++) {
            if (i == denyKeyword.length - 1) {
                denyKeyword_word += denyKeyword[i].word;
            } else {
                denyKeyword_word += denyKeyword[i].word + '\n';
            }
            denyKeyword_match_type = denyKeyword[i].match_type;
        }
        $('#denyctrl-group-keyword').val(denyKeyword_word).keyup();
        $("input[name = 'denykeywordmatch'][value = " + denyKeyword_match_type + "]").prop("checked", "checked");
        keywordSubmit();
    }else {
        $("#keywordstatus").val("已有0个关键词，0个否定关键词");
        $('#ctrl-group-keyword').val('').keyup();
        $("input[name = 'keywordmatch'][value = '1']").prop("checked", "checked");

        $('#denyctrl-group-keyword').val('').keyup();
        $("input[name = 'denykeywordmatch'][value = '1']").prop("checked", "checked");

    }
}

//刷新频道分类定向
function refreshChannel(data) {
    var checkedchannel = {};//已选定向
    document.getElementById("customchannel").parentNode.removeChild(document.getElementById("customchannel"));
    document.getElementById('customchannel-div').innerHTML =["<select id=\"customchannel\" multiple=\"multiple\">",
        "                </select>"].join("");

    if (data.channel_class !== '') {
        $("#channelCheck option[value = 1]").prop('selected', 'selected');
        var channel = data.channel_class.split(',');
        for (var i = 0; i < channel.length; i++) {
            checkedchannel[channel[i]] = true;
        }
        $("#channel-group").show();
    }else {
        $("#channelCheck option[value = 0]").prop('selected', 'selected');
        $('#channelCheck').selectpicker('refresh');
        $("#channel-group").hide();
    }

    // 渲染频道分类定向
    getchannelclassAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            var data = req.data;
            var html = '';
            for (var i in data) {
                var parent = '';
                var isSelected = '';
                if (data[i].parent !== undefined) {
                    parent = 'parent-id=' + data[i].parent;
                }
                if (checkedchannel[i]) {
                    isSelected = 'selected = "selected" checked = "checked" ';
                }
                html += '<option value=' + i + '  ' + parent + ' ' + isSelected + '>' + data[i].name + '</option>'
            }
            $("#customchannel").html(html);
            regionList('customchannel');
        } else {
            layer.msg(req.msg);
        }
    });
}

//刷新广告行为定向
function refreshAdvertisingBehavior(data) {
    if (data.tag_target) {
        $('#advertising-behavior-orientation').multiMenu('setChooseData', data.tag_target);
    }
}

function refreshUserInterestLabelBehavior(data) {
    if (data.category_target) {
        $('#user-interest-label').multiMenu('setChooseData', data.category_target);
    }
}
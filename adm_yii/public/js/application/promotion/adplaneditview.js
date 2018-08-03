/**
 * Created by liuchangyu on 16/12/20.
 */

$(document).ready(function () {

    var areaCheck = $("#areaCheck");
    var areaGroup = $("#area-group");
    var platCheck = $("#platCheck");
    var platGroup = $("#plat-group");
    var customplatCheck = $("#customplatCheck");
    var networkCheck = $("#networkCheck");
    var networkGroup = $("#network-group");
    var customnetwork = $("#customnetwork");

    var channelCheck = $("#channelCheck");
    var channelGroup = $("#channel-group");
    var customchannel = $("#customchannel");

    var KeywordsHint = $("#KeywordsHint");
    var matchHint = $(".matchHint");
    var deleteAll = $(".deleteAll");
    var keyworddeleteAll = $("#keyworddeleteAll");
    var denykeyworddeleteAll = $("#denykeyworddeleteAll");
    var keywordtextarea = $("#ctrl-group-keyword");
    var denykeywordtextarea = $("#denyctrl-group-keyword");

    var lastmedia = [];
    var lastAdTarget = [];
    var list_lenght = 0;

    var isFixFlow = false;
    //投放时段
    var allResult = {
        1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    };

    $('#user-interest-label').multiMenu({
        title: '用户兴趣标签定向',
        apiFunc: articleCategoryAPI,
        apiCallbackFunc: function (result) {
            var d = [];
            var req = JSON.parse(result);
            var dataGroup = req.data;
            if (req.status == 1) {
                d = translateFun(d, dataGroup);
            } else {
                console.log('tagAPI-error');
            }
            return d;
        }
    });

    $("#advertising-behavior-orientation").multiMenu({
        title: '广告行为定向',
        apiFunc: tagAPI,
        apiCallbackFunc: function (result) {
            var d = [];
            var req = JSON.parse(result);
            var dataGroup = req.data;
            if (req.status == 1) {
                d = translateFun(d, dataGroup);
            } else {
                console.log('tagAPI-error');
            }
            return d;
        }
    });

    //投放时段插件
    serviceTime('serviceTimeSelected');

    //推广目的
    var purpose = 'landing';
    var group_id = GetQueryString('groupId');
    fetchadgroupAPI(group_id, function (result) {
        var req = JSON.parse(result);
        purpose = req.data.purpose;
    });
    purposechange();
    function purposechange() {
        if (purpose == 'download') {//下载 1没有不限 2android 、ios单选
            $("#setDownload").show();
            $("#platCheck-landing").hide();
            if($("#platCheck-download").val() == "ios"){
                $("#appStore").show();
            }
            else {
                $("#appStore").hide();
            }


        } else if (purpose == 'landing') {//落地页 1不限 2自定义－多选
            $("#setDownload").hide();
            $("#platCheck-landing").show();
            customplatCheck.attr('multiple');
            customplatCheck.attr('title', '落地页平台可多选');
        }
    }
    $("#platCheck-download").on('change', function () {
        if($("#platCheck-download").val() == "ios"){
            $("#appStore").show();
            $("#app-store-id").on('blur', function () {
                if (!vaIsNotNull($(this).val()) || !isNumAlpha($(this).val())) {
                    vaError($(this), 'App Store ID 应为数字或字母');
                    $(this).focus();
                    return false;
                } else {
                    vaSuccess($(this));
                }
            });
        }
        else {
            $("#appStore").hide();
        }
    });
    //控制定向复用弹框是否显示
    $("#direct-control-btn").bind('click', function () {
        $("#directional-left-body").html('');
        groupsAndplansAPI(purpose, groupsAndplansonSuccess);
        $("#directional-right-body").html(planDetailHtml);
        $(".each-childrendata-div[plan-id='"+ planSelected +"']").addClass('each-childrendata-div-active');
    });
    function groupsAndplansonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1){
            directRender(req.data);
        }else {
            console.log('groupsAndplansonSuccess-error');
        }
    }

    // 渲染媒体定向
    fetchusermediatargetAPI(function (result) {
        var req = JSON.parse(result);
        var data = req.data;
        if (req.status == 1) {
            mediaAdOrientation('dl_media',data);
        } else {
            console.log('fetchusermediatargetAPI-error');
        }
    });
    groupsAPI(groupsonSuccess);
    function groupsonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1){
            var data = req.data;
            var html = '';
            for (var i in req.data) {
                html += "<option value='" + data[i].group_id + "' data-purpose='" + data[i].purpose + "'>" + data[i].group_name.replace(/</g, '&lt;') + "  -->  " + (data[i].purpose == 'download'? "应用下载":"落地页" ) + "</option>"
            }
            $('#groupname').append(html);
            $("#groupname option[value = '" + GetQueryString('groupId') + "']").prop('selected', 'selected');

        }else {
            console.log('groupsonSuccess-error')
        }
    }

    $('#groupname').bind('change', function () {
        var old_purpose = purpose;
        var group_id = $(this).val();
        fetchadgroupAPI(group_id, adgrouponSuccess);
        planDetailHtml = '';
        planSelected = '';
        if(old_purpose != purpose){
            $("#directional-left-body").html('');
            groupsAndplansAPI(purpose, groupsAndplansonSuccess);
        }
    });
    function adgrouponSuccess(result){
        var req = JSON.parse(result);
        if (req.status == 1){
            purpose = req.data.purpose;
            changePlatform(req.data);
        }else {
            console.log('adgrouponSuccess-error')
        }
    }

    function changePlatform(data) {
        switch (data.purpose) {
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
                $('#platCheck').selectpicker('refresh');
                $("#plat-group").hide();
                $('#customplatCheck').selectpicker('refresh');
                break;
        }
    }
    //计费方式不可更改
    $("#bid_type").attr('disabled', 'disabled');

    var checkedArea = {};//已选地域
    var checkedchannel = {};//已选定向
    fetchadplanAPI(GetQueryString('id'), fetchadplanAPIonSuccessFun);
    function fetchadplanAPIonSuccessFun(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {

            if(req.data.class == 'c96089f7-9cff-4149-997f-bb03d617cda0')
            {
                isFixFlow = true;
                $(".keywords").css('display','none');
                $(".channelCheck").css('display','none');
            }
            var data = req.data;
            $("#planName").val(data.name);
            // $("#charging option[value=" + data.class + "]").prop('selected', 'selected');
            //投放速度
            $("#speed option[value=" + data.speed + "]").prop('selected', 'selected');

            if (data.area !== '') {
                $("#areaCheck option[value = 1]").prop('selected', 'selected');
                var area = data.area.split(',');
                for (var i = 0; i < area.length; i++) {
                    checkedArea[area[i]] = true;
                }
                $("#area-group").show();
            }
            if (data.platform !== '') {
                switch (purpose) {
                    case 'download':
                        $("#platCheck-download option[value = " + data.platform + "]").prop('selected', 'selected');
                        $("#platCheck-download option[value = " + data.platform + "]").attr('selected', 'selected');
                        $("#downloadLink").val(data.download_link);
                        $("#packageName").val(data.app_pkg);
                        if($("#platCheck-download").val() == "ios"){
                            $("#appStore").show();
                        }
                        else {
                            $("#appStore").hide();
                        }
                        $("#app-store-id").val(data.app_store_id);
                        $("#platCheck-download").attr('disabled', 'disabled');
                        break;
                    case 'landing':
                        $("#platCheck option[value = 1]").prop('selected', 'selected');
                        var platformChecked = data.platform.split(',');
                        $("#plat-group").show();
                        for (var i = 0; i < platformChecked.length; i++) {
                            $("#customplatCheck option[value=" + platformChecked[i] + "]").prop('selected', 'selected');
                        }
                        break;
                }

            }
            //媒体广告位定向选中部分
            if (data.media_slot_target.length !== 0) {
                $("#media option[value = 1]").prop('selected', 'selected');
                $("#media_ad_orientation").show();
                renderMediaAd(data.media_slot_target);
                lastmedia = data.media_slot_target; //先存储已经选中的，再去跟全部的对比
            }
            //广告行为定向选中部分
            if (data.tag_target !== '' && data.tag_target !== null) {
                $('#advertising-behavior-orientation').multiMenu('setChooseData', data.tag_target);
            }

            if (data.category_target !== '' && data.category_target !== null) {
                $('#user-interest-label').multiMenu('setChooseData', data.category_target);
            }

            if (data.network !== '') {
                $("#networkCheck option[value = 1]").prop('selected', 'selected');
                var networkChecked = data.network.split(',');
                $("#network-group").show();
                for (var i = 0; i < networkChecked.length; i++) {
                    $("#customnetwork option[value=" + networkChecked[i] + "]").prop('selected', 'selected');
                }
            }
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
            }

            if (data.channel_class !== '') {
                $("#channelCheck option[value = 1]").prop('selected', 'selected');
                var channel = data.channel_class.split(',');
                for (var i = 0; i < channel.length; i++) {
                    checkedchannel[channel[i]] = true;
                }
                $("#channel-group").show();
            }
            var nowTime = moment().format('YYYY-MM-DD');//获取当前时间
            var startTime = data.s;//修改前起始时间
            var endTime = data.e;//修改前结束时间
            var borderTime = nowTime;//可选时间边界
            if (moment(startTime).isBefore(nowTime)) //当修改前起始时间在当前时间之前，那么起始时间变更为当前时间
            {
                startTime = nowTime;
            }
            if (moment(endTime).isBefore(nowTime)) { //当修改前结束时间在当前时间之前，那么起始时间和结束时间都变更为当前时间
                startTime = nowTime;
                endTime = nowTime;
            }
            //可选择时间永远是当前时间及以后
            initdaterangepickerPlan($("#searchDate"), moment(startTime), moment(endTime), moment(borderTime));
            function initdaterangepickerPlan(dateObj, startDate, endDate, minDate) {
                dateObj.daterangepicker({
                    startDate: startDate,
                    endDate: endDate,
                    // maxDate: maxDate, //最大时间
                    minDate: minDate, //最小时间
                    // dateLimit: {
                    //     days: 365
                    // }, //起止时间的最大间隔
                    showDropdowns: true,
                    showWeekNumbers: false, //是否显示第几周
                    timePicker: false, //是否显示小时和分钟
                    timePickerIncrement: 60, //时间的增量，单位为分钟
                    timePicker12Hour: false, //是否使用12小时制来显示时间
                    opens: 'left', //日期选择框的弹出位置
                    buttonClasses: ['btn btn-default'],
                    applyClass: 'btn-small btn-primary blue',
                    cancelClass: 'btn-small',
                    linkedCalendars: false,
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
                    dateObj.val(start.format('YYYY-MM-DD') + ',' + end.format('YYYY-MM-DD'));
                });
                //第一次进入修改界面时，显示上一次选中的时间范围
                $("#searchDate").val(data.s.replace(/\-/g, '/') + '-' + data.e.replace(/\-/g,'/') );
            }

            //投放时段
            if(isAlltime(data.hour_target)){
                $("#serviceTime option[value = 0]").prop('selected', 'selected');
            }else {
                $("#serviceTime option[value = 1]").prop('selected', 'selected');
                $("#serviceTime-group").show();
            }
            initializeServiceTime(data.hour_target);//初始化投放时段

            $('#budget').val(data.budget);
            $('#bid_type option[value=' + data.bid_type + ']').prop('selected', 'selected');
            $('#price').val(data.price);
            $('#frequency').val(data.frequency);


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
                    console.log('geoAPI-error');
                }
            });

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
                    console.log('getchannelclassAPI-error');
                }
            });

        } else {
            layer.msg(req.msg);
        }
    }

    function initializeServiceTime(serveceObject) {
        notAllTime();
        for(var i in serveceObject){
            var timeselected = serveceObject[i];
            var t = i -1 ;
            for(var j = 0; j < timeselected.length; j++){
                $(".ui-schedule-time[day='" + t + "'][time='" + timeselected[j] + "']").addClass('ui-schedule-time-selected');

                // 先判断箭头
                if(!$(".ui-schedule-timehead[time='" + timeselected[j] + "']").hasClass('ui-schedule-timehead-active')){
                    var length = $(".ui-schedule-time-selected[time='" + timeselected[j] + "']").length;
                    if(length > 6){
                        $(".ui-schedule-timehead[time='" + timeselected[j] + "']").addClass('ui-schedule-timehead-active')
                    }
                }
                //再判断日期一排
                if(!$("#ctrlschedulemyScheduleGrouplineState"+ t).is(':checked')){
                    var length = $(".ui-schedule-time-selected[day='" + t + "']").length;
                    if(length == 24){
                        $("#ctrlschedulemyScheduleGrouplineState"+ t).prop('checked', true);
                    }
                }
            }
        }
    }

    // 输入校验
    var checkList = [
        {
            id: '#planName',
            validationFunc: [vaIsNotNull, vaWordNumberLimit1_25],
            msg: ['广告计划名称不能为空', '名称长度应为1-50个字符:汉字占2个字符']
        }, {
            id: '#budget',
            validationFunc: [vaIsMoneyFrom50NotNull],
            msg: ['日预算不能为空，且应为正确金额格式，可输入范围：50~9999999999.99']
        }, {
            id: '#price',
            validationFunc: [vaIsMoneyNotNull],
            msg: ['出价不能为空，且应为正确金额格式，可输入范围：0.01~9999999999.99']
        }, {
            id: '#frequency',
            validationFunc: [isNumberAndNull, isNumber1to100],
            msg: ['频次应为正确数字格式', '频次输入范围是1~100']
        }
    ];

    for (var i = 0; i < checkList.length; i++) {
        var obj = checkList[i];
        $(obj.id).bind('blur', {obj: obj}, function (event) {
            var obj = event.data.obj;
            for (var i = 0; i < obj.validationFunc.length; i++) {
                if (!obj.validationFunc[i]($(obj.id).val())) {
                    vaError($(obj.id), obj.msg[i]);
                    return false;
                } else {
                    vaSuccess($(obj.id));
                }
            }
            return true;

        });
    }
    function validatefun(obj) {
        for (var i = 0; i < obj.validationFunc.length; i++) {
            if (!obj.validationFunc[i]($(obj.id).val())) {
                $(obj.id).focus();
                layer.msg(obj.msg[i]);
                vaError($(obj.id), obj.msg[i]);
                return false;
            } else {
                vaSuccess($(obj.id));
            }
        }
        return true;
    }

    function presubmit() {//提交验证
        for (var i = 0; i < checkList.length; i++) {
            var obj = checkList[i];
            if (!validatefun(obj)) {
                return false;
            }
        }
        return true;
    }
    if (purpose == 'download') {
        $("#downloadLink").bind('blur', function () {
            if (!vaIsNotNull($(this).val()) || !vaIsUrl($(this).val())) {
                vaError($(this), '请输入正确的链接地址，以http或https开头');
                $(this).focus();
                return false;
            } else {
                vaSuccess($(this));
            }
        });
        if($("#platCheck-download").val() == "ios"){
            $("#app-store-id").bind('blur', function () {
                if (!vaIsNotNull($(this).val()) || !isNumAlpha($(this).val())) {
                    vaError($(this), 'App Store ID 应为数字或字母');
                    $(this).focus();
                    return false;
                } else {
                    vaSuccess($(this));
                }
            });
        }
        $("#packageName").bind('blur', function () {
            if (!vaIsNotNull($(this).val())) {
                vaError($(this), '应用包名称不能为空');
                $(this).focus();
                return false;
            }
            else if (!notChinese($(this).val())) {
                vaError($(this), '应用包名称不能为中文');
                $(this).focus();
                return false;
            }
            else {
                vaSuccess($(this));
            }
        });

    }


    //地域选择的显示控制
    areaCheck.change(function () {
        if (areaCheck.val() !== "0") {
            areaGroup.slideDown();
        } else {
            areaGroup.slideUp();
        }
    });
    //平台选择的显示控制
    platCheck.change(function () {
        if (platCheck.val() == "1") {//自定义
            platGroup.slideDown();
        } else if (platCheck.val() == "0") {//不限
            platGroup.slideUp();
        }
    });

    //网络选择的显示控制
    networkCheck.change(function () {
        if (networkCheck.val() == "1") {//自定义
            networkGroup.slideDown();
        } else if (networkCheck.val() == "0") {//不限
            networkGroup.slideUp();
        }
    });
    //媒体广告位定向
    $("#media").change(function () {
        if ($("#media").val() == "1") {//自定义
            $("#media_ad_orientation").slideDown();
        } else if ($("#media").val() == "0") {//不限
            $("#media_ad_orientation").slideUp();
        }
    });
    //关键词提示
    KeywordsHint.popover(
        {
            trigger: 'hover'
        }
    );
    matchHint.popover(
        {
            trigger: 'hover',
            content: ' 精确匹配：文章的关键词与用户购买的关键词拆分词后必须完全一致，才能进行推广；举例：比如用户购买了“奶油蛋糕“一个关键词，分词后为“奶油”和“蛋糕”，文章中关键词必须同时包含“奶油”和“蛋糕”才算匹配上。<br/>包含匹配:文章的关键词包含用户购买的关键词拆分词后的任一词，即可进行推广；举例：比如用户购买了“奶油蛋糕“一个关键词，分词后为“奶油”和“蛋糕”，文章中关键词包含“奶油”或“蛋糕”就算匹配上。',
            html: true
        }
    );
    //全部删除
    keyworddeleteAll.on('click', function () {
        keywordtextarea.val('');
        keywordtextarea.keyup();
    });
    denykeyworddeleteAll.on('click', function () {
        denykeywordtextarea.val('');
        denykeywordtextarea.keyup();
    });

    //频道分类定向的显示控制
    channelCheck.change(function () {
        if (channelCheck.val() == "1") {//自定义
            channelGroup.slideDown();
        } else if (channelCheck.val() == "0") {//不限
            channelGroup.slideUp();
        }
    });
// 路径导航栏 开始
    clientaccountAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            $("#companyName a").html(req.data.name);
        }
    });
    fetchadgroupAPI(GetQueryString('groupId'), function (result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            $("#adgroupName a").html(req.data.name);
        } else {
            layer.msg(req.msg);
        }
    });
    $("#adgroupName").bind('click', function () {
        window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
    });
    // 路径导航栏 结束

    //投放时段
    $("#serviceTime").on('change',function () {
        if ($("#serviceTime").val() == "1") {//自定义
            $("#serviceTime-group").slideDown();
        } else if ($("#serviceTime").val() == "0") {//不限
            $("#serviceTime-group").slideUp();
        }
    });

    //广告行为定向，获取总数据
    var dataTemp = [];

    //处理后端数据，并转换格式
    //用了最笨的方式，由于事先知道是二级菜单，所以用了两层循环来复制，因为要改变属性code 为id，数据报表中可以省略这一步
    //由于code中含有特殊字符':'，导致jQuery不之别，所以用repalce替换成'-'，在拼接下发字符串时，要记得替换回来。
    function translateFun(dataTemp, dataGroup) {
        for (var i = 0; i < dataGroup.length; i++) {
            var obj = {};
            if (dataGroup[i].name == '全部') {
                continue;
            }
            obj.id = dataGroup[i].code.replace(/:/, '-');
            obj.name = dataGroup[i].name;
            obj.row = dataGroup[i].level - 1;
            obj.child = [];
            for (var j = 0; j < dataGroup[i].child.length; j++) {
                var objChild = {};
                if (dataGroup[i].child[j].name == '全部') {
                    continue;
                }
                objChild.id =  dataGroup[i].child[j].code.replace(/:/, '-');
                objChild.name = dataGroup[i].child[j].name;
                objChild.row = dataGroup[i].child[j].level - 1;
                obj.child.push(objChild);
            }
            dataTemp.push(obj);
        }
        return dataTemp;
    }

    //投放时段下发数据前判空
    function check() {
        var flag = false;
        if($(".ui-schedule-time-selected").length == 0){
            flag = true;
        }
        return flag;
    }
    //投放时段初始化时判断是否为全天投放
    function isAlltime(data) {
        var flag = true;
        var allResultLength = JSON.stringify(allResult);
        var dataLength = JSON.stringify(data);
        if(dataLength.length != allResultLength.length){
            flag = false;
        }

        return flag;
    }
    //提交
    $(".submit").on('click', function () {
        if (!presubmit()) {
            return false;
        }
        var id = GetQueryString('id');
        var planName = $("#planName").val();


        var group_id = $("#groupname").val();
        if (group_id == undefined) {
            layer.msg('获取广告组信息失败');
            return false;
        }

        var area = [];//地域
        if (areaCheck.val() !== "0") {
            $("#area #area-areaSelected dt").each(function () {
                area.push($(this).attr('geoid'));
            });
            if (area.length == 0) {
                layer.alert("请选择投放地域");
                return false;
            } else {
                area = area.join();
            }
        } else {//不限
            area = '';
        }
        var platform = '';//平台
        var app_pkg = '';
        var download_link = '';
        var app_store_id = '';
        if (purpose == 'download') {
            if ($("#platCheck-download").val() == '') {
                layer.alert('请选择平台');
                return false;
            } else {
                if($("#packageName").val() == ''){
                    layer.alert('请配置应用包名称');
                    return false;
                }else {
                    app_pkg = $("#packageName").val();
                }
                if($("#downloadLink").val() == ''){
                    layer.alert('请配置下载链接');
                    return false;
                }else {
                    download_link = $("#downloadLink").val();
                }
                if($("#platCheck-download").val() == "ios"){
                    if($("#app-store-id").val() == ''){
                        layer.msg('请配置APP Store ID');
                        return false;
                    }else {
                        app_store_id = $("#app-store-id").val();
                    }
                }
                platform = $("#platCheck-download").val();
            }
        } else if (purpose == 'landing') {
            if (platCheck.val() == '0') {
                platform = '';
            } else if (platCheck.val() == '1') {
                if (customplatCheck.val() == null) {
                    layer.alert('自定义平台未选中，请选择');
                    return false;
                } else {
                    platform = customplatCheck.val().join(',');
                }
            }
        }

        var network = '';
        if (networkCheck.val() == "0") {//不限
            network = '';
        } else if (networkCheck.val() == "1") {//自定义
            if (customnetwork.val() == null) {
                layer.alert('自定义网络未选中，请选择');
                return false;
            } else {
                network = customnetwork.val().join(',');
            }
        }

        var key_word = [];
        //获取正向关键词
        if (isFixFlow) {
            key_word = [];
            channel_class = '';
        }
        else {
            var keyword = keywordtextarea.attr("data-keyword").split(',');
            //获取否定关键词
            var denykeyword = denykeywordtextarea.attr("data-keyword").split(',');
            //组装关键词数据格式
            for (var i = 0; i < keyword.length; i++) {
                if (keyword[i] !== '') {
                    key_word.push({
                        'word': keyword[i],
                        'target_type': '1',//target_type:1正向 2否定
                        // 'match_type': $("input[name='keywordmatch']:checked").val() //match_type：1精确匹配 2包含匹配
                        'match_type': 1
                    })
                }
            }
            for (var i = 0; i < denykeyword.length; i++) {
                if (denykeyword[i] !== '') {
                    key_word.push({
                        'word': denykeyword[i],
                        'target_type': '2',
                        // 'match_type': $("input[name='denykeywordmatch']:checked").val()
                        'match_type': 1

                    })
                }
            }
            var channel_class = [];
            if (channelCheck.val() == "0") {//不限
                channel_class = '';
            } else if (channelCheck.val() == "1") {//自定义
                $("#customchannel #customchannel-areaSelected dt").each(function () {
                    channel_class.push($(this).attr('geoid'));
                });
                if (channel_class.length == 0) {
                    layer.alert("请选择频道分类定向");
                    return false;
                } else {
                    channel_class = channel_class.join();
                }
            } else {
                channel_class = '';
            }
        }


        var serachDateVal = $("#searchDate").val().split('-');
        var s = serachDateVal[0].replace(/\//g, '-').replace(/ /g, '');
        var e = serachDateVal[1].replace(/\//g, '-').replace(/ /g, '');
        // var slot_class = $("#charging").val();

        var budget = $("#budget").val();
        var bid_type = $("#bid_type").val();
        var price = $("#price").val();
        var frequency = $("#frequency").val();
        var frequency_status = 'off';
        if(frequency){
            frequency_status = 'on';
        }
        var speed = $("#speed").val();

        var tagTarget = '';//广告行为定向
        if ($("#advertising-behavior-orientation").multiMenu('isTarget')) {
            tagTarget = $("#advertising-behavior-orientation").multiMenu('getSubmitString');
        }

        var categoryTarget = '';
        if ($("#user-interest-label").multiMenu('isTarget')) {
            categoryTarget = $("#user-interest-label").multiMenu('getSubmitString');
        }

        //媒体广告位定向
        var media_slot_target = {};
        if ($("#media").val() == "1") {
            media_slot_target = mediaAdResult();
        }


        //投放时段数据
        var hour_target = {};
        if($("#serviceTime").val() == 0){
            hour_target = allResult;
        }else {
            for(var i = 0; i < 7; i++){
                var timeSelected = [];
                for(var j = 0; j < 24; j++){
                    if($(".ui-schedule-time[day='" + i + "'][time='" + j + "']").hasClass('ui-schedule-time-selected')){
                        timeSelected.push(j);
                    }
                }
                hour_target[i+1] = timeSelected;
            }
            if( check()){
                layer.msg('投放时段不能为空');
                return false;
            }
        }

        $("#Deepleaper_loading").show();
        var btnValue = $(this).attr('btn-value');
        setTimeout(function () {
            adplansaveeditAPI(id, planName, group_id, area, platform, network, media_slot_target, key_word, channel_class, s, e, budget, bid_type, price, frequency_status, frequency, speed, tagTarget, categoryTarget, hour_target, app_pkg, download_link, app_store_id, function (result) {
                $("#Deepleaper_loading").hide();
                var req = JSON.parse(result);
                if (req.status == 1) {
                    layer.msg('广告计划修改成功');
                    if(btnValue == 'submit-back'){
                        setTimeout(function () {
                            window.location = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');//保存修改
                        }, 1000);
                    }else {
                        setTimeout(function () {
                            window.location = '/promotion/adcreativeaddview?planId=' + req.data + '&groupId=' + GetQueryString('groupId') + '&entrance=' + GetQueryString('entrance');//保存并继续添加创意
                        }, 1000);
                    }
                } else {
                    layer.msg(req.msg);
                }
            })
        }, 100);
    });

    $('#cancel').bind('click', function () {
        window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
    })
});

//关键词模态框设置按钮
$("#set_btn").bind('click', function () {
    //关键词匹配
    var keynum1 = $("#ctrl-group-keyword").attr("data-keyword");
    var array = keynum1.split(',');
    var keywordnumline = $("#ctrl-group-keyword-text-num-line");
    var numLine = "1";
    var numContainer = array[0];
    for (var j = 1; j < array.length; j++) {
        numContainer += "\n" + array[j];
    }
    for (var i = 2; i < array.length + 1; i++) {
        numLine += "<br>" + i;
    }
    keywordnumline.html(numLine);
    $("#ctrl-group-keyword").val(numContainer);
    var keywordnums = '';

    if ($("#keywordnum").attr('dl_keynum') != 0) {
        keywordnums = '（' + array.length + '）';
    }
    $("#keywordnum").html(keywordnums);

    //否定关键词匹配
    var keynum2 = $("#denyctrl-group-keyword").attr("data-keyword");
    var denyarray = keynum2.split(',');
    var denykeynumline = $("#denyctrl-group-keyword-text-num-line");
    var denynumLine = "1";
    var denynumContainer = denyarray[0];
    for (var t = 1; t < denyarray.length; t++) {
        denynumContainer += "\n" + denyarray[t];
    }
    for (var d = 2; d < denyarray.length + 1; d++) {
        denynumLine += "<br>" + d;
    }
    denykeynumline.html(denynumLine);

    $("#denyctrl-group-keyword").val(denynumContainer);
    var denykeywordnums = '';

    if ($("#denykeywordnum").attr('dl_denykeynum') != 0) {
        denykeywordnums = '（' + denyarray.length + '）';
    }
    $("#denykeywordnum").html(denykeywordnums);

});

//关键词模态框确认保存
$("#keywordSubmit").on('click', keywordSubmit);

//关键词导出
$("#keywordExport").on('click', function () {
    var id = GetQueryString('id');
    var url = '/adplan/downloadWord?plan_id=' + id +'&target_type=1';
    window.open(encodeURI(url));
});
$("#denykeywordExport").on('click', function () {
    var id = GetQueryString('id');
    var url = '/adplan/downloadWord?plan_id=' + id +'&target_type=2';
    window.open(encodeURI(url));
});


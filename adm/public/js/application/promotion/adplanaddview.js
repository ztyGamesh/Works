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

    var list_lengh = 0;
    var isShow = false;

    var entrance = GetQueryString('entrance');
    initdaterangepickerPlan($("#searchDate"), moment(), moment(), moment());
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
            // parentEl:'.layoutInner',
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
    }


    // 渲染地域
    geoAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            var data = req.data;
            var html = '';
            for (var i in data) {
                var parent = '';
                if (data[i].parent !== undefined) {
                    parent = 'parent-id=' + data[i].parent;
                }
                html += '<option value=' + i + '  ' + parent + '>' + data[i].name + '</option>'
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
                if (data[i].parent !== undefined) {
                    parent = 'parent-id=' + data[i].parent;
                }
                html += '<option value=' + i + '  ' + parent + '>' + data[i].name + '</option>'
            }
            $("#customchannel").html(html);
            regionList('customchannel');//利用多级菜单的插件实现效果
        } else {
            console.log('getchannelclassAPI-error');
        }
    });
    var hasData = true;  //用于标识当前广告形式下是否有可投放媒体
    $("#fetchmediaadtype").change(function () {
        var slot_class = $("#fetchmediaadtype").val();
        if (slot_class == 'c96089f7-9cff-4149-997f-bb03d617cda0')//是固定信息流，则隐藏CPC计费方式
        {
            $('#bid_type option[value=cpc]').css('display', 'none');
            $('#bid_type').selectpicker('refresh');
            $('.keywords').css('display', 'none');
            $('.channelCheck').css('display', 'none');
        }
        else {
            $('#bid_type option[value=cpc]').css('display', 'block');
            $('#bid_type').selectpicker('refresh');
            $('.keywords').css('display', 'block');
            $('.channelCheck').css('display', 'block');
        }
        rendering_media_orientation();
    });
    //根据广告形式的选择 渲染媒体定向数据
    rendering_media_orientation();
    function rendering_media_orientation() {
        var slot_class = $("#fetchmediaadtype").val();
        getusermediabyadtypeAPI(slot_class, getusermediabyadtypeAPIonSuccess);
        function getusermediabyadtypeAPIonSuccess(result) {
            var req = JSON.parse(result);
            var data = req.data;
            list_lengh = req.data.length; //记录媒体定向数据总数，用于在保存提交前判断当前是否为全选状态
            if (req.status == 1) {
                if (req.data.length == 0) {
                    hasData = false;
                    $('#media').html('');
                }
                else {
                    hasData = true;
                    $('#media').html('');
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].bundle_id + '">' + data[i].name + '</option>';
                    }
                    $('#media').html(html);
                }
                $('#media').selectpicker('refresh');
            } else {
                console.log('getmediabyadtypeAPI-error');
            }
        }
    }

    // 渲染媒体定向
    // fetchusermediatargetAPI(function (result) {
    //     var req = JSON.parse(result);
    //     var data = req.data;
    //     console.log('target data ', data);
    //     if (req.status == 1) {
    //         var mediatargetData = [];//临时方案，将媒体定向保存在attr中，提交时读取；当媒体定向用户可改时，去除此方案，放开修改权限
    //         if (data.length == 0) {
    //             $("#mediaWrapper").hide();
    //         } else {
    //             var html = '';
    //             for (var i = 0; i < data.length; i++) {
    //                 mediatargetData.push(data[i].media_id);
    //                 html += '<option value="' + data[i].bundle_id + '">' + data[i].name + '</option>'
    //             }
    //         }
    //         $("#media").html(html).attr('mediatargetData', mediatargetData.join(','));
    //     } else {
    //         console.log('fetchusermediatargetAPI-error');
    //     }
    // });

    // 输入校验
    var checkList = [
        {
            id: '#planName',
            validationFunc: [vaIsNotNull, vaWordNumberLimit1_25],
            msg: ['广告计划名称不能为空', '名称长度应为1-50个字符:汉字占2个字符']
        }, {
            id: '#budget',
            validationFunc: [vaIsMoneyNotNull],
            msg: ['日预算不能为空，且应为正确金额格式，可输入范围：0.01~9999999999.99']
        }, {
            id: '#price',
            validationFunc: [vaIsMoneyNotNull],
            msg: ['出价不能为空，且应为正确金额格式，可输入范围：0.01~9999999999.99']
        }, {
            id: '#frequency',
            validationFunc: [isNumberAndNull],
            msg: ['频次应为正确数字格式']
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
    var purpose = 'landing';
    //推广目的
    var group_id = GetQueryString('groupId');
    fetchadgroupAPI(group_id, function (result) {
        var req = JSON.parse(result);
        purpose = req.data.purpose;
    });
    if (purpose == 'download') {//下载 1没有不限 2android 、ios单选
        var platCheckOption = '<option value="android">android</option><option value="ios">ios</option>';
        platCheck.html(platCheckOption);
        platCheck.attr('title', '请选择一个应用下载平台');

    } else if (purpose == 'landing') {//落地页 1不限 2自定义－多选
        customplatCheck.attr('multiple');
        customplatCheck.attr('title', '落地页平台可多选');
    }
    //网络选择的显示控制
    networkCheck.change(function () {
        if (networkCheck.val() == "1") {//自定义
            networkGroup.slideDown();
        } else if (networkCheck.val() == "0") {//不限
            networkGroup.slideUp();
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
//广告行为定向
    $("#advertising-behavior-orientation").change(function () {
        if ($("#advertising-behavior-orientation").val() == "1") {//自定义
            $("#ad-behavior-group").slideDown();
        } else if ($("#advertising-behavior-orientation").val() == "0") {//不限
            $("#ad-behavior-group").slideUp();
        }
    });

    var dataTemp = [];
    //广告行为定向数据
    tagAPI(tagAPIonSuccess);
    function tagAPIonSuccess(result) {
        var req = JSON.parse(result);
        var dataGroup = req.data;
        if (req.status == 1) {
            translateFun(dataTemp, dataGroup);
            multiMenuEntry(dataTemp);
        }
        else
        {
            console.log('tagAPI-error');
        }
    }
    //处理后端数据，并转换格式
    //用了最笨的方式，由于事先知道是二级菜单，所以用了两层循环来复制，因为要改变属性code 为id，数据报表中可以省略这一步
    //由于code中含有特殊字符':'，导致jQuery不之别，所以用Repalce替换成'-'，在拼接下发字符串时，要记得替换回来。

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
    }

    $("#advertising-behavior-orientation-title").bind('click', function () {
        if (isShow) {
            $("#dl-list").hide();
            isShow = false;
        }
        else {
            $("#dl-list").show();
            isShow = true;
        }
    });

    $(".dl-affirm-btn").bind('click', function () {
        var showName = submitName(dataTemp);
        if (showName.length > 40) {
            showName = showName.substring(0,40) + '...';
        }
        if (showName != '') {
            $("#advertising-behavior-orientation-title").html(showName);
        }
        else {
            $("#advertising-behavior-orientation-title").html('自定义广告行为定向可多选');
        }
        $("#dl-list").hide();
        // $("#dl-list-box").show();
        isShow = false;
    });
    $(".dl-list-footer-cancel-btn").bind('click', function () {
        refreshMultiMenu();//刷新
        $("#advertising-behavior-orientation-title").html('自定义广告行为定向可多选');
        $("#dl-list").hide();
        isShow = false;
    });


    //提交
    $("#submit").on('click', function () {
        if (!presubmit()) {
            return false;
        }
        var planName = $("#planName").val();

        var group_id = GetQueryString('groupId');
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
        if (purpose == 'download') {
            if (platCheck.val() == '') {
                layer.alert('请选择平台');
                return false;
            } else {
                platform = platCheck.val();
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
        var slot_class = $("#fetchmediaadtype").val();
        if (slot_class == 'c96089f7-9cff-4149-997f-bb03d617cda0'){
            key_word = [];
            channel_class = '';
        }else {
            //获取正向关键词
            var keyword = keywordtextarea.attr("data-keyword").split(',');
            //获取否定关键词
            var denykeyword = denykeywordtextarea.attr("data-keyword").split(',');
            //组装关键词数据格式
            for (var i = 0; i < keyword.length; i++) {
                if (keyword[i] !== '') {
                    key_word.push({
                        'word': keyword[i],
                        'target_type': '1',//target_type:1正向 2否定
                        'match_type': $("input[name='keywordmatch']:checked").val() //match_type：1精确匹配 2包含匹配
                    })
                }
            }
            for (var i = 0; i < denykeyword.length; i++) {
                if (denykeyword[i] !== '') {
                    key_word.push({
                        'word': denykeyword[i],
                        'target_type': '2',
                        'match_type': $("input[name='denykeywordmatch']:checked").val()
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

        var tagTarget = '';//广告行为定向
        if ($("#advertising-behavior-orientation").val() == "0") {
            tagTarget = '';
        }
        else {
            tagTarget = submitStr(dataTemp);
            // var tagAll = getTagCount();
            // var checkLength = tagTarget.split(',');
            // if (checkLength.length == tagAll) {   //全选则传空
            //     tagTarget = '';
            // }
        }
        //当全部选中媒体定向时，传空给后端
        var mediaSelected = '';
        mediaSelected = $("#media").val();
        var mediaSelected_length;
        if(mediaSelected == null){
            mediaSelected_length = 0;
        }else {
            mediaSelected_length = mediaSelected.length;
        }
        if(mediaSelected_length == list_lengh)
        {
            mediaSelected = '';
        }else if (mediaSelected) {
            mediaSelected = mediaSelected.join(',');
        } else {
            mediaSelected = '';
        }

        var serachDateVal = $("#searchDate").val().split('-');
        var s = serachDateVal[0].replace(/\//g, '-').replace(/ /g, '');
        var e = serachDateVal[1].replace(/\//g, '-').replace(/ /g, '');

        var budget = $("#budget").val();
        var bid_type = $("#bid_type").val();
        var price = $("#price").val();
        var frequency = $("#frequency").val();
        var speed = $("#speed").val();
        //广告形式：动态信息流|固定信息流
        var slot_class = $("#fetchmediaadtype").val();
        //当前广告形式下若没有可投放媒体，则不允许用户进行下一步配置操作
        if (!hasData) {
            layer.msg('没有可投放媒体');
            return false;
        }
        $("#Deepleaper_loading").show();
        setTimeout(function () {
            adplansaveAPI(planName, group_id, slot_class, area, platform, network, mediaSelected, key_word, channel_class, s, e, budget, bid_type, price, frequency, speed, tagTarget, function (result) {
                // layer.closeAll();
                $("#Deepleaper_loading").hide();
                var req = JSON.parse(result);
                if (req.status == 1) {
                    layer.msg('广告计划添加成功');
                    setTimeout(function () {
                        var slot_class = $("#fetchmediaadtype").val();
                        if (slot_class == 'c96089f7-9cff-4149-997f-bb03d617cda0') {
                            window.location = '/promotion/adcreativefixedaddview?planId=' + req.data + '&groupId=' + GetQueryString('groupId') + '&entrance=' + GetQueryString('entrance');
                        }
                        else {
                            window.location = '/promotion/adcreativeaddview?planId=' + req.data + '&groupId=' + GetQueryString('groupId') + '&entrance=' + GetQueryString('entrance');
                        }
                    }, 1000);
                }
                else {
                    layer.msg(req.msg);
                }
            })
        }, 100);
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


    //取消按钮
    $('#cancel').bind('click', function () {
        window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
    })
});
//关键词模态框关闭
$("#keywordSubmit").bind('click', keywordSubmit);
function keywordSubmit() {
    var num1 = 0;
    var num2 = 0;
    if ($("#keywordnum").html() !== '') {
        num1 = $("#keywordnum").html().replace(/\（/g, '').replace(/\）/g, '');
    }
    if ($("#denykeywordnum").html() !== '') {
        num2 = $("#denykeywordnum").html().replace(/\（/g, '').replace(/\）/g, '');
    }
    $("#ctrl-group-keyword").attr('data-keyword', $("#ctrl-group-keyword").attr('data-keyword-prepare'));
    $("#denyctrl-group-keyword").attr('data-keyword', $("#denyctrl-group-keyword").attr('data-keyword-prepare'));
    $("#keywordnum").attr('dl_keynum', num1);
    $("#denykeywordnum").attr('dl_denykeynum', num2);
    $("#keywordstatus").val("已有" + num1 + "个关键词，" + num2 + "个否定关键词");
    $("#keywordModal").modal('hide');
}
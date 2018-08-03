/**
 * Created by liuchangyu on 16/12/26.
 */

//动态信息流模板名称
var templateNAME = {
    'c0bb62fe-fc21-4b0b-a5c7-d547db667032': '大图模板',
    'b2826850-b106-4cde-8a7c-d1d08dfaec7a': '视频模板',
    '7c44a357-ecd0-4c5b-80d0-db8bd5100149': '大图+文字模板',
    '4d918595-d2a1-47c7-8e4a-012f28ddd96e': '视频+文字模板',
    '7e1199fd-de4d-469f-8778-5de1268cddea': '图文模板',
    '6684515c-3b6d-40f5-969c-d137c3913aab': '组图模板',
    '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': '文字链模板',

    //oppo 固定信息流
    '903bd235-0936-4c0d-b839-fa20a94d5507': '大图+文字模板',
    'cbf602dc-3c99-41f9-9e4b-91c033bf5a90': '图文模板',
    '2c52b03e-b044-4fda-8c18-bc00ed3bd80d': '组图模板'
};
//判断当前广告形式是否为固定信息流
var isSlotFixedFeeds = true;
// var id = $("#uid_hide").val();
var fix_id =GetQueryString('uid');
isSlotFixedFeedsAPI(fix_id,isSlotFixedFeedsAPIonSuccess);
function isSlotFixedFeedsAPIonSuccess(result) {
    var req = JSON.parse(result);
    if (req.status == '1') {
        var data = req.data;
        if(data == true)
        {
            isSlotFixedFeeds = true;//固定信息流~
        }
        else {
            isSlotFixedFeeds = false;
        }
    }else{
        layer.msg(req.msg);
    }
}

if(isSlotFixedFeeds)
{
//        是固定信息流 除广告位名称外 其余所有选项disabled
    $("#channelParent").attr('disabled','disabled');
    $("#channelChild").attr('disabled','disabled');
    $(".selectpicker").attr('disabled','disabled');
    $("input[type='text']").attr('disabled','disabled');
    $("input[type='checkbox']").attr('disabled','disabled');
    $("#name").removeAttr('disabled');
    // $("input[template-ctl=" + id + "]").prop('checked', 'checked').parents('.templateBox').show();
    //当为固定信息流时，仅显示OPPO对应的三个模板
    $(".templateBox").hide();
    $("input[template-ctl=903bd235-0936-4c0d-b839-fa20a94d5507]").parents('.templateBox').show();
    $("input[template-ctl=cbf602dc-3c99-41f9-9e4b-91c033bf5a90]").parents('.templateBox').show();
    $("input[template-ctl=2c52b03e-b044-4fda-8c18-bc00ed3bd80d]").parents('.templateBox').show();

}

$(document).ready(function () {
    medialistforcurrentuserAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            var html = '';
            for (var i in req.data) {
                html += "<option value='" + i + "'>" + req.data[i] + "</option>"
            }
            $('#media').append(html);
        } else {
            console.log('medialistforcurrentuserAPI返回失败');
            layer.msg(req.msg);
        }
    });
    $('#media').bind('change', function () {
        fetchmediainfoAPI($(this).val(), fetchmediainfoAPIonSuccess);
    });
    function fetchmediainfoAPIonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            switch (req.data.type) {//type   1:应用&网页   2:网页      3:应用
                case '1':
                    $("#media_type").html('网页、应用');
                    break;
                case '2':
                    $("#media_type").html('网页');
                    break;
                case '3':
                    $("#media_type").html('应用');
                    break;
            }
        } else {
            layer.msg(req.msg);
        }
    };

    function renderSelected(obj, val) {
        $(obj).find('option[value="' + val + '"]').prop('selected', 'selected');
    }

    // 请求初始数据
    var data_uid, data_name, data_media, data_class, data_slot_channel, data_template_count = '';
    var data_template = {};//目前存在的模板
    var templateObj = {
        'c0bb62fe-fc21-4b0b-a5c7-d547db667032': {
            render: function (obj) {
                var id = 'c0bb62fe-fc21-4b0b-a5c7-d547db667032';
                renderSelected($("#" + id + " select[dl-data=scale]"), obj.pic_setting.scale);
                $("#" + id + " input[dl-data=public_price]").val(obj.public_price);
            }
        },
        'b2826850-b106-4cde-8a7c-d1d08dfaec7a': {
            render: function (obj) {
                var id = 'b2826850-b106-4cde-8a7c-d1d08dfaec7a';
                renderSelected($("#" + id + " select[dl-data=scale]"), obj.pic_setting.scale);
                $("#" + id + " input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '7c44a357-ecd0-4c5b-80d0-db8bd5100149': {
            render: function (obj) {
                var id = '7c44a357-ecd0-4c5b-80d0-db8bd5100149';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '4d918595-d2a1-47c7-8e4a-012f28ddd96e': {
            render: function (obj) {
                var id = '4d918595-d2a1-47c7-8e4a-012f28ddd96e';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '7e1199fd-de4d-469f-8778-5de1268cddea': {
            render: function (obj) {
                var id = '7e1199fd-de4d-469f-8778-5de1268cddea';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=position]"), obj.pic_setting.position);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=align]"), obj.title_setting.align);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '6684515c-3b6d-40f5-969c-d137c3913aab': {
            render: function (obj) {
                var id = '6684515c-3b6d-40f5-969c-d137c3913aab';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=number]"), obj.pic_setting.number);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': {
            render: function (obj) {
                var id = '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0';

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },

        //oppo固定信息流模板
        //大图+文字
        '903bd235-0936-4c0d-b839-fa20a94d5507': {
            render: function (obj) {
                var id = '903bd235-0936-4c0d-b839-fa20a94d5507';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=file_size]").val(obj.pic_setting.file_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=pic_size]").val(obj.pic_setting.pic_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=format]").val(obj.pic_setting.format);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=length]").val(obj.title_setting.length);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        //图文
        'cbf602dc-3c99-41f9-9e4b-91c033bf5a90': {
            render: function (obj) {
                var id = 'cbf602dc-3c99-41f9-9e4b-91c033bf5a90';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=file_size]").val(obj.pic_setting.file_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=pic_size]").val(obj.pic_setting.pic_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=format]").val(obj.pic_setting.format);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=align]"), obj.title_setting.align);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=length]").val(obj.title_setting.length);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        //组图
        '2c52b03e-b044-4fda-8c18-bc00ed3bd80d': {
            render: function (obj) {
                var id = '2c52b03e-b044-4fda-8c18-bc00ed3bd80d';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                // $("#" + id + " form[dl-set=pic_setting] input[dl-data=number]").val(obj.pic_setting.number);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=file_size]").val(obj.pic_setting.file_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=pic_size]").val(obj.pic_setting.pic_size);
                $("#" + id + " form[dl-set=pic_setting] input[dl-data=format]").val(obj.pic_setting.format);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=length]").val(obj.title_setting.length);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },

    };

    $("#class").change();
    $("#accordion .panel").hide();
    fetchslotAPI(GetQueryString('uid'), fetchNewsFeedSlotAPIonSuccess);
    function fetchNewsFeedSlotAPIonSuccess(result) {//初始化渲染
        var req = JSON.parse(result);
        if (req.status == '1') {
            data_uid = req.data.uid;
            data_name = req.data.name;
            data_media = req.data.media;
            data_class = req.data.class;
            data_slot_channel = req.data.slot_channel.split(',');
            data_template_count = req.data.template_count;
            $("#name").val(data_name);
            $("#media option[value = " + data_media + "]").prop('selected', 'selected');
            $("#class option[value = " + data_class + "]").prop('selected', 'selected');

            fetchmediainfoAPI(data_media, fetchmediainfoAPIonSuccess);
            var templates = req.data.templates;
            for (var i = 0; i < templates.length; i++) {
                if(templates[i].st_status !== 'pause'){
                    $("input[template-ctl=" + templates[i].template_class + "]").prop({
                        "checked": "checked"
                    });
                    $("#" + templates[i].template_class).show();
                }

                var obj = templates[i].setting;
                obj.public_price = templates[i].price;
                templateObj[templates[i].template_class].render(obj);
                data_template[templates[i].template_class] = templates[i].st_uid;
            }
            getchannelclassformattedAPI(function (result) {
                var req = JSON.parse(result);
                if (req.status == 1) {
                    var html = '<option value="">请选择</option>';
                    var channelObj = {};
                    var data = req.data;
                    for (var i in data) {
                        html += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
                        if (data[i].child && data[i].child.length !== 0) {
                            channelObj[data[i].id] = data[i].child;
                        }
                    }
                    $('#channelParent').html(html);
                    $('#channelParent').change(function () {
                        if ($(this).val() !== '') {
                            $("#channelChild").closest(".form-group").show();
                            var childhtml = '';
                            var childData = channelObj[$(this).val()];
                            for (var i in childData) {
                                childhtml += "<option value='" + childData[i].id + "'>" + childData[i].name + "</option>";
                            }
                            $('#channelChild').html(childhtml);
                            $('#channelChild').selectpicker('refresh');
                        } else {
                            $('#channelChild').html('');
                            $("#channelChild").closest(".form-group").hide();
                        }
                    });
                    // console.log(channelObj);
                    // console.log(data_slot_channel);
                    for (var i in channelObj) {
                        for (var j = 0; j < channelObj[i].length; j++) {
                            for (var k = 0; k < data_slot_channel.length; k++) {
                                if (channelObj[i][j].id == data_slot_channel[k]) {
                                    $('#channelParent option[value=' + i + ']').prop('selected', 'selected').change();
                                }
                            }
                        }
                    }
                    if (!(data_slot_channel.length == 1 && data_slot_channel[0] == '')) {
                        for (var k = 0; k < data_slot_channel.length; k++) {
                            $('#channelChild option[value=' + data_slot_channel[k] + ']').prop('selected', 'selected').change();
                        }
                        $('#channelChild').selectpicker('refresh');
                    }
                } else {
                    console.log('getchannelclassformattedAPI返回失败');
                    layer.msg(req.msg);
                }
            });
        } else {
            layer.msg("获取信息流广告位模板信息失败：" + req.msg);
        }
    }


    var templateTurnLeft = $(".templateTurnLeft");
    var templateTurnRight = $(".templateTurnRight");
    // 选择模板展示框每页展示数量
    var templateNo = 4;
    // 信息流选择模板展示框总页数
    var message_flow_pages = '';
    // 信息流选择模板展示框当前页
    var message_flow_page_now = 1;
    if ($(".templateBox").length <= templateNo) {
        templateTurnLeft.hide();
        templateTurnRight.hide();
    }
    templateTurnLeft.on('click', function () {
        var templateSize = $(this).next().find(".templateBox").length;
        if (templateSize <= templateNo) {
            templateTurnLeft.hide();
            templateTurnRight.hide();
            return false;
        } else {
            //pages总页数
            message_flow_pages = Math.ceil(templateSize / templateNo);
            if (message_flow_page_now == 1) {
                return false;
            } else {
                message_flow_page_now -= 1;
                var leftSize = '-' + (message_flow_page_now - 1) * 633 + 'px';
                $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
            }
        }
    });
    templateTurnRight.on('click', function () {
        var templateSize = $(this).prev().find(".templateBox").length;
        if (templateSize <= templateNo) {
            return false;
        } else {
            //pages总页数
            message_flow_pages = Math.ceil(templateSize / templateNo);
            if (message_flow_page_now == message_flow_pages) {
                return false;
            } else {
                var leftSize = '-' + message_flow_page_now * 633 + 'px';
                message_flow_page_now += 1;
                $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
            }

        }
    });
    $(".templateDemo").bind('mouseover', function () {
        this.play();
    });
    $(".templateDemo").bind('mouseout', function () {
        this.currentTime = 0;
        this.pause();
    });
    //'选择模板' relationship with '编辑模板'
    $(".templateTitle input[type=checkbox]").change(function () {
        var template_id = $(this).attr('template-ctl');
        if ($(this).prop('checked')) {
            $('#' + template_id).show();
            if(data_template[template_id]){
                updateslottemplatestatusAPI(data_template[template_id],'active',function (result) {
                    var req = JSON.parse(result);
                    if(req.status == 1){
                        layer.msg('您已启动' + templateNAME[template_id] + '的使用');
                    }
                })
            }
        } else {
            $('#' + template_id).hide();
            if(data_template[template_id]){
                updateslottemplatestatusAPI(data_template[template_id],'pause',function (result) {
                    var req = JSON.parse(result);
                    if(req.status == 1){
                        layer.msg('您已取消' + templateNAME[template_id] + '的使用');
                    }
                })
            }
        }

    });
    $("#name").bind('blur', function () {
        if (!vaIsNotNull($(this).val()) || !vaWordNumberLimit1_25($(this).val())) {
            vaError($(this), '名称长度应为1-50个字符:汉字占2个字符');
            $(this).focus();
            return false;
        } else {
            vaSuccess($(this));
        }
    });
    $("#submit").bind('click', function () {
        //        是固定信息流 确认提交时  只提交名称
        if(isSlotFixedFeeds){
            console.log('uid',fix_id);

            slotUpdateNameAPI(fix_id, $("#name").val(), slotUpdateNameAPIonSuccess);
            function slotUpdateNameAPIonSuccess(result) {
                var req = JSON.parse(result);
                if (req.status == '1') {
                    layer.msg("广告位修改成功");
                    setTimeout(function () {
                        window.location = '/media/slot';
                    }, 1000)
                } else {
                    layer.msg("广告位修改失败：" + req.msg);
                }
            }
        }else {
            var name = $("#name").val();
            if (!vaWordNumberLimit1_25(name)) {
                vaError($("#name"), '名称长度应为1-50个字符:汉字占2个字符');
                return false;
            }
            var channelChild = $("#channelChild").val();
            if (channelChild == '' || channelChild == null) {
                vaError($("#channelParent"), '请选择广告位频道分类');
                return false;
            } else {
                vaSuccess($("#channelParent"));
            }
            var dataObj = {
                "uid": data_uid,//广告位id，添加传空
                "name": $("#name").val(),//广告位名称
                "media": $("#media").val(),//媒体id
                "class": $("#class").val(),//广告位类型id
                "slot_channel": $("#channelChild").val().join(','),//频道分类
                "sell_type": "3",//暂写死
                "templates": []
            };
            var templateObj = {
                'c0bb62fe-fc21-4b0b-a5c7-d547db667032': {
                    defineTemplates: function () {//定义模板
                        var id = 'c0bb62fe-fc21-4b0b-a5c7-d547db667032';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '大图模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + "  select[dl-data=scale]").val()
                                }
                            },
                            "price": $("#" + id + " input[dl-data=public_price]").val()
                        };
                    }
                },
                'b2826850-b106-4cde-8a7c-d1d08dfaec7a': {
                    defineTemplates: function () {//定义模板
                        var id = 'b2826850-b106-4cde-8a7c-d1d08dfaec7a';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '视频模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + "  select[dl-data=scale]").val()
                                }
                            },
                            "price": $("#" + id + " input[dl-data=public_price]").val()
                        };
                    }
                },
                '7c44a357-ecd0-4c5b-80d0-db8bd5100149': {
                    defineTemplates: function () {//定义模板
                        var id = '7c44a357-ecd0-4c5b-80d0-db8bd5100149';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '大图+文字模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                    "format": ["static_pic", "dynamic_pic"]
                                },
                                "title_setting": {
                                    "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                                },
                                "description_setting": {
                                    "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                }
                            },
                            "price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        };
                    }
                },
                '4d918595-d2a1-47c7-8e4a-012f28ddd96e': {
                    defineTemplates: function () {//定义模板
                        var id = '4d918595-d2a1-47c7-8e4a-012f28ddd96e';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '视频+文字模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                    "format": ["static_pic", "dynamic_pic"]
                                },
                                "video_setting": {
                                    "format": ["mp4"]
                                },
                                "title_setting": {
                                    "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                                },
                                "description_setting": {
                                    "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                }
                            },
                            "price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        };
                    }
                },
                '6684515c-3b6d-40f5-969c-d137c3913aab': {
                    defineTemplates: function () {//定义模板
                        var id = '6684515c-3b6d-40f5-969c-d137c3913aab';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '组图模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                    'number': $("#" + id + " form[dl-set=pic_setting] select[dl-data=number]").val(),
                                    "format": ["static_pic", "dynamic_pic"]
                                },
                                "title_setting": {
                                    "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                                },
                                "description_setting": {
                                    "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                }
                            },
                            'price': $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        };
                    }
                },
                '7e1199fd-de4d-469f-8778-5de1268cddea': {
                    defineTemplates: function () {//定义模板
                        var id = '7e1199fd-de4d-469f-8778-5de1268cddea';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '图文模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "pic_setting": {
                                    "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                    'position': $("#" + id + " form[dl-set=pic_setting] select[dl-data=position]").val(),
                                    "format": ["static_pic", "dynamic_pic"]
                                },
                                "title_setting": {
                                    "align": $("#" + id + " form[dl-set=title_setting] select[dl-data=align]").val(),
                                    "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                                },
                                "description_setting": {
                                    "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                }
                            },
                            'price': $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        };
                    }
                },
                '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': {
                    defineTemplates: function () {//定义模板
                        var id = '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0';
                        return {
                            'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                            'slot': data_uid,//广告位id
                            'class': $("#class").val(),//广告位类型
                            'template': '',//固定传空
                            'template_name': '文字链模板',
                            'template_class': id,//基础模板id
                            'setting': {
                                "title_setting": {
                                    "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                    "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                    "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                    "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                                }
                            },
                            'price': $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        };
                    }
                },
                //oppo固定信息流
                // '903bd235-0936-4c0d-b839-fa20a94d5507': {
                //     defineTemplates: function () {//定义模板
                //         var id = '903bd235-0936-4c0d-b839-fa20a94d5507';
                //         return {
                //             'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                //             'slot': data_uid,//广告位id
                //             'class': $("#class").val(),//广告位类型
                //             'template': '',//固定传空
                //             'template_name': '大图+文字模板',
                //             'template_class': id,//基础模板id
                //             'setting': {
                //                 "pic_setting": {
                //                     "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                //                     "format": ["static_pic", "dynamic_pic"]
                //                 },
                //                 "title_setting": {
                //                     "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                //                 },
                //                 "description_setting": {
                //                     "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                //                 }
                //             },
                //             "price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                //         };
                //     }
                // },
                // 'cbf602dc-3c99-41f9-9e4b-91c033bf5a90': {
                //     defineTemplates: function () {//定义模板
                //         var id = 'cbf602dc-3c99-41f9-9e4b-91c033bf5a90';
                //         return {
                //             'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                //             'slot': data_uid,//广告位id
                //             'class': $("#class").val(),//广告位类型
                //             'template': '',//固定传空
                //             'template_name': '图文模板',
                //             'template_class': id,//基础模板id
                //             'setting': {
                //                 "pic_setting": {
                //                     "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                //                     'position': $("#" + id + " form[dl-set=pic_setting] select[dl-data=position]").val(),
                //                     "format": ["static_pic", "dynamic_pic"]
                //                 },
                //                 "title_setting": {
                //                     "align": $("#" + id + " form[dl-set=title_setting] select[dl-data=align]").val(),
                //                     "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                //                 },
                //                 "description_setting": {
                //                     "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                //                 }
                //             },
                //             'price': $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                //         };
                //     }
                // },
                // '2c52b03e-b044-4fda-8c18-bc00ed3bd80d': {
                //     defineTemplates: function () {//定义模板
                //         var id = '2c52b03e-b044-4fda-8c18-bc00ed3bd80d';
                //         return {
                //             'uid': data_template[id] ? data_template[id] : '',//本模板id，模板唯一，添加传空
                //             'slot': data_uid,//广告位id
                //             'class': $("#class").val(),//广告位类型
                //             'template': '',//固定传空
                //             'template_name': '组图模板',
                //             'template_class': id,//基础模板id
                //             'setting': {
                //                 "pic_setting": {
                //                     "scale": $("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                //                     'number': $("#" + id + " form[dl-set=pic_setting] select[dl-data=number]").val(),
                //                     "format": ["static_pic", "dynamic_pic"]
                //                 },
                //                 "title_setting": {
                //                     "font": $("#" + id + " form[dl-set=title_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=title_setting] select[dl-data=length]").val()
                //                 },
                //                 "description_setting": {
                //                     "font": $("#" + id + " form[dl-set=description_setting] select[dl-data=font]").val(),
                //                     "font-size": $("#" + id + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                //                     "font-color": $("#" + id + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                //                     "length": $("#" + id + " form[dl-set=description_setting]  select[dl-data=length]").val()
                //                 }
                //             },
                //             'price': $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                //         };
                //     }
                // },
            };
            var templatectl = $(".templateTitle input[type=checkbox]:checked");
            if (templatectl.length == 0) {
                layer.msg('启动模板数不能为空，请重试!');
                return false;
            }
            if ($('#channelChild').val() == null) {
                layer.msg('广告位频道分类不能为空');
                return false;
            }
            var meow = true;
            templatectl.each(function (index, element) {
                var id = $(this).attr('template-ctl');//选中模板的id
                var collapse = $("#" + id).find(".panel-collapse");
                var priceEle = $("#" + id).find("input[dl-data=public_price]");//选中模版刊例价
                var price = priceEle.val();
                if (!vaIsMoneyNotNull(price)) {
                    vaError(priceEle, '金额输入格式有误');
                    collapse.collapse('show');
                    priceEle.focus();
                    meow = false;
                    return false;
                } else {
                    for (var i in templateObj) {
                        if (i == id) {
                            dataObj.templates.push(templateObj[i].defineTemplates());
                        }
                    }
                }
            });
            if (meow) {
                feedsslotaddAPI(dataObj, feedsslotaddAPIonSuccess);
            }
            function feedsslotaddAPIonSuccess(result) {
                var req = JSON.parse(result);
                if (req.status == '1') {
                    layer.msg("广告位修改成功");
                    setTimeout(function () {
                        window.location = '/media/slot';
                    }, 1000)
                } else {
                    layer.msg("广告位修改失败：" + req.msg);
                }
            }
        }

    });
    $("#cancel").bind('click',function () {
        window.location = '/media/slot';
    });
});
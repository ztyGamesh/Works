/**
 * Created by liuchangyu on 16/12/26.
 */

//动态信息流模板名称
var templateNAME = {
    //信息流
    'c0bb62fe-fc21-4b0b-a5c7-d547db667032': '大图模板',
    'b2826850-b106-4cde-8a7c-d1d08dfaec7a': '视频模板',
    '7c44a357-ecd0-4c5b-80d0-db8bd5100149': '大图+文字模板',
    '4d918595-d2a1-47c7-8e4a-012f28ddd96e': '视频+文字模板',
    '7e1199fd-de4d-469f-8778-5de1268cddea': '图文模板',
    '6684515c-3b6d-40f5-969c-d137c3913aab': '组图模板',
    '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': '文字链模板',

    //固定信息流
    // '903bd235-0936-4c0d-b839-fa20a94d5507': '大图+文字模板',
    // 'cbf602dc-3c99-41f9-9e4b-91c033bf5a90': '图文模板',
    // '2c52b03e-b044-4fda-8c18-bc00ed3bd80d': '组图模板',

    //开屏
    '8be1afb6-8d5c-4be9-917d-5d187ae03a48': '静态开屏',
    '876de12b-5e92-41da-a4a3-2f9fa33eda33': '动态开屏',
    '7d42ec85-5533-4390-9338-84bfb0f725b5': '视频开屏',

    //横幅
    'b62e5dfa-a628-4ddc-a2ef-c43e62feb318': '横幅-纯图',
    '3fc13471-36a1-4dfc-abde-98c364e78e2e': '横幅-图文',

    //插屏
    '5e0e3da8-e3cc-4330-a409-ee7263a08711': '插屏',
};
var static_click_enable = [];
var dynamic_click_enable = [];
var video_click_enable = [];


$(document).ready(function () {


    //初始化预览栏 begin
    var templateStyleObj = {
        //广告形式:信息流
        '29076f0d-a923-47d4-bfef-2e3cf28fc099': [
            {
                tempateId: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',
                previewIds: '/video/infor_flow_img.mp4',
                CN: '大图样式'
            }, {
                tempateId: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',
                previewIds: '/video/infor_flow_video.mp4',
                CN: '视频样式'
            },
            {
                tempateId: '7c44a357-ecd0-4c5b-80d0-db8bd5100149',
                previewIds: '/video/infor_flow_imgAndChar.mp4',
                CN: '大图＋文字样式'
            },
            {
                tempateId: '4d918595-d2a1-47c7-8e4a-012f28ddd96e',
                previewIds: '/video/infor_flow_videoAndChar.mp4',
                CN: '视频＋文字样式'
            },
            {
                tempateId: '7e1199fd-de4d-469f-8778-5de1268cddea',
                previewIds: '/video/infor_flow_smallimgAndChar.mp4',
                CN: '图文样式'
            },
            {
                tempateId: '6684515c-3b6d-40f5-969c-d137c3913aab',
                previewIds: '/video/infor_flow_imgs.mp4',
                CN: '组图样式'
            },
            {
                tempateId: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',
                previewIds: '/video/infor_flow_char.mp4',
                CN: '文字链样式'
            }],
        //固定信息流
        'c96089f7-9cff-4149-997f-bb03d617cda0':[
            {
                tempateId: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032_fixed',
                previewIds: '/video/infor_flow_img.mp4',
                CN: '大图样式'
            }, {
                tempateId: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a_fixed',
                previewIds: '/video/infor_flow_video.mp4',
                CN: '视频样式'
            },
            {
                tempateId: '7c44a357-ecd0-4c5b-80d0-db8bd5100149_fixed',
                previewIds: '/video/infor_flow_imgAndChar.mp4',
                CN: '大图＋文字样式'
            },
            {
                tempateId: '4d918595-d2a1-47c7-8e4a-012f28ddd96e_fixed',
                previewIds: '/video/infor_flow_videoAndChar.mp4',
                CN: '视频＋文字样式'
            },
            {
                tempateId: '7e1199fd-de4d-469f-8778-5de1268cddea_fixed',
                previewIds: '/video/infor_flow_smallimgAndChar.mp4',
                CN: '图文样式'
            },
            {
                tempateId: '6684515c-3b6d-40f5-969c-d137c3913aab_fixed',
                previewIds: '/video/infor_flow_imgs.mp4',
                CN: '组图样式'
            },
            {
                tempateId: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0_fixed',
                previewIds: '/video/infor_flow_char.mp4',
                CN: '文字链样式'
            }
        ],
        //广告形式:开屏
        '987b7cd8-2752-4a15-bc94-6c0a2764a5c4': [
            {
                tempateId: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',
                previewIds: '/video/infor_static_tail.mp4',
                CN: '3S静图',
                previewBorder:false
            },
            {
                tempateId: '876de12b-5e92-41da-a4a3-2f9fa33eda33',
                previewIds: '/video/infor_dynamics_tail.mp4',
                CN: '5S动图',
                previewBorder:false
            },
            {
                tempateId: '7d42ec85-5533-4390-9338-84bfb0f725b5',
                previewIds: '/video/infor_video_tail.mp4',
                CN: '5S视频',
                previewBorder:false
            }
        ],
        //广告形式:横幅
        '7b62026a-23aa-4592-836a-f4ee78f7ea2e': [
            {
                tempateId: '3fc13471-36a1-4dfc-abde-98c364e78e2e',
                previewIds: '/video/infor_banner_graphic.mp4',
                CN: '图文样式'
            },
            {
                tempateId: 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',
                previewIds: '/video/infor_banner_pure_figure.mp4',
                CN: '纯图样式'
            }
        ],
        //广告形式:插屏
        '5b3e416f-d93a-4632-87de-5d4fbcc942fb': [
            {
                tempateId: '5e0e3da8-e3cc-4330-a409-ee7263a08711',
                previewIds: '/video/infor_plaque.mp4',
                CN: '纯图样式'
            }
        ]
    };
    templateInit('adForm', 'templateWrapper', templateStyleObj);
    //初始化预览栏 end

    $("#setting-detail").html(slotDetailSetting($("input[name='adForm']:checked").val()));

//媒体创建广告位是返回该媒体账户下面的媒体列表
    medialistforcurrentuserAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            var html = '';
            for (var i in req.data) {
                html += "<option value='" + i + "'>" + req.data[i] + "</option>"
            }
            $('#media').append(html);
            fetchmediainfoAPI($('#media option:first-child').val(), fetchmediainfoAPIonSuccess);
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
            switch (req.data.type+'') {//type   1:应用&网页   2:网页      3:应用
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
        } else {
            console.log('getchannelclassformattedAPI返回失败');
            layer.msg(req.msg);
        }
    });
    $("#accordion .panel").hide();
    // $("#accordion #setting-detail .panel").hide();




    //'选择模板' relationship with '编辑模板'
    $(".templateTitle input[type=checkbox]").change(function () {
        var template_id = $(this).attr('template-ctl');
        if ($(this).prop('checked')) {
            $('#' + template_id).show()
        } else {
            $('#' + template_id).hide();
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
        //行业屏蔽start-----------------
        if($('#type_shielded').prop('checked') && (submitStr(dataTemp) == '')){
            // $("#Deepleaper_loading").hide();
            vaError($('#type_shielded'), '请选择屏蔽类别');
            return false;
        }
        var tagTarget = '';
        if($('#type_shielded').prop('checked'))
        {
            tagTarget = submitStr(dataTemp);
        }

        //行业屏蔽end-------------------
        var dataObj = {
            "uid": "",//广告位id，添加传空
            "name": $("#name").val(),//广告位名称
            "media": $("#media").val(),//媒体id
            "class": $("input[name='adForm']:checked").val(),//广告位类型id，广告形式
            "slot_channel": $("#channelChild").val().join(','),//频道分类
            "sell_type": "3",//暂写死
            "templates": [], //模板样式的选择
            "black_industry":tagTarget,
        };
        var templateObj = {
            //动态信息流
            '29076f0d-a923-47d4-bfef-2e3cf28fc099':[
                {
                    'c0bb62fe-fc21-4b0b-a5c7-d547db667032': {
                        defineTemplates: function () {//定义模板
                            var id = 'c0bb62fe-fc21-4b0b-a5c7-d547db667032';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '大图模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "  select[dl-data=scale]").val()
                                    }
                                    // "public_price": $("#" + id + " input[dl-data=public_price]").val()
                                },
                            };
                        }
                    },
                    'b2826850-b106-4cde-8a7c-d1d08dfaec7a': {
                        defineTemplates: function () {//定义模板
                            var id = 'b2826850-b106-4cde-8a7c-d1d08dfaec7a';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '视频模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "  select[dl-data=scale]").val()
                                    }
                                    // "public_price": $("#" + id + " input[dl-data=public_price]").val()
                                },
                            };
                        }
                    },
                    '7c44a357-ecd0-4c5b-80d0-db8bd5100149': {
                        defineTemplates: function () {//定义模板
                            var id = '7c44a357-ecd0-4c5b-80d0-db8bd5100149';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
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
                            };
                        }
                    },
                    '4d918595-d2a1-47c7-8e4a-012f28ddd96e': {
                        defineTemplates: function () {//定义模板
                            var id = '4d918595-d2a1-47c7-8e4a-012f28ddd96e';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
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
                            };
                        }
                    },
                    '6684515c-3b6d-40f5-969c-d137c3913aab': {
                        defineTemplates: function () {//定义模板
                            var id = '6684515c-3b6d-40f5-969c-d137c3913aab';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
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
                            };
                        }
                    },
                    '7e1199fd-de4d-469f-8778-5de1268cddea': {
                        defineTemplates: function () {//定义模板
                            var id = '7e1199fd-de4d-469f-8778-5de1268cddea';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
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
                            };
                        }
                    },
                    '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': {
                        defineTemplates: function () {//定义模板
                            var id = '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
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
                            };
                        }
                    },
                },
            ],

            //固定信息流
            'c96089f7-9cff-4149-997f-bb03d617cda0': [
                {
                    'c0bb62fe-fc21-4b0b-a5c7-d547db667032_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = 'c0bb62fe-fc21-4b0b-a5c7-d547db667032';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '大图模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + "  select[dl-data=scale]").val()
                                    }
                                    // "public_price": $("#" + id + " input[dl-data=public_price]").val()
                                },
                            };
                        }
                    },
                    'b2826850-b106-4cde-8a7c-d1d08dfaec7a_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = 'b2826850-b106-4cde-8a7c-d1d08dfaec7a';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '视频模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + "  select[dl-data=scale]").val()
                                    }
                                },
                            };
                        }
                    },
                    '7c44a357-ecd0-4c5b-80d0-db8bd5100149_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = '7c44a357-ecd0-4c5b-80d0-db8bd5100149';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '大图+文字模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                        "format": ["static_pic", "dynamic_pic"]
                                    },
                                    "title_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=length]").val()
                                    },
                                    "description_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                    }
                                },
                            };
                        }
                    },
                    '4d918595-d2a1-47c7-8e4a-012f28ddd96e_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = '4d918595-d2a1-47c7-8e4a-012f28ddd96e';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '视频+文字模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                        "format": ["static_pic", "dynamic_pic"]
                                    },
                                    "video_setting": {
                                        "format": ["mp4"]
                                    },
                                    "title_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=length]").val()
                                    },
                                    "description_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                    }
                                },
                            };
                        }
                    },
                    '6684515c-3b6d-40f5-969c-d137c3913aab_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = '6684515c-3b6d-40f5-969c-d137c3913aab';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '组图模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                        'number': $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=number]").val(),
                                        "format": ["static_pic", "dynamic_pic"]
                                    },
                                    "title_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=length]").val()
                                    },
                                    "description_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                    }
                                },
                            };
                        }
                    },
                    '7e1199fd-de4d-469f-8778-5de1268cddea_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = '7e1199fd-de4d-469f-8778-5de1268cddea';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '图文模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=scale]").val(),
                                        'position': $("#" + id + "_fixed" + " form[dl-set=pic_setting] select[dl-data=position]").val(),
                                        "format": ["static_pic", "dynamic_pic"]
                                    },
                                    "title_setting": {
                                        "align": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=align]").val(),
                                        "font": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=length]").val()
                                    },
                                    "description_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=description_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=description_setting]  input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=description_setting]  select[dl-data=length]").val()
                                    }
                                },
                            };
                        }
                    },
                    '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0_fixed': {
                        defineTemplates: function () {//定义模板
                            var id = '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '文字链模板',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "title_setting": {
                                        "font": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font]").val(),
                                        "font-size": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=font-size]").val(),
                                        "font-color": $("#" + id + "_fixed" + " form[dl-set=title_setting] input[dl-data=font-color]").val(),
                                        "length": $("#" + id + "_fixed" + " form[dl-set=title_setting] select[dl-data=length]").val()
                                    }
                                },
                            };
                        }
                    },
                },
            ],

            //开屏
            '987b7cd8-2752-4a15-bc94-6c0a2764a5c4':[
                {
                    '8be1afb6-8d5c-4be9-917d-5d187ae03a48': {
                        defineTemplates: function () {//定义模板
                            var id = '8be1afb6-8d5c-4be9-917d-5d187ae03a48';
                            if(static_click_enable.length == 0) {
                                vaError($("#static_clicked"), '请配置是否可点击');
                                return false;
                            }
                            if($("#static_can_click").prop('checked')) {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '静态开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        "pic_setting": {
                                            "format": ["static_pic"],
                                            "display_time":3,
                                            "clickable":static_click_enable,
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
                                };
                            }else {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '静态开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        "pic_setting": {
                                            "format": ["static_pic"],
                                            "display_time":3,
                                            "clickable":static_click_enable,
                                        },
                                    },
                                };
                            }
                        }
                    },
                    '876de12b-5e92-41da-a4a3-2f9fa33eda33': {
                        defineTemplates: function () {//定义模板
                            var id = '876de12b-5e92-41da-a4a3-2f9fa33eda33';
                            if(dynamic_click_enable.length == 0) {
                                vaError($("#dynamic_clicked"), '请配置是否可点击');
                                return false;
                            }
                            if($("#dynamic_can_click").prop('checked')) {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '动态开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        "pic_setting": {
                                            "format": ["dynamic_pic"],
                                            "display_time":5,
                                            "clickable":dynamic_click_enable,
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
                                };
                            }else {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '动态开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        "pic_setting": {
                                            "format": ["dynamic_pic"],
                                            "display_time":5,
                                            "clickable":dynamic_click_enable,
                                        },
                                    },
                                };
                            }

                        }
                    },
                    '7d42ec85-5533-4390-9338-84bfb0f725b5': {
                        defineTemplates: function () {//定义模板
                            var id = '7d42ec85-5533-4390-9338-84bfb0f725b5';
                            if(video_click_enable.length == 0) {
                                vaError($("#video_clicked"), '请配置是否可点击');
                                return false;
                            }
                            if($("#video_can_click").prop('checked')) {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '视频开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        "video_setting":{
                                            "format": ["mp4"],
                                            "display_time":5,
                                            "clickable":video_click_enable,
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
                                };
                            }else {
                                return {
                                    'uid': '',//本模板id，模板唯一，添加传空
                                    'slot': '',//广告位id
                                    'class': $("input[name='adForm']:checked").val(),//广告位类型
                                    'template': '',//固定传空
                                    'template_name': '视频开屏',
                                    'template_class': id,//基础模板id
                                    'setting': {
                                        // "pic_setting": {
                                        //     "format": ["dynamic_pic"],
                                        // },
                                        "video_setting":{
                                            "format": ["mp4"],
                                            "display_time": 5,
                                            "clickable":video_click_enable,
                                        },

                                    },
                                };
                            }
                        }
                    },
                },
            ],

            //横幅
            '7b62026a-23aa-4592-836a-f4ee78f7ea2e':[
                {
                    'b62e5dfa-a628-4ddc-a2ef-c43e62feb318': {
                        defineTemplates: function () {//定义模板
                            var id = 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '纯图',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "  select[dl-data=scale]").val()
                                    },
                                    "display_setting":{
                                        "display_type":$("input[name=access_type]:checked").val(),
                                    },

                                },
                            };
                        }
                    },
                    '3fc13471-36a1-4dfc-abde-98c364e78e2e': {
                        defineTemplates: function () {//定义模板
                            var id = '3fc13471-36a1-4dfc-abde-98c364e78e2e';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '图文',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + "  select[dl-data=scale]").val()
                                    },
                                    "display_setting": {
                                        "display_type":$("input[name=access_type]:checked").val(),
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
                            };
                        }
                    },
                },
            ],

            //插屏
            '5b3e416f-d93a-4632-87de-5d4fbcc942fb':[
                {
                    '5e0e3da8-e3cc-4330-a409-ee7263a08711': {
                        defineTemplates: function () {//定义模板
                            var id = '5e0e3da8-e3cc-4330-a409-ee7263a08711';
                            return {
                                'uid': '',//本模板id，模板唯一，添加传空
                                'slot': '',//广告位id
                                'class': $("input[name='adForm']:checked").val(),//广告位类型
                                'template': '',//固定传空
                                'template_name': '插屏',
                                'template_class': id,//基础模板id
                                'setting': {
                                    "pic_setting": {
                                        "scale": $("#" + id + " select[dl-data=scale]").val(),
                                    },
                                },
                            };
                        }
                    },
                },
        ],

        };
        var templatectl = $(".templateTitle input[type=checkbox]:checked");
        if (templatectl.length == 0) {
            layer.msg('请至少选择一种模板！');
            return false;
        }
        if ($('#channelChild').val() == null) {
            layer.msg('广告位频道分类不能为空');
            return false;
        }
        var meow = true;
        templatectl.each(function (index, element) {
            var id = $(this).attr('template-ctl');//选中模板的id
            var adType = $("input[name='adForm']:checked").val();
            var collapse = $("#" + id).find(".panel-collapse");
            var currenForm = templateObj[adType]; //当前的广告形式
            var currenForm_template = currenForm[0]; //当前广告形式下的模板
            for (var i in currenForm_template) { //遍历当前广告形式下的模板是否有被选中的，如果有就将其加入队列中
                if (i == id) {
                    dataObj.templates.push(currenForm_template[i].defineTemplates());
                }
            }
        });

        if (meow) {
            feedsslotaddAPI(dataObj, feedsslotaddAPIonSuccess);
        }
        function feedsslotaddAPIonSuccess(result) {
            var req = JSON.parse(result);
            if (req.status == '1') {
                layer.msg("广告位添加成功");
                setTimeout(function () {
                    window.location = '/media/slot';
                }, 1000)
            } else {
                layer.msg("添加广告位失败：" + req.msg);
            }
        }
    });
    $("#cancel").bind('click', function () {
        window.location = '/media/slot';
    });

    $("input[name='adForm']").bind('change', function () {
        if($(this).val() == '7b62026a-23aa-4592-836a-f4ee78f7ea2e') {
            $("#ad_access_type").show();
        } else {
            $("#ad_access_type").hide();
        }
        var abc = slotDetailSetting($(this).val());
        $("#setting-detail").html(abc);
        $(".selectpicker").selectpicker({//初始化
            // style: 'btn-success',//显示样式
            // size: 20
        });
    });

    //行业屏蔽显示控制
    $("input[name=shield]").bind('change', function () {
        vaSuccess($(this));
        switch ($(this).val()) {
            case '0':
                $('#dl-list').hide();
                $('#marker').hide();
                break;
            case '1':
                $('#dl-list').show();
                $('#marker').show();
        }
    });
    //行业屏蔽数据
    var dataTemp = [];
    tagAPI(tagAPIonSuccess);
    function tagAPIonSuccess(result) {
        var req = JSON.parse(result);
        var dataGroup = req.data;
        var dataId = 'dl-list';
        if (req.status == 1) {
            translateFun(dataTemp, dataGroup);
            multiMenuEntry(dataTemp, dataId);
            $(".dl-list-footer").css('display', 'none');
            $(".dl-list-box").css('height','300px');
            $("#dl-list").css('height','315px');
        }
        else
        {
            console.log('tagAPI-error');
        }
    }
    function translateFun(dataTemp, dataGroup) {
        for (var i = 0; i < dataGroup.length; i++) {
            var obj = {};
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

    ifSelectedEnable_static();
    function ifSelectedEnable_static() {
        static_click_enable = [];
        var i = 0;
        if($("#static_can_click").prop('checked')){
            static_click_enable[i++] = $("#static_can_click").val();
        }
        if($("#static_not_click").prop('checked')){
            static_click_enable[i++] = $("#static_not_click").val();
        }
    }


    ifSelectedEnable_dynamic();
    function ifSelectedEnable_dynamic() {
        dynamic_click_enable = [];
        var i = 0;
        if($("#dynamic_can_click").prop('checked')){
            dynamic_click_enable[i++] = $("#dynamic_can_click").val();
        }
        if($("#dynamic_not_click").prop('checked')){
            dynamic_click_enable[i++] = $("#dynamic_not_click").val();
        }
    }


    ifSelectedEnable_video();
    function ifSelectedEnable_video() {
        video_click_enable = [];
        var i = 0;
        if($("#video_can_click").prop('checked')){
            video_click_enable[i++] = $("#video_can_click").val();
        }
        if($("#video_not_click").prop('checked')){
            video_click_enable[i++] = $("#video_not_click").val();
        }
    }

    //开屏形式下，是否可点击选项的内容显示与隐藏
    $("#setting-detail").on('change', $("input[name=static_clicked]"), function () {
        ifSelectedEnable_static();
        if($('#static_can_click').prop('checked')) {
            $("#static_tail_set").show();
        } else {
            $("#static_tail_set").hide();
        }

    });
    $("#setting-detail").on('change', $("input[name=dynamic_clicked]"), function () {
        ifSelectedEnable_dynamic();
        // vaSuccess($(this));
        if($('#dynamic_can_click').prop('checked')) {
            $("#dynamic_tail_set").show();
        } else {
            $("#dynamic_tail_set").hide();
        }

    });
    $("#setting-detail").on('change', $("input[name=video_clicked]"), function () {
        ifSelectedEnable_video();
        // vaSuccess($(this));
        if($('#video_can_click').prop('checked')) {
            $("#video_tail_set").show();
        } else {
            $("#video_tail_set").hide();
        }

    });

});
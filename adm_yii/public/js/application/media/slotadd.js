/**
 * Created by liuchangyu on 16/11/23.
 */

/**
 * 模板自定义名称
 * 信息流模板
 大图模板           infor_flow_img
 交互大图模板       infor_flow_img_intera
 视频模板           infor_flow_video
 交互视频模板        infor_flow_video_intera
 组图模板           infor_flow_imgs
 图文模板            infor_flow_imgAndchar

 * 模板uid

 377c4492-e117-4d21-bf5a-3d249f047753    视频模板
 4ad94269-ff36-48d7-8852-bdcb622f1a1e    交互式大图模板
 649592c0-7bc9-4372-a930-d2ad2b343e0b    组图模板
 7fd00961-175d-4f75-9592-932d7b62a6da    图文模板
 85352823-e777-45ff-bed1-c7adbbd00461    大图模板
 e5ad8823-64c6-47bb-ad21-a20272a8656a    交互式视频模板
 400b7843-c675-492e-b3a2-54fbd5602a20    开屏-半屏模板
 b0bad561-c370-44fe-bb25-2ed0f9a5a9d3    App标准开屏
 b0bad561-c370-44fe-bb25-2ed0f9a5a9f2    App标准Banner
 fa67b05c-a8b7-458e-a9d7-1eef77d9544b    app视频模板
 400b7843-c675-492e-b3a2-54fbd5803b41    PC-固定位模板
 400b7843-c675-492e-b3a2-44fba4103a92    PC-弹窗模板
 54f1524c-8902-4038-8af9-3dadef8f4742    web视频模板
 5db87273-fe0f-42e2-b259-abed8c9cd5fd    H5图片广告底部悬浮

 * 信息流模板
 大图模板            85352823-e777-45ff-bed1-c7adbbd00461
 交互大图模板         4ad94269-ff36-48d7-8852-bdcb622f1a1e
 视频模板            377c4492-e117-4d21-bf5a-3d249f047753
 交互视频模板         4ad94269-ff36-48d7-8852-bdcb622f1a1e
 组图模板            649592c0-7bc9-4372-a930-d2ad2b343e0b
 图文模板            7fd00961-175d-4f75-9592-932d7b62a6da


 * 模板提交格式示例
 "pic_setting":{"scale":"2_1","format":["static_pic","dynamic_pic"]},
 "title_setting":{"font":null,"font-size":"14","font-color":"red","length":"22"},
 "description_setting":{"font":null,"font-size":"14","font-color":"red","length":"22"},
 "public_price":"20000"
 */


$(document).ready(function () {

    $("#class").change();
    $("#accordion .panel").hide();
    /**
     * about'选择模板'
     * begin------
     */
    var templateTurnLeft = $(".templateTurnLeft");
    var templateTurnRight = $(".templateTurnRight");
    // 选择模板展示框每页展示数量
    var templateNo = 4;
    // 信息流选择模板展示框总页数
    var message_flow_pages = '';
    // 信息流选择模板展示框当前页
    var message_flow_page_now = 1;
    templateTurnLeft.on('click', function () {
        var templateSize = $(this).next().find(".templateBox").length;
        if (templateSize <= templateNo) {
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
    //'选择模板' relationship with '编辑模板'
    $(".templateTitle input[type=checkbox]").change(function () {
        var template_id = $(this).attr('template-ctl');
        if ($(this).prop('checked')) {
            $('#' + template_id).show()
        } else {
            $('#' + template_id).hide();
        }
    });
    /*＊
     * about'选择模板'
     * end..
     */

    //完成添加（信息流）
    $("#submit").on('click', function () {
        var lunbo = ($("input[name=sell_type]:checked").val() == 1) ? 1 : $("select[name=lunbo]").val();
        var dataObj = {
            "uid": "",//广告位id，添加传空
            "name": $("#name").val(),//广告位名称
            "media": $("#media option:selected").val(),//媒体id
            "class": $("#class option:selected").val(),//广告位类型id
            "sell_type": $("input[name=sell_type]:checked").val(),
            "lunbo": lunbo,
            "templates": []
        };
        var templateObj = {
            '85352823-e777-45ff-bed1-c7adbbd00461': {
                defineTemplates: function () {//定义模板
                    var id = '85352823-e777-45ff-bed1-c7adbbd00461';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
                        'template': '',//固定传空
                        'template_name': '大图模板',
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            },
            '4ad94269-ff36-48d7-8852-bdcb622f1a1e': {
                defineTemplates: function () {//定义模板
                    var id = '4ad94269-ff36-48d7-8852-bdcb622f1a1e';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
                        'template': '',//固定传空
                        'template_name': '交互式大图模板',
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            },
            '377c4492-e117-4d21-bf5a-3d249f047753': {
                defineTemplates: function () {//定义模板
                    var id = '377c4492-e117-4d21-bf5a-3d249f047753';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
                        'template': '',//固定传空
                        'template_name': '视频模板',
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            },
            'e5ad8823-64c6-47bb-ad21-a20272a8656a': {
                defineTemplates: function () {//定义模板
                    var id = 'e5ad8823-64c6-47bb-ad21-a20272a8656a';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
                        'template': '',//固定传空
                        'template_name': '交互式视频模板',
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            },
            '649592c0-7bc9-4372-a930-d2ad2b343e0b': {
                defineTemplates: function () {//定义模板
                    var id = '649592c0-7bc9-4372-a930-d2ad2b343e0b';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            },
            '7fd00961-175d-4f75-9592-932d7b62a6da': {
                defineTemplates: function () {//定义模板
                    var id = '7fd00961-175d-4f75-9592-932d7b62a6da';
                    return {
                        'uid': '',//本模板id，模板唯一，添加传空
                        'slot': '',//广告位id
                        'class': $("#class option:selected").val(),//广告位类型
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
                            },
                            "public_price": $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val()
                        }
                    };
                }
            }
        };
        var templatectl = $(".templateTitle input[type=checkbox]:checked");
        if (templatectl.length == 0) {
            layer.msg('请至少选择一种模板！');
            return false;
        }

        if (!vaIsNotNull($('#name').val()) || !vaWordNumberLimit1_25($('#name').val())) {
            vaError($('#name'), '名称长度应为1-50个字符:汉字占2个字符');
            $('#name').focus
            return false;
        } else {
            vaSuccess($('#name'));
        }

            var meow = true;
            templatectl.each(function (index, element) {
                var id = $(this).attr('template-ctl');//选中模板的id
                var collapse = $("#" + id).find(".panel-collapse");
                var priceEle = $("#" + id).find("input[dl-data=public_price]");//选中模版刊例价
                var price = priceEle.val();
                //验证
                if (!vaIsMoneyNotNull(price)) {
                    vaError(priceEle, '金额格式错误');
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
});
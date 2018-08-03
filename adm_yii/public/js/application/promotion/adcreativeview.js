/**
 * Created by liuchangyu on 16/11/23.
 */

/**
 * 模板提交格式示例
 */
var purpose = '';//推广目的
$(document).ready(function () {
    //初始化预览栏 begin
    var templateObj = {
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
        //广告形式:开屏
        '987b7cd8-2752-4a15-bc94-6c0a2764a5c4': [
            {
                tempateId: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',
                previewIds: '/video/infor_static_tail.mp4',
                CN: '3S静图',
                previewBorder: false
            },
            {
                tempateId: '876de12b-5e92-41da-a4a3-2f9fa33eda33',
                previewIds: '/video/infor_dynamics_tail.mp4',
                CN: '5S动图',
                previewBorder: false
            },
            {
                tempateId: '7d42ec85-5533-4390-9338-84bfb0f725b5',
                previewIds: '/video/infor_video_tail.mp4',
                CN: '5S视频',
                previewBorder: false
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
    templateInit('adForm', 'templateWrapper', templateObj);
    //初始化预览栏 end
    $("#accordion .panel").hide();
    function fetchadgroupAPIonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            $("#adgroupName").html(req.data.name);
            if (req.data.purpose == 'download') {
                purpose = "download";
                $("#link_label").html('应用下载详情页');
                $("#link").attr('placeholder', '点击广告创意到达的页面');
                $("#extend_label").html('应用下载配置');
                $("#download").show();
                $("#deeplink_div").hide();
            } else if (req.data.purpose == 'landing') {
                purpose = 'landing';
                $("#link_label").html('URL地址');
                $("#landingWrapper").show();
                $("#deeplink_div").show();
            }
        } else {
            layer.msg(req.msg);
        }
    }

    fetchcreativeAPI(GetQueryString('id'), fetchcreativeAPIonSuccessFun);
    function fetchcreativeAPIonSuccessFun(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            var data = req.data;
            fetchadgroupAPI(data.group_id, fetchadgroupAPIonSuccess);
            var id = data.template_class;
            var slot_class = data.slot_class;//获取广告形式
            $('input[type=radio][name=adForm][value=' + slot_class + ']').prop('checked', 'true');
            $("input[template-ctl=" + id + "]").prop({'checked': 'checked', 'disabled': 'disabled'});
            $('.templateBox').hide();
            $('#templateTurnLeft').hide();
            $('#templateTurnRight').hide();
            $("input[template-ctl=" + id + "]").parents('.templateBox').show();
            {//广告形式控制广告是否可点击
                var informationFlowConfig = $("#informationFlowConfig");
                var linkConfig = $("#linkConfig");
                var landing = $("#landing");
                var openScreenConfig = $("#openScreenConfig");
                switch (slot_class) {
                    case '29076f0d-a923-47d4-bfef-2e3cf28fc099'://信息流
                        informationFlowConfig.show();//显示附加创意、应用下载配置
                        linkConfig.show();//显示广告着陆页设置
                        landing.closest('.row').show();//显示第三方点击检测链接
                        openScreenConfig.hide();//隐藏开屏配置
                        break;
                    case '987b7cd8-2752-4a15-bc94-6c0a2764a5c4'://开屏
                        informationFlowConfig.hide();//隐藏附加创意、应用下载配置
                        linkConfig.hide();//隐藏广告着陆页设置
                        landing.closest('.row').hide();//隐藏第三方点击检测链接
                        openScreenConfig.show();//显示开屏配置
                        $('input[name=canClick][value=false]').prop('checked', 'checked').change();//切换开屏广告为不可点击的初始状态

                        break;
                    case '7b62026a-23aa-4592-836a-f4ee78f7ea2e'://横幅
                        informationFlowConfig.hide();//隐藏附加创意、应用下载配置
                        linkConfig.show();//显示广告着陆页设置
                        landing.closest('.row').show();//显示第三方点击检测链接
                        openScreenConfig.hide();//隐藏开屏配置
                        break;
                    case '5b3e416f-d93a-4632-87de-5d4fbcc942fb'://插屏
                        informationFlowConfig.hide();//隐藏附加创意、应用下载配置
                        linkConfig.show();//显示广告着陆页设置
                        landing.closest('.row').show();//显示第三方点击检测链接
                        openScreenConfig.hide();//隐藏开屏配置
                }
            }
            $("input[template-ctl=" + id + "]").prop('checked', 'checked').parents('.templateBox').show();
            $("#" + id).show();
            $("#" + id + " .creativeName").val(data.name);
            var material = JSON.parse(data.material);
            $("#landing").val(data.landing);
            $("#monitoring_url").val(data.monitoring_url);
            switch (slot_class) {
                case '29076f0d-a923-47d4-bfef-2e3cf28fc099'://信息流
                    if (material.pic) {
                        $("#" + id + " .demonstrate_image").attr('src', 'http://static.adm.deepleaper.com/material/' + material.pic);
                    }
                    if (material.pic_scale) {
                        $("#" + id + " .demonstrate_image").attr('src', 'http://static.adm.deepleaper.com/material/' + material.pic);
                    }
                    if (material.video) {
                        $("#" + id + " .demonstrate_video").attr('src', 'http://static.adm.deepleaper.com/material/' + material.video);
                    }

                    if (material.title) {
                        $("#" + id + " .creativeTitle").val(material.title);
                    }

                    if (material.description) {
                        $("#" + id + " .creativeDescription").val(material.description);
                    }

                    if (id == '6684515c-3b6d-40f5-969c-d137c3913aab') {
                        $("#" + id + " .demonstrate_image")[0].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic1);
                        $("#" + id + " .demonstrate_image")[1].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic2);
                        $("#" + id + " .demonstrate_image")[2].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic3);
                    }
                    $("#link").val(data.link);
                    $("#deeplink").val(data.deep_link);
                    var extend_type = data.extend_type;
                    var ad_source = data.ad_source;
                    var extend_data = data.extend_data !== '' ? JSON.parse(data.extend_data) : {};//防止新增对象字段影响旧的创意数据读取
                    if (purpose == 'landing') {
                        $("#ad_source").val(ad_source);
                        $("#extend_type option[value=" + extend_type + "]").prop('selected', 'selected');
                        switch (extend_type) {
                            case 'empty':
                                $("#extend_phone_btn_wrapper").hide();
                                $("#extend_phone_number_wrapper").hide();
                                $("#extend_form_btn_wrapper").hide();
                                $("#extend_form_url_wrapper").hide();
                                $("#landing_extend_title_wrapper").hide();
                                break;
                            case 'phone':
                                $("#extend_phone_btn_wrapper").show();
                                $("#extend_phone_number_wrapper").show();
                                $("#extend_form_btn_wrapper").hide();
                                $("#extend_form_url_wrapper").hide();
                                $("#landing_extend_title_wrapper").show();
                                $("#phone_btnName option[value=" + extend_data.button_text + "]").prop('selected', 'selected');
                                $("#phone_number").val(extend_data.phone_number);
                                $("#landing_extend_title").val(extend_data.extend_title);
                                break;
                            case 'form':
                                $("#extend_phone_btn_wrapper").hide();
                                $("#extend_phone_number_wrapper").hide();
                                $("#extend_form_btn_wrapper").show();
                                $("#extend_form_url_wrapper").show();
                                $("#landing_extend_title_wrapper").show();
                                $("#form_btnName").val(extend_data.button_text);
                                $("#form_url").val(extend_data.extend_url);
                                $("#landing_extend_title").val(extend_data.extend_title);
                                break;
                        }
                    } else if (purpose == 'download') {
                        $("#appName").val(ad_source);
                        $("#appDownloadUrl").val(extend_data.extend_url);
                        $("#download_extend_title").val(extend_data.extend_title);
                    }
                    break;
                case '987b7cd8-2752-4a15-bc94-6c0a2764a5c4'://开屏
                    var clickable = material.clickable;
                    var title = material.title;
                    var description = material.description;

                    if (clickable == 0) {
                        $("#adClickUrl").closest('.row').hide();
                        $("#adClickDetail").closest('.row').hide();
                        $("#adClickTitle").closest('.row').hide();
                        $("#landing").closest('.row').hide();//隐藏第三方点击检测链接
                    } else if (clickable == 1) {
                        $("#adClickUrl").closest('.row').show();
                        $("#adClickDetail").closest('.row').show();
                        $("#adClickTitle").closest('.row').show();
                        $('#adClickUrl').val(data.link);
                        $('#adClickTitle').val(title);
                        $('#adClickDetail').val(description);
                        $("#landing").closest('.row').show();//显示第三方点击检测链接
                    }
                    // 图片数据初始化
                    if (id == "8be1afb6-8d5c-4be9-917d-5d187ae03a48" || id == "876de12b-5e92-41da-a4a3-2f9fa33eda33") {//图片
                        var splash_pic = material.splash_pic;
                        for (var i = 0; i < splash_pic.length; i++) {
                            $("#" + id + " .demonstrate_image[pic_size=" + splash_pic[i].pic_size + "]").attr('src', 'http://static.adm.deepleaper.com/material/' + splash_pic[i].pic);
                        }
                    } else if (id == "7d42ec85-5533-4390-9338-84bfb0f725b5") {//视频
                        var splash_video = material.splash_video;
                        for (var i = 0; i < splash_video.length; i++) {
                            $("#" + id + " .demonstrate_video[video_size=" + splash_video[i].video_size + "]").attr('src', 'http://static.adm.deepleaper.com/material/' + splash_video[i].video);
                        }
                    }
                    break;
                case '7b62026a-23aa-4592-836a-f4ee78f7ea2e'://横幅
                    $("#link").val(data.link);
                    if (id == "3fc13471-36a1-4dfc-abde-98c364e78e2e") {//图文
                        $("#" + id + " .creativeTitle").val(material.title);
                        $("#" + id + " .creativeDescription").val(material.description);
                        $("#" + id + " .demonstrate_image").attr('src', 'http://static.adm.deepleaper.com/material/' + material.pic);
                        $("#" + id + " .adv_title").html(material.title);
                        $("#" + id + " .adv_detail").html(material.description);
                    } else if (id == "b62e5dfa-a628-4ddc-a2ef-c43e62feb318") {//纯图
                        $("#" + id + " .demonstrate_image").attr('src', 'http://static.adm.deepleaper.com/material/' + material.pic);
                    }
                    break;
                case '5b3e416f-d93a-4632-87de-5d4fbcc942fb'://插屏
                    $("#link").val(data.link);
                    $("#" + id + " .demonstrate_image").attr('src', 'http://static.adm.deepleaper.com/material/' + material.pic);
                    break;
            }
        } else {
            layer.msg(req.msg);
        }
    }

    $('#pass').bind('click', function () {
        var tag = labellingObj.inputCode();
        if (!tag) {
            layer.msg("标签未选择, 不能为空");
            return
        }
        adcreativeupdateauditstatusAPI(GetQueryString('id'), 'pass', '', tag, function (result) {
            var req = JSON.parse(result);
            if (req.status == 1) {
                layer.alert('审核通过成功', function () {
                    window.history.go(-1);
                });
            } else {
                layer.msg('adcreativeupdateauditstatusAPI返回错误');
            }
        });
    });
    $('#reject').bind('click', function () {
        layer.open({
            type: 1,
            content: $('#comment'),
            btn: ['确认提交'],
            yes: function (index, layero) {
                layer.close(index);
                var comment = $('#comment').val();
                $('#comment').val('');
                adcreativeupdateauditstatusAPI(GetQueryString('id'), 'reject', comment, null, function (result) {
                    var req = JSON.parse(result);
                    console.log(req);
                    if (req.status == 1) {
                        layer.alert('审核拒绝成功', function () {
                            window.history.go(-1);
                        });
                    } else {
                        layer.msg('adcreativeupdateauditstatusAPI返回错误');
                    }
                });
            },
            cancel: function () {
                $('#comment').val('');
            }
        });
    });
    $('#cancel').bind('click', function () {
        window.history.go(-1);
    })
});
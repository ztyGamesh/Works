/**
 * Created by liuchangyu on 16/11/23.
 */

/**
 * 模板提交格式示例
 */

//动态信息流模板名称
var templateNAME = {
    'c0bb62fe-fc21-4b0b-a5c7-d547db667032': '大图模板',
    'b2826850-b106-4cde-8a7c-d1d08dfaec7a': '视频模板',
    '7c44a357-ecd0-4c5b-80d0-db8bd5100149': '大图+文字模板',
    '4d918595-d2a1-47c7-8e4a-012f28ddd96e': '视频+文字模板',
    '7e1199fd-de4d-469f-8778-5de1268cddea': '图文模板',
    '6684515c-3b6d-40f5-969c-d137c3913aab': '组图模板',
    '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0': '文字链模板'
};
var purpose = '';//推广目的
$(document).ready(function () {
    $("#accordion .panel").hide();
    var audit_status = '';

    function fetchadgroupAPIonSuccess(result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            if (req.data.purpose == 'download') {
                purpose = "download";
                $("#link_label").html('应用下载详情页');
                $("#link").attr('placeholder', '点击“下载按钮”以外的区域所到达的地址');
                $("#extend_label").html('应用下载配置');
                $("#download").show();
            } else if (req.data.purpose == 'landing') {
                purpose = 'landing';
                $("#link_label").html('URL地址');
                $("#landing").show();
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
            audit_status = data.audit_status;
            if (audit_status == 'audit') {
                $("#pass").removeAttr('disabled');
                $("#reject").removeAttr('disabled');
            }
            $("input[template-ctl=" + id + "]").prop('checked', 'checked').parents('.templateBox').show();
            $("#" + id).show();

            $("#" + id + " .creativeName").val(data.name);

            var material = JSON.parse(data.material);

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
            $("#landing").val(data.landing);
            $("#monitoring_url").val(data.monitoring_url);
            var extend_type = data.extend_type;
            var ad_source = data.ad_source;
            var extend_data = JSON.parse(data.extend_data);
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
        } else {
            layer.msg(req.msg);
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
    //'选择模板' relationship with '编辑模板'
    $(".templateTitle input[type=checkbox]").change(function () {
        var template_id = $(this).attr('template-ctl');
        if ($(this).prop('checked')) {
            $('#' + template_id).show()
        } else {
            $('#' + template_id).hide();
        }
    });
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
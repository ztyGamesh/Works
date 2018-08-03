/**
 * Created by liuchangyu on 16/11/23.
 */

/**
 * 模板提交格式示例
 */

//动态信息流模板名称
var templateNAME = {
    '903bd235-0936-4c0d-b839-fa20a94d5507': '大图+文字模板',
    'cbf602dc-3c99-41f9-9e4b-91c033bf5a90': '图文模板',
    '2c52b03e-b044-4fda-8c18-bc00ed3bd80d': '组图模板',
};
var purpose = '';//推广目的
var platform = '';//计划平台
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
    function fetchadplanAPIonSuccess(result){
        var req = JSON.parse(result);
        if (req.status == 1) {
            $("#adplanName a").html(req.data.name);
            platform = req.data.platform;
            if (platform == 'ios') {
                $("#appDownloadUrl").attr('placeholder', '点击“下载按钮”区域所到达的地址，以https://itunes.apple.com开头')
            } else if (platform == 'android') {
                $("#appPackageNameWrapper").show();
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
            fetchadplanAPI(data.plan_id,fetchadplanAPIonSuccess);
            var id = data.template_class;
            audit_status = data.audit_status;
            if (audit_status == 'audit') {
                $("#pass").removeAttr('disabled');
                $("#reject").removeAttr('disabled');
            }
            $("input[template-ctl=" + id + "]").prop('checked', 'checked').parents('.templateBox').show();
            $("#" + id).show();

            //给创意名称栏 赋值
            // $("#" + id + " .creativeName").val(data.name);
            $("#" + id + " .creativeName").html(data.name);
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
                //给创意标题栏 赋值
                // $("#" + id + " .creativeTitle").val(material.title);
                $("#" + id + " .creativeTitle").html(material.title);
            }

            if (material.description) {
                //给创意描述栏 赋值
                // $("#" + id + " .creativeDescription").val(material.description);
                $("#" + id + " .creativeDescription").html(material.description);
            }

            if (id == '2c52b03e-b044-4fda-8c18-bc00ed3bd80d') {
                $("#" + id + " .demonstrate_image")[0].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic1);
                $("#" + id + " .demonstrate_image")[1].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic2);
                $("#" + id + " .demonstrate_image")[2].setAttribute('src', 'http://static.adm.deepleaper.com/material/' + material.pic3);
            }
            // $("#link").val(data.link);
               $("#link").attr("href",data.link).html(data.link);
            // $("#link").html("<a>"+data.link+"</a>");
            // $("#landing").val(data.landing);
               $("#landing").attr("href",data.landing).html(data.landing);
            // $("#monitoring_url").val(data.monitoring_url);
               $("#monitoring_url").attr("href",data.monitoring_url).html(data.landing);
            var extend_type = data.extend_type;
            var ad_source = data.ad_source;
            var extend_data = JSON.parse(data.extend_data);
            if (purpose == 'landing') {
                // $("#ad_source").val(ad_source);
                $("#ad_source").html(ad_source);
                $("#landingWrapper").show();
            } else if (purpose == 'download') {
                // $("#appName").val(ad_source);
                $("#appName").html(ad_source);
                // $("#appDownloadUrl").val(extend_data.extend_url);
                $("#appDownloadUrl").attr("href",extend_data.extend_url).html(extend_data.extend_url);
                // $("#download_extend_title").val(extend_data.extend_title);
                $("#download_extend_title").html(extend_data.extend_title);
                if (platform == 'android') {//填写android应用包名称
                    // $("#appPackageName").val(data.bundle_id);
                    $("#appPackageName").html(data.bundle_id);
                }
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
            console.log(tag);
            console.log(req);
            if (req.status == 1) {
                layer.alert('审核通过成功', function () {
                    window.history.go(-1);
                });
            } else {
                layer.msg('adcreativeupdateauditstatusAPI返回错误')
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
                        layer.msg('adcreativeupdateauditstatusAPI返回错误')
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


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


// 动态信息流模板支持的图片尺寸
var ruleArrObj = {
    'c0bb62fe-fc21-4b0b-a5c7-d547db667032': {
        name:'大图模板',
        photo:[[720,405],[800,600],[960,640],[800,100],[800,200],[900,150],[720,240],[640,100]]
    },
    'b2826850-b106-4cde-8a7c-d1d08dfaec7a': {
        name:'视频模板',
        photo:[[720,405],[800,600]],
        vedio:[[720,405],[800,600]]
    },
    '7c44a357-ecd0-4c5b-80d0-db8bd5100149': {
        name:'大图+文字模板',
        photo:[[800,600],[960,640],[600,300],[720,405]]
    },
    '4d918595-d2a1-47c7-8e4a-012f28ddd96e': {
        name:'视频+文字模板',
        photo:[[720,405],[800,600]],
        vedio:[[720,405],[800,600]]
    },
    '7e1199fd-de4d-469f-8778-5de1268cddea': {
        name:'图文模板',
        photo:[[480,320],[400,300],[400,400]]
    },
    '6684515c-3b6d-40f5-969c-d137c3913aab': {
        name:'组图模板',
        photo:[[480,320],[400,300],[400,400]],
    }
};
var purpose = '';//推广目的
var platform = '';//计划平台
$(document).ready(function () {

    for (var item in templateNAME) {
        $('#' + item + ' .creativeName').val(templateNAME[item] + generateMixed(6));
    }

    $("#accordion .panel").hide();

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
// 输入校验
    var checkList = [
        {
            id: '#link',
            validationFunc: [vaIsUrl],
            msg: ['链接地址格式错误']
        }, {
            id: '#landing',
            validationFunc: [vaIsUrlorNull],
            msg: ['链接地址格式错误']
        }, {
            id: '#monitoring_url',
            validationFunc: [vaIsUrlorNull],
            msg: ['链接地址格式错误']
        }
    ];
    // 推广目的为应用下载的专属校验
    var downloadCheckList = [
        {
            id: '#appName',
            validationFunc: [vaIsNotNull, va2_10],
            msg: ['应用名不能为空', '应用名2-10个字']
        }, {
            id: '#appDownloadUrl',
            validationFunc: [vaAppDownloadUrl],
            msg: ['地址错误']
        }, {
            id: '#download_extend_title',
            validationFunc: [vaIsNotNull, va2_12],
            msg: ['创意副标题不能为空', '创意副标题2-12个字']
        }
    ];

    // 推广目的为落地页的专属校验
    var landingCheckList = [
        {
            id: '#ad_source',
            validationFunc: [vaIsNotNull, va2_10],
            msg: ['广告来源不能为空', '广告来源2-10个字']
        }
    ];

    function vaAppDownloadUrl(url) {//立即下载超链接条件过滤
        var myreg = /^(https:\/\/itunes.apple.com){1}/;
        if (platform == 'android') {
            myreg = /^(http:\/\/|https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
        }
        return myreg.test(url);
    }

    function va2_10(str) {//广告来源2-10个字
        var wordLength = str.replace(/[^x00-xFF]/g, '**').length;
        return (wordLength >= 4 && wordLength <= 20);
    }

    function va2_12(str) {//创意副标题2-12个字
        var wordLength = str.replace(/[^x00-xFF]/g, '**').length;
        return (wordLength >= 4 && wordLength <= 24);
    }

    $('.creativeTitle').bind('blur', function () {
        var str = $(this).val().replace(/[^x00-xFF]/g, '**').length;
        if (str < 12 || str > 46) {
            vaError($(this), '标题字数错误');
        } else {
            vaSuccess($(this));
        }
    });
    $('.creativeDescription').bind('blur', function () {
        var str = $(this).val().replace(/[^x00-xFF]/g, '**').length;
        if ((str < 12 || str > 46) && (str !== 0)) {
            vaError($(this), '描述字数错误');
        } else {
            vaSuccess($(this));
        }
    });
    $('.creativeName').bind('blur', function () {
        if (!vaWordNumberLimit1_25($(this).val())) {
            vaError($(this), '名称长度应为1-50个字符:汉字占2个字符');
        } else {
            vaSuccess($(this));
        }
    });
    // 表单收集按钮名称校验
    $('#form_btnName').bind('blur', function () {
        var str = $(this).val().replace(/[^x00-xFF]/g, '**').length;
        if (str < 1 || str > 8) {
            vaError($(this), '1-8个字符，汉字占两个字符');
        } else {
            vaSuccess($(this));
        }
    });
    $('#form_url').bind('blur', function () {
        if(!vaIsUrl($(this).val())){
            vaError($(this), '表单站点地址格式错误');
        } else {
            vaSuccess($(this));
        }
    });
    $('#phone_number').bind('blur', function () {
        if (!vatelephone($(this).val())) {
            vaError($(this), '电话号码格式错误');
        } else {
            vaSuccess($(this));
        }
    });
    $('#landing_extend_title').bind('blur', function () {
        if (!vaIsNotNull($(this).val()) || !vaWordNumberLimit($(this).val(), 4, 24)) {
            vaError($(this), '附加创意标题不能为空，长度2-12个字');
        } else {
            vaSuccess($(this));
        }
    });
    for (var i = 0; i < checkList.length; i++) {
        var obj = checkList[i];
        $(obj.id).bind('blur', {obj: obj}, function (event) {
            return validatefun(event.data.obj);
        });
    }
    for (var i = 0; i < downloadCheckList.length; i++) {
        var obj = downloadCheckList[i];
        $(obj.id).bind('blur', {obj: obj}, function (event) {
            return validatefun(event.data.obj);
        });
    }
    for (var i = 0; i < landingCheckList.length; i++) {
        var obj = landingCheckList[i];
        $(obj.id).bind('blur', {obj: obj}, function (event) {
            return validatefun(event.data.obj);
        });
    }
    function validatefun(obj) {
        for (var i = 0; i < obj.validationFunc.length; i++) {
            if (!obj.validationFunc[i]($(obj.id).val())) {
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

    function downpresubmit() {//提交验证(download)
        for (var i = 0; i < downloadCheckList.length; i++) {
            var obj = downloadCheckList[i];
            if (!validatefun(obj)) {
                return false;
            }
        }
        return true;
    }

    function landingpresubmit() {//提交验证(landing)
        for (var i = 0; i < landingCheckList.length; i++) {
            var obj = landingCheckList[i];
            if (!validatefun(obj)) {
                return false;
            }
        }
        return true;
    }

    // 路径导航栏 开始
    clientaccountAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            $("#companyName a").html(req.data.name);
        }
    });
    /*判断广告组是落地页还是应用下载的API*/
    fetchadgroupAPI(GetQueryString('groupId'), function (result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            $("#adgroupName a").html(req.data.name);
            if (req.data.purpose == 'download') {
                purpose = "download";
                $("#link_label").html('应用下载详情页');
                $("#link").attr('placeholder', '点击“下载按钮”以外的区域所到达的地址');
                $("#extend_label").html('应用下载配置');
                $("#download").show();
            } else if (req.data.purpose == 'landing') {
                purpose = 'landing';
                $("#link_label").html('URL地址');
                $("#landingWrapper").show();
            }
        } else {
            layer.msg(req.msg);
        }
    });
    fetchadplanAPI(GetQueryString('planId'), function (result) {
        var req = JSON.parse(result);
        if (req.status == 1) {
            $("#adplanName a").html(req.data.name);
            platform = req.data.platform;
            if(platform == 'ios'){
                $("#appDownloadUrl").attr('placeholder','点击“下载按钮”区域所到达的地址，以https://itunes.apple.com开头')
            }

        } else {
            layer.msg(req.msg);
        }
    });
    $("#adgroupName").bind('click', function () {
        window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
    });
    $("#adplanName").bind('click', function () {
        window.location.href = '/promotion/adcreativelistview?groupId=' + GetQueryString('groupId') + '&planId=' + GetQueryString('planId');
    });
    // 路径导航栏 结束
    $("#cancel").bind('click', function () {
        window.location.href = '/promotion/adcreativelistview?planId=' + GetQueryString('planId') + '&groupId=' + GetQueryString('groupId');
    });

    $("#submit").bind('click', function () {
        if (!presubmit()) {
            return false;
        }
        var group_id = GetQueryString('groupId');
        var plan_id = GetQueryString('planId');
        var link = $("#link").val();
        var landing = $("#landing").val();
        var monitoring_url = $("#monitoring_url").val();
        var ad_source = '';//广告来源or应用名称
        var extend_type = '';//扩展信息类型
        var extend_data = {};//扩展数据
        if (purpose == 'landing') {
            if (!landingpresubmit()) {
                return false;
            }
            var landing_extend_title = $("#landing_extend_title").val();
            ad_source = $("#ad_source").val();
            extend_type = $("#extend_type").val();
            switch (extend_type) {
                case 'phone':
                    //电话拨打附加创意，检验电话号码合法性
                    var phone_number = $("#phone_number").val();
                    if (!vatelephone(phone_number)) {
                        vaError($("#phone_number"), '电话号码格式错误');
                        return false;
                    }
                    if (!vaIsNotNull(landing_extend_title) || !vaWordNumberLimit(landing_extend_title, 4, 24)) {
                        vaError($("#landing_extend_title"), '附加创意标题不能为空，长度2-12个字');
                        return false;
                    }
                    extend_data = {
                        "extend_title": landing_extend_title,
                        "button_text": $("#phone_btnName").val(),
                        "phone_number": phone_number
                    };
                    break;
                case 'form':
                    //表单收集附加创意，校验按钮名称、表单站点地址合法性
                    // Todo:
                    var form_btnName = $("#form_btnName").val();
                    if (!vaWordNumberLimit(form_btnName, 1, 8)) {
                        vaError($("#form_btnName"), '1-8个字符，汉字占两个字符');
                        return false;
                    }
                    var form_url = $("#form_url").val();
                    if (!vaIsUrl(form_url)) {
                        vaError($("#form_url"), '链接地址格式错误');
                        $("#form_url").focus();
                        return false;
                    }
                    if (!vaIsNotNull(landing_extend_title) || !vaWordNumberLimit(landing_extend_title, 4, 24)) {
                        vaError($("#landing_extend_title"), '附加创意标题不能为空，长度2-12个字');
                        return false;
                    }
                    extend_data = {
                        "extend_title": landing_extend_title,
                        "button_text": form_btnName,
                        "extend_url": form_url
                    };
                    break;
            }
        } else if (purpose == 'download') {
            if (!downpresubmit()) {
                return false;
            }
            ad_source = $("#appName").val();
            extend_type = 'download';
            extend_data = {
                "extend_title": $("#download_extend_title").val(),
                "button_text": "立即下载",
                "extend_url": $("#appDownloadUrl").val()
            }
        }


        var adcreativesaveObj = [];
        var adcreativesaveObjSun = {
            'name': '',
            'group_id': group_id,
            'plan_id': plan_id,
            'link': link,
            'template_class': '',
            'material': {},
            'landing': landing,
            'monitoring_url': monitoring_url,
            'ad_source': ad_source,
            'extend_type': extend_type,
            'extend_data': extend_data
        };

        var templatectl = $(".templateTitle input[type=checkbox]:checked");
        if (templatectl.length == 0) {
            layer.msg('请至少选择一种模板！');
            return false;
        }
        var inputfileisSucc = true;
        templatectl.each(function (index, element) {
            var id = $(this).attr('template-ctl');//选中模板的id
            var collapse = $("#" + id).find(".panel-collapse");
            var inputfile = collapse.find('input[type = file]');
            var falg = false;
            // 测试创意名称字数限制
            if (!vaWordNumberLimit1_25($("#" + id + ' .creativeName').val())) {
                vaError($("#" + id + ' .creativeName'), '名称长度应为1-50个字符:汉字占2个字符');
                $("#" + id + ' .creativeName').focus();
                inputfileisSucc = false;
                falg = true;
                return false;
            } else {
                vaSuccess($("#" + id + ' .creativeName'));
            }
            inputfile.each(function (index, element) {
                if ($(this).attr('flag') == 'false') {
                    inputfileisSucc = false;
                    layer.msg('警告：' + templateNAME[id] + '还有未上传的素材,请检查');
                    location.hash = '';
                    location.hash = id;
                    collapse.collapse('show');

                    falg = true;
                    return false;
                }
            });
            if (falg) {
                return false;
            }

            var titleTextarea = collapse.find('.creativeTitle');
            if (titleTextarea.length !== 0) {
                var str = titleTextarea.val().replace(/[^x00-xFF]/g, '**').length;
                if (str < 12 || str > 46) {
                    inputfileisSucc = false;
                    titleTextarea.focus();
                    vaError(titleTextarea, '标题字数错误');
                    return false;
                } else {
                    vaSuccess(titleTextarea);
                }
            }
            var descriptionTextarea = collapse.find('.creativeDescription');
            if (descriptionTextarea.length !== 0) {
                var str = descriptionTextarea.val().replace(/[^x00-xFF]/g, '**').length;
                if ((str < 12 || str > 46) && (str !== 0)) {
                    inputfileisSucc = false;
                    descriptionTextarea.focus();
                    vaError(descriptionTextarea, '描述字数错误');
                    return false;
                } else {
                    vaSuccess(descriptionTextarea);
                }
            }
            var adcreativesaveObjSunCopy = deepCopy(adcreativesaveObjSun);
            adcreativesaveObjSunCopy.template_class = id;


            if (id == '6684515c-3b6d-40f5-969c-d137c3913aab') {//组图模板有3张图
                adcreativesaveObjSunCopy.material.pic1 = $("#" + id + " .inputUpload_image")[0].getAttribute('flag');
                adcreativesaveObjSunCopy.material.pic2 = $("#" + id + " .inputUpload_image")[1].getAttribute('flag');
                adcreativesaveObjSunCopy.material.pic3 = $("#" + id + " .inputUpload_image")[2].getAttribute('flag');
                adcreativesaveObjSunCopy.material.pic_scale = $("#" + id + " .inputUpload_image")[0].getAttribute('pic_scale');
            } else {
                if ($('#' + id + ' .inputUpload_image').length > 0) {
                    adcreativesaveObjSunCopy.material.pic = $("#" + id + " .inputUpload_image").attr('flag');
                    adcreativesaveObjSunCopy.material.pic_scale = $("#" + id + " .inputUpload_image").attr('pic_scale');
                }
            }
            if ($('#' + id + ' .inputUpload_video').length > 0) {
                adcreativesaveObjSunCopy.material.video = $("#" + id + " .inputUpload_video").attr('flag');
            }
            adcreativesaveObjSunCopy.name = $("#" + id + ' .creativeName').val();

            if ($('#' + id + ' .creativeTitle').length > 0) {
                adcreativesaveObjSunCopy.material.title = $("#" + id + ' .creativeTitle').val();
            }

            if ($('#' + id + ' .creativeDescription').length > 0) {
                adcreativesaveObjSunCopy.material.description = $("#" + id + ' .creativeDescription').val();
            }

            adcreativesaveObj.push(adcreativesaveObjSunCopy);
        });
        if (!inputfileisSucc) {
            return false;
        }
        $("#Deepleaper_loading").show();
        adcreativesaveAPI(adcreativesaveObj, function (result) {
            var req = JSON.parse(result);
            if (req.status == 1) {
                $("#Deepleaper_loading").hide();
                layer.msg('创意添加成功');
                setTimeout(function () {
                    switch (GetQueryString('entrance')) {//从哪个列表页开始进入的新建，直到完成创意填写后再次返回到进入新建的列表页。
                        case 'group':
                            window.location = '/promotion/adgrouplistview';
                            break;
                        case 'plan':
                            window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
                            break;
                        case 'creative':
                            window.location.href = '/promotion/adcreativelistview?planId=' + GetQueryString('planId') + '&groupId=' + GetQueryString('groupId');
                    }
                }, 1000);
            } else {
                $("#Deepleaper_loading").hide();
                layer.msg(req.msg);
            }
        })


    });

    $("#extend_type").bind('change', function () {
        var extend_type = $(this).val();
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
                break;
            case 'form':
                $("#extend_phone_btn_wrapper").hide();
                $("#extend_phone_number_wrapper").hide();
                $("#extend_form_btn_wrapper").show();
                $("#extend_form_url_wrapper").show();
                $("#landing_extend_title_wrapper").show();
                break;
        }
    })
});

for (var item in templateNAME) {
    if ($('#' + item + ' .inputUpload_image').length > 0) {
        fileinput_img_init('#' + item + ' .inputUpload_image');
    }
    if ($('#' + item + ' .inputUpload_video').length > 0) {
        fileinput_video_init('#' + item + ' .inputUpload_video');
    }
}


//图片上传
function fileinput_img_init(ele) {
    $(ele).fileinput({
        language: 'zh',
        uploadUrl: '/materiel/uploadimagewithdetail',
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        maxFileSize: 100,
        showUploadedThumbs: false,
        initialPreviewShowDelete: false,
        // dropZoneEnabled: false,
        layoutTemplates: {
            actions: '<div class="file-actions">\n' +
            '    <div class="file-footer-buttons" style="display: none">\n' +
            '        {upload} {delete} {zoom} {other}' +
            '    </div>\n' +
            '    {drag}\n' +
            '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
            '    <div class="clearfix"></div>\n' +
            '</div>'
        }
    }).on("fileuploaded", function (event, data, previewId, index) {
        var response = data.response;
        console.log(previewId);
        console.log(index);
        console.log(event.currentTarget);
        // console.log(data);
        // console.log(response);
        // console.log(response);
        //添加图片尺寸校验功能
        {
            //用户的图片尺寸
            var clientMaterial = {
                height: response.data.height,
                width: response.data.width
            };
            //对用的广告创意ID
            var ruleArrId = ele.slice(1).split(".")[0].trim();

            //需要判断的规则数组
            var ruleArr;
            for(var k in ruleArrObj) {
                if (k === ruleArrId) {
                    ruleArr = ruleArrObj[k].photo;
                }
            }

            //判断用户的图片尺寸是否在规则数组中
            //如果存在，则返回上传成功信息
            //如果不在，则返回上传失败信息
            var flag = false;
            for (var i = 0; i < ruleArr.length;i++) {
                if (ruleArr[i][0] === clientMaterial.width && ruleArr[i][1] === clientMaterial.height) {
                    flag = true;
                }
            }
            if (!flag) {
                //添加错误信息的报错样式
                response.status = 0;
                response.msg = "请按支持尺寸投放";
                // $(document.querySelector(".input-group")).fileinput("clear");
                try {
                    var lenEle = $(ele).length;
                    if (lenEle == 1) {
                        //单图上传
                        $(ele).fileinput("clear").fileinput("enable");
                    } else {
                        //组图上传
                        // $($(ele)[0]).fileinput("clear").fileinput("enable");
                        // $($(ele)[1]).fileinput("clear").fileinput("enable");
                        // $($(ele)[2]).fileinput("clear").fileinput("enable");
                        $(event.currentTarget).fileinput("clear").fileinput("enable");
                    }
                } catch (e) {
                    console.log("error");
                }


            }
        }
        if (response.status == 1) {
            event.delegateTarget.setAttribute('flag', response.data.name);
            event.delegateTarget.setAttribute('pic_scale', reduction(response.data.width, response.data.height));
            //添加图片预览功能
            {
                var fatherID = $(this).closest(".panel-collapse ,.collapse ,.in").attr("id");
                var imgConfig = [
                    //先留着 以后可能会用
                    "collapse_infor_flow_img",
                    "collapse_infor_flow_imgAndChar",
                    "collapse_infor_flow_smallimgAndChar",
                    //组图需要特殊处理
                    "collapse_infor_flow_imgs",
                ];
                {
                    if (fatherID == imgConfig[3]) {
                        // var tempArr = [
                        //     //插件选中框中一个图片对应两个下标 所以赋值需要隔1
                        //     $("#"+fatherID+" .kv-file-content img")[0],
                        //     $("#"+fatherID+" .kv-file-content img")[2],
                        //     $("#"+fatherID+" .kv-file-content img")[4]
                        // ];
                        var imgObj = {};
                        Object.defineProperties(imgObj,{
                            imgLeft:{
                                set:function(newValue) {
                                    if (!newValue) {
                                        newValue = "../../../images/placeHolder.png";
                                        $("#preview"+fatherID+" .main_img img")[0].src = newValue;
                                    } else {
                                        $("#preview"+fatherID+" .main_img img")[0].src = newValue.src;
                                    }
                                }
                            },
                            imgCenter:{
                                set:function(newValue) {
                                    if (!newValue) {
                                        newValue = "../../../images/placeHolder.png";
                                        $("#preview"+fatherID+" .main_img img")[1].src = newValue;
                                    } else {
                                        $("#preview"+fatherID+" .main_img img")[1].src = newValue.src;
                                    }
                                }
                            },
                            imgRight:{
                                set:function(newValue) {
                                    if (!newValue) {
                                        newValue = "../../../images/placeHolder.png";
                                        $("#preview"+fatherID+" .main_img img")[2].src = newValue;
                                    } else {
                                        $("#preview"+fatherID+" .main_img img")[2].src = newValue.src;
                                    }
                                }
                            }
                        });

                        //图片同步功能初始化
                        imgObj.imgLeft = $("#imgsOne .file-live-thumbs>.file-preview-frame img")[0];
                        imgObj.imgCenter = $("#imgsTwo .file-live-thumbs>.file-preview-frame img")[0];
                        imgObj.imgRight = $("#imgsThree .file-live-thumbs>.file-preview-frame img")[0];
                        //图片同步功能绑定点击事件
                        document.addEventListener("click",function(e) {
                            var imgsOneDom = $("#imgsOne")[0],
                                imgsTwoDom = $("#imgsTwo")[0],
                                imgsThreeDom = $("#imgsThree")[0];

                            var imgsOneFlag = $.contains(imgsOneDom,e.target);
                            var imgsTwoFlag = $.contains(imgsTwoDom,e.target);
                            var imgsThreeFlag = $.contains(imgsThreeDom,e.target);

                            if (imgsOneFlag) {
                                if (e.target.innerHTML == "上传" || e.target.innerHTML == "×" || e.target.innerHTML == "移除") {
                                    imgObj.imgLeft = $("#imgsOne .file-live-thumbs>.file-preview-frame img")[0];
                                    // imgObj.imgCenter = $("#imgsTwo .file-live-thumbs>.file-preview-frame img")[0];
                                    // imgObj.imgRight = $("#imgsThree .file-live-thumbs>.file-preview-frame img")[0];
                                }
                            } else if (imgsTwoFlag) {
                                if (e.target.innerHTML == "上传" || e.target.innerHTML == "×" || e.target.innerHTML == "移除") {
                                    // imgObj.imgLeft = $("#imgsOne .file-live-thumbs>.file-preview-frame img")[0];
                                    imgObj.imgCenter = $("#imgsTwo .file-live-thumbs>.file-preview-frame img")[0];
                                    // imgObj.imgRight = $("#imgsThree .file-live-thumbs>.file-preview-frame img")[0];
                                }
                            } else if (imgsThreeFlag) {
                                if (e.target.innerHTML == "上传" || e.target.innerHTML == "×" || e.target.innerHTML == "移除") {
                                    // imgObj.imgLeft = $("#imgsOne .file-live-thumbs>.file-preview-frame img")[0];
                                    // imgObj.imgCenter = $("#imgsTwo .file-live-thumbs>.file-preview-frame img")[0];
                                    imgObj.imgRight = $("#imgsThree .file-live-thumbs>.file-preview-frame img")[0];
                                }
                            }


                        });
                    } else {
                        var imgObjSingle = {};
                        Object.defineProperty(imgObjSingle,"imgCenter",{
                            set:function (newValue) {
                                if (!newValue) {
                                    newValue = "../../../images/placeHolder.png";
                                    $("#preview"+fatherID+" .main_img img")[0].src = newValue;
                                } else {
                                    $("#preview"+fatherID+" .main_img img")[0].src = newValue.src;
                                }
                            }
                        });
                        imgObjSingle.imgCenter = $("#" + fatherID + " .file-live-thumbs>.file-preview-frame img")[0];
                        //图片同步功能绑定点击事件
                        document.addEventListener("click",function(e) {
                            if (e.target.innerHTML == "上传" || e.target.innerHTML == "×" || e.target.innerHTML == "移除") {
                                imgObjSingle.imgCenter = $("#" + fatherID + " .file-live-thumbs>.file-preview-frame img")[0];
                            }
                        });
                        // $("#"+fatherID+" .main_img img").attr("src",$("#"+fatherID+" .kv-file-content img").attr("src"));
                    };
                }
            }
            layer.msg('图片上传成功！');
        } else {
            event.delegateTarget.setAttribute('flag', 'false');
            event.delegateTarget.removeAttribute('pic_scale');
            var fatherIDadd = $(this).closest(".panel-collapse ,.collapse ,.in").attr("id");
            if (fatherIDadd == "collapse_infor_flow_imgs") {
                $("#preview"+fatherIDadd+" .main_img img")[0].src = "../images/smallHolder.png";
                $("#preview"+fatherIDadd+" .main_img img")[1].src = "../images/smallHolder.png";
                $("#preview"+fatherIDadd+" .main_img img")[2].src = "../images/smallHolder.png";
            } else {
                $("#preview"+fatherIDadd+" .main_img img")[0].src = "../../../images/placeHolder.png";
            }
            layer.msg('图片上传失败：' + response.msg);
        }
    }).on('fileclear', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
        event.delegateTarget.removeAttribute('pic_scale');
    }).on('change', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
        event.delegateTarget.removeAttribute('pic_scale');
    }).on('fileselect', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
        event.delegateTarget.removeAttribute('pic_scale');
    });

}
function fileinput_video_init(ele) {
    $(ele).fileinput({
        language: 'zh',
        uploadUrl: '/materiel/uploadfile',
        allowedFileExtensions: ['mp4'],
        maxFileSize: 5 * 1024,
        showUploadedThumbs: false,
        initialPreviewShowDelete: false,
        layoutTemplates: {
            actions: '<div class="file-actions">\n' +
            '    <div class="file-footer-buttons" style="display: none">\n' +
            '        {upload} {delete} {zoom} {other}' +
            '    </div>\n' +
            '    {drag}\n' +
            '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
            '    <div class="clearfix"></div>\n' +
            '</div>'
        }
    }).on("fileuploaded", function (event, data, previewId, index) {
        var response = data.response;
        if (response.status == 1) {
            event.delegateTarget.setAttribute('flag', response.data);
            layer.msg('视频上传成功！');
        } else {
            event.delegateTarget.setAttribute('flag', 'false');
            layer.msg('视频上传失败：' + response.msg);
        }
    }).on('fileclear', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
    }).on('change', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
    }).on('fileselect', function (event) {
        event.delegateTarget.setAttribute('flag', 'false');
    });

}
function reduction(m, n) {//最简约分
    var u = +m, v = +n, t = v;
    while (v != 0) {
        t = u % v;
        u = v;
        v = t;
    }
    return m / u + "_" + n / u;
}

/*实时预览功能代码*/
var halfWidthArr = [
    "collapse_infor_flow_img",
    "collapse_infor_flow_video",
    "collapse_infor_flow_imgAndChar",
    "collapse_infor_flow_videoAndChar",
    "collapse_infor_flow_smallimgAndChar",
    "collapse_infor_flow_imgs",
    "collapse_infor_flow_char"
];
function halfWidth(arr) {
    "use strict";
    var len = arr.length,
        i;
    for(i = 0; i < len; i++) {
        $("#" + arr[i]).css("position","relative").css("minHeight","610px");
        $("#" + arr[i] + ">.panel-body").css("width","60%");
        //这里是预览代码
        $("#" + arr[i] ).append("<div  id='preview"+arr[i]+"' style='position: absolute;top: 0;left: 52%;height: 602px;width:330px;overflow: hidden;'></div>");
    }
}
//将原来的广告创意样式变成页面的一半，留出空位添加预览区域
halfWidth(halfWidthArr);

//给创意添加预览功能
setTimeout(function(){
    "use strict";
    //预览模板字符串对象
    var strTemplate = {
        "collapse_infor_flow_img":
        '<div class="container" style="width: 320px;height: 590px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0px;padding-right: 0px">'
        +'<img class="img_top" src="../../../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">'
        +'<div class="main_img" style="width: 296px;height: 166px;">'
        +'<img src="../../../images/placeHolder.png" alt="" style="width:296px;height: 166px">'
        +'</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="adv_addtitle">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 2px 2px ;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 2px 0 0 0;">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../../../images/down.png" alt="">'
        +'</div>',
        "collapse_infor_flow_video":
        '<div class="container" style="width: 320px;height: 590px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0px;padding-right: 0px">'
        +'<img class="img_top" src="../../../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">'
        +'<div class="main_img" style="width: 296px;height: 166px; position: relative;background-color: #909090">'
        +'<img src="" alt="" style="width:296px;height: 166px;">'
        +'<div style="position: absolute;left: 50%;top:50%;transform: translateX(-50%) translateY(-50%);width: 65px;height: 65px;background-image: url(http://static.adm.deepleaper.com/material/play.png)">'
        +'</div>'
        +'</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="adv_addtitle">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 2px 0 0 0;">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../../../images/down.png" alt="">'
        +'</div>',
        //大图加文字模板
        "collapse_infor_flow_imgAndChar":
        '<div class="container" style="width: 320px;height: 602px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0px;padding-right: 0px">'
        +'<img class="img_top" src="../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">'
        +'<div class="adv_title" style="font-size: 14px">广告创意标题</div>'
        +'<div class="main_img" style="width: 296px;height: 166px;">'
        +'<img src="../images/placeHolder.png" alt="" style="width:296px;height: 166px">'
        +'</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="adv_addtitle" >十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 4px 0;">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../images/down.png" alt="" style="margin-top: 14px">'
        +'</div>',
        //视频 + 文字 模板
        "collapse_infor_flow_videoAndChar":
        '<div class="container" style="width: 320px;height: 602px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0px;padding-right: 0px">'
        +'<img class="img_top" src="../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">'
        +'<div class="adv_title" style="font-size: 14px">广告创意标题</div>'
        +'<div class="main_img" style="width: 296px;height: 166px;position: relative;background-color: #909090">'
        +'<img src="" alt="" style="width:296px;height: 166px">'
        +'<div style="position: absolute;left: 50%;top:50%;transform: translateX(-50%) translateY(-50%);width: 65px;height: 65px;background-image: url(http://static.adm.deepleaper.com/material/play.png)">'
        +'</div>'
        +'</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="adv_addtitle">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 4px 0;">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../images/down.png" alt="" style="margin-top: 14px">'
        +'</div>',
        "collapse_infor_flow_smallimgAndChar":
        '<div class="container" style="width: 320px;height: 450px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0;padding-right: 0;">'
        +'<img class="img_top" src="../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 100px;margin: 0 auto;">'
        +'<div class="main_img" style="width: 99px;height: 66px;float: left;">'
        +'<img src="../images/smallHolder.png" alt="" style="width:99px;height: 66px" >'
        +'</div>'
        +'<div class="main_content" style=" float: left; height: 70px;margin-left: 6px">'
        +'<div class="adv_title" style="font-size: 12px;margin-bottom: 24px">广告创意标题</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;min-width: 181px">'
        +'<span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px;">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 2px 0 ; height: 20px;overflow: hidden">'
        +'<img src="../images/close.png" style="margin: 0 0 6px 0 " alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;clear: both;background-color:#909090;color: #f6f6f6;">'
        +'<span class="adv_addtitle" style="margin: 0 0 0 6px">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #f6f6f6;border-radius: 3px;padding: 2px 6px 2px;float: right;line-height: 12px;margin: 6px 6px 0 0;">应用下载</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../images/down.png" alt="">'
        +'</div>',
        "collapse_infor_flow_imgs":
        '<div class="container" style="width: 320px;height: 520px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0;padding-right: 0;">'
        +'<img class="img_top" src="../images/top.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 160px;margin: 0 auto ;">'
        +'<div class="adv_title" style="font-size: 14px">广告创意标题</div>'
        +'<div class="main_img" style="width: 300px;height: 66px;">'
        +'<img src="../images/smallHolder.png" alt="" style="width:99px;height: 66px"><img src="../images/smallHolder.png" alt="" style="margin: 0 1px 0;width: 100px;height:66px"><img src="../images/smallHolder.png" alt=""style="width:99px;height: 66px">'
        +'</div>'
        +'<div class="main_title" style="height: 40px;line-height: 40px;font-size: 12px;">'
        +'<span class="adv_addtitle">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 2px 8px 1px;float: right;line-height: 12px;margin: 11px 0;">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left: 10px">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right; height: 30px">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../images/down.png" alt="">'
        +'</div>',
        "collapse_infor_flow_char":
        '<div class="container" style="width: 320px;height: 560px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0;padding-right: 0;">'
        +'<img class="img_top" src="../images/textTop.png" alt="">'
        +'<div class="main_area" style="width: 296px;height: 80px;margin: 0 auto;clear:both">'
        +'<div class="adv_title" style="font-size: 14px">广告创意标题</div>'
        +'<div class="main_title" style="height: 30px;line-height: 30px;font-size: 12px;background-color:#909090;color: #f6f6f6">'
        +'<span class="adv_addtitle" style="margin-left: 10px">十个字的附加创意</span>'
        +'<span class="title_button" style="border:1px solid #f6f6f6;border-radius: 3px;padding: 2px 8px 2px;float: right;line-height: 12px;margin: 5px 10px 0 0 ;clear:both">应用下载</span>'
        +'</div>'
        +'<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;overflow: hidden;">'
        +'<span class="source_button" style="border:1px solid #000;padding: 2px 2px ;border-radius: 3px;line-height: 12px">广告</span>'
        +'<span class="adv_addsource" style="margin-left:10px ">十个字的广告来源</span>'
        +'<span class="source_close" style="float:right;margin: 2px 0;clear:both;">'
        +'<img src="../images/close.png" alt="">'
        +'</span>'
        +'</div>'
        +'</div>'
        +'<img class="img_down" src="../images/textDown.png" alt="">'
        +'</div>',
    };
    //给每个创意添加预览模板字符串
    for (var k in strTemplate) {
        var kk = "preview" + k;
        document.getElementById(kk).innerHTML = strTemplate[k];
    }
    // 给每个预览模板添加双向数据绑定功能
    /*  collapse_infor_flow_img */
    var obj = {
        "advSource":null,
        "advButton":null,
        "advAddcreate":null,
        //预览中含有广告标题创意的
        "advTitle":{
            "collapse_infor_flow_imgAndChar":null,
            "collapse_infor_flow_videoAndChar":null,
            "collapse_infor_flow_smallimgAndChar":null,
            "collapse_infor_flow_imgs":null,
            "collapse_infor_flow_char":null
        },
        "advImg":{
            "collapse_infor_flow_img":null,
            "collapse_infor_flow_video":null,
            "collapse_infor_flow_imgAndChar":null,
            "collapse_infor_flow_videoAndChar":null,
            "collapse_infor_flow_smallimgAndChar":null,
            "collapse_infor_flow_imgs":null,
            "collapse_infor_flow_char":null
        }
    };
    //广告来源实时预览
    Object.defineProperty(obj,"advSource",{
        set:function(newVal) {
            for (var i = 0,len = $(".adv_addsource").length;i < len;i ++) {
                if (newVal == "") {
                    newVal = "十个字的广告来源"
                }
                $(".adv_addsource")[i].innerHTML = newVal;
            }
        }
    });
    //按钮名称实时预览
    Object.defineProperty(obj,"advButton",{
        set:function(newVal) {
            for(var i = 0,len = $(".title_button").length;i < len;i ++) {
                //按钮栏是否显示的判断依据
                var flag = $(".filter-option ,.pull-left")[0].innerHTML;
                if (flag === "无" ) {
                    if (purpose == "landing") {
                        $(".main_title").hide();
                    }
                } else {
                    $(".main_title").show();
                    $(".title_button")[i].innerHTML = newVal;
                }

            }
        }
    })
    //附加创意实时预览
    Object.defineProperty(obj,"advAddcreate",{
        set:function(newVal) {
            for (var i = 0,len = $(".adv_addtitle").length;i < len;i++) {
                if (newVal == "") {
                    newVal = "十个字的附加创意"
                }
                $(".adv_addtitle")[i].innerHTML = newVal;
            }
        }
    })
    //广告创意标题实时预览
    Object.defineProperties(obj.advTitle,{
        "collapse_infor_flow_imgAndChar": {
            set: function(newVal) {
                if (newVal == "") {
                    newVal = "广告标题创意";
                }
                $(".adv_title")[0].innerHTML = newVal;
            }
        },
        "collapse_infor_flow_videoAndChar": {
            set: function(newVal) {
                if (newVal == "") {
                    newVal = "广告标题创意";
                }
                $(".adv_title")[1].innerHTML = newVal;
            }
        },
        "collapse_infor_flow_smallimgAndChar": {
            set: function(newVal) {
                if (newVal == "") {
                    newVal = "广告标题创意";
                }
                $(".adv_title")[2].innerHTML = newVal;
            }
        },
        "collapse_infor_flow_imgs": {
            set: function(newVal) {
                if (newVal == "") {
                    newVal = "广告标题创意";
                }
                $(".adv_title")[3].innerHTML = newVal;
            }
        },
        "collapse_infor_flow_char": {
            set: function(newVal) {
                if (newVal == "") {
                    newVal = "广告标题创意";
                }
                $(".adv_title")[4].innerHTML = newVal;
            }
        },
    });
    // $("#collapse_infor_flow_imgAndChar .creativeName").on("keyup",function() {
    //     obj.advTitle.collapse_infor_flow_imgAndChar = $("#collapse_infor_flow_imgAndChar .creativeName").val();
    // })
    //广告创意图片实时预览



    //广告来源实时监听
    if (purpose == "landing") {
        document.getElementById("ad_source").addEventListener("keyup",function(e) {
            obj.advSource = e.target.value;
        })
    } else if (purpose == "download") {
        document.getElementById("appName").addEventListener("keyup",function(e) {
            obj.advSource = e.target.value;
        })
    }
    //按钮名称实时监听 电话拨打
    document.addEventListener("change",function(e) {
        // $("#extend_form_btn_wrapper .col-md-7 input").val("表单收集");
        var flag = $(".filter-option ,.pull-left")[0].innerHTML;
        if (flag == "表单收集") {
            $(".filter-option ,.pull-left")[1].innerHTML = "表单收集";
        } else {
            if ($(".filter-option ,.pull-left")[1].innerHTML == "表单收集") {
                $(".filter-option ,.pull-left")[1].innerHTML = "咨询热线";
            }
        }
        obj.advButton = $(".filter-option ,.pull-left")[1].innerHTML;
    })
    //按钮名称实时监听 表单收集

    $("#extend_form_btn_wrapper .col-md-7 input")[0].addEventListener("keyup",function(){
        obj.advButton = $("#extend_form_btn_wrapper .col-md-7 input").val() || "表单收集";
    })

    //附加创意实时监听
    if (purpose == "landing") {
        document.getElementById("landing_extend_title").addEventListener("keyup",function(e) {
            obj.advAddcreate = e.target.value;
        })
    } else if (purpose == "download") {
        document.getElementById("download_extend_title").addEventListener("keyup",function(e) {
            obj.advAddcreate = e.target.value;
        })
    }

    //广告创意标题实时监听
    for (var advTitle in obj.advTitle) {
        (function(advTitle){
            $("#"+advTitle+" .creativeTitle").on("keyup",function() {
                obj.advTitle[advTitle] = $("#"+advTitle+" .creativeTitle").val();
            })
        })(advTitle)
    }
    //广告创意图片实时监听
},1000);


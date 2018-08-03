$(document).ready(function () {
    /** 初始化dom，开始 **/

    /* 初始化广告形式和模板 **/
    http_post_data('/adplan/creativeFormats', 'get', {id: GetQueryString('planId')}, function(res){
        console.log(res);
        if(1 === res.status){
            var data = res.data;
            fetchcreativeAPI(GetQueryString('id'), function(result){
                var res = JSON.parse(result);
                if (res.status == 1) {
                    var d = res.data;
                    d.extend_data = d.extend_data ? JSON.parse(d.extend_data) : {};
                    console.log(d);
                    initModifyTemplateData(data, d, function(modifyOldData){
                        //判断广告组是落地页还是应用下载的API
                        getPur_plat(GetQueryString('groupId'), d);
                        $('#dom-ad-create-edit .adv_title').html(modifyOldData.material.title || '');
                        $('#dom-ad-create-edit .adv_detail').html(modifyOldData.material.description || '');
                        for(var i = 0; i < 4; i++){
                            $('#dom-ad-create-edit .main_img img.pic' + i).attr('src', '//static.adm.deepleaper.com/material/' + modifyOldData.material['pic' + (i || '')]);
                        }
                    });
                } else {
                    layer.msg(res.msg);
                }
            });
        }else{
            layer.msg(res.msg);
        }
    });

    clientaccountAPI(function (result) {
        var req = JSON.parse(result);
        if (req.status == 1 && req.data != null) {
            $("#companyName").html(req.data.name);
        }
    });

    /* 计划名称 **/
    fetchadplanAPI(GetQueryString('planId'), function (result) {
        var req = JSON.parse(result);
        console.log(req);
        if (req.status == 1) {
            $("#adplanName a").html(req.data.name);
            platform = req.data.platform;
            // if (platform == 'ios') {
            //     $("#appDownloadUrl").attr('placeholder', '点击“下载按钮”区域所到达的地址，以https://itunes.apple.com开头')
            // }
        } else {
            layer.msg(req.msg);
        }
    });

    //判断广告组是落地页还是应用下载的API
    function getPur_plat(groupId, d){
        fetchadgroupAPI(groupId, function (result) {
            var req = JSON.parse(result);
            console.log(req)
            if (req.status == 1) {
                $("#adgroupName a").html(req.data.name);
                if (req.data.purpose == 'download') {
                    purpose = "download";
                    $("#link_label").html('应用下载详情页');
                    $("#link").attr('placeholder', '点击广告创意到达的页面');
                    $("#deeplink_div").hide();
                    $("#extend_label").html('应用下载配置');
                    $("#download").show();
                    $("#landingWrapper").hide();
                    $('[data-preview="appName"]').prev().html('应用下载');
                    fetchadplanAPI(GetQueryString('planId'), function (result) {
                        var req = JSON.parse(result);
                        if (req.status == 1) {
                            $("#adplanName a").html(req.data.name);
                            platform = req.data.platform;
                            // if (platform == 'ios') {
                            //     $("#appDownloadUrl").attr('placeholder', '点击“下载按钮”区域所到达的地址，以https://itunes.apple.com开头')
                            // }
                        } else {
                            layer.msg(req.msg);
                        }
                    });
                } else if (req.data.purpose == 'landing') {
                    purpose = 'landing';
                    $("#link_label").html('URL地址');
                    $("#landingWrapper").show();
                    $("#deeplink_div").show();
                    $("#download").hide();
                    $('[data-preview="ad_source"]').prev().html('广告');
                }
                $('[data-preview="ad_source-' + purpose + '"]').addClass('active');
                //数据填充
                $('#extend_type').selectpicker('val', d.extend_type);
                $('#link').val(d.link);
                $("#deeplink").val(d.deep_link);
                $('#monitoring_url').val(d.monitoring_url);
                $('#landing').val(d.landing);
                var extend_type;
                if('landing' === purpose){
                    extend_type = $("#extend_type").val();//附加创意类型
                    $('#ad_source').val(d.ad_source);
                }else if('download' === purpose){
                    extend_type = 'download';//附加创意类型
                    $('#appName').val(d.ad_source);
                }
                changeExtend(extend_type);
                switch (extend_type) {
                    case 'empty':
                        break;
                    case 'phone':
                        $('#phone_btnName').selectpicker('val', d.extend_data.button_text);
                        $('#phone_number').val(d.extend_data.phone_number);
                        $('#landing_extend_title').val(d.extend_data.extend_title);
                        break;
                    case 'form':
                        $('#form_btnName').val(d.extend_data.button_text);
                        $('#form_url').val(d.extend_data.extend_url);
                        $('#landing_extend_title').val(d.extend_data.extend_title);
                        break;
                    case 'download':
                        $('#download_extend_title').val(d.extend_data.extend_title);
                        break;
                }
                //预览
                if('landing' === purpose){
                    $('#dom-ad-create-edit .adv_addsource').html($('#ad_source').val());//广告来源
                }else if('download' === purpose){
                    $('#dom-ad-create-edit .adv_addsource').html($('#appName').val());//应用名
                }
                switch (extend_type) {
                    case 'empty':
                        $('#dom-ad-create-edit .main_title').css('display', 'none');
                        break;
                    case 'phone':
                        $('#dom-ad-create-edit .main_title').css('display', 'block');
                        $('#dom-ad-create-edit .title_button').html($('#phone_btnName').val());
                        $('#dom-ad-create-edit .adv_addtitle').html($('#landing_extend_title').val());
                        break;
                    case 'form':
                        $('#dom-ad-create-edit .main_title').css('display', 'block');
                        $('#dom-ad-create-edit .title_button').html($('#form_btnName').val() || '表单收集');
                        $('#dom-ad-create-edit .adv_addtitle').html($('#landing_extend_title').val());
                        break;
                    case 'download':
                        $('#dom-ad-create-edit .main_title').css('display', 'block');
                        $('#dom-ad-create-edit .title_button').html('应用下载');
                        $('#dom-ad-create-edit .adv_addtitle').html($('#download_extend_title').val());
                        break;
                }
            } else {
                layer.msg(req.msg);
            }
        });
    }
    
    /** 初始化dom，结束 **/

    /** 功能操作，开始 **/

    /* 返回操作 **/
    // 编辑内容初始化 结束
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

    /* 附加创意选择 **/
    function changeExtend(extend_type){
        switch (extend_type) {
            case 'empty':
                $("#extend_phone_btn_wrapper").hide();
                $("#extend_phone_number_wrapper").hide();
                $("#extend_form_btn_wrapper").hide();
                $("#extend_form_url_wrapper").hide();
                $("#landing_extend_title_wrapper").hide();
                //预览
                $('#dom-ad-create-edit .title_button').parent().css('display', 'none');
                $('#dom-ad-create-edit .title_button').html('');
                break;
            case 'phone':
                $("#extend_phone_btn_wrapper").show();
                $("#extend_phone_number_wrapper").show();
                $("#extend_form_btn_wrapper").hide();
                $("#extend_form_url_wrapper").hide();
                $("#landing_extend_title_wrapper").show();
                //预览
                $('#dom-ad-create-edit .title_button').parent().css('display', 'block');
                $('#dom-ad-create-edit .title_button').html($('#phone_btnName').val());
                break;
            case 'form':
                $("#extend_phone_btn_wrapper").hide();
                $("#extend_phone_number_wrapper").hide();
                $("#extend_form_btn_wrapper").show();
                $("#extend_form_url_wrapper").show();
                $("#landing_extend_title_wrapper").show();
                //预览
                $('#dom-ad-create-edit .title_button').parent().css('display', 'block');
                $('#dom-ad-create-edit .title_button').html($('#form_btnName').val() || '表单收集');
                break;
        }
    }
    $("#extend_type").bind('change', function () {
        var extend_type = $(this).val();
        changeExtend(extend_type);
    });
    
        /* 预览 **/
        $(document).on('input', '#dom-ad-create-edit [data-name]', function(){
            var parent = $(this).parents('[data-index]:first').find('.container');
            var name = $(this).attr('data-name');
            var value = $(this).val().trim();
            switch(name){
                case 'title':
                    parent.find('.adv_title').html(value);
                    break;
                case 'description':
                    parent.find('.adv_detail').html(value);
                    break;
            }
        }).on('input', `#ad_source,
                #appName,
                #form_btnName,
                #landing_extend_title,
                #download_extend_title`, function(){
            var parent = $('#dom-ad-create-edit');
            var id = $(this).attr('id');
            var value = $(this).val().trim();
            switch(id){
                case 'ad_source':
                case 'appName':
                    parent.find('.adv_addsource').html(value);
                    break;
                case 'form_btnName':
                    parent.find('.title_button').html(value || '表单收集');
                    break;
                case 'landing_extend_title':
                    parent.find('.adv_addtitle').html(value);
                    break;
                case 'download_extend_title':
                    parent.find('.adv_addtitle').html(value);
                    break;
            }
        }).on('change', '#phone_btnName', function(){
            var parent = $('#dom-ad-create-edit');
            var value = $(this).val();
            parent.find('.title_button').html(value);
        });
    
        /* 上传文件 **/
        $(document).on('change', '#dom-ad-create-edit input[type=file]', function () {
            var id = this.id;
            var file = this.files[0];
            var type = $(this).attr('data-file-type');
            var parent = $(this).parents('[data-index]:first');
            var $record = $(this).next();
            var format = file.name.replace(/(.*\.)/g, '');
            //要求
            var requireFormat = $record.attr('data-format').split('/');
            var requireW_H = parent.find('[data-name="pic_scale"]').val().split('_');
            //预览
            var num = id.slice(-1);
            var review = $(this).parents('[data-index]:first').find('.container .main_img img.pic' + num);
            //清除文件
            this.outerHTML = this.outerHTML;
            if(-1 === requireFormat.indexOf(format)){
                layer.msg('文件格式错误！');
                return;
            }
            if(file.size > $record.attr('data-size')){
                layer.msg('上传文件太大！');
                return;
            }
            switch(type){
                case 'pic':
                    var url = '/materiel/uploadimagewithdetail';
                    var data = new FormData();
                    data.append('file_data', file);
                    var show = $('#' + id + '-img');
                    var loading = show.parent().addClass('data-loading');
                    http_post_data(url, 'filePost', data, function (res) {
                        if(1 === res.status){
                            var data = res.data;
                            var width = data.width;
                            var height = data.height;
                            if(requireW_H[0] * height === requireW_H[1] * width){
                                $record.val(data.name);
                                $record.next().val(data.size);
                                var $recordSize = $record.next().next();
                                var recordSizeName = $recordSize.attr('data-name');
                                var recordSizeNameText = width + '_' + height;
                                var flag = true;
                                if('pic1_size' === recordSizeName ||
                                        'pic2_size' === recordSizeName ||
                                        'pic3_size' === recordSizeName){
                                    var otherSize = [];
                                    parent.find('[data-name="pic1_size"],[data-name="pic2_size"],[data-name="pic3_size"]').each(function(){
                                        var value = $(this).val();
                                        if(value){
                                            otherSize.push(value);
                                        }
                                    });
                                    if(otherSize.length > 0){
                                        if(otherSize.indexOf(recordSizeNameText) < 0){
                                            layer.msg('图片上传失败：组图图片尺寸要一致');
                                            flag = false;
                                        }
                                    }
                                }
                                if(flag){
                                    $recordSize.val(recordSizeNameText);
                                    var filePath = '//static.adm.deepleaper.com/material/' + data.name;
                                    show.attr('src', filePath);
                                    review.attr('src', filePath);
                                }
                            }else{
                                layer.msg('图片上传失败：图片尺寸不符合规范');
                            }
                        }else{
                            layer.msg(res.msg);
                        }
                        loading.removeClass('data-loading');
                    });
                    break;
                case 'video':
                    var url = '/materiel/uploadfile';
                    var data = new FormData();
                    data.append('file_data', file);
                    var show = $('#' + id + '-video');
                    var loading = show.parent().addClass('data-loading');
                    http_post_data(url, 'filePost', data, function (res) {
                        console.log(res)
                        if(1 === res.status){
                            var data = res.data;
                            var width = data.width;
                            var height = data.height;
                            if(requireW_H[0] * height === requireW_H[1] * width){
                                $record.val(data.name);
                                var filePath = '//static.adm.deepleaper.com/material/' + data.name;
                                show.attr({
                                    src: filePath,
                                    controls: 'controls',
                                });
                            }else{
                                layer.msg('视频上传失败：视频尺寸不符合规范');
                            }
                        }else{
                            layer.msg(res.msg);
                        }
                        loading.removeClass('data-loading');
                    });
                    break;
                default:
                    break;
            }
        });
    
        /* 输入框失焦验证 **/
        $("#ad_source,#appName,#landing_extend_title,#download_extend_title,#phone_number,#form_btnName,#form_url,#link,#monitoring_url,#landing").on('blur', function(){
            validateInput($(this), true);
        });
        $(document).on('blur', '#dom-ad-create-edit [data-name]', function(){
            var name = $(this).attr('data-name');
            var value = $(this).val().trim();
            if(-1 < ['name', 'title', 'description'].indexOf(name)){
                validate4Type($(this), name, value, true);
            }
        });
    
        /* 提交 **/
        $('#submit').on('click', function(){
            var data = getDataInfo();
            console.log('data01', data)
            var creativeId = GetQueryString('id');
            var planId =  GetQueryString('planId');
            var groupId =  GetQueryString('groupId');
            if(data){
                var d = data[0];
                d.creative_id = creativeId;
                d.plan_id = planId;
                d.group_id = groupId;
                console.log(data);
                $("#Deepleaper_loading").show();
                adcreativeeditAPI(data, function (result) {
                    var req = JSON.parse(result);
                    if (req.status == 1) {
                        $("#Deepleaper_loading").hide();
                        layer.msg('创意修改成功');
                        setTimeout(function () {
                            window.location = '/promotion/adcreativelistview?planId=' + planId + '&groupId=' + groupId;
                        }, 1000);
                    } else {
                        $("#Deepleaper_loading").hide();
                        layer.msg(req.msg);
                    }
                })
            }
        });
    
        /** 功能操作，结束 **/    
    
});
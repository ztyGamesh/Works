$(document).ready(function () {
    /** 初始化dom，开始 **/

    /* 计划下拉框 **/
    (function(){
        var gid = GetQueryString('groupId');
        var pid = GetQueryString('planId');
        var url = '/adgroup/groups';
        http_post_data(url, 'get', {
            plan: 1,
        }, function(res){
            console.log(res)
            if(1 === res.status){
                $('#plannamelist').html(res.data.map(({group_id, group_name, child}) =>
                    `<li class="dropdown-header"><span class="text">${group_name}</span></li>` +
                    child.map(({plan_id, plan_name}) => {
                        var text = group_name + ' --> ' + plan_name;
                        if(group_id == gid && plan_id == pid){
                            $('#planname').attr({
                                'data-group': group_id,
                                'data-plan': plan_id,
                            }).html(text);
                        }
                        return `<li><a href="javascript:;" data-text="${text}" data-group="${group_id}" data-plan="${plan_id}">${plan_name}</a></li>`
                    }
                    ).join('')
                ).join(`<li class="divider"></li>`));
            }else{
                layer.msg(res.msg);
            }
        });
        $('#plannamelist').on('click', 'li a', function(){
            var group_id = $(this).attr('data-group');
            var plan_id = $(this).attr('data-plan');
            var text = $(this).attr('data-text');
            $('#planname').attr({
                'data-group': group_id,
                'data-plan': plan_id,
            }).html(text);
            //重置添加创意模板列表
            // var oldTypes = $('#dom-ad-type').children().remove();
            // var oldCreates = $('#dom-ad-create .panel.panel-default').remove();
            http_post_data('/adplan/creativeFormats', 'get', {id: plan_id}, function(res){
                if(1 === res.status){
                    initTemplateData(res.data);
                    /* 保留已添加 **/
                    // var newTypes = $('#dom-ad-type').children();
                    // var newCreates = $('#dom-ad-create .panel.panel-default');
                    // newTypes.each(function(){
                    //     var newItem = $(this);
                    //     var typeId = newItem.attr('data-type');
                    //     var oldItem = oldTypes.filter('[data-type="' + typeId + '"]');
                    //     if(1 == oldItem.length){
                    //         newItem.hasClass('active') ? oldItem.addClass('active') : oldItem.removeClass('active');
                    //         newItem.after(oldItem);
                    //         newItem.remove();
                    //     }
                    // });
                    // newCreates.each(function(){
                    //     var newItem = $(this);
                    //     var styleId = newItem.attr('data-style');
                    //     var oldItem = oldCreates.filter('[data-style="' + styleId + '"]');
                    //     if(1 == oldItem.length){
                    //         newItem.hasClass('active') ? oldItem.addClass('active') : oldItem.removeClass('active');
                    //         newItem.after(oldItem);
                    //         newItem.remove();
                    //     }
                    // });
                }else{
                    layer.msg(res.msg);
                }
                //判断广告组是落地页还是应用下载的API
                getPur_plat(group_id);
            });
        });
    })();

    /* 初始化广告形式和模板 **/
    http_post_data('/adplan/creativeFormats', 'get', {id: GetQueryString('planId')}, function(res){
        console.log(res);
        if(1 === res.status){
            initTemplateData(res.data);
        }else{
            layer.msg(res.msg);
        }
        //判断广告组是落地页还是应用下载的API
        getPur_plat(GetQueryString('groupId'));
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
    function getPur_plat(groupId){
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
                    $("#deeplink_div").show();
                    $("#landingWrapper").show();
                    $("#download").hide();

                    $('[data-preview="ad_source"]').prev().html('广告');
                }
                $('[data-preview="ad_source-' + purpose + '"]').addClass('active');
                //预览
                var extend_type;
                if('landing' === purpose){
                    $('#dom-ad-create .adv_addsource').html($('#ad_source').val());//广告来源
                    extend_type = $("#extend_type").val();//附加创意类型
                }else if('download' === purpose){
                    $('#dom-ad-create .adv_addsource').html($('#appName').val());//应用名
                    extend_type = 'download';//附加创意类型
                }
                switch (extend_type) {
                    case 'empty':
                        $('#dom-ad-create .main_title').css('display', 'none');
                        break;
                    case 'phone':
                        $('#dom-ad-create .main_title').css('display', 'block');
                        $('#dom-ad-create .title_button').html($('#phone_btnName').val());
                        $('#dom-ad-create .adv_addtitle').html($('#landing_extend_title').val());
                        break;
                    case 'form':
                        $('#dom-ad-create .main_title').css('display', 'block');
                        $('#dom-ad-create .title_button').html($('#form_btnName').val() || '表单收集');
                        $('#dom-ad-create .adv_addtitle').html($('#landing_extend_title').val());
                        break;
                    case 'download':
                        $('#dom-ad-create .main_title').css('display', 'block');
                        $('#dom-ad-create .title_button').html('应用下载');
                        $('#dom-ad-create .adv_addtitle').html($('#download_extend_title').val());
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
    $("#adgroupName").bind('click', function () {
        window.location.href = '/promotion/adplanlistview?groupId=' + GetQueryString('groupId');
    });
    $("#adplanName").bind('click', function () {
        window.location.href = '/promotion/adcreativelistview?groupId=' + GetQueryString('groupId') + '&planId=' + GetQueryString('planId');
    });
    $("#cancel").bind('click', function () {
        window.location.href = '/promotion/adcreativelistview?planId=' + GetQueryString('planId') + '&groupId=' + GetQueryString('groupId');
    });

    /* 附加创意选择 **/
    $("#extend_type").bind('change', function () {
        var extend_type = $(this).val();
        switch (extend_type) {
            case 'empty':
                $("#extend_phone_btn_wrapper").hide();
                $("#extend_phone_number_wrapper").hide();
                $("#extend_form_btn_wrapper").hide();
                $("#extend_form_url_wrapper").hide();
                $("#landing_extend_title_wrapper").hide();
                //预览
                $('#dom-ad-create .title_button').parent().css('display', 'none');
                $('#dom-ad-create .title_button').html('');
                break;
            case 'phone':
                $("#extend_phone_btn_wrapper").show();
                $("#extend_phone_number_wrapper").show();
                $("#extend_form_btn_wrapper").hide();
                $("#extend_form_url_wrapper").hide();
                $("#landing_extend_title_wrapper").show();
                //预览
                $('#dom-ad-create .title_button').parent().css('display', 'block');
                $('#dom-ad-create .title_button').html($('#phone_btnName').val());
                break;
            case 'form':
                $("#extend_phone_btn_wrapper").hide();
                $("#extend_phone_number_wrapper").hide();
                $("#extend_form_btn_wrapper").show();
                $("#extend_form_url_wrapper").show();
                $("#landing_extend_title_wrapper").show();
                //预览
                $('#dom-ad-create .title_button').parent().css('display', 'block');
                $('#dom-ad-create .title_button').html($('#form_btnName').val() || '表单收集');
                break;
        }
    });

    /* 广告形式切换 **/
    $(document).on('click', '#dom-ad-type>div', function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type = $(this).attr('data-type');
        $('#dom-ad-create>div[data-type="' + type + '"]').addClass('active').siblings().removeClass('active');
    });

    /* 广告模板切换 **/
    $(document).on('click', '#dom-ad-create .panel-heading', function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
    });
    
    /* 广告创意左右切换 **/
    $(document).on('click', '#dom-ad-create .add-new-left', function(){
        var parent = $(this).parents('.panel.panel-default:first');
        var size = parent.find('.add-new-size').html();
        var page = parent.find('.add-new-page').html();
        if(page > 1){
            page--;
            changeAdCreate(parent, page, size);
        }
    }).on('click', '#dom-ad-create .add-new-right', function(){
        var parent = $(this).parents('.panel.panel-default:first');
        var size = parent.find('.add-new-size').html();
        var page = parent.find('.add-new-page').html();
        if(page < size){
            page++;
            changeAdCreate(parent, page, size);
        }
    });

    /* 新建创意 **/
    $(document).on('click', '#dom-ad-create .add-new', function(e){
        var name = $(this).attr('data-text');
        var parent = $(this).parents('.panel.panel-default:first');
        var list = parent.find('.data-creative-list');
        var template = parent.attr('data-style');
        var size = + list.attr('data-size') + 1;
        if(size > 25){
            layer.msg('最多25个创意！');
            return;
        }
        list.append(addAdCreative(name, template, size));
        changeAdCreate(parent, size, size);
        //预览
        var extend_type;
        if('landing' === purpose){
            parent.find('.adv_addsource').html($('#ad_source').val());//广告来源
            extend_type = $("#extend_type").val();//附加创意类型
        }else if('download' === purpose){
            parent.find('.adv_addsource').html($('#appName').val());//应用名
            extend_type = 'download';//附加创意类型
        }
        switch (extend_type) {
            case 'empty':
                parent.find('.main_title').css('display', 'none');
                break;
            case 'phone':
                parent.find('.main_title').css('display', 'block');
                parent.find('.title_button').html($('#phone_btnName').val());
                parent.find('.adv_addtitle').html($('#landing_extend_title').val());
                break;
            case 'form':
                parent.find('.main_title').css('display', 'block');
                parent.find('.title_button').html($('#form_btnName').val() || '表单收集');
                parent.find('.adv_addtitle').html($('#landing_extend_title').val());
                break;
            case 'download':
                parent.find('.main_title').css('display', 'block');
                parent.find('.title_button').html('应用下载');
                parent.find('.adv_addtitle').html($('#download_extend_title').val());
            case 'download':
                break;
        }
    });
    
    /* 删除创意 **/
    $(document).on('click', '#dom-ad-create .add-new-delete', function(e){
        var _this = this;
        layer.confirm('是否删除此创意？', function(){
            var parent = $(_this).parents('.panel.panel-default:first');
            var p = $(_this).parent();
            var size = + p.parent().attr('data-size') - 1;
            var page = + p.attr('data-index') - 1;
            p.nextAll().toArray().forEach(t => {
                var index = + $(t).attr('data-index') - 1;
                $(t).attr('data-index', index);
            });
            p.remove();
            if(0 === page && size > 0){
                page = 1;
            }
            changeAdCreate(parent, page, size);
            layer.closeAll();
        });
        
    });

    /* 预览 **/
    $(document).on('input', '#dom-ad-create [data-name]', function(){
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
        var parent = $('#dom-ad-create');
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
        var parent = $('#dom-ad-create');
        var value = $(this).val();
        parent.find('.title_button').html(value);
    });

    /* 尺寸选择时清除已上传 **/
    $(document).on('change', '#dom-ad-create select[data-name="pic_scale"]', function(){
        var parent = $(this).parents('[data-index]:first');
        parent.find('.data-files img').removeAttr('src');
        parent.find('.data-video').removeClass('error');
        parent.find('.data-files video').removeAttr('src').removeAttr('controls');
        var $record = parent.find('input[type=file]').next();
        $record.val('');
        $record.next().val('');
        $record.next().next().val('');
        parent.find('.main_img img.pic0').attr('src', '../images/placeHolder.png');
        parent.find('.main_img img.pic1,.main_img img.pic2,.main_img img.pic3').attr('src', '../images/smallHolder.png');
    });

    /* 上传文件 **/
    $(document).on('change', '#dom-ad-create input[type=file]', function () {
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
    $(document).on('blur', '#dom-ad-create [data-name]', function(){
        var name = $(this).attr('data-name');
        var value = $(this).val().trim();
        if(-1 < ['name', 'title', 'description'].indexOf(name)){
            validate4Type($(this), name, value, true);
        }
    });

    /* 提交 **/
    $('#submit').on('click', function(){
        var data = getDataInfo();
        if(data){
            console.log(data);
            $("#Deepleaper_loading").show();
            adcreativesaveAPI(data, function (result) {
                var req = JSON.parse(result);
                if (req.status == 1) {
                    $("#Deepleaper_loading").hide();
                    layer.msg('创意添加成功');
                    setTimeout(function () {
                        var planId = $('#planname').attr('data-plan');//GetQueryString('planId')
                        var groupId = $('#planname').attr('data-group');//GetQueryString('groupId')
                        switch (GetQueryString('entrance')) {//从哪个列表页开始进入的新建，直到完成创意填写后再次返回到进入新建的列表页。
                            case 'group':
                                window.location = '/promotion/adgrouplistview';
                                break;
                            case 'plan':
                                window.location.href = '/promotion/adplanlistview?groupId=' + groupId;
                                break;
                            case 'creative':
                                window.location.href = '/promotion/adcreativelistview?planId=' + planId + '&groupId=' + groupId;
                                break;
                            default:
                                window.location.href = '/promotion/adcreativelistview?planId=' + planId + '&groupId=' + groupId;
                                break;
                        }
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
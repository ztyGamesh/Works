/**
 * 创意模板组件
 */

 /***** 常量开始 *****/
/* 常量 **/
/* 模板数据 **/
var templateObj;

/* 建议尺寸 **/
var picVideoSize;

/* 推广目的 */
var purpose;

/* 计划平台 */
var platform;

/* 是否为修改页面 */
var isModifyPage = false;
var modifyOldData = {};

/* 模板ID **/
var AdCreateConstant = {
    flow_root: '29076f0d-a923-47d4-bfef-2e3cf28fc099',//广告形式:信息流
    flow_img: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',//大图样式
    flow_video: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',//视频样式
    flow_imgAndChar: '7c44a357-ecd0-4c5b-80d0-db8bd5100149',//大图＋文字样式
    flow_videoAndChar: '4d918595-d2a1-47c7-8e4a-012f28ddd96e',//视频＋文字样式
    flow_smallimgAndChar: '7e1199fd-de4d-469f-8778-5de1268cddea',//图文样式
    flow_imgs: '6684515c-3b6d-40f5-969c-d137c3913aab',//组图样式
    flow_char: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',//文字链样式

    tail_root: '987b7cd8-2752-4a15-bc94-6c0a2764a5c4',//广告形式:开屏
    tail_3_static_img: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',//3S静图
    tail_5_dynamic_img: '876de12b-5e92-41da-a4a3-2f9fa33eda33',//5S动图
    tail_5_video: '7d42ec85-5533-4390-9338-84bfb0f725b5',//5S视频

    banner_root: '7b62026a-23aa-4592-836a-f4ee78f7ea2e',//广告形式:横幅
    banner_smallimgAndChar: '3fc13471-36a1-4dfc-abde-98c364e78e2e',//图文样式
    banner_img: 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',//纯图样式

    plaque_root: '5b3e416f-d93a-4632-87de-5d4fbcc942fb',//广告形式:插屏
    plaque_img: '5e0e3da8-e3cc-4330-a409-ee7263a08711',//纯图样式
}

/* 新建创意模板 */
var AdCreateNew = {
    name: function(name){
        return `<div class="row">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1  control-label Dl-required">创意名称</label>
                    <div class="col-md-7">
                        <input type="text" class="form-control dl-notNull creativeName" data-name="name" value="${isModifyPage ? modifyOldData.name : name}">
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>`;
    },
    title: function(titleObj){
        return `<div class="row">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1  control-label Dl-required">创意标题</label>
                    <div class="col-md-7">
                        <textarea class="form-control dl-notNull creativeTitle" maxlength="50"
                                data-min="${titleObj.min}"
                                data-max="${titleObj.max}"
                                data-key="material"
                                data-name="title"
                                placeholder="${titleObj.min}-${titleObj.max}个字"
                            >${isModifyPage ? modifyOldData.material.title : ''}</textarea>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>`;
    },
    description: function(descriptionObj, isnull){
        return `<div class="row">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1  control-label ${isnull ? '' : 'Dl-required'}">创意描述</label>
                    <div class="col-md-7">
                        <textarea type="text" class="form-control creativeDescription" maxlength="50"
                                data-min="${descriptionObj.min}"
                                data-max="${descriptionObj.max}"
                                data-key="material"
                                data-name="description"
                                ${
                                    isnull ? 'data-isnull="true"' : ''
                                }
                                placeholder="${descriptionObj.min}-${descriptionObj.max}个字"
                            >${isModifyPage ? modifyOldData.material.description : ''}</textarea>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>`;
    },
    picwall: function(picObj, styleId){
        var now = + new Date();
        return `<div class="data-files">
                <div class="row">
                    <div class="form-group">
                        <label class="col-md-2 col-md-offset-1 control-label Dl-required">选择尺寸</label>
                        <div class="col-md-7">
                            <select class="form-control" style="height: 31px;" data-key="material" data-name="pic_scale">
                            ${isModifyPage ? 
                                `<option value="${modifyOldData.material.pic_scale}" selected>
                                    ${modifyOldData.material.pic_scale.replace('_', ' : ')} （建议尺寸：${
                                        picVideoSize[styleId][modifyOldData.material.pic_scale] ? 
                                        picVideoSize[styleId][modifyOldData.material.pic_scale].join(',') : ''
                                    }）
                                </option>` :
                                Array.from(new Set(picObj.scale)).map((t, index) => {
                                    var set = t.split('_');
                                    var readSize = picVideoSize[styleId][t];
                                    return `<option value="${t}" ${index ? '' : 'selected'}>
                                        ${set[0]} : ${set[1]} ${readSize ? '（建议尺寸：' + readSize.join(',') + '）' : ''}
                                    </option>`
                                }).join('')}
                            </select>
                        </div>
                        <span class="help-block col-md-7 col-md-offset-3"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group">
                        <div class="col-md-9 col-md-offset-3 control-label" style="text-align: left;margin-top: -24px;color: #aaa;">
                            图片大小：${picObj.size.text}以内&nbsp;&nbsp;支持格式：${picObj.format.join('/')}
                        </div>
                    </div>
                </div>
                ${
                    picObj.count == 3 ? [1, 2, 3].map(t =>
                            AdCreateNew.pic(picObj, now, t)
                        ).join('') : AdCreateNew.pic(picObj, now, 0)
                }
            </div>`;
    },
    videowall: function(videoObj, styleId){
        var now = + new Date();
        return `<div class="data-files">
                <div class="row">
                    <div class="form-group">
                        <div class="col-md-9 col-md-offset-3 control-label" style="text-align: left;margin-top: -24px;color: #aaa;">
                            视频大小：${videoObj.size.text}以内&nbsp;&nbsp;支持格式：${videoObj.format.join('/')}
                        </div>
                    </div>
                </div>
                ${AdCreateNew.video(videoObj, now, 0)}
            </div>`
    },
    pic: function(picObj, now, num){
        var pic = 'pic' + (num || '');
        var id = 'create-creative-upload-pic-' + now + '-' + num;
        return `<div class="row">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1 control-label Dl-required">图片上传</label>
                    <div class="col-md-7">
                        <label style="width: 100px;display: block;" class="btn btn-default" for="${id}">
                            <input style="display: none;" data-file-type="pic" type="file" id="${id}"/>
                            <input style="width: 0;height: 0;" data-key="material" data-name="${pic}" data-size="${picObj.size.bytes}" data-format="${picObj.format.join('/')}" value="${isModifyPage ? modifyOldData.material[pic] : ''}"/>
                            <input style="display: none;" data-key="material" data-name="${pic}_bytes" value="${isModifyPage ? modifyOldData.material[pic + '_bytes'] : ''}"/>
                            <input style="display: none;" data-key="material" data-name="${pic}_size" value="${isModifyPage ? modifyOldData.material['pic_size'] : ''}"/>
                            上传图片
                        </label>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>
            <div class="row" style="margin-top: -15px;">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1  control-label">创意图片</label>
                    <div class="col-md-7" style="width: 270px;">
                        <div style="width: 100%;height: 0;padding-bottom: 100%;border-radius: 4px;border: 1px solid #ccc;position: relative;">
                            <div style="width: 100%;height: 100%;position: absolute;padding: 12px;">
                                <div style="width: 100%;height: 100%; padding: 6px;border: 1px dashed #ccc;">
                                    <img style="width: 100%;" id="${id + '-img'}" ${isModifyPage ? 'src="//static.adm.deepleaper.com/material/' + modifyOldData.material[pic] + '"' : ''}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>`;
    },
    video: function(videoObj, now, num){
        var video = 'video' + (num || '');
        var id = 'create-creative-upload-video-' + now + '-' + num;
        return `<div class="row">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1 control-label Dl-required">视频上传</label>
                    <div class="col-md-7">
                        <label style="width: 100px;display: block;" class="btn btn-default" for="${id}">
                            <input style="display: none;" data-file-type="video" type="file" id="${id}"/>
                            <input style="width: 0;height: 0;" data-key="material" data-name="${video}" data-size="${videoObj.size.bytes}" data-format="${videoObj.format.join('/')}" value="${isModifyPage ? modifyOldData.material[video] : ''}"/>
                            上传视频
                        </label>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>
            <div class="row" style="margin-top: -15px;">
                <div class="form-group">
                    <label class="col-md-2 col-md-offset-1  control-label">创意视频</label>
                    <div class="col-md-7" style="width: 270px;">
                        <div style="width: 100%;height: 0;padding-bottom: 80%;border-radius: 4px;border: 1px solid #ccc;position: relative;">
                            <div style="width: 100%;height: 100%;position: absolute;padding: 12px;">
                                <div style="width: 100%;height: 100%; padding: 6px;border: 1px dashed #ccc;" class="data-video">
                                    <video style="width: 100%;" id="${id + '-video'}" onerror="readVideoError.bind(this)(event);" onloadedmetadata="readVideoSuccess.bind(this)(event);" ${isModifyPage ? 'src="//static.adm.deepleaper.com/material/' + modifyOldData.material[video] + '" controls="controls"' : ''}>
                                        <p>该浏览器不支持加载视频</p>
                                    </video>
                                    <div class="video-error">
                                        <div class="video-error-img"></div>
                                        <!--<div class="video-error-text">该视频无法正常播放！</div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="help-block col-md-7 col-md-offset-3"></span>
                </div>
            </div>`;
    }
}

/* 广告形式 **/
function domAdCreativeType(){
    $('#dom-ad-type').html(templateObj.map(({name, slot_class}, index) =>
        `<div data-type="${slot_class}" class="${index ? '' : 'active'}">${name}<span class="badge"></span></div>`
    ).join(''));
}

/* 广告模板 **/
function domAdCreativeStyle(){
    $('#dom-ad-style').html(templateObj.map(({name, slot_class, child}, index) => {
        var size = child.length;
        return `<div class="col-md-10 col-md-offset-1 ${index ? '' : 'active'}" data-type="${slot_class}">
                <div class="templateWrapper">
                    <img src="/img/application/media/arrowL.png" class="templateTurnLeft cursor"/>
                    <div class="templateContainer">
                        <div class="templateContainerMove" style="left: 0px;" data-size="${size}" data-index="0">
                            ${child.map(({template_name, template}, index) =>
                                `<div class="templateBox" isshow="true" style="display: inline-block;" data-index="${index}">
                                    <div class="templateTitle">
                                        <div class="checkbox checkbox-deepleaper">
                                            <input class="templateCheckbox Dl-checkbox" data-style="${template}" type="checkbox" id="data-style-${template}">
                                            <label for="data-style-${template}">${template_name}</label>
                                        </div>
                                    </div>
                                    <video width="145px" height="258px" class="templateDemo">
                                        <source src="${getAdCreateVideo(template)}">
                                    </video>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    <img src="/img/application/media/arrowR.png" class="templateTurnRight cursor ${size > 4 ? 'active' : ''}"/>
                </div>
            </div>`
    }).join(''));
}

/* 广告创意 **/
function domAdCreative(){
    $('#dom-ad-create').html(templateObj.map(({name, slot_class, child}, index) =>
        `<div data-type="${slot_class}" class="${index ? '' : 'active'}">
            <div class="col-md-12">
                <div class="panel-group accordion" role="tablist" aria-multiselectable="true">
                    ${child.map(({template_name, template}, index) =>
                        `<div class="panel panel-default ${index ? '' : 'active'}" data-style="${template}" style="display: block;">
                            <div class="panel-heading" role="tab">
                                <h4 class="panel-title">
                                    <a data-toggle="ignore-collapse" href="javascript:;" data-href="#data-creative-list-${template}" aria-expanded="true" aria-controls="data-creative-list-${template}">
                                        <!--<span class="collapse－switch"></span>-->
                                        ${template_name}<span class="badge"></span>
                                    </a>
                                        <div style="width: 300px;padding-left: 10px;margin: 0 auto;">
                                            <div data-text="${name + '-' + template_name}" class="add-new btn btn-primary">添加</div>
                                            <div class="add-new-page">0</div>
                                            /<div class="add-new-size">0</div>
                                        </div>
                                </h4>
                            </div>
                            <div class="collapse in" id="data-creative-list-${template}" aria-expanded="true" style="position: relative;">
                                <div class="position-left">
                                    <div class="add-new-left"></div>
                                </div>
                                <div class="position-right">
                                    <div class="add-new-right"></div>
                                </div>
                                <div class="data-creative-list" data-size="0"></div>
                            </div>
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>`
    ).join(''));
}

/* 视频加载成功 **/
function readVideoSuccess(e){
    $(this).parent().removeClass('error');
}

/* 视频加载失败 **/
function readVideoError(e){
    $(this).parent().addClass('error');
}

/* 视频播放 **/
function playVideo(){
    this.play();
}

/* 视频暂停 **/
function pauseVideo(){
    this.pause();
    this.currentTime = 0;
}
/***** 常量结束 *****/

/* 初始化数据 **/
function initTemplateData(data){
    console.log('data',data)
    // 模板数据
    templateObj = data;
    // 建议尺寸
    picVideoSize = {};
    templateObj.forEach(item => {
        item.child.forEach(t => {
            var styleId = t.template;
            http_post_data('/adcreative/recommendSize', 'get', {
                template: styleId,
            }, function(res){
                if(1 == res.status){
                    picVideoSize[styleId] = res.data;
                }
            });
        });
    });
    // 广告形式
    domAdCreativeType();
    // 广告创意
    domAdCreative();
}

/* 修改创意初始化 **/
function initModifyTemplateData(tData, data, callback){
    templateObj = tData;
    isModifyPage = true;
    modifyOldData = data;
    modifyOldData.material = modifyOldData.material ? JSON.parse(modifyOldData.material) : {};
    var styleId = data.template_class;
    var typeId = data.slot_class;
    $('#typeIdSelect [value="' + typeId + '"]').attr('checked', 'checked');
    // 建议尺寸
    picVideoSize = {};
    http_post_data('/adcreative/recommendSize', 'get', {
        template: styleId,
    }, function(res){
        if(1 == res.status){
            picVideoSize[styleId] = res.data;
            $('#dom-ad-create-edit').html(addAdCreative('', styleId, 1));
            callback(modifyOldData);
        }
    });
    //浏览框标题
    var d = getAdCreateShow(styleId);
    $('#dom-ad-create-edit-name').html(d.template_name);
    $('#templateWrapper-text').html(d.template_name);
    $('#templateWrapper-video').attr('src', getAdCreateVideo(styleId));
}

/* 新建广告创意 **/
function addAdCreative(name, styleId, index){
    var name = name.trim();
    for(var i = 0; i < 6; i++){
        name += String.fromCharCode(65 + (Math.random() * 26 >> 0));
    }
    return `<div class="panel-collapse collapse in active" data-index="${index}" role="tabpanel" aria-labelledby="headingOne" style="position: relative; min-height: 610px;">
            <div class="add-new-delete"></div>
            <div class="panel-body" style="width: 60%;">${getAdCreateNew(styleId, name)}</div>
            ${getAdCreateReview(styleId)}
        </div>`
}

/**
 * 修改创意数量
 * @param $t $('.panel.panel-default')
 */
function changeAdCreate($t, index, size, isOpen){
    $t.find('.add-new-size').html(size);
    $t.find('.add-new-page').html(index);
    $t.find('.data-creative-list').attr('data-size', size);
    $t.find('.data-creative-list [data-index="' + index + '"]').addClass('active').siblings().removeClass('active');
    var left = $t.find('.add-new-left').removeClass('active');
    var right = $t.find('.add-new-right').removeClass('active');
    if(index > 1){
        left.addClass('active');
    }
    if(index < size){
        right.addClass('active');
    }
    if(isOpen){
        var parent = $t.parents('[data-type]:first');
        var typeId = parent.attr('data-type');
        $('#dom-ad-type>div[data-type="' + typeId + '"]').addClass('active').siblings().removeClass('active');
        parent.addClass('active').siblings().removeClass('active');
        $t.addClass('active').siblings().removeClass('active');
    }
    //记录
    $('#dom-ad-create>div[data-type]').each(function(index, item){
        var typeId = $(this).attr('data-type');
        var all = 0;
        [].slice.call($(this).find('.panel.panel-default')).forEach(function(t){
            var num = + $(t).find('.data-creative-list').attr('data-size');
            $(t).find('.panel-title .badge').html(num || '');
            all += num;
        });
        $('#dom-ad-type>div[data-type="' + typeId + '"]>.badge').html(all || '');
    });
}

/* 输入框校验 **/
function validateInput($t, isBlur){
    var id = $t.attr('id');
    var value = $t.val().trim();
    var flag = true;
    var msg = '';
    switch(id){
        case 'ad_source':
            flag = validateString(value, 'size', 2, 10);
            msg = '广告来源不能为空，长度2-10个字';
            break;
            case 'appName':
            flag = validateString(value, 'size', 2, 10);
            msg = '应用名不能为空，长度2-10个字';
            break;
        case 'landing_extend_title':
            flag = validateString(value, 'size', 2, 12);
            msg = '附加创意标题不能为空，长度2-12个字';
            break;
        case 'download_extend_title':
            flag = validateString(value, 'size', 2, 12);
            msg = '创意副标题不能为空，长度2-12个字';
            break;
        case 'phone_number':
            flag = validateString(value, 'numSize', 5, 11);
            msg = '电话号码格式错误';
            break;
        case 'form_btnName':
            flag = validateString(value, 'size', 1, 8);
            msg = '按钮名称不能为空，长度1-8个字';
            break;
        case 'form_url':
        case 'link':
            flag = validateString(value, 'url');
            msg = '链接地址格式错误';
            break;
        case 'monitoring_url':
        case 'landing':
            flag = validateString(value, 'urlIsNull');
            msg = '链接地址格式错误';
            break;
        // case 'appDownloadUrl':
        //     flag = validateAppUrl($t, value, '地址错误');
        //     break;
    }
    if(!flag){
        vaError($t, msg);
        isBlur || $t.focus();
    }else{
        vaSuccess($t);
    }
    return flag;
}

/* 新建创意校验 **/
function validate4Type($t, name, value, isBlur){
    var min = $t.attr('data-min') || 0;
    var max = $t.attr('data-max') || '';
    var value = $t.val().trim();
    var isNull = $t.attr('data-isnull');
    var flag = true;
    switch(name){
        case 'name':
            if(!value){
                vaError($t, '创意名称不能为空');
                flag = false;
            }
            if(!validateString(value, 'charSize', 1, 50)){
                vaError($t, '50个字以内，2个英文是1个字');
                flag = false;
            }
            break;
        case 'title':
        case 'description':
            var t = isNull ? 'sizeIsNull' : 'size';
            if(!validateString(value, t, min, max)){
                vaError($t, $t.attr('placeholder'));
                flag = false;
            }
            break;
        case 'pic':
        case 'pic1':
        case 'pic2':
        case 'pic3':
        case 'pic4':
            if(!value){
                layer.msg('请选择图片');
                flag = false;
            }
            break;
        case 'video':
            if(!value){
                layer.msg('请选择视频');
                flag = false;
            }
            break;
        default:
            return true;
            break;
    }
    if(flag){
        vaSuccess($t);
        return true;
    }
    if(isBlur){
        return false;
    }
    var parent = $t.parents('.panel.panel-default:first');
    var p = $t.parents('[data-index]');
    var size = parent.find('.add-new-size').html();
    var index = p.attr('data-index');
    changeAdCreate(parent, index, size, true);
    $t.focus();
    return false;
}

/* 获取新建创意提交数据 **/
function getAdCreateData(){
    var list = $('#dom-ad-create .data-creative-list>div').toArray();
    var flag = true;
    var data = list.map(t => {
        var obj = {
            material: {},
            template_class: $(t).parents('.panel.panel-default:first').attr('data-style'),
        };
        $(t).find('[data-name]').toArray().forEach(elem => {
            var key = $(elem).attr('data-key');
            var name = $(elem).attr('data-name');
            var value = $(elem).val().trim();
            if('pic1_size' === name){
                obj['material']['pic_size'] = value;
            }else if('pic2_size' === name || 'pic3_size' === name){
            }else if(key){
                obj[key][name] = value;
            }else{
                obj[name] = value;
            }
            if(flag && !validate4Type($(elem), name, value)){
                flag = false;
            }
        });
        return obj;
    });
    return flag && data;
}

/* 获取修改创意提交数据 **/
function getAdCreateModifyData(){
    var flag = true;
    var obj = {
        material: {},
        template_class: modifyOldData.template_class,
    };
    $('#dom-ad-create-edit').find('[data-name]').toArray().forEach(elem => {
        var key = $(elem).attr('data-key');
        var name = $(elem).attr('data-name');
        var value = $(elem).val().trim();
        if('pic1_size' === name){
            obj['material']['pic_size'] = value;
        }else if('pic2_size' === name || 'pic3_size' === name){
        }else if(key){
            obj[key][name] = value;
        }else{
            obj[name] = value;
        }
        if(flag && !validate4Type($(elem), name, value)){
            flag = false;
        }
    });
    return flag && [obj];
}

/* 获取当前页面提交数据 **/
function getDataInfo() {
    // var planId = GetQueryString('planId');
    // var groupId = GetQueryString('groupId');
    var planId = $('#planname').attr('data-plan');
    var groupId = $('#planname').attr('data-group');
    var entrance = GetQueryString('entrance');
    var ad_source;
    var extend_type;
    var extend_data = {};//附加创意
    if('landing' === purpose){
        ad_source = $("#ad_source").val();//广告来源
        extend_type = $("#extend_type").val();//附加创意类型
    }else if('download' === purpose){
        ad_source = $('#appName').val();//应用名
        extend_type = 'download';//附加创意类型
    }
    switch (extend_type) {
        case 'phone':
            extend_data = {
                "extend_title": $("#landing_extend_title").val(),//附加创意标题
                "button_text": $("#phone_btnName").val(),//按钮名称
                "phone_number": $("#phone_number").val(),
            };
            break;
        case 'form':
            extend_data = {
                "extend_title": $("#landing_extend_title").val(),//附加创意标题
                "button_text": $("#form_btnName").val(),//按钮名称
                "extend_url": $("#form_url").val(),
            };
            break;
        case 'download':
            extend_data = {
                "extend_title": $("#download_extend_title").val(),//创意副标题
                "button_text": "立即下载",//按钮名称
                // "extend_url": $("#appDownloadUrl").val(),//应用下载地址
                "extend_url": '',
            }
            break;

    }
    var link = $("#link").val();//URL地址
    var deep_link = '';
    deep_link = $("#deeplink").val();
    if(deep_link == undefined || deep_link == null){
        deep_link = '';
    }

    var landing = $("#landing").val();//第三方点击监测链接
    var monitoring_url = $("#monitoring_url").val();//第三方曝光监测链接
    var list = isModifyPage ? getAdCreateModifyData() : getAdCreateData();
    if(false === list){
        return;
    }
    list = list.map(function (t) {
        return Object.assign(t, {
            "group_id": groupId,
            "plan_id": planId,
            "link": link,
            "deep_link": deep_link,
            "landing": landing,
            "monitoring_url": monitoring_url,
            "ad_source": ad_source,
            "extend_type": extend_type,
            "extend_data": extend_data,
        });
    });
    if(0 === list.length){
        layer.msg('请至少选择一种模板！');
        return false;
    }
    if('landing' === purpose){
        if(!validateInput($('#ad_source'))){
            return false;
        }
    }else if('download' === purpose){
        if(!validateInput($('#appName'))){
            return false;
        }
    }
    switch (extend_type) {
        case 'phone':
            if(!validateInput($('#landing_extend_title')) ||
                    !validateInput($('#phone_number'))){
                return false;
            }
            break;
        case 'form':
            if(!validateInput($('#landing_extend_title')) ||
                    !validateInput($('#form_btnName')) ||
                    !validateInput($('#form_url'))){
                return false;
            }
            break;
        // case 'download':
        //     if(!validateInput($('#download_extend_title')) ||
        //             !validateInput($('#appDownloadUrl'))){
        //         return false;
        //     }
        //     break;
    }
    if(!validateInput($('#link')) ||
            !validateInput($('#monitoring_url')) ||
            !validateInput($('#landing'))){
        return false;
    }
    return list;
}

/* 获取模板数据 **/
function getAdCreateShow(styleId){
    for(var i = 0, l = templateObj.length; i < l; i++){
        var d = templateObj[i];
        for(var j = 0, m = d.child.length; j < m; j++){
            var c = d.child[j];
            if(c.template === styleId){
                var obj = Object.assign(c, {
                    name: d.name,
                    slot_class: d.slot_class,
                });
                return obj;
            }
        }
    }
}

/* 获取新建列表 **/
function getAdCreateNew(styleId, name){
    var data = getAdCreateShow(styleId);
    var titleObj = data.title_setting;
    var descriptionObj = data.description_setting;
    var picObj = data.pic_setting;
    var videoObj = {
        size: {
            bytes: 5242880,
            text: "5m"
        },
        format: ['mp4']
    };//data.video_setting;
    var typeId = data.template;
    switch(styleId){
        //广告形式:信息流
        case AdCreateConstant.flow_img://大图样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_video://视频样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.picwall(picObj, typeId),
                AdCreateNew.videowall(videoObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_imgAndChar://大图＋文字样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
                AdCreateNew.description(descriptionObj, true),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_videoAndChar://视频＋文字样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
                AdCreateNew.description(descriptionObj, true),
                AdCreateNew.picwall(picObj, typeId),
                AdCreateNew.videowall(videoObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_smallimgAndChar://图文样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
                AdCreateNew.description(descriptionObj),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_imgs://组图样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
                AdCreateNew.description(descriptionObj, true),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.flow_char://文字链样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
            ].join('');
            break;
        //广告形式:开屏
        case AdCreateConstant.tail_3_static_img://3S静图
        case AdCreateConstant.tail_5_dynamic_img://5S动图
        case AdCreateConstant.tail_5_video://5S视频
            return '';
            break;
        //广告形式:横幅
        case AdCreateConstant.banner_smallimgAndChar://图文样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.title(titleObj),
                AdCreateNew.description(descriptionObj),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        case AdCreateConstant.banner_img://纯图样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        //广告形式:插屏
        case AdCreateConstant.plaque_img://纯图样式
            return [
                AdCreateNew.name(name),
                AdCreateNew.picwall(picObj, typeId),
            ].join('');
            break;
        default:
            return '';
            break;
    }
}

/* 获取预览列表 **/
function getAdCreateReview(styleId){
    var content = '';
    var height = 590;
    var top = '<img class="img_top" src="../../../images/top.png" alt="">';
    var textTop = '<img class="img_top" src="../images/textTop.png" alt="">';
    var bottom = '<img class="img_down" src="../../../images/down.png" alt="">';
    var textBottom = '<img class="img_down" src="../images/textDown.png" alt="">';
    var pic = `<div class="main_img" style="width: 296px;height: 166px;">
            <img class="pic0" src="../images/placeHolder.png" alt="" style="width:296px;height: 166px">
        </div>`;
    var pic3 = `<div class="main_img" style="width: 300px;height: 66px;">
            <img class="pic1" src="../images/smallHolder.png" alt="" style="width:95px;height: 66px">
            <img class="pic2" src="../images/smallHolder.png" alt="" style="margin: 0 1px;width: 95px;height:66px">
            <img class="pic3" src="../images/smallHolder.png" alt="" style="width:95px;height: 66px">
        </div>`;
    var play = `<div class="main_img" style="width: 296px;height: 166px;position: relative;">
            <img class="pic0" src="../images/placeHolder.png" alt="" style="width:296px;height: 166px">
            <div style="position: absolute;left: 50%;top:50%;transform: translateX(-50%) translateY(-50%);width: 65px;height: 65px;background-image: url(http://static.adm.deepleaper.com/material/play.png)">
            </div>
        </div>`;
    var smallPic = `<div class="main_img" style="width: 99px;height: 84px;padding-top: 5px;float: left;">
            <img class="pic0" src="../images/placeHolder.png" alt="" style="width:99px;height: 66px">
        </div>`;
    var title = '<div class="adv_title" style="font-size: 14px;height: 20px;overflow: hidden;"></div>';
    var smallTitle = '<div class="adv_title" style="font-size: 14px;width: 180px;height: 40px;overflow: hidden;"></div>';
    var addTitle = `<div class="main_title" style="height: 30px; line-height: 30px; font-size: 12px;padding: 0 3px; display: none; clear:both;">
            <span class="adv_addtitle" style="width: 145px;height: 22px;display: inline-block;overflow: hidden;"></span>
            <span class="title_button" style="border:1px solid #000;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">
            </span>
        </div>`;
    var backAddTitle = `<div class="main_title" style="height: 30px; line-height: 30px; font-size: 12px;padding: 0 3px;background-color: #909090;color: #f6f6f6; clear:both; display: none;">
            <span class="adv_addtitle"></span>
            <span class="title_button" style="border: 1px solid #f6f6f6;border-radius: 3px;padding: 0px 8px 0px;float: right;line-height: 12px;margin: 8px 0;">
            </span>
        </div>`;
    var source = `<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;">
            <span class="source_button" style="border:1px solid #000;padding: 2px 2px ;border-radius: 3px;line-height: 12px;position: relative;top: -2px;">
                广告
            </span>
            <span class="adv_addsource" style="margin-left: 10px;width: 125px;display: inline-block;overflow: hidden;height: 12px;line-height: 12px;"></span>
            <span class="source_close" style="float:right;margin: 2px 0 0 0;">
                <img src="../images/close.png" alt="">
            </span>
        </div>`;
    var smallSource = `<div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;min-width: 181px">
            <span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px;position: relative;top: -2px;">
                广告
            </span>
            <span class="adv_addsource" style="margin-left: 5px;width: 125px;display: inline-block;overflow: hidden;height: 12px;line-height: 12px;"></span>
            <span class="source_close" style="float:right;margin: 2px 0 ; height: 20px;overflow: hidden;width: 20px;">
                <img src="../images/close.png" style="margin-top: -6px;margin-left: -12px;" alt="">
            </span>
        </div>`;
    switch(styleId){
        // 广告形式:信息流
        case AdCreateConstant.flow_img://大图样式
            content = top + `<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">
                    ${pic + addTitle + source}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_video://视频样式
            content = top + `<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">
                    ${play + addTitle + source}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_imgAndChar://大图＋文字样式
            content = top + `<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">
                    ${title + pic + addTitle + source}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_videoAndChar://视频＋文字样式
            content = top + `<div class="main_area" style="width: 296px;height: 228px;margin: 0 auto;">
                ${title + play + addTitle + source}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_smallimgAndChar://图文样式
            content = top + `<div class="main_area" style="width: 296px;height: 100px;margin: 0 auto;">
                    ${smallPic}
                    <div class="main_content" style=" float: left; height: 90px;margin-left: 6px">
                        ${smallTitle + `
                        <div class="adv_detail" style="font-size: 12px;margin-bottom: 0;overflow: hidden;min-height: 17px;width: 178px;max-height: 32px;">
                        </div>` + smallSource}
                    </div>
                    ${addTitle}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_imgs://组图样式
            content = top + `<div class="main_area" style="width: 296px;height: 160px;margin: 0 auto;">
                    ${title + pic3 + addTitle + source}
                </div>` + bottom;
            break;
        case AdCreateConstant.flow_char://文字链样式
            content = textTop + `<div class="main_area" style="width: 296px;height: 80px;margin: 0 auto;clear:both">
                    ${title + addTitle + source}
                </div>` + textBottom;
            break;
        // 广告形式:开屏
        case AdCreateConstant.tail_3_static_img://3S静图
        case AdCreateConstant.tail_5_dynamic_img://5S动图
        case AdCreateConstant.tail_5_video://5S视频
            content = '';
            break;
        // 广告形式:横幅
        case AdCreateConstant.banner_smallimgAndChar://图文样式
            content = textTop + textTop + `<div class="main_area" style="width: 318px;min-height: 100px;position: absolute;bottom: 0;background: #FFF;padding: 15px;opacity: 0.8;">
                    <div class="main_img" style="width: 72px;height: 72px;float: left;">
                        <img class="pic0" src="../images/smallHolder.png" class="pic0" alt="" style="width:72px;height: 72px">
                    </div>
                    <div class="main_content" style="height: 70px;margin-left: 87px;">
                        <div class="adv_title" style="font-size: 14px;width: 180px;height: 40px;margin-bottom: 2px;overflow: hidden">
                        </div>
                        <div class="adv_detail" style="font-size: 12px;margin-bottom: 0;overflow: hidden;min-height: 17px;width: 178px;max-height: 32px;">
                        </div>
                        <div class="main_source" style="height: 30px;line-height: 30px;font-size: 12px;min-width: 181px">
                            <span class="source_button" style="border:1px solid #000;padding: 0 2px 0;border-radius: 3px;line-height: 12px;position: relative;top: -2px;">
                                广告
                            </span>
                            <span class="adv_addsource" style="margin-left: 5px;width: 125px;display: inline-block;overflow: hidden;height: 12px;line-height: 12px;"></span>
                            <span class="source_close" style="float:right;margin: 2px 0; height: 20px;overflow: hidden;width: 20px;">
                                <img src="../images/close.jpg" style="margin-top: -6px;margin-left: -12px;">
                            </span>
                        </div>
                    </div>
                </div>`;
            break;
        case AdCreateConstant.banner_img://纯图样式
            height = 500;
            content = textTop + textTop + `<div class="main_area" style="width: 318px;height: 48px;margin: 0 auto;position: relative;opacity: 0.8;top: -48px;">
                    <div class="main_img" style="width: 318px;height: 48px">
                        <img class="pic0" src="../images/placeHolder.png" alt="" style="width: 318px;height: 48px;">
                    </div>
                    <div class="main_source" style="height: 30px;font-size: 12px;position: absolute;width: 100%;top: 0;">
                        <span class="source_button" style="border:1px solid #000;padding: 1px 2px;border-radius: 3px;line-height: 12px;position: relative;top: 3px;left: 3px;">
                            广告
                        </span>
                        <img src="../img/clear.png" style="position: absolute;right: 3px;top: 4px;">
                    </div>
                </div>`;
            break;
        //广告形式:插屏
        case AdCreateConstant.plaque_img://纯图样式
            content = top + top + `<div class="main_area" style="width: 280px;height: 210px;margin: 0 auto; position: absolute;top: 162px;left:18px">
                    <div class="main_img">
                        <img class="pic0" src="../images/placeHolder.png" style="width:280px;height: 210px">
                    </div>
                    <span class="source_button" style="border:1px solid #000;padding: 1px 2px;border-radius: 3px;line-height: 12px;position: absolute;top: 3px;left: 3px;">
                        广告
                    </span>
                    <img src="../img/clear.png" style="position: absolute;right: 3px;top: 4px;">
                </div>` + bottom;
            break;
        default:
            content = '';
            break;
    }
    return `<div style="position: absolute;top: 15px;left: 52%;height: 617px;width:330px;overflow: hidden;">
        <div class="container" style="width: 320px;height: ${height}px;box-sizing: border-box;border: 1px solid #ccc;position: relative;background-color: #f6f6f6;padding-left: 0px;padding-right: 0px">
            ${content}
        </div>
    </div>`
}

/* 获取模板视频 **/
function getAdCreateVideo(styleId){
    switch(styleId){
        //广告形式:信息流
        case AdCreateConstant.flow_img://大图样式
            return '/video/infor_flow_img.mp4';     
            break;
        case AdCreateConstant.flow_video://视频样式
            return '/video/infor_flow_video.mp4';
            break;
        case AdCreateConstant.flow_imgAndChar://大图＋文字样式
            return '/video/infor_flow_imgAndChar.mp4';
            break;
        case AdCreateConstant.flow_videoAndChar://视频＋文字样式
            return '/video/infor_flow_videoAndChar.mp4';
            break;
        case AdCreateConstant.flow_smallimgAndChar://图文样式
            return '/video/infor_flow_smallimgAndChar.mp4';
            break;
        case AdCreateConstant.flow_imgs://组图样式
            return '/video/infor_flow_imgs.mp4';
            break;
        case AdCreateConstant.flow_char://文字链样式
            return '/video/infor_flow_char.mp4';
            break;
        //广告形式:开屏
        case AdCreateConstant.tail_3_static_img://3S静图
            return '/video/infor_static_tail.mp4';
            break;
        case AdCreateConstant.tail_5_dynamic_img://5S动图
            return '/video/infor_dynamics_tail.mp4';
            break;
        case AdCreateConstant.tail_5_video://5S视频
            return '/video/infor_video_tail.mp4';
            break;
        //广告形式:横幅
        case AdCreateConstant.banner_smallimgAndChar://图文样式
            return '/video/infor_banner_graphic.mp4';
            break;
        case AdCreateConstant.banner_img://纯图样式
            return '/video/infor_banner_pure_figure.mp4';
            break;
        //广告形式:插屏
        case AdCreateConstant.plaque_img://纯图样式
            return '/video/infor_plaque.mp4';
            break;
        default:
            return '';
            break;
    }
}
/**
 * Created by wangqi on 2018/1/10.
 */
var media_obj = {};
//框架
function mediaItializeiFun(id) {
    document.getElementById(id).innerHTML =
        ["<div id=\"dl-media-box\">",
            "        <div class=\"dl-media-top-box\">",
            "            <div class=\"dl-media-top-left\">",
            "                <span class=\"top-left-span\">媒体列表</span>",
            "            </div>",
            "            <div class=\"dl-media-top-right\">",
            "                <span class=\"top-right-span\">已选择</span>",
            "                <input class=\"dl-media-all-delete\" type=\"button\" value=\"删除已选\">",
            "            </div>",
            "        </div>",
            "        <div class=\"dl-media-container-box\">",
            "            <div id=\"dl-media-container-selected\"></div>",
            "            <div id=\"dl-media-container-checked\"></div>",
            "        </div>",
            "        <div class=\"dl-media-footer-box\">",
            "            <div class=\"dl-media-footer-affirm-frame\">",
            "                <input class=\"dl-media-affirm-btn\" type=\"button\" value=\"确认选择\">",
            "            </div>",
            "            <div class=\"dl-media-footer-cancel-frame\">",
            "                <input class=\"dl-media-cancel-btn\" type=\"button\" value=\"取消\">",
            "            </div>",
            "        </div>",
            "    </div>"].join("");
}
//入口
function mediaAdOrientation(id, dataTemp) {
    mediaItializeiFun(id); //初始化显示框架
    fun_directMedia_left(dataTemp);//左侧数据渲染
    fun_directMedia_right(dataTemp);//右侧数据渲染
    funMediaSetProperty(dataTemp);//双向绑定
}

//左侧
function fun_directMedia_left(dataTemp) {
    //基本一些元素的创建
    var newDiv = document.createElement('div');
    var newUl = document.createElement('ul');
    var newLi = document.createElement('li');
    var newLabel = document.createElement('label');
    var newInput = document.createElement('input');
    var newSpan = document.createElement('span');

    var media_listIdLeft = document.getElementById('dl-media-container-selected');

// 左侧
    var media_areaLeft = newDiv.cloneNode(true);
    media_areaLeft.setAttribute('class', 'media_areaLeft');
    media_areaLeft.setAttribute('width', '100%');
    media_listIdLeft.appendChild(media_areaLeft);

    var media_areaP = newDiv.cloneNode(true); //一条数据的盒子
    media_areaP.setAttribute('class', 'media_areaP');
    media_areaLeft.appendChild(media_areaP);

    var ul_sum = newUl.cloneNode(true);
    ul_sum.setAttribute('class', 'cd-accordion-menu animated');
    media_areaP.appendChild(ul_sum);

    var all_li = newLi.cloneNode(true);
    all_li.setAttribute('class', 'li-class');
    ul_sum.appendChild(all_li);

    var all_div = newDiv.cloneNode(true);
    all_div.setAttribute('class', 'all-div');
    all_li.appendChild(all_div);

    var all_input = newInput.cloneNode(true);
    all_input.setAttribute('type', 'checkbox');
    all_input.setAttribute('name', 'all');
    all_input.setAttribute('id', 'all_media');
    all_input.setAttribute('all-flag', '0');
    all_input.setAttribute('class','input-left input-all');
    all_div.appendChild(all_input);

    var all_label = newLabel.cloneNode(true);
    // label.setAttribute('for', 'all');
    all_label.setAttribute('class','left-label all-label');
    all_label.innerHTML = '全部';
    all_div.appendChild(all_label);

    for(var i = 0; i < dataTemp.length; i++)
    {
        var li = newLi.cloneNode(true);
        li.setAttribute('class', 'li-class');
        ul_sum.appendChild(li);

        var div = newDiv.cloneNode(true);
        div.setAttribute('class', 'each-data-div');
        div.setAttribute('name', 'div-data');
        li.appendChild(div);

        var media_div = newDiv.cloneNode(true);
        media_div.setAttribute('class', 'each-data-div-media');
        media_div.setAttribute('name', 'div-data');
        div.appendChild(media_div);

        //媒体选择
        var input = newInput.cloneNode(true);
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'input-media');
        input.setAttribute('id', dataTemp[i].bundle_id);
        input.setAttribute('class', 'input-left input-media');
        // input.setAttribute('checked',true);
        media_div.appendChild(input);

        var label = newLabel.cloneNode(true);
        label.setAttribute('class','left-label input-media-label');
        // label.setAttribute('for', dataTemp[i].bundle_id);
        label.innerHTML = dataTemp[i].media_name;
        label.style.marginLeft =  '5px';
        media_div.appendChild(label);

        var ad_div = newDiv.cloneNode(true);
        ad_div.setAttribute('class', 'each-data-div-ad');
        ad_div.setAttribute('name', 'div-data');
        div.appendChild(ad_div);

        var ad_span = newSpan.cloneNode(true);
        ad_span.innerHTML = '-----';
        ad_span.style.marginLeft =  '5px';
        ad_div.appendChild(ad_span);

        //定向广告位
        var ad_input = newInput.cloneNode(true);
        ad_input.setAttribute('type', 'checkbox');
        // ad_input.setAttribute('name', dataTemp[i].media_name);
        ad_input.setAttribute('id', 'ad-' + dataTemp[i].bundle_id);
        ad_input.setAttribute('class', 'ad-display input-ad');
        ad_input.style.marginLeft =  '5px';
        // ad_input.setAttribute('class', 'input-left');
        // input.setAttribute('checked',true);
        ad_div.appendChild(ad_input);

        var ad_label = newLabel.cloneNode(true);
        ad_label.setAttribute('class', "ad-display input-ad-label");
        ad_label.innerHTML = '定向广告位';
        ad_label.style.marginLeft =  '5px';
        // ad_label.setAttribute('for', 'ad-' + dataTemp[i].bundle_id);
        ad_div.appendChild(ad_label);

        //广告位UID
        var adId_input = newInput.cloneNode(true);
        adId_input.setAttribute('type', 'text');
        adId_input.setAttribute('class', 'adId-display input-adId');
        adId_input.setAttribute('placeholder', '请填写定向广告位ID，多个ID以英文逗号隔开');
        adId_input.style.marginLeft =  '5px';
        adId_input.setAttribute('id', 'adId-' + dataTemp[i].bundle_id);
        ad_div.appendChild(adId_input);
    }

}

//右侧
function fun_directMedia_right(dataTemp){
    //基本一些元素的创建
    var newDiv = document.createElement('div');
    var newUl = document.createElement('ul');
    var newLi = document.createElement('li');
    var newLabel = document.createElement('label');
    var newImg = document.createElement('img');
    var newInput = document.createElement('input');
    var newSpan = document.createElement('span');

    var listIdRight = document.getElementById('dl-media-container-checked');
// 右侧
    var media_areaRight = newDiv.cloneNode(true);
    media_areaRight.setAttribute('class', 'media_areaRight'); // 把这部分插入到  directional-right-body  中
    media_areaRight.setAttribute('width', '100%');
    listIdRight.appendChild(media_areaRight);

    var media_areaR = newDiv.cloneNode(true); //一条数据的盒子
    media_areaR.setAttribute('class', 'media_areaR');
    media_areaRight.appendChild(media_areaR);

    var ul_sum = newUl.cloneNode(true);
    ul_sum.setAttribute('class', 'cd-accordion-menu animated');
    media_areaR.appendChild(ul_sum);

    for(var i = 0; i < dataTemp.length; i++){
        var li = newLi.cloneNode(true);
        li.setAttribute('class', 'li-class  has-children');
        ul_sum.appendChild(li);

        var div = newDiv.cloneNode(true);
        div.setAttribute('class','each-data-div-delete active-deleted');
        div.setAttribute('name','div-deldata');
        div.setAttribute('id', dataTemp[i].bundle_id + '-r');
        li.appendChild(div);

        var label = newLabel.cloneNode(true);
        label.setAttribute('class', 'delete-label');
        label.innerHTML = dataTemp[i].media_name;
        label.style.marginLeft = '5px';
        div.appendChild(label);

        // var ad_span = newSpan.cloneNode(true);
        // // ad_span.setAttribute('class', "ad-display");
        // ad_span.innerHTML = '-----';
        // ad_span.style.marginLeft =  '5px';
        // div.appendChild(ad_span);

        var img_delete = newImg.cloneNode(true);
        img_delete.setAttribute('src','/img/multiMenu/delete.png');
        img_delete.setAttribute('class','delete-img');
        div.appendChild(img_delete);

        var adId_span = newSpan.cloneNode(true);
        adId_span.setAttribute('class', "adId-display-r ");
        adId_span.setAttribute('id', "r-adId-" + dataTemp[i].bundle_id);
        adId_span.innerHTML = '';
        adId_span.style.marginLeft =  '5px';
        div.appendChild(adId_span);

    }
}

//双向数据绑定
function funMediaSetProperty(dataTemp) {
    for (var i = 0; i < dataTemp.length; i++) {
        var data = dataTemp[i].bundle_id;
        var dataName = data + "-r";
        Object.defineProperty(media_obj, dataName, {  //循环创建属性
            set:function(data){
                return function (newVal) {
                    var data_l = document.getElementById(data);
                    var $data_l = $(data_l);

                    var data_r = document.getElementById(data + '-r');
                    var $data_r = $(data_r);

                    var data_ad = document.getElementById('ad-' + data);
                    var $data_ad = $(data_ad);

                    var data_adId = document.getElementById('adId-' + data);
                    var $data_adId = $(data_adId);

                    var data_adId_r = document.getElementById('r-adId-' + data);
                    var $data_adId_r = $(data_adId_r);

                    if (newVal == 1){
                        $data_l.prop('checked', true);
                        $data_l.parent().addClass("active-checked");
                        $data_r.css('display', 'block');
                        $data_l.addClass("submit-checked");
                        $data_r.removeClass('active-deleted');
                        $data_adId_r.html('');
                    }else {
                        $data_l.removeAttr('checked');//左边的CheckBox
                        $data_l.parent().removeClass("active-checked");  //用active_checked 来做标识，最后被选中的
                        $data_r.css('display', 'none');//右边的X
                        $data_l.removeClass("submit-checked");
                        $data_r.addClass('active-deleted');
                        $data_ad.removeAttr('checked');
                        $data_adId.val('');
                        $data_adId.hide();
                        $data_adId_r.html('');
                    }
                }
            }(data)
        });

    }
}
$(document).ready(function () {
//----------------是否显示广告位ID输入框 start------------------------
    $("#dl_media").on('click', '.input-ad-label', function (e) {
        var media_id = document.getElementById( $(this).parent().children('input').attr('id').slice(3));
        var $media_id = $(media_id);
        var data_r = document.getElementById($(this).parent().children('input').attr('id').slice(3) + '-r');
        var $data_r = $(data_r);

        var data_adId_r = document.getElementById('r-adId-' + $(this).parent().children('input').attr('id').slice(3));
        var $data_adId_r = $(data_adId_r);

        $media_id.prop('checked',true);
        $media_id.parent().addClass("active-checked");
        $data_r.css('display', 'block');
        $media_id.addClass("submit-checked");
        $data_r.removeClass('active-deleted');

        var id = document.getElementById("adId-" + $(this).parent().children('input').attr('id').slice(3));
        var $id = $(id);

        var input_id = document.getElementById("ad-" + $(this).parent().children('input').attr('id').slice(3));
        var $input_id = $(input_id);


        if($(this).parent().children('input').is(':checked')){
            $id.hide();
            $id.val('');
            $data_adId_r.html('');
            $input_id.removeAttr('checked');
        }else {
            $input_id.prop('checked',true);
            $id.show();
        }
    });

    $("#dl_media").on('click', '.input-ad', function (e) {
        var media_id = document.getElementById( $(this).parent().children('input').attr('id').slice(3));
        var $media_id = $(media_id);
        var data_r = document.getElementById($(this).parent().children('input').attr('id').slice(3) + '-r');
        var $data_r = $(data_r);

        var data_adId_r = document.getElementById('r-adId-' + $(this).parent().children('input').attr('id').slice(3));
        var $data_adId_r = $(data_adId_r);

        $media_id.prop('checked',true);
        $media_id.parent().addClass("active-checked");
        $data_r.css('display', 'block');
        $media_id.addClass("submit-checked");
        $data_r.removeClass('active-deleted');

        var id = document.getElementById("adId-" + $(this).parent().children('input').attr('id').slice(3));
        var $id = $(id);

        var input_id = document.getElementById("ad-" + $(this).parent().children('input').attr('id').slice(3));
        var $input_id = $(input_id);


        if($(this).parent().children('input').is(':checked')){
            $input_id.prop('checked',true);
            $id.show();
        }else {
            $id.hide();
            $id.val('');
            $data_adId_r.html('');
            $input_id.removeAttr('checked');
        }
    });

//----------------是否显示广告位ID输入框 end------------------------

//-------------------------定向广告位输入触发事件 start------------------
    //回车触发
    $("#dl_media").on('keyup', '.input-adId', function () {
        if (event.keyCode == "13" && $(this).val().replace(/\s+/g,"")) {
            getSlotNamesFun($(this));
        }
    });
    //失去焦点触发
    $("#dl_media").on('blur', '.input-adId', function () {
        getSlotNamesFun($(this));
    });
//-------------------------定向广告位输入触发事件 end------------------

    //鼠标悬浮在每条数据上的突出显示效果
    $("#dl_media").on('mouseover','.each-data-div, .each-data-div-delete, .all-div', function () {
        $(this).addClass('mouseover-style');
    });
    $("#dl_media").on('mouseleave','.each-data-div, .each-data-div-delete, .all-div', function () {
        $(this).removeClass('mouseover-style');
    });


    //左侧每条数据选中时
    $("#dl_media").on('click','.input-media, .input-media-label', function () {

        var objName = $(this).parent().children('input').attr('id') + '-r';
        if ($(this).parent().hasClass("active-checked")){
            $(this).parent().removeClass("active-checked");
            $("input[type='checkbox'][class='input-media']", $(this)).removeAttr("checked");
            media_obj[objName] = "0";
        }
        else{
            $(this).parent().addClass("active-checked");

            media_obj[objName] = "1";
            $("input[type='checkbox'][class='input-media']", $(this)).prop("checked","true");
        }
        return callBackLeftFun($(this));
    });


    //右侧删除媒体
    $('#dl_media').on('click', '.delete-img', function () {
        var objName = $(this).parent().attr('id');
        media_obj[objName] = "0";
        $("#all_media").removeAttr("checked");
    });

    //右侧删除广告位
    $('#dl_media').on('click', '.adId-delete-img', function () {
        var id = 'div_' + $(this).attr('id').slice(4);
        var del_id = document.getElementById(id);
        this.parentNode.parentNode.removeChild(del_id);
        var dingxiang_id = document.getElementById($(this).attr('dingxiangID'));
        var $dingxiang_id = $(dingxiang_id);
        var adDelId = $(this).attr('id').slice(4);
        var dingxiangArray = $dingxiang_id.val().split(',');
        var newArray = [];
        var t = 0;
        for(var i = 0; i < dingxiangArray.length; i++){
            if(adDelId != dingxiangArray[i]){
                newArray[t++] = dingxiangArray[i];
            }
        }
        $dingxiang_id.val(newArray.join(','));

    });


    //全部全选 label
    $("#dl_media").on('click', '.all-label',function () {
        // console.log('all',$("#all_media").is(":checked"));
        if($("#all_media").is(":checked")){
            $("#all_media").removeAttr("checked");
            $(".each-data-div-media").removeClass("active-checked");
            $("input[type='checkbox'][name='input-media']").removeAttr("checked");

            $(".each-data-div-delete").css('display', 'none');//右边的X
            $("input[type='checkbox'][name='input-media']").removeClass("submit-checked");
            $(".each-data-div-delete").addClass('active-deleted');
            $(".input-ad").removeAttr('checked');
            $(".input-adId").val('');
            $(".input-adId").hide();
        }else {
            $("#all_media").prop("checked","true");
            $(".each-data-div-media").addClass("active-checked");
            $("input[type='checkbox'][name='input-media']").prop("checked","true");
            $(".each-data-div-delete").css('display', 'block');
            $("input[type='checkbox'][name='input-media']").addClass("submit-checked");
            $(".each-data-div-delete").removeClass('active-deleted');
            $(".adId-display-r").html('');
        }
    });
    //全部 CheckBox
    $("#dl_media").on('click', '.input-all',function () {
        if($("#all_media").is(":checked")){
            $("#all_media").prop("checked","true");
            $(".each-data-div-media").addClass("active-checked");
            $("input[type='checkbox'][name='input-media']").prop("checked","true");
            $(".each-data-div-delete").css('display', 'block');
            $("input[type='checkbox'][name='input-media']").addClass("submit-checked");
            $(".each-data-div-delete").removeClass('active-deleted');
            $(".adId-display-r").html('');
        }else {
            $("#all_media").removeAttr("checked");
            $(".each-data-div-media").removeClass("active-checked");
            $("input[type='checkbox'][name='input-media']").removeAttr("checked");

            $(".each-data-div-delete").css('display', 'none');//右边的X
            $("input[type='checkbox'][name='input-media']").removeClass("submit-checked");
            $(".each-data-div-delete").addClass('active-deleted');
            $(".input-ad").removeAttr('checked');
            $(".input-adId").val('');
            $(".input-adId").hide();
        }
    });

    //删除已选
    $("#dl_media").on('click', '.dl-media-all-delete',  function () {
        clearAll();
    });

});

//计算选中的内容是不是全部
function callBackLeftFun(result) {
    var sumLength =  result.parent().parent().parent().siblings('li').length;
    var checkedLength = $("input[type='checkbox'][name='input-media']:checked").length ;
    if(sumLength == checkedLength){
        $("#all_media").prop("checked", "true");
    }else {
        $("#all_media").removeAttr("checked");
    }
}

//清空全部
function clearAll() {
    $("#all_media").removeAttr("checked");
    $(".each-data-div-media").removeClass("active-checked");
    $("input[type='checkbox'][name='input-media']").removeAttr("checked");
    $(".each-data-div-delete").css('display', 'none');//右边的X
    $("input[type='checkbox'][name='input-media']").removeClass("submit-checked");
    $(".each-data-div-delete").addClass('active-deleted');
    $(".input-ad").removeAttr('checked');
    $(".input-adId").val('');
    $(".input-adId").hide();
    $(".adId-display-r").html('');
}

//拼接下发字符串
function mediaAdResult() {
    var resultData = {};
    var checked_data = $("input[type='checkbox'][name='input-media']:checked");
    for(var i = 0; i < checked_data.length; i++){
        var dingxiang_id = document.getElementById("ad-" + $(checked_data[i]).attr('id'));
        var $dingxiang_id = $(dingxiang_id);

        var guanggaowei_id = document.getElementById("adId-" + $(checked_data[i]).attr('id'));
        var $guanggaowei_id = $(guanggaowei_id);

        var pre = $(checked_data[i]).attr('id');
        if($dingxiang_id.is(":checked")){
            var uids = $guanggaowei_id.val().split(',');
            var new_uids = unique1(uids);
            resultData[pre] = new_uids.join(',').replace(/\s+/g,"");
        }else {
            resultData[pre] = '';
        }
    }
    return resultData;
}

//重新渲染
function renderMediaAd(data) {
    var newSpan = document.createElement('span');
    var newDiv = document.createElement('div');
    var newImg = document.createElement('img');

    for(var i = 0; i < data.length; i++){
        var media_id = document.getElementById(data[i].bundle_id); //被选中媒体ID
        var $media_id = $(media_id);
        var dingxiang_id = document.getElementById('ad-' + data[i].bundle_id);//选择自定义广告位定向ID
        var $dingxiang_id = $(dingxiang_id);

        var addel_id = 'adId-' + data[i].bundle_id;
        var guanggaowei_id = document.getElementById('adId-' + data[i].bundle_id);//配置的广告位ID
        var $guanggaowei_id = $(guanggaowei_id);

        var guanggaoweiname_id = document.getElementById('r-adId-' + data[i].bundle_id);//配置的广告位名字显示框ID
        // var $guanggaoweiname_id = $(guanggaoweiname_id);

        var objName =  data[i].bundle_id + '-r';//双向绑定的属性

        $media_id.prop("checked",true);//选中媒体
        media_obj[objName] = "1";//同事触发双向绑定

        if(data[i].slots.length != 0){  //如果自己定向里内容的话
            $dingxiang_id.prop("checked",true);//自定义定向被选中
            var slots_str = [];//广告位ID集合

            for(var q = 0; q < data[i].slots.length; q++)
            {
                var adId_div = newDiv.cloneNode(true);
                adId_div.setAttribute('id', "div_" + data[i].slots[q].slot_id);
                guanggaoweiname_id.appendChild(adId_div);

                var adId_span = newSpan.cloneNode(true);
                adId_span.setAttribute('class', "adId-display-r adId_span");
                adId_span.setAttribute('id', data[i].slots[q].slot_id);
                adId_span.innerHTML = data[i].slots[q].slot_name;
                adId_span.style.marginLeft =  '15px';
                adId_div.appendChild(adId_span);

                var img_delete = newImg.cloneNode(true);
                img_delete.setAttribute('src','/img/multiMenu/delete.png');
                img_delete.setAttribute('class','adId-delete-img');
                img_delete.setAttribute('id', 'img_' + data[i].slots[q].slot_id);
                img_delete.setAttribute('dingxiangID', addel_id);
                adId_div.appendChild(img_delete);

                slots_str[q] = data[i].slots[q].slot_id;
            }

            $guanggaowei_id.show();
            $guanggaowei_id.val(slots_str.join(','));
        }
        callBackLeftFun($(media_id));
    }
}

// 数组去重
function unique1(array){
    var n = []; //一个新的临时数组
    for(var i = 0; i < array.length; i++){
        if (n.indexOf(array[i]) == -1){
            n.push(array[i]);
        }
    }
    return n;
}

//根据广告位ID获得对应广告位名称，并判断当前广告位是否符合规则
function getSlotNamesFun(thisSlot) {
    var id = "r-adId-" + thisSlot.attr('id').slice(5);
    var idd = document.getElementById(id);
    var $idd = $(idd);

    var dingxiangID = "adId-" + thisSlot.attr('id').slice(5);
    var dingxiang_id = document.getElementById( "adId-" + thisSlot.attr('id').slice(5));
    var $dingxiang_id = $(dingxiang_id);
    var html = [];
    var bundle_id = thisSlot.attr('id').slice(5);
    var newSpan = document.createElement('span');
    var newDiv = document.createElement('div');
    var newImg = document.createElement('img');
    var errors = [];
    while(idd.lastChild) //当div下还存在最后的子节点时 循环继续
    {
        idd.removeChild(idd.lastChild);
    }

    var uids = thisSlot.val().split(',');
    var new_uids = unique1(uids);
    var slot_ids =  new_uids.join(',').replace(/\s+/g,"");
    getSlotNamesAPI(slot_ids, bundle_id, function (result) {
        var req = JSON.parse(result);
        var data = req.data;
        if (req.status == 1) {
            if(data.valid.length != 0){
                for(var i = 0; i < data.valid.length; i++)
                {
                    var adId_div = newDiv.cloneNode(true);
                    adId_div.setAttribute('id', "div_" + data.valid[i].slot_id);
                    idd.appendChild(adId_div);

                    var adId_span = newSpan.cloneNode(true);
                    adId_span.setAttribute('class', "adId-display-r adId_span");
                    adId_span.setAttribute('id', data.valid[i].slot_id);
                    adId_span.innerHTML = data.valid[i].name;
                    adId_span.style.marginLeft =  '15px';
                    adId_div.appendChild(adId_span);

                    var img_delete = newImg.cloneNode(true);
                    img_delete.setAttribute('src','/img/multiMenu/delete.png');
                    img_delete.setAttribute('class','adId-delete-img');
                    img_delete.setAttribute('id', 'img_' + data.valid[i].slot_id);
                    img_delete.setAttribute('dingxiangID', dingxiangID);
                    adId_div.appendChild(img_delete);
                    html.push(data.valid[i].slot_id);

                }
            }
            if(data.invalid.length != 0) {
                for(var j = 0; j < data.invalid.length; j++)
                {
                    var error = data.invalid[j].slot_id + ":<br/>" + data.invalid[j].error;
                    errors.push(error);
                }
                layer.msg(errors.join('<br/>'), {
                    time: 0 //不自动关闭
                    ,btn: ['确定']
                    ,yes: function(index){
                        layer.close(index);
                    }
                });
            }
        }else {
            layer.msg(req.msg);
        }
    })
    $dingxiang_id.val(html.join(','));
}
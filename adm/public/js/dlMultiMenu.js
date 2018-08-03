/**
 * Created by wangqi on 2017/7/25.
 */


//全局 双向绑定属性集合
var obj = {};
var tagAll = 0;

window.onload = function () {
    //如果选中了第一级的复选框，子集的复选框全部被选中 ，子集中有一个取消选中，父级的复选框就不能选中,子联动父效果有问题
    $(".dl-list-footer-cancel-btn").bind('click',function () {
        // tagAPIonSuccess(result)
        // $(".dl-list-box").hide();
        //取消的时候 要把所有checked 都转为FALSE
        // $("div[name='div-data']").children('input').removeAttr("checked");
        // $(".each-data-div-delete").css('display', 'none');
        // $("div[name='div-data']").removeClass("active-checked");
        // $("div[name='div-data']").children('input').removeClass("submit-checked");
        // $("#all").removeAttr("checked");
        // $("#all").removeClass("submit-checked");

    });
    $(".dl-affirm-btn").bind('click',function () {
        $(".dl-list").hide();
    });

    $(".dl-all-clear-btn").bind('click',function () {
        //全部清除时，将右侧部分清空，左侧部分所有checked内容 转为 FALSE
        $("div[name='div-data']").children('input').removeAttr("checked");
        $(".each-data-div-delete").css('display', 'none');
        $("div[name='div-data']").removeClass("active-checked");
        $("div[name='div-data']").children('input').removeClass("submit-checked");
        $("#all").removeAttr("checked");
        $("#all").removeClass("submit-checked");
    });
    $(".all-div").bind('click',function () {
        if ($("#all").attr('all-flag') == '0'){
            //全部 未选中状态下发生change事件 要把所有的CheckBox全部选中
            $("input[type='checkbox']", $(this).parent().parent()).prop("checked", "true");
            $("#all").attr('all-flag', '1');
            $("div[name='div-data']").addClass('active-checked');
            $("div[name='div-deldata']").css('display', 'block');
            $("div[name='div-deldata']").removeClass('active-deleted');
            $("input[type='checkbox']", $(this).parent().parent()).addClass("submit-checked");
        }
        else{
            //全部  选中状态 下发生 change 事件
            $("input[type='checkbox']", $(this).parent().parent()).removeAttr("checked");
            $("#all").attr('all-flag', '0');
            $("div[name='div-data']").removeClass('active-checked');
            $("div[name='div-deldata']").css('display', 'none');
            $("div[name='div-deldata']").addClass('active-deleted');
            $("input[type='checkbox']", $(this).parent().parent()).removeClass("submit-checked");
        }
    });
function callBackLeftFun(result) {
    var fatherId = result.closest('.has-children').children('div').children('input').attr('id');
    var sumLength =  result.parent().siblings('li').length + 1;
    var checkedLength = $("input[type='checkbox']:checked", result.parent().parent()).length ;
    if (checkedLength == 0) {
        $('#' + fatherId).removeAttr('checked');
        $('#' + fatherId).parent().removeClass("active-checked");
        $('#' + fatherId).removeClass("submit-checked");
        $('#' + fatherId + '-r').css('display', 'none');
        $('#' + fatherId + '-r').addClass('active-deleted');
    }
    else if (sumLength == checkedLength) {
        $("#" + fatherId).prop('checked', true);
        $('#' + fatherId).parent().addClass("active-checked");
        $('#' + fatherId).addClass("submit-checked");
    }
    else {
        $('#' + fatherId).removeAttr('checked');
        $('#' + fatherId).parent().removeClass("active-checked");
        $('#' + fatherId).removeClass("submit-checked");
    }

    var allSelect = $("div.each-data-div").length;
    var allSelected = $("input[type='checkbox']:checked", result.closest('.areaP')).length;
    if (allSelect == allSelected) {
        $("#all").prop("checked", "true");
        $("#all").attr('all-flag', '1');
        $("#all").parent().addClass('active-checked');
        $("#all").addClass("submit-checked");
    }
    else {
        $("#all").removeAttr("checked");
        $("#all").attr('all-flag', '0');
        $("#all").parent().removeClass('active-checked');
        $("#all").removeClass("submit-checked");
    }
}

//选中数据
    $('.each-data-div').bind('click', function () {
        //获取当前数据的父节点id
        var fatherId = $(this).closest('.has-children').children('div').children('input').attr('id');
        var objName = $(this).children('input').attr('id') + '-r';
        if ($(this).hasClass("active-checked")){
            $(this).removeClass("active-checked");
            $("input[type='checkbox']", $(this)).removeAttr("checked");
            if ($(this).parent().hasClass('has-children')){
                $("input[type='checkbox']", $(this).parent()).removeAttr("checked");
                $("div[name='div-data']", $(this).parent()).removeClass('active-checked');

                var ids = [];
                ids = $("input[type='checkbox']", $(this).parent());
                var idLength = $("input[type='checkbox']", $(this).parent()).length;
                for (var i = 0; i < idLength; i++){
                    obj[ids[i].id + '-r'] = "0";
                }
            }
            else {
                obj[objName] = "0";
            }
        }
        else{
            $(this).addClass("active-checked");
            if ($(this).parent().hasClass('has-children')){
                $("input[type='checkbox']", $(this).parent()).prop("checked","true");
                $("div[name='div-data']", $(this).parent()).addClass('active-checked');
                var ids = [];
                ids = $("input[type='checkbox']", $(this).parent());
                var idLength = $("input[type='checkbox']", $(this).parent()).length;
                for (var i = 0; i < idLength; i++){
                    obj[ids[i].id + '-r'] = "1";
                }
            }
            else {
                obj[objName] = "1";
                $("input[type='checkbox']", $(this)).prop("checked","true");
                //判断同级的元素是不是都被选中
            }
            $("#" + fatherId + "-r").css('display', 'block');//点击左侧，右侧会带着父级一起出现，目前只验证二级菜单
            $("#" + fatherId + "-r").removeClass('active-deleted');

        }
        return callBackLeftFun($(this));
    });

    function callBackRightFun(result) {
        var fatherId = result.closest('.has-children').children('div').attr('id');
        var sumLength =  result.parent().parent().siblings('li').length + 1;
        var checkedLength = $("div.active-deleted", result.parent().parent().parent()).length;
        var fatherIdLeft = fatherId.substring(0,fatherId.lastIndexOf('-r'));

        if (sumLength == 1) {
            $('#' + fatherIdLeft).removeAttr('checked');
            $('#' + fatherIdLeft).parent().removeClass("active-checked");
            $('#' + fatherIdLeft).removeClass("submit-checked");
            $("#" + fatherId).css('display', 'none');
            $("#" + fatherId).addClass('active-deleted');
        }
        else if (sumLength == checkedLength) {
            $("#" + fatherId).css('display', 'none');
            $("#" + fatherId).addClass('active-deleted');
        }
        else if (checkedLength < sumLength) {
            $('#' + fatherIdLeft).removeAttr('checked');
            $('#' + fatherIdLeft).parent().removeClass("active-checked");
            $('#' + fatherIdLeft).removeClass("submit-checked");
        }

        var allSelect = $("div.each-data-div-delete").length;
        var allSelected = $("div.active-deleted").length ;
        if (allSelected) {
            $("#all").removeAttr("checked");
            $("#all").attr('all-flag', '0');
            $("#all").parent().removeClass('active-checked');
            $("#all").removeClass("submit-checked");
        }
    }

    //右侧已选择区域中删除数据图标绑定事件
    $('.delete-img').bind('click', function () {
        var objName = $(this).parent().attr('id');
        // $(this).parent().css('display','none');
        if ($(this).parent().parent().hasClass('has-children')){
            // $("div[name='div-deldata']", $(this).parent().parent()).css('display','none');
            var ids = [];
            ids = $("div[name='div-deldata']", $(this).parent().parent());
            var idLength = $("div[name='div-deldata']", $(this).parent().parent()).length;
            for (var i = 0; i < idLength; i++){
                obj[ids[i].id] = "0";  //与左侧数据不同的是，右侧ID即为属性名称
            }
        }
        else {
            obj[objName] = "0";
        }
        return callBackRightFun($(this));
    });

//控制菜单展开收起的箭头图标绑定事件
    $('.unfold-img').bind('click', function (event) {
        if($(this).parent().hasClass("active")){
            $(this).parent().removeClass("active");
            $("img[class='unfold-img']", $(this).parent()).attr('src','/img/multiMenu/fold.png');

        }else{
            $(this).parent().addClass("active");
            $("img[class='unfold-img']", $(this).parent()).attr('src','/img/multiMenu/unfold.png');
        }
        if ($(this).parent().parent().hasClass('has-children')){
            $(this).parent().parent().children('ul').slideToggle(300);
        }
        event.stopPropagation();
    });

    //鼠标悬浮在每条数据上的突出显示效果
    $('.each-data-div, .each-data-div-delete, .all-div').bind('mouseover', function () {
        $(this).addClass('mouseover-style');
    });
    $('.each-data-div, .each-data-div-delete, .all-div').bind('mouseleave', function () {
        $(this).removeClass('mouseover-style');
    });

};

function itializeiFun() {
    document.getElementById("dl-list").innerHTML =
        ["                <div class=\"dl-list-box\">",
            "                    <div class=\"dl-list-top-box\">",
            "                        <div class=\"dl-list-top-box-find-input\">",
            // "                            <input class=\"dl-list-top-box-left-find-input\" type=\"text\">",//搜索框
            // "                            <div class=\"dl-list-top-box-left-find-btn\">",
            // "                                <img src=\"/img/multiMenu/findBtn.png\">",
            // "                            </div>",
            "                                <span class='list-left-label'>待选择项</span>",
            "                        </div>",
            "                        <div class=\"dl-list-top-box-show-frame\">",
            "                            <span class='list-right-label'>已选择</span>",
            "                            <input class=\"dl-all-clear-btn\" type=\"button\" value=\"全部清除\">",
            "                        </div>",
            "                    </div>",
            "                    <div class=\"dl-list-container\">",
            "                        <div class=\"dl-list-container-select\" id = \"dl-list-container-select-frame\">",//左侧数据内容
            "                        </div>",
            "                        <div class=\"dl-list-container-checked\" id = \"dl-list-container-checked-frame\"></div>",//右侧选中内容
            "                    </div>",
            "                    <div class=\"dl-list-footer\">",
            "                        <div class=\"dl-list-footer-affirm-frame\">",
            "                            <input class=\"dl-affirm-btn\" type=\"button\" value=\"确认选择\">",
            "                        </div>",
            "                        <div class=\"dl-list-footer-cancel-frame\">",
            "                            <input class=\"dl-list-footer-cancel-btn\" type=\"button\" value=\"取消\">",
            "                        </div>",
            "                    </div>",
            "                </div>"].join("");
}

function multiMenuEntry(dataTemp) {
    //初始化弹框框架
    itializeiFun();

//基本一些元素的创建
    var newDiv = document.createElement('div');
    var newUl = document.createElement('ul');
    var newLi = document.createElement('li');
    var newInput = document.createElement('input');
    var newLabel = document.createElement('label');
    var newImg = document.createElement('img');

    var listIdLeft = document.getElementById('dl-list-container-select-frame');
    var listIdRight = document.getElementById('dl-list-container-checked-frame');

// 左侧
    var areaLeft = newDiv.cloneNode(true);
    areaLeft.setAttribute('class', 'areaLeft'); // 把这部分插入到  dl-list-container-select-frame  中
    areaLeft.setAttribute('width', '100%');
    listIdLeft.appendChild(areaLeft);

//右侧
    var areaRight = newDiv.cloneNode(true);
    areaRight.setAttribute('class', 'areaRight');//  把这部分插入到  dl-list-container-checked-frame  中
    listIdRight.appendChild(areaRight);

    var areaP = newDiv.cloneNode(true); //一条数据的盒子
    areaP.setAttribute('class', 'areaP');
    areaLeft.appendChild(areaP);

    var areapRight = newDiv.cloneNode(true);
    areapRight.setAttribute('class', 'areapRight');
    areaRight.appendChild(areapRight);

    fun_list(dataTemp, 0);
    function fun_list(dataTemp, ff, li) {
        fun_list_left(dataTemp, 0, li);
        fun_list_right(dataTemp, 0, li);
    }

    function fun_list_left(dataTemp, ff_left, li) {
        var number = 0;
        if (ff_left) {
            var ul = newUl.cloneNode(true);
            li.appendChild(ul);
        }
        else {
            var ul = newUl.cloneNode(true);
            ul.setAttribute('class', 'cd-accordion-menu animated');
            areaP.appendChild(ul);
            var li = newLi.cloneNode(true);
            li.setAttribute('class', 'li-class');
            ul.appendChild(li);

            var div = newDiv.cloneNode(true);
            div.setAttribute('class', 'all-div child-none');
            li.appendChild(div);

            var input = newInput.cloneNode(true);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', 'all');
            input.setAttribute('id', 'all');
            input.setAttribute('all-flag', '0');
            input.setAttribute('class','input-left');
            div.appendChild(input);

            var label = newLabel.cloneNode(true);
            // label.setAttribute('for', 'all');
            label.setAttribute('class','left-label');
            label.innerHTML = '全部';
            div.appendChild(label);
        }
        for (var i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].child) {
                var li = newLi.cloneNode(true);
                li.setAttribute('class', 'li-class  has-children');
                ul.appendChild(li);
                var div = newDiv.cloneNode(true);
                div.setAttribute('class', 'has-children each-data-div');
                div.setAttribute('name', 'div-data');
                li.appendChild(div);

                var input = newInput.cloneNode(true);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', dataTemp[i].name);
                input.setAttribute('id', dataTemp[i].id);
                input.setAttribute('class', 'input-left');
                // input.setAttribute('checked',true);
                div.appendChild(input);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class','left-label');
                // label.setAttribute('for', dataTemp[i].id);
                label.innerHTML = dataTemp[i].name;
                label.style.marginLeft = ( dataTemp[i].row ) * 10 + 'px';
                div.appendChild(label);

                var img = newImg.cloneNode(true);
                img.setAttribute('src','/img/multiMenu/fold.png');
                img.setAttribute('class','unfold-img');
                div.appendChild(img);

                fun_list_left(dataTemp[i].child, 1, li);//递归调用
                number++;

            } else {
                var li = newLi.cloneNode(true);
                li.setAttribute('class', 'li-class');
                ul.setAttribute('class', 'child-none');
                ul.appendChild(li);

                var div = newDiv.cloneNode(true);
                div.setAttribute('class', 'each-data-div ');
                div.setAttribute('name', 'div-data');
                li.appendChild(div);

                var input = newInput.cloneNode(true);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', dataTemp[i].name);
                input.setAttribute('id', dataTemp[i].id);
                input.setAttribute('class', 'check input-left');
                div.appendChild(input);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class','left-label');
                // label.setAttribute('for', dataTemp[i].id);
                label.innerHTML = dataTemp[i].name;
                label.style.marginLeft = (dataTemp[i].row + 1) * 10 + 'px';
                div.appendChild(label);

                tagAll++;
            }
        }
    }

    function fun_list_right(dataTemp, ff_right, li) {
        if (ff_right) {
            var ul = newUl.cloneNode(true);
            li.appendChild(ul);
        }
        else {
            var ul = newUl.cloneNode(true);
            ul.setAttribute('class', 'cd-accordion-menu animated');
            areapRight.appendChild(ul);
        }

        for (var i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].child) {
                var li = newLi.cloneNode(true);
                li.setAttribute('class', 'li-class  has-children');
                ul.appendChild(li);

                var div = newDiv.cloneNode(true);
                div.setAttribute('class','each-data-div-delete active-deleted active');
                div.setAttribute('name','div-deldata');
                div.setAttribute('id', dataTemp[i].id + '-r');
                li.appendChild(div);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class', 'delete-label');
                label.innerHTML = dataTemp[i].name;
                label.style.marginLeft = ( dataTemp[i].row + 1) * 10 + 'px';
                div.appendChild(label);

                var img_fold = newImg.cloneNode(true);
                img_fold.setAttribute('src','/img/multiMenu/unfold.png');
                img_fold.setAttribute('class','unfold-img');
                div.appendChild(img_fold);

                var img_delete = newImg.cloneNode(true);
                img_delete.setAttribute('src','/img/multiMenu/delete.png');
                img_delete.setAttribute('class','delete-img');
                div.appendChild(img_delete);

                fun_list_right(dataTemp[i].child, 1, li);//递归调用
                //终于递归成功

            } else {
                var li = newLi.cloneNode(true);
                li.setAttribute('class', 'li-class');
                ul.appendChild(li);

                var div = newDiv.cloneNode(true);
                div.setAttribute('class','each-data-div-delete active-deleted');
                div.setAttribute('name','div-deldata');
                div.setAttribute('id', dataTemp[i].id + '-r');
                li.appendChild(div);

                var label = newLabel.cloneNode(true);
                label.innerHTML = dataTemp[i].name;
                label.setAttribute('class','delete-span');
                label.style.marginLeft = ( dataTemp[i].row + 1) * 10 + 'px';
                div.appendChild(label);

                var img = newImg.cloneNode(true);
                img.setAttribute('src','/img/multiMenu/delete.png');
                img.setAttribute('class','delete-img');
                div.appendChild(img);
            }
        }
    }

    //双向绑定属性操作
    funSetProperty(dataTemp);
}


function funSetProperty(dataTemp) {
    for (var i = 0; i < dataTemp.length; i++) {
        var data = dataTemp[i].id;
        var dataName = data + "-r";
        Object.defineProperty(obj, dataName, {  //循环创建属性
            set:function(data){
                return function (newVal) {
                    if (newVal == 1){
                        $('#' + data).prop('checked', true);
                        $('#' + data).parent().addClass("active-checked");
                        $('#' + data + '-r').css('display', 'block');
                        $('#' + data).addClass("submit-checked");
                        $('#' + data + '-r').removeClass('active-deleted');
                    }else {
                        $('#' + data).removeAttr('checked');//左边的CheckBox
                        $('#' + data).parent().removeClass("active-checked");  //用active_checked 来做标识，最后被选中的
                        $('#' + data + '-r').css('display', 'none');//右边的X
                        $('#' + data).removeClass("submit-checked");
                        $('#' + data + '-r').addClass('active-deleted');
                    }
                }
            }(data)
        });

        if (dataTemp[i].child) {
            funSetProperty(dataTemp[i].child);
        }
    }
}

//下发的数据是拼接字符串的
function submitStr(dataTemp) {
    var strChecked = [];
    var x = document.getElementsByClassName('check submit-checked');
    //要下发的数据，已经单个提出来了，然后用class='check' 区分它是最底层的数据
    for (var i = 0; i < x.length; i++) {
        var idTemp = x[i].getAttribute('id');
        var linshi = idTemp.replace(/-/, ':');
        strChecked[i] = linshi;
    }
    var str = strChecked.join(',');
    return str;
}

function submitName(dataTemp) {
    var strChecked = [];
    var x = document.getElementsByClassName('check submit-checked');
    //要下发的数据，已经单个提出来了，然后用class='check' 区分它是最底层的数据
    for (var i = 0; i < x.length; i++) {
        strChecked[i] = x[i].getAttribute('name');
    }
    var strName = strChecked.join(',');
    return strName;
}

//修改计划页，广告行为定向初始化
function editItializeiFun(checkedData) {
    $('#' + checkedData).prop('checked', true);
    $('#' + checkedData).parent().addClass("active-checked");
    $('#' + checkedData + '-r').css('display', 'block');
    $('#' + checkedData + '-r').removeClass('active-deleted')
    $('#' + checkedData).addClass("submit-checked");
    //将子级的父级一同显示在右侧已选择框内
    var fatherId = $('#' + checkedData).closest('.has-children').children('div').children('input').attr('id');
    $("#" + fatherId + "-r").css('display', 'block');
    $("#" + fatherId + "-r").removeClass('active-deleted');
    //初始化时，判断左侧父级是否应该被勾选
    var sumLength =  $('#' + checkedData).parent().parent().siblings('li').length + 1;
    var checkedLength = $("input[type='checkbox']:checked", $('#' + checkedData).parent().parent().parent()).length;
    if (sumLength == checkedLength) {
        $("#" + fatherId).prop('checked', true);
        $('#' + fatherId).parent().addClass("active-checked");
        $('#' + fatherId).addClass("submit-checked");
    }

}
//获取最底层标签总数据
function getTagCount() {
    return tagAll;
}
//刷新，清空列表数据
function refreshMultiMenu() {
    $("div[name='div-data']").children('input').removeAttr("checked");
    $(".each-data-div-delete").css('display', 'none');
    $("div[name='div-data']").removeClass("active-checked");
    $("div[name='div-data']").children('input').removeClass("submit-checked");
    $("#all").removeAttr("checked");
    $("#all").removeClass("submit-checked");
}
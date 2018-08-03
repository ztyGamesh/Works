/**
 * Created by yingxiangchen on 18/4/7.
 */

(function ($) {

    function MultiMenu() {
        return {
            _defaults: {
                title: '',
                apiFunc: null,
                apiCallbackFunc: null,
                chooseData: null,
                isListShow: false
            },

            _bind: function (target, dom) {
                var settings = this._settings;
                var _this = this;
                var target = this._target;
                var obj = this._objState;

                $(dom['title']).bind('click', function () {
                    if (settings.isListShow) {
                        $(dom['list']).hide();
                        settings.isListShow = false;
                    }
                    else {
                        $(dom['list']).show();
                        settings.isListShow = true;
                    }
                });

                $(dom['select']).change(function () {
                    if ($(this).val() == "1") {//自定义
                        $(dom['group']).slideDown();
                    } else if ($(this).val() == "0") {//不限
                        $(dom['group']).slideUp();
                    }
                });

                $(dom['cancelBtn']).click(function () {
                    _this._refreshMultiMenu();
                    if (settings.chooseData) {
                        var lastAdTarget = settings.chooseData;
                        for (var i = 0; i < lastAdTarget.length; i++) {
                            _this._editItializeiFun(lastAdTarget[i].level2);//重新勾选
                        }
                        $(dom['title']).html(_this._submitName());
                    } else {
                        $(dom['title']).html('自定义广告行为定向可多选');
                    }
                    $(dom['list']).hide();
                    settings.isListShow = false;
                });

                $(dom['affirmBtn']).click(function () {
                    dom['list'].hide();

                    var showName = _this._submitName();
                    if (showName.length > 40) {
                        showName = showName.substring(0, 40) + '...';
                    }
                    if (showName != '') {
                        $(dom['title']).html(showName);
                    }
                    else {
                        $(dom['title']).html('自定义广告行为定向可多选');
                    }
                    $(dom['list']).hide();
                    settings.isListShow = false;
                });


                $(dom['clearBtn']).click(function () {
                    _this._refreshMultiMenu();
                });

                $(target).find('.all-div').click(function () {
                    if ($(target).find("[data-id='all']").attr('all-flag') == '0') {
                        //全部 未选中状态下发生change事件 要把所有的CheckBox全部选中
                        $("input[type='checkbox']", $(this).closest('.areaP')).prop("checked", "true");
                        $(target).find("[data-id='all']").attr('all-flag', '1');
                        $(target).find("div[name='div-data']").addClass('active-checked');
                        $(target).find("div[name='div-deldata']").css('display', 'block');
                        $(target).find("div[name='div-deldata']").removeClass('active-deleted');
                        $("input[type='checkbox']", $(this).closest('.areaP')).addClass("submit-checked");
                    }
                    else {
                        //全部  选中状态 下发生 change 事件
                        $("input[type='checkbox']", $(this).closest('.areaP')).removeAttr("checked");
                        $(target).find("[data-id='all']").attr('all-flag', '0');
                        $(target).find("div[name='div-data']").removeClass('active-checked');
                        $(target).find("div[name='div-deldata']").css('display', 'none');
                        $(target).find("div[name='div-deldata']").addClass('active-deleted');
                        $("input[type='checkbox']", $(this).closest('.areaP')).removeClass("submit-checked");
                    }
                });

                $(target).find('.each-data-div').click(function () {
                    //获取当前数据的父节点id
                    var fatherId = $(this).closest('.has-children').children('div').children('input').attr('data-id');
                    var grandfatherId = $(this).parent().parent().closest('.has-children').children('div').children('input').attr('data-id');
                    var grandgrandfatherId = $(this).closest('.has-children').parent().parent().children('div').children('input').attr('data-id');
                    if ($(this).closest('.has-children').children('div').children('input')) {

                    }
                    var objName = $(this).children('input').attr('data-id') + '-r';
                    if ($(this).hasClass("active-checked")) {
                        $(this).removeClass("active-checked");
                        $(this).removeAttr("checked");
                        if ($(this).parent().hasClass('has-children')) {
                            $(this).parent().removeAttr("checked");
                            $(this).parent().removeClass('active-checked');

                            var ids = [];
                            ids = $("input[type='checkbox']", $(this).parent());
                            var idLength = $("input[type='checkbox']", $(this).parent()).length;
                            for (var i = 0; i < idLength; i++) {
                                obj[$(ids[i]).attr('data-id') + '-r'] = "0";
                            }
                        }
                        else {
                            obj[objName] = "0";
                        }
                    }
                    else {
                        $(this).addClass("active-checked");
                        if ($(this).parent().hasClass('has-children')) {
                            $("input[type='checkbox']", $(this).parent()).prop("checked", "true");
                            $("div[name='div-data']", $(this).parent()).addClass('active-checked');
                            var ids = [];
                            ids = $("input[type='checkbox']", $(this).parent());
                            var idLength = $("input[type='checkbox']", $(this).parent()).length;
                            for (var i = 0; i < idLength; i++) {
                                obj[$(ids[i]).attr('data-id') + '-r'] = "1";
                            }
                        }
                        else {
                            obj[objName] = "1";
                            $("input[type='checkbox']", $(this)).prop("checked","true");
                            //判断同级的元素是不是都被选中
                        }
                        $(target).find("[data-id='" + fatherId + "-r']").css('display', 'block');
                        $(target).find("[data-id='" + fatherId + "-r']").removeClass('active-deleted');

                        $(target).find("[data-id='" + grandfatherId + "-r']").css('display', 'block');
                        $(target).find("[data-id='" + grandfatherId + "-r']").removeClass('active-deleted');

                        $(target).find("[data-id='" + grandgrandfatherId + "-r']").css('display', 'block');
                        $(target).find("[data-id='" + grandgrandfatherId + "-r']").removeClass('active-deleted');
                    }
                    return _this._callBackLeftFun($(this));
                });

                $(target).find('.delete-img').click(function () {
                    var objName = $(this).parent().attr('data-id');
                    if ($(this).parent().parent().hasClass('has-children')) {
                        var ids = [];
                        ids = $("div[name='div-deldata']", $(this).parent().parent());
                        var idLength = $("div[name='div-deldata']", $(this).parent().parent()).length;
                        for (var i = 0; i < idLength; i++) {
                            obj[$(ids[i]).attr('data-id')] = "0";  //与左侧数据不同的是，右侧ID即为属性名称
                        }
                    }
                    else {
                        obj[objName] = "0";
                    }
                    return _this._callBackRightFun($(this));
                });

                $(target).find('.unfold-img').click(function () {
                    if ($(this).parent().hasClass("active")) {
                        $(this).parent().removeClass("active");
                        $("img[class='unfold-img']", $(this).parent()).attr('src', '/img/multiMenu/fold.png');

                    } else {
                        $(this).parent().addClass("active");
                        $("img[class='unfold-img']", $(this).parent()).attr('src', '/img/multiMenu/unfold.png');
                    }
                    if ($(this).parent().parent().hasClass('has-children')) {
                        $(this).parent().parent().children('ul').slideToggle(300);
                    }
                    event.stopPropagation();
                });

                $(dom['list']).on('mouseover', '.each-data-div, .each-data-div-delete, .all-div', function () {
                    $(this).addClass('mouseover-style');
                });
                $(dom['list']).on('mouseleave', '.each-data-div, .each-data-div-delete, .all-div', function () {
                    $(this).removeClass('mouseover-style');
                });
            },

            _callBackLeftFun: function (result) {
                var target = this._target;
                var fatherId = result.closest('.has-children').children('div').children('input').attr('data-id');
                var sumLength = result.parent().siblings('li').length + 1;
                var checkedLength = $("input[type='checkbox']:checked", result.parent().parent()).length;
                if (checkedLength == 0) {
                    $(target).find('[data-id="' + fatherId + '"]').removeAttr('checked');
                    $(target).find('[data-id="' + fatherId + '"]').parent().removeClass("active-checked");
                    $(target).find('[data-id="' + fatherId + '"]').removeClass("submit-checked");
                    $(target).find('[data-id="' + fatherId + '-r"]').css('display', 'none');
                    $(target).find('[data-id="' + fatherId + '-r"]').addClass('active-deleted');
                }
                else if (sumLength == checkedLength) {
                    $(target).find('[data-id="' + fatherId + '"]').prop('checked', true);
                    $(target).find('[data-id="' + fatherId + '"]').parent().addClass("active-checked");
                    $(target).find('[data-id="' + fatherId + '"]').addClass("submit-checked");
                }
                else {
                    $(target).find('[data-id="' + fatherId + '"]').removeAttr('checked');
                    $(target).find('[data-id="' + fatherId + '"]').parent().removeClass("active-checked");
                    $(target).find('[data-id="' + fatherId + '"]').removeClass("submit-checked");
                }

                if (result.hasClass('has-children')) {
                    //点第二层点到全选  grandfatherId是会改变的
                    var grandfatherId = result.parent().parent().closest('.has-children').children('div').children('input').attr('data-id');
                    var secondLength = $("input[type='checkbox']", result.closest('.has-children').parent().parent()).length;
                    var secondCheckedLength = $("input[type='checkbox']:checked", result.parent().parent().parent()).length;
                    if (secondCheckedLength == 0) {
                        $(target).find('[data-id="' + grandfatherId + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + grandfatherId + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + grandfatherId + '"]').removeClass("submit-checked");
                        $(target).find('[data-id="' + grandfatherId + '-r"]').css('display', 'none');
                        $(target).find('[data-id="' + grandfatherId + '-r"]').addClass('active-deleted');
                    }
                    else if (secondLength == secondCheckedLength) {
                        $(target).find('[data-id="' + grandfatherId + '"]').prop('checked', true);
                        $(target).find('[data-id="' + grandfatherId + '"]').parent().addClass("active-checked");
                        $(target).find('[data-id="' + grandfatherId + '"]').addClass("submit-checked");
                    }
                    else {
                        $(target).find('[data-id="' + grandfatherId + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + grandfatherId + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + grandfatherId + '"]').removeClass("submit-checked");
                    }
                }

                //点第三层点到全选
                var grandgrandfatherId = result.closest('.has-children').parent().parent().children('div').children('input').attr('data-id');
                var grandfatherSumLength = $("input[type='checkbox']", result.closest('.has-children').parent().parent()).length - 1;
                var grandfatherCheckedLength = $("input[type='checkbox']:checked", result.parent().parent().parent().parent()).length;
                if (grandfatherCheckedLength == 0) {
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').removeAttr('checked');
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').parent().removeClass("active-checked");
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').removeClass("submit-checked");
                    $(target).find('[data-id="' + grandgrandfatherId + '-r"]').css('display', 'none');
                    $(target).find('[data-id="' + grandgrandfatherId + '-r"]').addClass('active-deleted');
                }
                else if (grandfatherSumLength == grandfatherCheckedLength) {
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').prop('checked', true);
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').parent().addClass("active-checked");
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').addClass("submit-checked");
                }
                else {
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').removeAttr('checked');
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').parent().removeClass("active-checked");
                    $(target).find('[data-id="' + grandgrandfatherId + '"]').removeClass("submit-checked");
                }

                var allSelect = $(target).find("div.each-data-div").length;
                var allSelected = $("input[type='checkbox']:checked", result.closest('.areaP')).length;
                if (allSelect == allSelected) {
                    $(target).find("[data-id='all']").prop("checked", "true");
                    $(target).find("[data-id='all']").attr('all-flag', '1');
                    $(target).find("[data-id='all']").parent().addClass('active-checked');
                    $(target).find("[data-id='all']").addClass("submit-checked");
                }
                else {
                    $(target).find("[data-id='all']").removeAttr("checked");
                    $(target).find("[data-id='all']").attr('all-flag', '0');
                    $(target).find("[data-id='all']").parent().removeClass('active-checked');
                    $(target).find("[data-id='all']").removeClass("submit-checked");
                }
            },

            _callBackRightFun: function (result) {
                var target = this._target;
                var fatherId = result.closest('.has-children').children('div').attr('data-id');
                var sumLength = result.parent().parent().siblings('li').length + 1;
                var checkedLength = $("div.active-deleted", result.parent().parent().parent()).length;
                if (fatherId) {
                    var fatherIdLeft = fatherId.substring(0, fatherId.lastIndexOf('-r'));

                    if (sumLength == 1) {
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + fatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeClass("submit-checked");
                        $(target).find('[data-id="' + fatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + fatherId + '"]').addClass('active-deleted');
                    }
                    else if (sumLength == checkedLength) {
                        $(target).find('[data-id="' + fatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + fatherId + '"]').addClass('active-deleted');
                    }
                    else if (checkedLength < sumLength) {
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + fatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeClass("submit-checked");
                    }
                }

                if (result.parent().parent().hasClass('has-children')) {
                    var fatherIdLeft = fatherId.substring(0, fatherId.lastIndexOf('-r'));

                    if (sumLength == 1) {
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + fatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeClass("submit-checked");
                        $(target).find('[data-id="' + fatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + fatherId + '"]').addClass('active-deleted');
                    }
                    else if (sumLength == checkedLength) {
                        $(target).find('[data-id="' + fatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + fatherId + '"]').addClass('active-deleted');
                    }
                    else if (checkedLength < sumLength) {
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + fatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + fatherIdLeft + '"]').removeClass("submit-checked");
                    }

                    //点第二层
                    var grandfatherId = result.parent().parent().parent().closest('.has-children').children('div').attr('data-id');
                    if (typeof(grandfatherId) != "undefined") {
                        var grandfatherIdLeft = grandfatherId.substring(0, grandfatherId.lastIndexOf('-r'));
                        var secondLength = $("div[name='div-deldata']", result.closest('.has-children').parent().parent()).length - 1;
                        var secondCheckedLength = $("div.active-deleted", result.parent().parent().parent().parent()).length;
                        if (secondLength == 1) {
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').removeAttr('checked');
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').parent().removeClass("active-checked");
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').removeClass("submit-checked");
                            $(target).find('[data-id="' + grandfatherId + '"]').css('display', 'none');
                            $(target).find('[data-id="' + grandfatherId + '"]').addClass('active-deleted');
                        }
                        else if (secondLength == secondCheckedLength) {
                            $(target).find('[data-id="' + grandfatherId + '"]').css('display', 'none');
                            $(target).find('[data-id="' + grandfatherId + '"]').addClass('active-deleted');
                        }
                        else if (secondCheckedLength < secondLength) {
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').removeAttr('checked');
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').parent().removeClass("active-checked");
                            $(target).find('[data-id="' + grandfatherIdLeft + '"]').removeClass("submit-checked");
                        }
                    }
                }

                //点第三层点到全选
                var grandgrandfatherId = result.closest('.has-children').parent().parent().children('div').attr('data-id');
                if (typeof(grandgrandfatherId) != "undefined") {
                    var grandgrandfatherIdLeft = grandgrandfatherId.substring(0, grandgrandfatherId.lastIndexOf('-r'));
                    var grandfatherSumLength = $("div[name='div-deldata']", result.closest('.has-children').parent().parent()).length - 1;
                    var grandfatherCheckedLength = $("div.active-deleted", result.closest('.has-children').parent().parent()).length;
                    if (grandfatherSumLength == 1) {
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').removeClass("submit-checked");
                        $(target).find('[data-id="' + grandgrandfatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + grandgrandfatherId + '"]').addClass('active-deleted');
                    }
                    else if (grandfatherSumLength == grandfatherCheckedLength) {
                        $(target).find('[data-id="' + grandgrandfatherId + '"]').css('display', 'none');
                        $(target).find('[data-id="' + grandgrandfatherId + '"]').addClass('active-deleted');
                    }
                    else if (grandfatherCheckedLength < grandfatherSumLength) {
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').removeAttr('checked');
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').parent().removeClass("active-checked");
                        $(target).find('[data-id="' + grandgrandfatherIdLeft + '"]').removeClass("submit-checked");
                    }
                }

                var allSelect = $(target).find("div.each-data-div-delete").length;
                var allSelected = $(target).find("div.active-deleted").length;
                if (allSelected) {
                    $(target).find("[data-id='all']").removeAttr("checked");
                    $(target).find("[data-id='all']").attr('all-flag', '0');
                    $(target).find("[data-id='all']").parent().removeClass('active-checked');
                    $(target).find("[data-id='all']").removeClass("submit-checked");
                }
            },

            _createHtml: function (target, settings, data) {
                context =
                    '<div class="form-group advertising-behavior-orientation">\
                        <label class="col-md-2 col-md-offset-1 control-label">' + settings['title'] + '</label>\
                        <div class="col-md-7">\
                            <select class="selectpicker" data-width="100%" name="multimenu-select">\
                                <option value="0">不限</option>\
                                <option value="1">自定义</option>\
                            </select>\
                        </div>\
                        <span class="help-block col-md-7 col-md-offset-3"></span>\
                    </div>\
                    <div class="form-group" style="display: none " name="multimenu-group">\
                        <label class="col-md-2 col-md-offset-1  control-label">选择定向</label>\
                        <div class="col-md-7 ">\
                            <div name="multimenu-title" class="multimenu-title">自定义' + settings['title'] + '可多选</div>\
                            <div name="multimenu-list" class="multimenu-list">\
                                <div class="dl-list-box">\
                                    <div class="dl-list-top-box">\
                                        <div class="dl-list-top-box-find-input">\
                                            <span class="list-left-label">待选择项</span>\
                                        </div>\
                                        <div class="dl-list-top-box-show-frame">\
                                            <span class="list-right-label">已选择</span>\
                                            <input class="dl-all-clear-btn" type="button" value="全部清除">\
                                        </div>\
                                    </div>\
                                    <div class="dl-list-container">\
                                         <div class="dl-list-container-select" name="multimenu-select-frame">\
                                            <div class="areaLeft" width="100%">\
                                                <div class="areaP" name="areaP"></div>\
                                            </div>\
                                         </div>\
                                         <div class="dl-list-container-checked" name="multimenu-checked-frame">\
                                            <div class="areaRight">\
                                                <div class="areapRight" name="areapRight"></div>\
                                            </div>\
                                         </div>\
                                    </div>\
                                    <div class="dl-list-footer">\
                                         <div class="dl-list-footer-affirm-frame">\
                                             <input class="dl-affirm-btn" type="button" value="确认选择">\
                                         </div>\
                                         <div class="dl-list-footer-cancel-frame">\
                                            <input class="dl-list-footer-cancel-btn" type="button" value="取消">\
                                         </div>\
                                    </div>\
                                 </div>\
                            </div>\
                        </div>\
                    </div>';
                target.append(context);
            },

            _funSetProperty: function (dataTemp) {
                var obj = this._objState;
                var target = this._target;
                for (var i = 0; i < dataTemp.length; i++) {
                    var data = dataTemp[i].id;
                    var dataName = data + "-r";
                    Object.defineProperty(obj, dataName, {  //循环创建属性
                        set: function (data) {
                            return function (newVal) {
                                if (newVal == 1) {
                                    $(target).find('[data-id="' + data + '"]').prop('checked', true);
                                    $(target).find('[data-id="' + data + '"]').parent().addClass("active-checked");
                                    $(target).find('[data-id="' + data + '-r"]').css('display', 'block');
                                    $(target).find('[data-id="' + data + '"]').addClass("submit-checked");
                                    $(target).find('[data-id="' + data + '-r"]').removeClass('active-deleted');
                                } else {
                                    $(target).find('[data-id="' + data + '"]').removeAttr('checked');//左边的CheckBox
                                    $(target).find('[data-id="' + data + '"]').parent().removeClass("active-checked");  //用active_checked 来做标识，最后被选中的
                                    $(target).find('[data-id="' + data + '-r"]').css('display', 'none');//右边的X
                                    $(target).find('[data-id="' + data + '"]').removeClass("submit-checked");
                                    $(target).find('[data-id="' + data + '-r"]').addClass('active-deleted');
                                }
                            }
                        }(data),
                        configurable: true
                    });

                    if (dataTemp[i].child) {
                        this._funSetProperty(dataTemp[i].child);
                    }
                }
            },

            //修改计划页，广告行为定向初始化
            _editItializeiFun: function (checkedData) {
                var target = this._target;
                $(target).find('[data-id="' + checkedData + '"]').prop('checked', true);
                $(target).find('[data-id="' + checkedData + '"]').parent().addClass("active-checked");
                $(target).find('[data-id="' + checkedData + '-r"]').css('display', 'block');
                $(target).find('[data-id="' + checkedData + '-r"]').removeClass('active-deleted')
                $(target).find('[data-id="' + checkedData + '"]').addClass("submit-checked");
                //将子级的父级一同显示在右侧已选择框内
                var fatherId = $(target).find('[data-id="' + checkedData + '"]').closest('.has-children').children('div').children('input').attr('data-id');
                $(target).find('[data-id="' + fatherId + '-r"]').css('display', 'block');
                $(target).find('[data-id="' + fatherId + '-r"]').removeClass('active-deleted');
                //把第一层父亲带上
                var grandfatherId = $(target).find('[data-id="' + checkedData + '"]').closest('.has-children').parent().parent().children('div').children('input').attr('data-id');
                $(target).find('[data-id="' + grandfatherId + '-r"]').css('display', 'block');
                $(target).find('[data-id="' + grandfatherId + '-r"]').removeClass('active-deleted');


                //初始化时，判断左侧第二层父级是否应该被勾选
                var sumLength = $(target).find('[data-id="' + checkedData + '"]').parent().parent().siblings('li').length + 1;
                var checkedLength = $("input[type='checkbox']:checked", $('[data-id="' + checkedData + '"]').parent().parent().parent()).length;
                if (sumLength == checkedLength) {
                    $(target).find('[data-id="' + fatherId + '"]').prop('checked', true);
                    $(target).find('[data-id="' + fatherId + '"]').parent().addClass("active-checked");
                    $(target).find('[data-id="' + fatherId + '"]').addClass("submit-checked");
                }

                //判断第一层父级是否该选中
                var fatherSumLength = $("input[type='checkbox']", $('[data-id="' + checkedData + '"]').closest('.has-children').parent().parent()).length - 1;
                var fatherCheckedLength = $("input[type='checkbox']:checked", $('[data-id="' + checkedData + '"]').parent().parent().parent().parent()).length;
                if (fatherSumLength == fatherCheckedLength) {
                    $(target).find('[data-id="' + fatherSumLength + '"]').prop('checked', true);
                    $(target).find('[data-id="' + fatherSumLength + '"]').parent().addClass("active-checked");
                    $(target).find('[data-id="' + fatherSumLength + '"]').addClass("submit-checked");
                }
            },

            _submitStr: function () {
                var strChecked = [];
                var x = $(this._target).find('.check.submit-checked');
                //要下发的数据，已经单个提出来了，然后用class='check' 区分它是最底层的数据
                for (var i = 0; i < x.length; i++) {
                    var idTemp = $(x[i]).attr('data-id');
                    var linshi = idTemp.replace(/-/, ':');
                    strChecked[i] = linshi;
                }
                var str = strChecked.join(',');
                return str;
            },

            _submitStrSubstring: function () {
                var strChecked = [];
                var x = $(this._target).find('.check.submit-checked');
                //要下发的数据，已经单个提出来了，然后用class='check' 区分它是最底层的数据
                for (var i = 0; i < x.length; i++) {
                    var idTemp = $(x[i]).attr('data-id');
                    var linshi = idTemp.substring(2);
                    strChecked[i] = linshi;
                }
                var str = strChecked.join(',');
                return str;
            },

            _submitName: function () {
                var strChecked = [];
                var x = $(this._target).find('.check.submit-checked');
                //要下发的数据，已经单个提出来了，然后用class='check' 区分它是最底层的数据
                for (var i = 0; i < x.length; i++) {
                    strChecked[i] = $(x[i]).attr('name');
                }
                var strName = strChecked.join(',');
                return strName;
            },

            _multiMenuEntry: function (dataTemp) {
                var dataId = this._target;
                var tagAll = this._tagAll;
                //基本一些元素的创建
                var newDiv = document.createElement('div');
                var newUl = document.createElement('ul');
                var newLi = document.createElement('li');
                var newInput = document.createElement('input');
                var newLabel = document.createElement('label');
                var newImg = document.createElement('img');

                var areaP = $(dataId).find('[name="areaP"]');
                var areapRight = $(dataId).find('[name="areapRight"]');

                fun_list(dataTemp, 0);
                function fun_list(dataTemp, ff, li) {
                    fun_list_left(dataTemp, 0, li);
                    fun_list_right(dataTemp, 0, li);
                }

                function fun_list_left(dataTemp, ff_left, li) {
                    var number = 0;
                    if (ff_left) {
                        var ul = newUl.cloneNode(true);
                        li.append(ul);
                    }
                    else {
                        var ul = newUl.cloneNode(true);
                        ul.setAttribute('class', 'cd-accordion-menu animated');
                        areaP.append(ul);
                        var li = newLi.cloneNode(true);
                        li.setAttribute('class', 'li-class');
                        ul.appendChild(li);

                        var div = newDiv.cloneNode(true);
                        div.setAttribute('class', 'all-div child-none');
                        li.appendChild(div);

                        var input = newInput.cloneNode(true);
                        input.setAttribute('type', 'checkbox');
                        input.setAttribute('name', 'all');
                        input.setAttribute('data-id', 'all');
                        input.setAttribute('all-flag', '0');
                        input.setAttribute('class', 'input-left');
                        div.appendChild(input);

                        var label = newLabel.cloneNode(true);
                        // label.setAttribute('for', 'all');
                        label.setAttribute('class', 'left-label');
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
                            input.setAttribute('data-id', dataTemp[i].id);
                            input.setAttribute('class', 'input-left');
                            // input.setAttribute('checked',true);
                            div.appendChild(input);

                            var label = newLabel.cloneNode(true);
                            label.setAttribute('class', 'left-label');
                            // label.setAttribute('for', dataTemp[i].id);
                            label.innerHTML = dataTemp[i].name;
                            label.style.marginLeft = ( dataTemp[i].row ) * 10 + 'px';
                            div.appendChild(label);

                            var img = newImg.cloneNode(true);
                            img.setAttribute('src', '/img/multiMenu/fold.png');
                            img.setAttribute('class', 'unfold-img');
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
                            input.setAttribute('data-id', dataTemp[i].id);
                            input.setAttribute('class', 'check input-left');
                            div.appendChild(input);

                            var label = newLabel.cloneNode(true);
                            label.setAttribute('class', 'left-label');
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
                        areapRight.append(ul);
                    }

                    for (var i = 0; i < dataTemp.length; i++) {
                        if (dataTemp[i].child) {
                            var li = newLi.cloneNode(true);
                            li.setAttribute('class', 'li-class  has-children');
                            ul.appendChild(li);

                            var div = newDiv.cloneNode(true);
                            div.setAttribute('class', 'each-data-div-delete active-deleted active');
                            div.setAttribute('name', 'div-deldata');
                            div.setAttribute('data-id', dataTemp[i].id + '-r');
                            li.appendChild(div);

                            var label = newLabel.cloneNode(true);
                            label.setAttribute('class', 'delete-label');
                            label.innerHTML = dataTemp[i].name;
                            label.style.marginLeft = ( dataTemp[i].row + 1) * 10 + 'px';
                            div.appendChild(label);

                            var img_fold = newImg.cloneNode(true);
                            img_fold.setAttribute('src', '/img/multiMenu/unfold.png');
                            img_fold.setAttribute('class', 'unfold-img');
                            div.appendChild(img_fold);

                            var img_delete = newImg.cloneNode(true);
                            img_delete.setAttribute('src', '/img/multiMenu/delete.png');
                            img_delete.setAttribute('class', 'delete-img');
                            div.appendChild(img_delete);

                            fun_list_right(dataTemp[i].child, 1, li);//递归调用

                        } else {
                            var li = newLi.cloneNode(true);
                            li.setAttribute('class', 'li-class');
                            ul.appendChild(li);

                            var div = newDiv.cloneNode(true);
                            div.setAttribute('class', 'each-data-div-delete active-deleted');
                            div.setAttribute('name', 'div-deldata');
                            div.setAttribute('data-id', dataTemp[i].id + '-r');
                            li.appendChild(div);

                            var label = newLabel.cloneNode(true);
                            label.innerHTML = dataTemp[i].name;
                            label.setAttribute('class', 'delete-span');
                            label.style.marginLeft = ( dataTemp[i].row + 1) * 10 + 'px';
                            div.appendChild(label);

                            var img = newImg.cloneNode(true);
                            img.setAttribute('src', '/img/multiMenu/delete.png');
                            img.setAttribute('class', 'delete-img');
                            div.appendChild(img);
                        }
                    }
                }

                //双向绑定属性操作
                this._funSetProperty(dataTemp);
            },

            _refreshMultiMenu: function () {
                var target = this._target;
                $(target).find("div[name='div-data']").children('input').removeAttr("checked");
                $(target).find(".each-data-div-delete").css('display', 'none');
                $(target).find("div[name='div-data']").removeClass("active-checked");
                $(target).find("div[name='div-data']").children('input').removeClass("submit-checked");
                $(target).find("[data-id='all']").removeAttr("checked");
                $(target).find("[data-id='all']").removeClass("submit-checked");
            },

            _func: function () {
                var _this = this;
                return {
                    getSubmitString: function () {
                        return _this._submitStr();
                    },

                    getSubmitSubString: function () {
                        return _this._submitStrSubstring();
                    },

                    getSubmitName: function () {
                        return _this._submitName();
                    },

                    isTarget: function () {
                        return $(_this._dom['select']).val() == '1';
                    },

                    setChooseData: function (_, lastData) {
                        $(_this._dom['select']).find("option[value='1']").prop('selected', 'selected');
                        $(_this._dom['select']).selectpicker('refresh');
                        $(_this._dom['group']).show();
                        $(_this._dom['list']).show();
                        _this._settings.isListShow = true;
                        _this._settings['chooseData'] = lastData;
                        for (var i = 0; i < lastData.length; i++) {
                            _this._editItializeiFun(lastData[i].level2);
                        }
                    },

                    getReuseTargetString: function (_, lastData) {
                        if (!lastData) {
                            return ''
                        }
                        var res = [];
                        for (var i = 0; i < lastData.length; i++) {
                            res.push($(_this._target).find('[data-id="' + lastData[i].level1 + '"]').attr('name') + '●' + $(_this._target).find('[data-id="' + lastData[i].level2 + '"]').attr('name'));
                        }
                        return res.join('、');
                    }
                }
            },

            _init: function (target, param) {
                var target = $(target);
                // Combine params with default settings.
                var settings = {};
                for (var attrName in this._defaults) {
                    settings[attrName] = param[attrName] || this._defaults[attrName];
                }
                this._target = target;
                if (settings['data']) {
                    this._data = settings['data'];
                } else if (settings['apiFunc'] && settings['apiCallbackFunc']) {
                    this._data = settings['apiFunc'](settings['apiCallbackFunc']);
                }
                this._settings = settings;
                this._objState = {};
                this._tagAll = 0;

                // Create DOM
                this._createHtml(target, this._settings, this._data);

                // Define some useful element.
                this._dom = {};
                this._dom['select'] = $(target).find("[name='multimenu-select']");
                this._dom['group'] = $(target).find("[name='multimenu-group']");
                this._dom['list'] = $(target).find("[name='multimenu-list']");
                this._dom['title'] = $(target).find("[name='multimenu-title']");
                this._dom['selectFrame'] = $(target).find("[name='multimenu-select-frame']");
                this._dom['checkedFrame'] = $(target).find("[name='multimenu-checked-frame']");
                this._dom['cancelBtn'] = $(target).find(".dl-list-footer-cancel-btn");
                this._dom['affirmBtn'] = $(target).find(".dl-affirm-btn");
                this._dom['clearBtn'] = $(target).find(".dl-all-clear-btn");

                // State Initialized
                $(this._dom['select']).find("option[value=0]").prop('selected', 'selected');
                $(this._dom['select']).selectpicker('refresh');
                $(this._dom['group']).hide();
                $(this._dom['list']).hide();

                // Insert Data
                this._multiMenuEntry(this._data);

                // Bind Action
                this._bind(target, this._dom);
            }
        }
    }

    $.fn.multiMenu = function (options, param) {
        if (!$(this).data('multiMenu')) {
            var tmp = new MultiMenu();
            tmp._init(this, options);
            $(this).data('multiMenu', tmp);
        }
        var t = $(this).data('multiMenu');

        if (typeof options == 'string') {
            return t._func()[options](this, param);
        }
    };

    $.multiMenu = new MultiMenu();

})(jQuery);
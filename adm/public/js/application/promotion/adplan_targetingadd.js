/**
 * 地域选择控件
 */
function addAreaRep(id, value, _id, geoid) {
    var ori = id;
    id = "tr_" + id;
    if ($("#" + _id + "-areaSelected #" + id).length <= 0)
        $("#" + _id + "-areaSelected").append("<dt id='" + id + "' geoid = '" + geoid + "'><a class='fr' href='javascript:void(0)' onclick=unCheckArea('" + ori + "','" + _id + "')>删除</a><strong>" + value + "</strong></dt>");
}

function searchArea(_id) {
    $("#" + _id + " .hideTag").each(function () {
        if ($(this).val().indexOf($("#" + _id + "-area_search").val()) < 0) {
            $(this).parent().css("display", "none");
        } else {
            $(this).parent().css("display", "inline-block");
        }
    });
}


function unCheckArea(checkBox, _id) {
    $("#" + checkBox).attr('checked', false);
    $("#" + _id + "-areaSelected #tr_" + checkBox).remove();
}

//select 输出转换
function regionList(id) {
    var selectList = document.getElementById(id);


    var tempValue;
    var tempText;
    var tempFlag = false;
    var searchTag = [];
    var newDiv = document.createElement('div');
    var newUl = document.createElement('ul');
    var newLi = document.createElement('li');
    var newInput = document.createElement('input');
    var newLabel = document.createElement('label');
    var newDl = document.createElement('dl');
    var newSpan = document.createElement('span');
    var newSelect = document.createElement('select');
    var newOption = document.createElement('option');
    var newA = document.createElement('a');
    var newStrong = document.createElement('strong');

    var contains = newDiv.cloneNode(true);
    contains.setAttribute('class', 'areaCon clr clearfix');

    var choose = newDiv.cloneNode(true);
    choose.setAttribute('class', 'choose');
    contains.appendChild(choose);

    var spanl = newSpan.cloneNode(true);
    spanl.setAttribute('class', 'l');
    choose.appendChild(spanl);

    var sch = newInput.cloneNode(true);
    sch.setAttribute('type', 'text');
    sch.setAttribute('name', 'area_search');
    sch.setAttribute('id', id + '-area_search');
    sch.setAttribute('class', 'sch');
    // spanl.appendChild(sch);  //屏蔽搜索框

    var btnB2 = newSpan.cloneNode(true);
    btnB2.setAttribute('class', 'btn b2');
    // spanl.appendChild(btnB2);  //屏蔽搜索框

    var areaSearchButton = newInput.cloneNode(true);
    areaSearchButton.setAttribute('type', 'button');
    areaSearchButton.setAttribute('name', 'yt0');
    areaSearchButton.setAttribute('value', '搜索');
    areaSearchButton.setAttribute('id', id + '-area_search_button');
    // btnB2.appendChild(areaSearchButton); //屏蔽搜索框

    var chooseStrong = newStrong.cloneNode(true);
    chooseStrong.innerHTML = '已选择项目：';
    choose.appendChild(chooseStrong);

    var unAll = newA.cloneNode(true);
    unAll.setAttribute('id', id + '-unAll');
    unAll.setAttribute('href', 'javascript:;');
    unAll.innerHTML = '全部删除';
    choose.appendChild(unAll);

    var areaL = newDiv.cloneNode(true);
    areaL.setAttribute('class', 'fl areaL');

    var areaM = newDiv.cloneNode(true);
    areaM.setAttribute('class', 'fl areaM');

    var areaR = newDiv.cloneNode(true);
    areaR.setAttribute('class', 'fl areaR');

    selectList.parentNode.insertBefore(contains, selectList);
    contains.appendChild(areaL);
    contains.appendChild(areaM);
    contains.appendChild(areaR);

    var areaSelected = newDl.cloneNode(true);
    areaSelected.setAttribute('id', id + '-areaSelected');
    areaR.appendChild(areaSelected);

    for (var key = 0; key < selectList.options.length; key++) {
        var _option = selectList.options[key];

        if (!_option.hasAttribute('parent-id')) {
            tempValue = _option.value;
            tempText = _option.text;
            tempFlag = false;
            searchTag = [];
            searchTag.push(_option.text);

            var areaP = newDiv.cloneNode(true);
            areaP.setAttribute('class', 'areaP');
            areaL.appendChild(areaP);

            var hideTag = newInput.cloneNode(true);
            hideTag.setAttribute('type', 'hidden');
            hideTag.setAttribute('class', 'hideTag');
            hideTag.setAttribute('value', searchTag);
            areaP.appendChild(hideTag);

            var labelin = newLabel.cloneNode(true);
            labelin.setAttribute('class', 'labelin');
            labelin.setAttribute('title', _option.text);
            labelin.innerHTML = _option.text;
            areaP.appendChild(labelin);

            var mainArea = newInput.cloneNode(true);
            mainArea.setAttribute('type', 'checkbox');
            mainArea.setAttribute('name', (id + '[]'));
            mainArea.setAttribute('value', _option.value);
            mainArea.setAttribute('data-text', _option.text);
            mainArea.setAttribute('class', 'mainArea');
            mainArea.setAttribute('id', (id + '-area' + key));
            if (_option.hasAttribute('checked') || _option.hasAttribute('selected')) {
                mainArea.setAttribute('checked', 'checked');
                addAreaRep(id + '-area' + key, _option.text, _option.value);
            }
            labelin.insertBefore(mainArea, labelin.firstChild);
        } else if (tempValue == _option.getAttribute('parent-id')) {
            searchTag.push(_option.text);
            hideTag.setAttribute('value', searchTag);
            if (!tempFlag) {
                tempFlag = true;
                var subCity = newDiv.cloneNode(true);
                subCity.setAttribute('class', 'subCity');
                areaL.lastChild.appendChild(subCity);

                var ul = newUl.cloneNode(true);
                subCity.appendChild(ul);

                var li = newLi.cloneNode(true);
                ul.appendChild(li);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class', 'labelin');
                label.setAttribute('title', _option.text);
                label.innerHTML = _option.text;
                li.appendChild(label);

                var input = newInput.cloneNode(true);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', _option.value);
                input.setAttribute('data-text', tempText + ' · ' + _option.text);
                input.setAttribute('name', (id + '[]'));
                input.setAttribute('id', (id + '-area' + key));
                if (_option.hasAttribute('checked') || _option.hasAttribute('selected')) {
                    input.setAttribute('checked', 'checked');
                    addAreaRep(id + '-area' + key, tempText + ' · ' + _option.text, _option.value);
                }
                label.insertBefore(input, label.firstChild);
            } else {
                var li = newLi.cloneNode(true);
                ul.appendChild(li);

                var label = newLabel.cloneNode(true);
                label.setAttribute('class', 'labelin');
                label.innerHTML = _option.text;
                li.appendChild(label);

                var input = newInput.cloneNode(true);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', _option.value);
                input.setAttribute('data-text', tempText + ' · ' + _option.text);
                input.setAttribute('name', (id + '[]'));
                input.setAttribute('id', (id + '-area' + key));
                if (_option.hasAttribute('checked') || _option.hasAttribute('selected')) {
                    input.setAttribute('checked', 'checked');
                    addAreaRep(id + '-area' + key, tempText + ' · ' + _option.text, _option.value);
                }
                label.insertBefore(input, label.firstChild);

                areaL.lastChild.lastChild.lastChild.appendChild(li);
            }
        }
    }
    selectList.parentNode.removeChild(selectList);
    contains.setAttribute('id', id);

    $("#" + id + ' .hideTag').each(function () {
        var v = $(this).val();
        v += $(this).next('.mainArea').val();
        var sc = $(this).nextAll('.subCity').find('ul li');
        sc.each(function () {
            v += $(this).find('label').html();
        });
        $(this).val(v);
    });
    $("#" + id + "-area_search").focus().on('keyup', function () {
        searchArea(id);
    });

    $("#" + id + "-area_search_button").on('click', function () {
        searchArea(id);
    });

    $("#" + id + " div.areaL input[id^='" + id + "-area']:checked").each(function () {
        addAreaRep($(this).attr('id'), $(this).attr('data-text'), id, $(this).val());
    });

    $("#" + id + " .areaL .areaP").mouseenter(function () {
        $(this).find('.subCity').show();
    });

    $("#" + id + " .areaL div").mouseleave(function () {
        $(this).find('.subCity').hide();
    });

    $("#" + id + " input[id^='" + id + "-area']").on('change', function () {
        if ($(this).is(':checked')) {
            addAreaRep($(this).attr('id'), $(this).attr('data-text'), id, $(this).val());
        } else {
            $("#" + id + "-areaSelected #tr_" + $(this).attr('id')).remove();
        }
    });

    $("#" + id + "-unAll").on('click', function () {
        $("#" + id + " .areaL input").attr("checked", false);
        $("#" + id + "-areaSelected").html("");
    });
}
/**
 * Created by liuchangyu on 16/12/19.
 */
$(document).ready(function () {
    //关键词
    var keyword = $("#ctrl-group-keyword");
    var keywordnumline = $("#ctrl-group-keyword-text-num-line");
    var keywordnum = $("#keywordnum");
    keyword.keyup(kewwordHandle);
    keyword.keydown(kewwordHandle);
    function kewwordHandle(e) {
        var arry = $(this).val().split('\n');
        if (arry.length > 1000) {//关键词最多支持1000个
            arry = arry.slice(0, 1000);
            $(this).val(arry.join('\n'));
            layer.msg('计划关键词最多支持1000个');
        }
        //console.log('原始数组:' + arry);
        var numLine = "1";
        for (var i = 2; i < arry.length + 1; i++) {
            numLine += "<br>" + i;
        }
        keywordnumline.html(numLine);

        var effectiveArry = [];
        var keywordnums = '';
        for (var j = 0; j < arry.length; j++) {
            if (arry[j] != '' && !( /^[ ]+$/g.test(arry[j]))) {
                effectiveArry.push(arry[j]);
            }
        }
        //console.log('去空值后' + effectiveArry);
        if (effectiveArry.length !== 0) {
            keywordnums = '（' + effectiveArry.length + '）';
        }
        keywordnum.html(keywordnums);
        $(this).attr('data-keyword-prepare', effectiveArry);
    }

    keyword.scroll(function () {
        keywordnumline.scrollTop($(this).scrollTop());
    });

    //否定关键词
    var denykeyword = $("#denyctrl-group-keyword");
    var denykeywordnumline = $("#denyctrl-group-keyword-text-num-line");
    var denykeywordnum = $("#denykeywordnum");
    denykeyword.keyup(denykewwordHandle);
    denykeyword.keydown(denykewwordHandle);
    function denykewwordHandle(e) {
        var arry = $(this).val().split('\n');
        if (arry.length > 100) {//否定关键词最多支持100个
            arry = arry.slice(0, 100);
            $(this).val(arry.join('\n'));
            layer.msg('计划否定关键词最多支持100个');
        }
        // console.log('原始数组:' + arry);
        var numLine = "1";
        for (var i = 2; i < arry.length + 1; i++) {
            numLine += "<br>" + i;
        }
        denykeywordnumline.html(numLine);

        var effectiveArry = [];
        var keywordnums = '';
        for (var j = 0; j < arry.length; j++) {
            if (arry[j] != '' && !( /^[ ]+$/g.test(arry[j]))) {
                effectiveArry.push(arry[j]);
            }
        }
        // console.log('去空值后' + effectiveArry);
        if (effectiveArry.length !== 0) {
            keywordnums = '（' + effectiveArry.length + '）';
        }
        denykeywordnum.html(keywordnums);
        $(this).attr('data-keyword-prepare', effectiveArry);
    }

    denykeyword.scroll(function () {
        denykeywordnumline.scrollTop($(this).scrollTop());
    })
});
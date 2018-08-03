;(function () {
    //定义的构造函数
    var Selectezone = function () {
        var _this;
        $('.areaL .areaP').hover(
            function () {
                $(this).addClass('areaAct');
            },
            function () {
                $(this).removeClass('areaAct');
            }
        )
    }
    //定义Selectezone的方法
    Selectezone.prototype = {
        init: function () {
            _this = this;
            _this.geoEles = $("#geo input:checkbox");
            //_this.uncheck();
            _this.cityChange();
            $('.sch').val(''); //页面刷新，清除
            _this.connection();
        },
        connection: function () {
            $("#area_search").keyup(function() {
                var val = $(this).val();
                val? _this.search($(this).val()) : $('#geo label').css('background','none');
            });
            $(".selectFirstLine").click(function () { _this.selectLine(1); });
            $(".selectSecondLine").click(function () { _this.selectLine(2); });
            $(".selectThirdLine").click(function () { _this.selectLine(3); });
            $('#inAll').click(function () { _this.ckdTrue( _this.geoEles);  _this.cityChange(); })
            $('#unSet').click(function () {  _this.unSet(); _this.cityChange(); })
            $('#unAll').click(function () { _this.uncheck(); _this.cityChange(); })
            $(".mainArea").change(function () {  _this.mainAreaChange(this); })
            $('.subCity input').change(function () {  _this.cityChange($(this)); })
        },
        ckdTrue: function (labels) {
            $(labels).attr("checked", true).prop("checked", true);
        },
        ckdFalse: function (labels) {
            $(labels).attr("checked", false).prop("checked", false);
        },
        uncheck: function () {
            _this.ckdFalse(_this.geoEles);
        },
        unSet: function () {
            _this.geoEles.each(function(){
                this.checked ? _this.ckdFalse(this) : _this.ckdTrue(this);
            });
        },
        selectLine: function (line) {
            _this.ckdTrue($(":checkbox[data-level='" + line + "']"));
            _this.cityChange();
        },
        mainAreaChange: function (that) {
            that.checked ? _this.ckdTrue($(that).parent().next().find('input')) : _this.ckdFalse($(that).parent().next().find('input'));
            _this.cityChange();
        },
        cityChange: function () {
            $('.mainArea').each(function () {
                var _main = this;
                var totalNum = 0;
                var selectedNum = 0;
                var onlyone = true;
                var ul = $(_main).parent().next();
                var areaNum = $(_main).parent().prev().prev();
                ul.find('input').each(function () {
                    totalNum++;
                    onlyone = false;
                    this.checked == true ? selectedNum++ : null;
                });
                //有子城市的才做这个判断
                if (!onlyone) {
                    areaNum.find('.selectedNum').html(selectedNum);
                    (selectedNum == 0) ? areaNum.hide() : areaNum.show();
                    (selectedNum == totalNum) ? _this.ckdTrue(_main) : _this.ckdFalse(_main);
                }
            });
        },
        search: function (schVal) {
            $('#geo label').each(function () {
                var title = $(this).attr('title');
                if(title.indexOf(schVal)>=0){
                    $(this).css('background','#eee');
                    $(this).parents('.subCity')? $(this).parents('.subCity').prev('label').css('background','#eee') : null;
                }
            })
        }
    }
    //在插件中使用Selectezone对象
    $.fn.selecteZonePlugin = function () {
        //创建Selectezone的实体
        var selectezone = new Selectezone();
        //调用其方法
        return selectezone.init();
    }
})()
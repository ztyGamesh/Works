/**
 * Created by liuchangyu on 16/11/29.
 */
$(document).ready(function () {
    var materielType = 1;//1是非信息流，2是信息流

    var scaleArray = {
        '4_3': "4:3 800*600",
        '3_2': "3:2 960*640",
        '2_1': "2:1 600*300",
        '1_1': "1:1 800*800",
        '16_9': "16:9 1280*720",
        '6_5': "6:5 600*500",
        '4_9': "4:9 800*600",
        '3_6': "3:6 960*640",
        '2_3': "2:3 600*300",
        '1_3': "1:3 800*800",
        '16_27': "16:27 1280*720",
        '6_15': "6:15 600*500",
        '3:2': "3:2 960*640、480*320、320*213、320*210",
        '4:3': "4:3 800*600、400*300、200*150",
        '1:1': "1:1 800*800"
    };

    function checkinputfile(ele) {//ele下显示的上传控件，不能为空
        var flag = true;
        $("#" + ele + " input[type=file]").each(function () {
            if ($(this).closest('.form-group').css('display') == 'block' && !vaIsNotNull($(this).val())) {
                vaError($(this), '请上传文件');
                flag = false;
            } else {
                vaSuccess($(this));
            }
        });
        return flag;
    }

    //添加素材
    $("#addMateriel").bind('click', function () {
        if ($("#selC").val() == "") {
            layer.msg('请选择模板');
        } else {
            $.ajax({
                type: "get",
                url: '/materiel/materieladd',
                cache: false,
                async: false,
                success: function (data) {
                    layer.open({
                        type: 1,
                        area: '800px',
                        offset: '50px'
                        , btn: ['确认', '取消']
                        , success: function () {
                            $('.layui-layer-content').html(data);
                            fetchtemplateAPI($("#selC").val(), fetchtemplateAPIonSuccess);//根据选择的模板查素材 并渲染在'添加素材'中
                        }
                        , yes: function (index, layero) {
                            //按钮【按钮一】的回调
                            if (materielType == 1) {//非信息流
                                var $form = $("#materielAdd");
                                if (!vaIsNotNull($("#materielAdd input[name=name]").val())) {
                                    vaError($("#materielAdd input[name=name]"), '请输入素材名称');
                                    return false;
                                } else if (!checkinputfile("materielAdd")) {//显示出来的上传框，必须传文件
                                    return false;
                                } else {
                                    $form.ajaxSubmit({
                                        dataType: 'json',
                                        success: function (data) {
                                            if (data.status == 1) {
                                                layer.msg('素材添加成功');
                                                getmaterialbytemplateAPI($("#selC").val(),  function (result) {
                                                    var res = JSON.parse(result);
                                                    if (res.status == '1' && res.data !== null) {
                                                        objInit("#material");
                                                        $.each(res.data, function (key, value) {
                                                            $("#material").append('<option value="' + key + '">' + value + '</option>');
                                                        });
                                                        $(".selectpicker").selectpicker('refresh');
                                                    }
                                                });
                                                layer.close(index);
                                            } else {
                                                layer.open({
                                                    type: 0,
                                                    title: '错误提示',
                                                    tipsMore : true,
                                                    content: "素材添加失败：" + data.msg,
                                                    yes: function(index, layero){
                                                        layer.close(index);
                                                    }
                                                });
                                                return false;
                                            }
                                        }
                                    });
                                }
                            } else if (materielType == 2) {//信息流
                                var $form = $("#type_infor_flow");
                                if (!vaIsNotNull($("#type_infor_flow input[name=name]").val())) {
                                    vaError($("#type_infor_flow input[name=name]"), '请输入素材名称');
                                    return false;
                                } else if(!vaIsNotNull($("#type_infor_flow input[name=title]").val())) {
                                    vaError($("#type_infor_flow input[name=title]"), '请输入标题');
                                    return false;
                                } else if (!checkinputfile("type_infor_flow")) {//显示出来的上传框，必须传文件
                                    return false;
                                } else {
                                    $form.ajaxSubmit({
                                        dataType: 'json',
                                        success: function (data) {
                                            console.log(data);
                                            if (data.status == 1) {
                                                layer.msg('素材添加成功');
                                                getmaterialbytemplateAPI($("#selC").val(),  function (result) {
                                                    var res = JSON.parse(result);
                                                    if (res.status == '1' && res.data !== null) {
                                                        objInit("#material");
                                                        $.each(res.data, function (key, value) {
                                                            $("#material").append('<option value="' + key + '">' + value + '</option>');
                                                        });
                                                        $(".selectpicker").selectpicker('refresh');
                                                    }
                                                });
                                                layer.close(index);
                                            } else {
                                                layer.open({
                                                    type: 0,
                                                    title: '错误提示',
                                                    tipsMore : true,
                                                    content: "素材添加失败：" + data.msg,
                                                    yes: function(index, layero){
                                                        layer.close(index);
                                                    }
                                                });
                                                return false;
                                            }
                                        }
                                    });
                                }
                            } else {//其他

                            }
                        }
                    });
                }
            });
        }
    });
    function objInit(obj) {
        return $(obj).html("<option value=''>请选择</option>");
    }
    function fetchtemplateAPIonSuccess(result) {
        var req = JSON.parse(result);
        console.log(req);
        if (req.status == '1') {
            var data_class = req.data.class;//广告位类型
            var val = adsType[data_class];

            for (var i = 0; i < val['show'].length; i++) {
                var tag = val['show'][i];
                $('.' + tag).show();
            }
            for (var i = 0; i < val['hide'].length; i++) {
                var tag = val['hide'][i];
                $('.' + tag).hide();
            }
            materielType = 1;
            $("#materielAdd #type").val(val['chinese']);//非信息流广告位方式需要传'素材的位类型'
            $('.layui-layer-content input[name=template]').val(req.data.uid);//广告位模板id，添加素材时提交
            if (req.data.material_type !== '视频' && req.data.class !== '19f6c554-fb2c-4604-8e66-51386e739b96') {//素材类型不等于视频 并且 不是信息流
                $(".type_video").hide();
            } else if (req.data.class == '19f6c554-fb2c-4604-8e66-51386e739b96') {//如果是信息流广告位
                materielType = 2;
                var template_class = req.data.template_class; //模板类型
                if (req.data.setting.video_setting !== undefined) { //是视频模板
                    $("#type_infor_flow .type_video").show();
                    $("#type_infor_flow .pics").hide();
                    $("#type_infor_flow .type_video .videoFormat").html(req.data.setting.video_setting.format);
                } else if (template_class == "649592c0-7bc9-4372-a930-d2ad2b343e0b") {//组图
                    $("#type_infor_flow .pics").show();
                    $("#type_infor_flow .type_video").hide();
                } else {
                    $("#type_infor_flow .pics").hide();
                    $("#type_infor_flow .type_video").hide();
                }
                $("#type_infor_flow #title").prop("maxLength", req.data.setting.title_setting.length);
                $("#type_infor_flow #description").prop("maxLength", req.data.setting.description_setting.length);
                $("#type_infor_flow .scale").html(scaleArray[req.data.setting.pic_setting.scale]);
            }
        } else {
            layer.msg("模板素材信息查询失败：" + req.msg);
        }
    }

    var adsType = {
        // app_开屏
        '3e2bbd3f-3e8a-4ddc-892a-12070890543c': {
            'show': ['type_splash'],                  // 当选该广告位类型时，需要显示的控件，下同
            'hide': ['type_banner', 'type_infor_flow'],                   // 当选该广告位类型时，需要隐藏的控件，下同
            'chinese': 'App_开屏'
        },
        // app_横幅
        '6e77385f-7834-11e6-a656-008cfaf6f0c0': {
            'show': ['type_banner'],
            'hide': ['type_splash', 'type_infor_flow'],
            'chinese': 'App_横幅'
        },
        // web_横幅
        '3b8930a2-84cb-11e6-a656-008cfaf6f0c0': {
            'show': ['type_banner'],
            'hide': ['type_splash', 'type_infor_flow'],
            'chinese': 'web_横幅'
        },
        // pc 固定位
        '44a1e8c4-d660-4ef2-bde7-84d3bc605880': {
            'show': ['type_banner'],
            'hide': ['type_splash', 'type_infor_flow'],
            'chinese': 'pc_固定位'
        },
        // pc 弹窗
        'ec7c2e0a-c3e2-46fe-af98-662e1b350d84': {
            'show': ['type_banner'],
            'hide': ['type_splash', 'type_infor_flow'],
            'chinese': 'pc_弹窗'
        },
        // app信息流
        '19f6c554-fb2c-4604-8e66-51386e739b96': {
            'show': ['type_infor_flow'],
            'hide': ['type_splash', 'type_banner', 'normal_template'],
            'chinese': 'App_信息流'
        }

    };
});
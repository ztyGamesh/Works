/**
 * Created by liuchangyu on 16/11/23.
 */

/**
 * 模板自定义名称
 * 信息流模板
 大图模板           infor_flow_img
 交互大图模板       infor_flow_img_intera
 视频模板           infor_flow_video
 交互视频模板        infor_flow_video_intera
 组图模板           infor_flow_imgs
 图文模板            infor_flow_imgAndchar

 * 模板uid

 377c4492-e117-4d21-bf5a-3d249f047753    视频模板
 4ad94269-ff36-48d7-8852-bdcb622f1a1e    交互式大图模板
 649592c0-7bc9-4372-a930-d2ad2b343e0b    组图模板
 7fd00961-175d-4f75-9592-932d7b62a6da    图文模板
 85352823-e777-45ff-bed1-c7adbbd00461    大图模板
 e5ad8823-64c6-47bb-ad21-a20272a8656a    交互式视频模板
 400b7843-c675-492e-b3a2-54fbd5602a20    开屏-半屏模板
 b0bad561-c370-44fe-bb25-2ed0f9a5a9d3    App标准开屏
 b0bad561-c370-44fe-bb25-2ed0f9a5a9f2    App标准Banner
 fa67b05c-a8b7-458e-a9d7-1eef77d9544b    app视频模板
 400b7843-c675-492e-b3a2-54fbd5803b41    PC-固定位模板
 400b7843-c675-492e-b3a2-44fba4103a92    PC-弹窗模板
 54f1524c-8902-4038-8af9-3dadef8f4742    web视频模板
 5db87273-fe0f-42e2-b259-abed8c9cd5fd    H5图片广告底部悬浮

 * 信息流模板
 大图模板            85352823-e777-45ff-bed1-c7adbbd00461
 交互大图模板         4ad94269-ff36-48d7-8852-bdcb622f1a1e
 视频模板            377c4492-e117-4d21-bf5a-3d249f047753
 交互视频模板         4ad94269-ff36-48d7-8852-bdcb622f1a1e
 组图模板            649592c0-7bc9-4372-a930-d2ad2b343e0b
 图文模板            7fd00961-175d-4f75-9592-932d7b62a6da


 * 模板提交格式示例
 "pic_setting":{"scale":"2_1","format":["static_pic","dynamic_pic"]},
 "title_setting":{"font":null,"font-size":"14","font-color":"red","length":"22"},
 "description_setting":{"font":null,"font-size":"14","font-color":"red","length":"22"},
 "public_price":"20000"
 */

function renderSelected(obj, val) {
    $(obj).find('option[value="' + val + '"]').prop('selected', 'selected');
}


$(document).ready(function () {
    $("#class").change();
    $("#accordion .panel").hide();
    // 请求初始数据
    var data_uid, data_name, data_media, data_class, data_sell_type, data_template_count = '';
    var data_template = {};
    var templateObj = {
        '85352823-e777-45ff-bed1-c7adbbd00461': {
            render: function (obj) {
                var id = '85352823-e777-45ff-bed1-c7adbbd00461';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
                // 模板不允许删除
                $("#" + id + "")
            }
        },
        '4ad94269-ff36-48d7-8852-bdcb622f1a1e': {
            render: function (obj) {
                var id = '4ad94269-ff36-48d7-8852-bdcb622f1a1e';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }

        },
        '377c4492-e117-4d21-bf5a-3d249f047753': {
            render: function (obj) {
                var id = '377c4492-e117-4d21-bf5a-3d249f047753';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }

        },
        'e5ad8823-64c6-47bb-ad21-a20272a8656a': {
            render: function (obj) {
                var id = 'e5ad8823-64c6-47bb-ad21-a20272a8656a';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }

        },
        '649592c0-7bc9-4372-a930-d2ad2b343e0b': {
            render: function (obj) {
                var id = '649592c0-7bc9-4372-a930-d2ad2b343e0b';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=number]"), obj.pic_setting.number);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        },
        '7fd00961-175d-4f75-9592-932d7b62a6da': {
            render: function (obj) {
                var id = '7fd00961-175d-4f75-9592-932d7b62a6da';
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=scale]"), obj.pic_setting.scale);
                renderSelected($("#" + id + " form[dl-set=pic_setting] select[dl-data=position]"), obj.pic_setting.position);

                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=align]"), obj.title_setting.align);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font]"), obj.title_setting.font);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=font-size]"), obj.title_setting['font-size']);
                $("#" + id + " form[dl-set=title_setting] input[dl-data=font-color]").val(obj.title_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=title_setting] select[dl-data=length]"), obj.title_setting.length);

                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font]"), obj.description_setting.font);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=font-size]"), obj.description_setting['font-size']);
                $("#" + id + " form[dl-set=description_setting] input[dl-data=font-color]").val(obj.description_setting['font-color']);
                renderSelected($("#" + id + " form[dl-set=description_setting] select[dl-data=length]"), obj.description_setting['length']);

                $("#" + id + " form[dl-set=public_price] input[dl-data=public_price]").val(obj.public_price);
            }
        }
    };


    if ($("#class_hide").val() == '19f6c554-fb2c-4604-8e66-51386e739b96') {
        fetchslotAPI($('#uid_hide').val(), fetchslotAPIonSuccess);
    }
    function fetchslotAPIonSuccess(result) {//初始化渲染
        var req = JSON.parse(result);
        if (req.status == '1') {
            data_uid = req.data.uid;
            data_name = req.data.name;
            data_media = req.data.media;
            data_class = req.data.class;
            data_sell_type = req.data.sell_type;
            data_template_count = req.data.template_count;
            var templates = req.data.templates;
            for (var i = 0; i < templates.length; i++) {
                $("input[template-ctl=" + templates[i].template_class + "]").prop({
                    "checked": "checked",
                    "disabled": "disabled"
                });
                $("#" + templates[i].template_class).show();
                templateObj[templates[i].template_class].render(templates[i].setting);
                data_template[templates[i].template_class] = templates[i].st_uid;
            }
            console.log(data_template)

        } else {
            layer.msg("获取信息流广告位模板信息失败：" + req.msg);
        }
    }


    /**
     * about'选择模板'
     * begin------
     */
    var templateTurnLeft = $(".templateTurnLeft");
    var templateTurnRight = $(".templateTurnRight");
    // 选择模板展示框每页展示数量
    var templateNo = 4;
    // 信息流选择模板展示框总页数
    var message_flow_pages = '';
    // 信息流选择模板展示框当前页
    var message_flow_page_now = 1;
    templateTurnLeft.on('click', function () {
        var templateSize = $(this).next().find(".templateBox").length;
        if (templateSize <= templateNo) {
            return false;
        } else {
            //pages总页数
            message_flow_pages = Math.ceil(templateSize / templateNo);
            if (message_flow_page_now == 1) {
                return false;
            } else {
                message_flow_page_now -= 1;
                var leftSize = '-' + (message_flow_page_now - 1) * 633 + 'px';
                $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
            }

        }
    });
    templateTurnRight.on('click', function () {
        var templateSize = $(this).prev().find(".templateBox").length;
        if (templateSize <= templateNo) {
            return false;
        } else {
            //pages总页数
            message_flow_pages = Math.ceil(templateSize / templateNo);
            if (message_flow_page_now == message_flow_pages) {
                return false;
            } else {
                var leftSize = '-' + message_flow_page_now * 633 + 'px';
                message_flow_page_now += 1;
                $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
            }

        }
    });
    //'选择模板' relationship with '编辑模板'
    $(".templateTitle input[type=checkbox]").change(function () {
        var template_id = $(this).attr('template-ctl');
        if ($(this).prop('checked')) {
            $('#' + template_id).show()
        } else {
            $('#' + template_id).hide();
        }
    });
    /*＊
     * about'选择模板'
     * end..
     */
    // 所有输入框不可编辑
    $("input").prop("disabled","disabled");
    $("select").prop("disabled","disabled");
    $("#submit").on('click', function () {
        window.location = '/media/slot';
    });
});
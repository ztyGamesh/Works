/** 初始化样式预览&选择栏
 * 目前用于广告创意、广告位页面
 * @param adFormId, string, the name of adForm radio element.
 *
 * @param tWrapperId, string, the id of template's render Wrapper element.
 *
 * @param templateObj, object, template's message
 * @param templateObj[i], string, the id of adForm
 * @param templateObj[i].tempateId, string, the id of templates under adForm
 * @param templateObj[i].previewIds, string, the id of template's preview gif or mp4 etc.
 * @param templateObj[i].CN, string, chinese name of the template
 *
 * DEMO:
 *     var templateObj = {
        //广告形式:信息流
        '29076f0d-a923-47d4-bfef-2e3cf28fc099': [
            {
                tempateId: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',
                previewIds: '/video/infor_flow_img.mp4',
                CN: '大图样式'
            }, {
                tempateId: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',
                previewIds: '/video/infor_flow_video.mp4',
                CN: '视频样式'
            },
            {
                tempateId: '7c44a357-ecd0-4c5b-80d0-db8bd5100149',
                previewIds: '/video/infor_flow_imgAndChar.mp4',
                CN: '大图＋文字样式'
            },
            {
                tempateId: '4d918595-d2a1-47c7-8e4a-012f28ddd96e',
                previewIds: '/video/infor_flow_videoAndChar.mp4',
                CN: '视频＋文字样式'
            },
            {
                tempateId: '7e1199fd-de4d-469f-8778-5de1268cddea',
                previewIds: '/video/infor_flow_smallimgAndChar.mp4',
                CN: '图文样式'
            },
            {
                tempateId: '6684515c-3b6d-40f5-969c-d137c3913aab',
                previewIds: '/video/infor_flow_imgs.mp4',
                CN: '组图样式'
            },
            {
                tempateId: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',
                previewIds: '/video/infor_flow_char.mp4',
                CN: '文字链样式'
            }],
        //广告形式:开屏
        '987b7cd8-2752-4a15-bc94-6c0a2764a5c4': [
            {
                tempateId: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',
                previewIds: '/video/infor_static_tail.mp4',
                CN: '3S静图',
                previewBorder:false
            },
            {
                tempateId: '876de12b-5e92-41da-a4a3-2f9fa33eda33',
                previewIds: '/video/infor_dynamics_tail.mp4',
                CN: '5S动图',
                previewBorder:false
            },
            {
                tempateId: '7d42ec85-5533-4390-9338-84bfb0f725b5',
                previewIds: '/video/infor_video_tail.mp4',
                CN: '5S视频',
                previewBorder:false
            }
        ],
        //广告形式:横幅
        '7b62026a-23aa-4592-836a-f4ee78f7ea2e': [
            {
                tempateId: '3fc13471-36a1-4dfc-abde-98c364e78e2e',
                previewIds: '/video/infor_banner_graphic.mp4',
                CN: '图文样式'
            },
            {
                tempateId: 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',
                previewIds: '/video/infor_banner_pure_figure.mp4',
                CN: '纯图样式'
            }
        ],
        //广告形式:插屏
        '5b3e416f-d93a-4632-87de-5d4fbcc942fb': [
            {
                tempateId: '5e0e3da8-e3cc-4330-a409-ee7263a08711',
                previewIds: '/video/infor_plaque.mp4',
                CN: '纯图样式'
            }
        ]
    };
 templateInit('adForm', 'templateWrapper', templateObj);
 */
function templateInit(adFormId, tWrapperId, templateObj) {
    // 选择模板展示框每页展示数量
    var templateNo = 4;
    // 获得广告形式单选框
    var adFormRadio = $('input[type=radio][name=' + adFormId + ']');
    // 获得选中的广告形式ID
    var adFormRadioValue = adFormRadio.val();
    // 广告形式改变后调整预览栏及设置栏状态
    adFormRadio.bind('change', function () {
        // 隐藏所有设置栏
        $("#accordion .panel").hide();
        // 所有预览框取消选中状态
        $('.templateCheckbox').prop('checked', false);
        // 所有预览框隐藏，显示当前选中广告形式下对应的预览框
        $('.templateBox').attr('isShow', 'false').hide();
        $('.templateBox[adFomParent=' + $(this).val() + ']').attr('isShow', 'true').show();
        // 重置预览栏的位移状态
        $(".templateContainerMove").css('left', 0);
        templateStateChangeInit();
    });
    var templateHtml = function () {
        var html = '';
        for (var adForm in templateObj) {
            var templateBox = '<div class="templateBox" adFomParent="' + adForm + '" isShow="true">';
            if (adForm !== adFormRadioValue) {
                templateBox = '<div class="templateBox" adFomParent="' + adForm + '" style="display: none;" isShow="false">';//只显示当前选中广告形式下的样式预览
            }
            for (var i = 0; i < templateObj[adForm].length; i++) {
                html += templateBox
                    + '<div class="templateTitle">'
                    + '<div class="checkbox checkbox-deepleaper">'
                    + '<input class="templateCheckbox Dl-checkbox" type="checkbox" template-ctl="' + templateObj[adForm][i].tempateId + '" id="templateCtl-' + templateObj[adForm][i].tempateId + '">'
                    + '<label for="templateCtl-' + templateObj[adForm][i].tempateId + '">' + templateObj[adForm][i].CN
                    + '</label>'
                    + '</div>'
                    + '</div>'
                    + '<video width="145px" height="258px" class="templateDemo ' + (templateObj[adForm][i].previewBorder == false ? 'previewNoBorder' : ' ') + '">'
                    + '<source src="' + templateObj[adForm][i].previewIds + '">'
                    + '</video>'
                    + '</div>'
            }
        }
        return html;
    };
    var templateWrapper = '<div class="col-md-10 col-md-offset-1">'
        + '<div class="templateWrapper">'
        + '<img src="/img/application/media/arrowL.png" class="templateTurnLeft cursor" id="templateTurnLeft">'
        + '<div class="templateContainer">'
        + '<div class="templateContainerMove" >'
        + templateHtml()
        + '</div>'
        + '</div>'
        + '<img src="/img/application/media/arrowR.png" class="templateTurnRight cursor" id="templateTurnRight">'
        + '</div>'
        + '</div>';

    $('#' + tWrapperId).html(templateWrapper);

    //初始化样式预览栏切换功能
    function templateStateChangeInit() {
        var templateTurnLeft = $(".templateTurnLeft");
        var templateTurnRight = $(".templateTurnRight");

        // 信息流选择模板展示框总页数
        var message_flow_pages = '';
        // 信息流选择模板展示框当前页
        var message_flow_page_now = 1;
        if ($(".templateBox[isShow=true]").length <= templateNo) {
            templateTurnLeft.hide();
            templateTurnRight.hide();
        } else {
            templateTurnLeft.show();
            templateTurnRight.show();
        }
        templateTurnLeft.on('click', function () {
            var templateSize = $(this).next().find(".templateBox[isShow=true]").length;
            console.log(templateSize);
            if (templateSize <= templateNo) {
                templateTurnLeft.hide();
                templateTurnRight.hide();
                return false;
            } else {
                //pages总页数
                message_flow_pages = Math.ceil(templateSize / templateNo);
                if (message_flow_page_now == 1) {
                    return false;
                } else {
                    message_flow_page_now -= 1;
                    var leftSize = '-' + (message_flow_page_now - 1) * 620 + 'px';
                    $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
                }
            }
        });
        templateTurnRight.on('click', function () {
            var templateSize = $(this).prev().find(".templateBox[isShow=true]").length;
            if (templateSize <= templateNo) {
                return false;
            } else {
                //pages总页数
                message_flow_pages = Math.ceil(templateSize / templateNo);
                if (message_flow_page_now == message_flow_pages) {
                    return false;
                } else {
                    var leftSize = '-' + message_flow_page_now * 620 + 'px';
                    message_flow_page_now += 1;
                    $(this).siblings('.templateContainer').find(".templateContainerMove")[0].style.left = leftSize;
                }
            }
        });
    }

    templateStateChangeInit();


    $(".templateDemo").bind({
        'mouseover': function () {
            this.play();
        },
        'mouseout': function () {
            this.currentTime = 0;
            this.pause();
        }
    });
}

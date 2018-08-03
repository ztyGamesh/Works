/**
 * Custom Common function
*/
var Comm = {
    
    // tip for has action
    success: function(msg){
        Comm._popup(1, msg);
    },
    error: function(msg){
        Comm._popup(0, msg);
    },
    // base on bootstrap.modal    
    _popup:function(status, msg){
        if (!msg){
            msg = (status == 1) ? 'Do Success!' : 'Has Error!';
        }
        var color = (status == 1) ? 'alert-success' : 'alert-danger';
        var icon = (status == 1) ? 'glyphicon-ok' : 'glyphicon-remove';
        var id = "myalert-"+ new Date().getTime();
        
        var tpl = '<div id="'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"><div class="modal-dialog modal-sm">'
                + '<div class="modal-content"><div class="alert '+color+'" style="margin-bottom: 0px;"><b><icon class="glyphicon '+icon+'"></icon> '+msg+'</b></div></div>'
                + '</div></div>';
        
        $('body div[id^="myalert"]').remove();
        $('body').append(tpl);
        $('#'+id).modal('show');
//        if (time > 0) {
//            // auto closed
//            setTimeout(function(){$('#'+id).modal('hide');}, time*1000);
//        }
    },
        
    confirm: function(msg, callback){
        var $modal = Comm.modal('show', {
            title: '提示',
            body: msg ? msg : '确认此操作？',
            btn: {submit:'确定',cancel:'取消'},
            width: 'sm',
        });
        $modal.find('.btnSubmit').click(function(){
            $modal.modal('hide');
            if ( typeof callback == 'function' ){
                callback();
            }
        });
        return false;
    },
        
    /**
     * 
     * @param: {string} element = show|hide
     * @param {object} {title:[string],body:[html code],footer:[true|false],}
     * @demo    Comm.modal('show', {title:'modal test', body:$('#div-tpl').html(), footer:false})
     */
    modal: function(element, options){
        if (options.title == undefined) options.title = 'Modal Title';
        if (options.footer == undefined) options.footer = true;
        if ( options.btn == undefined ){
            options.btn = {
                submit: ' Save ',
                cancel: ' Cancel ',
            };
        }
        var btn = options.btn;
        
        var style, css = '';
        if (options.width) {
            var width = {
                sm: 'modal-sm',
                lg: 'modal-lg',        
            };
            if ( width[ options.width ] != undefined ){
                style = width[ options.width ];
            }
            else if( typeof options.width == 'number' ){
            	css = "width:"+options.width+'px';
            }
            else if( typeof options.widht == 'string' ){
            	css = "width:"+options.width;
            }
        }

        var id = "mymodal-"+ new Date().getTime();
        var tpl = 
'<div class="modal fade" id="'+id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
+  '<div class="modal-dialog '+style+'" style="'+css+'" role="document"><div class="modal-content">'
+      '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">'+options.title+'</h4></div>'
+      '<div class="modal-body">'+options.body+'</div>'
+      (options.footer ? '<div class="modal-footer"><button type="button" class="btn btn-default btnCancel" data-dismiss="modal">'+btn.cancel+'</button><button type="button" class="btn btn-primary btnSubmit">'+btn.submit+'</button></div>' : '')
+  '</div></div>'
+'</div>';

        $('body div[id^="mymodal"]').remove();
        $('body').append(tpl);
        $("#"+id).modal(element);
        return $('#'+id);
    },
    
    /**
     * 
     * @param {object} obj
     * @param {function} callback
     * @demo    Comm.dropdown($('.dropdown'),function(n){
     *               console.log(n);
     *           });
     */
    dropdown: function(obj, callback){
        var $obj = $(obj);
        $obj.find(".dropdown-menu li a").click(function(){
//            console.log( $(this) );
            $obj.find('.dropdown-menu li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            $obj.find('span.caret').parent().html( $(this).text() +'<span class="caret"></span>' );
            // close dropdown
            $obj.removeClass("open");
            // if has callback
            if (callback && typeof callback == 'function'){
                callback( $(this) );
            }
            return false;
        });
        
    },
    
    
    form: {
        showError: function(field, msg){
//        console.log( $(field) );
            var el = $(field);
            var controlGroup = el.parents('.form-group');
            controlGroup.removeClass('has-success').addClass('has-error');
            controlGroup.find('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            controlGroup.find("#valierr").html(msg);
        },
    },
    
    
    date: {
        strtotime: function(strdate) {
            var date = strdate.split(/\D+/);
            var timestamp = new Date(date[0], date[1], date[2]);
            return timestamp/1000;
        }
    },

    loading: function (showtime) {
        var arg = window.location.href.substring(7, 9);
        var img =   {
            'dp'    :   'deepleaper-loading.gif',
        };
        var div = '<div class="loading" style="width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); position: absolute; top: 0; left: 0; z-index: 9999;"><img src="/img/loading/' + img[arg] + '" style="width: 100px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0; "/></div>';
        $('body').append(div);
        if(showtime){
            setTimeout(Comm.hideLoading, showtime);
        }
    },

    hideLoading: function () {
        $('.loading').remove();
    },

    switchClient: function(userID) {
        Comm.loading();
        $.ajax({
            type: "post",
            url: '/index/switchclient',
            cache: false,
            data: {uid:userID},
            success: function(data) {

                if(data.status){
                    // location.reload();
                    location.href='/index';
                }else{
                    Comm.error(data.msg);
                }
            },
            dataType: "json"
        });
    }
    
};

/**
 * 修改密码
 */
function modifyPwd() {
    var addValdation = false;
    //获取 添加 html
    $.ajax({
        type: 'GET',
        url: '/user/modifypwd',
        cache: false,
        async: true,
        success: function (data) {
            var dia = dialog({
                title: '修改密码',
                content: data,
                width: 500,
                okValue: '提交',
                cancelValue: '取消',
                onshow: function () {
//                    $('.ui-dialog-content form').find('.selectpicker').each(function () {
//                        $(this).selectpicker();
//                    });
                },
                ok: function () {
                    Comm.loading();
                    var $form = $('.ui-dialog-content form');
                    if (false == addValdation) {
                        $form.validation();
                    }
                    if (false == $form.valid()) {
                        Comm.hideLoading();
                        return false;
                    } else {
                        $form.ajaxSubmit({
                            beforeSubmit: function () {
                                if (!$form.valid()) return false;
                            },
                            dataType: 'json',
                            success: function (res) {
                                Comm.hideLoading();
                                if (res.status) {
                                    Comm.success(res.msg);
                                    dia.close();
                                } else {
                                    Comm.error(res.msg);
                                }
                            }
                        });
                    }
                    return false;
                },
                cancel: function () {
                    this.close();
                }

            }).showModal();
        }
    });
}

/**
 * 账号信息
 */
function viewSelf() {
    //获取 添加 html
    $.ajax({
        type: 'GET',
        url: '/user/userinfo',
        cache: false,
        async: true,
        success: function (data) {
            var dia = dialog({
                title: '账号信息',
                content: data,
                width: 500,
                okValue: '关闭',
//                cancelValue: '取消',
                cancelDisplay: false,
                onshow: function () {
                    $('.ui-dialog-content form').find('.selectpicker').each(function () {
                        $(this).selectpicker();
                    });
                },
                ok: function () {
                    this.close();
                },
                cancel: function () {
                    this.close();
                }

            }).showModal();
        }
    });
}


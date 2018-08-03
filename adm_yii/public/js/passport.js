/**
 * js for passport
 */
$(function(){
    //IE绑定回车 !!转布尔型
    if (!!window.ActiveXObject || "ActiveXObject" in window){
        $(document).keydown(function(event){
            if(event.keyCode == 13){
                $("#formLogin").submit();
            }
        });
    }
    // do form submit
	$("#formLogin").bind('submit', function(){
        $('.login-tip').hide();
        var $form = $(this);
        $form.ajaxSubmit({
            success: function(txt){
            	txt = $.parseJSON(txt);
//                console.log( txt );
                if (txt.status != 1){
                    $('.login-tip').show();
//                    $('.login-tip .tip').html(txt.msg);
                    $('#btnSub').show();
                    $('.refresh').hide();
                    return false;
                }
            	if (txt.data && txt.data.backurl) {
            		window.location.href = txt.data.backurl;
            	}
            }
        });
        return false;
    });
});
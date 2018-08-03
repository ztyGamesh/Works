$(function(){
    /* 登录相关 */
    var username=$(".user");
    var userpass=$(".pass");
    var name=username.val();
    var pass=userpass.val();
    username.focus();
    userpass.focus(function () {
        userpass.attr('type','password');
    });
    subStyle(name,pass);
    username.keydown(function(e){
        name=$(this).val();
        subStyle(name,pass,e);
    });
    userpass.keydown(function(e){
        pass=$(this).val();
        subStyle(name,pass,e);
    });
    document.onkeydown = function(e){ var e = document.all ? window.event : e; subStyle(name,pass,e); }
    $('.sub').click(function(event) {
        $('.sub').css('display', 'none').siblings('.refresh').css('display', 'inline-block');
    });
    function subStyle(name,pass,e){
        if(name=="" || pass==""){
            $('.sub').css('display', 'none').siblings('.subImg').css({ 'display': 'inline-block', 'opacity': '0.3', 'filter': 'alpha(opacity=30)'});
        }else{
            if(e && e.keyCode==13 && e.keyCode!=116) {
                $('.sub').css('display', 'none').siblings('.refresh').css('display', 'inline-block');
            }else{
                $('.sub').css('display', 'block').siblings('.subImg').css('display', 'none');
            }
        }
    }

});
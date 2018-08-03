$(function () {
    changeDivHeight();
    window.onresize=function(){ changeDivHeight(); }
    function changeDivHeight(){
        var h = $(window).height() - 99;
        $('.content').css('min-height', h);
        $('.right-wrap .inner').css('min-height', h - 23);
    }

    $('.global-notice-icon').click(function () {
        $(this).parent('.global-notice').animate({opacity: 0, height: 0}, 1000);
        setTimeout((function () { $('.global-notice').css('display', 'none'); }), 1000);
    });

    $('.global-site a').popover({
        html: true,
        content: function() {
            return $(".global-site-wrap").html();
        }
    });

    $('#user-list').select2();

    $('.left-btn-close').click(function () {
        $(this).css('display', 'none');
        $('.left-btn-open').css('display', 'block');
        $('.left-wrap').addClass('left-wrap-act').siblings('.right-wrap').addClass('right-wrap-act');
        $('.left-nav').hide();
    });
    $('.left-btn-open').click(function () {
        $(this).css('display', 'none');
        $('.left-btn-close').css('display', 'block');
        $('.left-wrap').removeClass('left-wrap-act').siblings('.right-wrap').removeClass('right-wrap-act');
        setTimeout((function () { $('.left-nav').show(); }), 500);
    });
})
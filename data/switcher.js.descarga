(function ($) {
    "use strict";

    $(function () { // start: document ready

        $('.nb-switcher-toggle').click(function(){
            $(this).closest('.nb-switcher').toggleClass('nb-switcher-expanded');
        });

        // set Switcher Height
        setSwitcherHeight();

    }); // end: document ready

    $(window).on('resize', function () { // start: window resize
        // set Switcher Height
        setSwitcherHeight();
    }); // end: window resize

    function setSwitcherHeight(){
        var windowHeight = $(window).height();
        var topOffset = $('.nb-switcher').position().top;
        var switcherHeight = $('.nb-switcher').outerHeight();
        var switcherNewHeight = windowHeight - topOffset;

        if( windowHeight - topOffset < switcherHeight ){
            $('.nb-switcher').height(switcherNewHeight);
        }
        else{
            $('.nb-switcher').height('auto');
        }

    }

})(jQuery);


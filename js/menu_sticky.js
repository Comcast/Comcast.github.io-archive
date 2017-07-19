(function () {
    $(function () {
        var categories = $(".category-menu");
        var stickyEl = "sticky";
        var top = $('.top-informational').height();
        var bottom = document.getElementsByClassName("bottom-informational")[0];

        function checkVisible(elm) {
          var rect = elm.getBoundingClientRect();
          var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

          return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        }

        $(window).scroll(function () {
            if($(this).scrollTop() > top && !checkVisible(bottom)) {
                categories.addClass(stickyEl);
            } else {
                categories.removeClass(stickyEl);
            }
        });
    })
}())

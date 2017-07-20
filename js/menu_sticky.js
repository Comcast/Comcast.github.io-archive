(function () {
    $(function () {
        var categories = $(".category-menu");
        var stickyEl = "sticky";
        var bottom = document.getElementsByClassName("bottom-informational")[0];

        function checkVisible(elm) {
          var rect = elm.getBoundingClientRect();
          var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

          return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        }

        function setStickyClass() {
            if($(this).scrollTop() > document.querySelector('.top-informational').offsetHeight && !checkVisible(bottom) && $('body').width() >= 700) {
                categories.addClass(stickyEl);
            } else {
                categories.removeClass(stickyEl);
            }
        }

        $(window).scroll(setStickyClass);
        $(window).resize(setStickyClass);
    })
}())

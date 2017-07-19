(function ($) {
    "use strict";

    $(function () {
        var categories = [];

        function extractCategory(index, classes) {
            if (classes.match(/^category-/) && !classes.match(/all$/)) {
                categories.push(classes.split("-")[1]);
            }
        }

        function populateCategories() {
            return $(".category-menu li").each(function (index, lis) {
                $.each($(lis).attr("class").split(" "), extractCategory);
            });
        }

        function showAll() {
            $(".github-content li").show();
            $(".category-menu li").removeClass('category-selected');
            $(".category-menu li.category-all").addClass('category-selected');
        }

        function showCategory(category) {
            return function () {
                $(".github-content li").hide();
                $(".category-menu li").removeClass('category-selected');
                $(".github-content li.category-" + category).show();
                $(".category-menu li.category-" + category).addClass('category-selected');
            };
        }

        function setupShowAll() {
            $(".category.category-all").click(showAll);
        }

        function setupShowCategories() {
            $.each(categories, function (index, category) {
                $(".category.category-" + category).click(showCategory(category));
            });
        }

        function setup() {
            setupShowAll();

            populateCategories().promise().done(setupShowCategories);
        }

        setup();
    });
}(jQuery));

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
        }

        function showCategory(category) {
            return function () {
                $(".github-content li").hide();
                $(".github-content li.category-" + category).show();
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

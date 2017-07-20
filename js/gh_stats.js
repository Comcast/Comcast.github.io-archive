(function ($) {
    $(function () {
        var gh = new GitHub({token: "290ceb2840c197938c226d6d3f2b07e0178953d3"});
        var comcast = gh.getOrganization("comcast");

        function populateTotal(type) {
            return function (response) {
                var total = document.getElementById("total-" + type);
            
                total.innerHTML = response.data.length;
            }
        }

        comcast.getRepos().then(populateTotal("repos"));
        comcast.listMembers().then(populateTotal("members"));
    });
}(jQuery));
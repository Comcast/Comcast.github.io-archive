(function ($) {
    "use strict";

    $(function () {
        var gh = new GitHub({token: "3ab48f1540336680f0ee83ba41359dcba1c7e712"});
        var comcast = gh.getOrganization("comcast");

        function formatDate(date) {
          var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];

          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();

          return monthNames[monthIndex] + " " + day + ", " + year;
        }

        function sortReposByUpdatedDate(a, b) {
            return new Date(b.pushed_at) - new Date(a.pushed_at);
        }

        function generateRecentRepoHTML(repo) {
            return "<a href=\"" + repo.html_url + "\">" + repo.name + "</a>"
                 + " <span class=\"repo-update-date\">"
                 + formatDate(new Date(repo.pushed_at))
                 + "</span>"
                 + "<span class=\"repo-bullet\">&#8226;</span>"
                 + "<span class=\"repo-stargazers\">"
                 + repo.stargazers_count + " stargazers"
                 + "</span>"
                 + "<span class=\"repo-bullet\">&#8226;</span>"
                 + "<span class=\"repo-forks\">"
                 + repo.forks_count + " forks"
                 + "</span>";
        }

        function populateRecentRepos(repos) {
            var mostRecentRepos = repos.sort(sortReposByUpdatedDate);
            var repo;
            var recent;
            var i;

            for (i = 0; i < 5; i++) {
                recent = document.getElementById("recent-" + (i + 1));
                repo = mostRecentRepos[i];

                recent.innerHTML = generateRecentRepoHTML(repo);
            }
        }

        function populateTotal(type) {
            return function (response) {
                var total = document.getElementById("total-" + type);

                total.innerHTML = response.data.length;

                if (type === "repos") {
                    populateRecentRepos(response.data);
                }
            }
        }

        comcast.getRepos().then(populateTotal("repos"));
        comcast.listMembers().then(populateTotal("members"));
    });
}(jQuery));

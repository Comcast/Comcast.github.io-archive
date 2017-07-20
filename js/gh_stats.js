(function ($) {
    "use strict";

    $(function () {
        var gh = new GitHub({token: "290ceb2840c197938c226d6d3f2b07e0178953d3"});
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
            return new Date(b.updated_at) - new Date(a.updated_at);
        }

        function generateRecentRepoHTML(repo) {
            return "<a href=\"" + repo.html_url + "\">" + repo.name + "</a>"
                 + " <span class=\"repo-update-date\">"
                 + formatDate(new Date(repo.updated_at))
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

            for (i = 0; i < 3; i++) {
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

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

        function generateRecentRepoHTML(repo, options) {
          options = options || {};
          var includeDate = options.hasOwnProperty('date') ? options.date : true;
          var html = "<a href=\"" + repo.html_url + "\">" + repo.name + "</a>";

          if (includeDate) {
            html += " <span class=\"repo-update-date\">";
            html += formatDate(new Date(repo.pushed_at))
            html += "</span>";
            html += "<span class=\"repo-bullet\">&#8226;</span>"
          }

          html += "<span class=\"repo-stargazers\">"
          html += repo.stargazers_count + " stargazers"
          html += "</span>"
          html += "<span class=\"repo-bullet\">&#8226;</span>"
          html += "<span class=\"repo-forks\">"
          html += repo.forks_count + " forks"
          html += "</span>";

          return html;
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

        function sortReposByStars(a, b) {
            return new Date(b.stargazers_count) - new Date(a.stargazers_count);
        }

        function populateStarredRepos(repos) {
            var mostStarredRepos = repos.sort(sortReposByStars);
            var repo;
            var star;
            var i;

            for (i = 0; i < 5; i++) {
                star = document.getElementById("starred-" + (i + 1));
                repo = mostStarredRepos[i];

                star.innerHTML = generateRecentRepoHTML(repo, {date:false});
            }
        }

        function sortReposByForks(a, b) {
            return new Date(b.forks_count) - new Date(a.forks_count);
        }

        function populateForkedRepos(repos) {
            var mostForkedRepos = repos.sort(sortReposByForks);
            var repo;
            var fork;
            var i;

            for (i = 0; i < 5; i++) {
                fork = document.getElementById("forked-" + (i + 1));
                repo = mostForkedRepos[i];

                fork.innerHTML = generateRecentRepoHTML(repo, {date:false});
            }
        }

        function populateTotal(type) {
            return function (response) {
                var total = document.getElementById("total-" + type);

                total.innerHTML = response.data.length;

                if (type === "repos") {
                    populateRecentRepos(response.data);
                    populateStarredRepos(response.data);
                    populateForkedRepos(response.data);
                }
            }
        }

        comcast.getRepos().then(populateTotal("repos"));
        comcast.listMembers().then(populateTotal("members"));
    });
}(jQuery));

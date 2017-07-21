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

        function populateStat(repos, sortKey, idPrefix, options) {
            var sortFunction = function(a, b) {
              return new Date(b[sortKey]) - new Date(a[sortKey]);
            }
            var mostRecentRepos = repos.sort(sortFunction);
            var repo;
            var li;
            var i;

            for (i = 0; i < 5; i++) {
                li = document.getElementById(idPrefix + '-' + (i + 1));
                repo = mostRecentRepos[i];

                li.innerHTML = generateRecentRepoHTML(repo, options);
            }
        }

        function populateTotal(type) {
            return function (response) {
                var total = document.getElementById("total-" + type);

                total.innerHTML = response.data.length;

                if (type === "repos") {
                    populateStat(response.data, 'pushed_at', 'recent');
                    populateStat(response.data, 'stargazers_count', 'starred', {date:false});
                    populateStat(response.data, 'forks_count', 'forked', {date:false});
                }
            }
        }

        comcast.getRepos().then(populateTotal("repos"));
        comcast.listMembers().then(populateTotal("members"));
    });
}(jQuery));

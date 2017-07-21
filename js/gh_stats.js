(function ($) {
    "use strict";

    $(function () {
        var gh = new GitHub({token: "58c1436230b1e498d450ddada68dba779320560b"});
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
          var includeDescription = options.hasOwnProperty('desc') ? options.desc : true;
          var includeDate = options.hasOwnProperty('date') ? options.date : true;
          var includeStars = options.hasOwnProperty('stars') ? options.stars : true;
          var includeForks = options.hasOwnProperty('forks') ? options.forks : true;
          var html = "<a href=\"" + repo.html_url + "\">" + repo.name + "</a>";

          if (includeDescription && repo.description) {
            html += " <span class=\"repo-description\">";
            html += repo.description;
            html += "</span>";
            if (includeDate || includeStars || includeForks) {
              html += "<span class=\"repo-bullet\">&#8226;</span>"
            }
          }

          if (includeDate) {
            html += " <span class=\"repo-update-date\">";
            html += formatDate(new Date(repo.pushed_at))
            html += "</span>";
            if (includeStars || includeForks) {
              html += "<span class=\"repo-bullet\">&#8226;</span>"
            }
          }

          if (includeStars) {
            html += "<span class=\"repo-stargazers\">"
            html += repo.stargazers_count + " stargazers"
            html += "</span>"
            if (includeForks) {
              html += "<span class=\"repo-bullet\">&#8226;</span>"
            }
          }

          if (includeForks) {
            html += "<span class=\"repo-forks\">"
            html += repo.forks_count + " forks"
            html += "</span>";
          }

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
                var sourceRepos;
                var forkedRepos;

                if (type === "repos") {
                    sourceRepos = response.data.filter(function(repo){ return !repo.fork; });
                    forkedRepos = response.data.filter(function(repo){ return repo.fork; });
                    document.getElementById('total-source-repos').innerHTML = sourceRepos.length;
                    document.getElementById('total-forked-repos').innerHTML = forkedRepos.length;
                    populateStat(sourceRepos, 'pushed_at', 'recent', {stars: false, forks: false});
                    populateStat(sourceRepos, 'stargazers_count', 'starred', {date:false, desc: false});
                    populateStat(sourceRepos, 'forks_count', 'forked', {date:false, desc: false});
                    populateStat(forkedRepos, 'pushed_at', 'pr', {date:false, stars: false, forks: false});
                } else {
                    document.getElementById('total-members').innerHTML = response.data.length;
                }
            }
        }

        comcast.getRepos().then(populateTotal("repos"));
        comcast.listMembers().then(populateTotal("members"));
    });
}(jQuery));

(function ($) {
    "use strict";

    $(function () {
        var gh = new GitHub({token: "6752827c8bd9591f64f14dd2505a38b723fadf10"});
        var comcast = gh.getOrganization("comcast");

        var stats = {
          formatDate: function(date) {
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
          },

          generateRecentRepoHTML: function(repo, options) {
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
              html += this.formatDate(new Date(repo.pushed_at))
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
          },

          populateStat: function(repos, sortKey, idPrefix, options) {
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

                  li.innerHTML = this.generateRecentRepoHTML(repo, options);
              }
          },

          populateTotal: function(type) {
            return function (response) {
              var sourceRepos;
              var forkedRepos;

              if (type === "repos") {
                sourceRepos = response.data.filter(function(repo){ return !repo.archived && !repo.private &&!repo.fork; });
                forkedRepos = response.data.filter(function(repo){ return !repo.archived && !repo.private &&repo.fork; });
                document.getElementById('total-public-repos').innerHTML = response.data.length;
                document.getElementById('total-source-repos').innerHTML = sourceRepos.length;
                document.getElementById('total-forked-repos').innerHTML = forkedRepos.length;
                this.populateStat(sourceRepos, 'pushed_at', 'recent', {stars: false, forks: false});
                this.populateStat(sourceRepos, 'stargazers_count', 'starred', {date:false, desc: false});
                this.populateStat(sourceRepos, 'forks_count', 'forked', {date:false, desc: false});
              } else {
                document.getElementById('total-members').innerHTML = response.data.length;
              }

              ga('set', 'dimension1', 'success'); // githubApiStatus
              if(!window.GA_PAGEVIEW_SENT) {
                ga('send', 'pageview');
                GA_PAGEVIEW_SENT = true;
              }
            }.bind(stats);
          },

          handleGithubFailure: function(e) {
            e = e || {};

            var githubApiError = [];

            if (e.message) {
              githubApiError.push(e.message);
            } else {
              githubApiError.push('NO_MSG');
            }

            if (e.response && e.response.status) {
              githubApiError.push(e.response.status);
            } else {
              githubApiError.push('NO_STATUS');
            }

            if (e.request && e.request.url) {
              githubApiError.push(e.request.url);
            } else {
              githubApiError.push('NO_URL');
            }

            ga('set', 'dimension1', 'failure'); // githubApiStatus
            ga('set', 'dimension2', githubApiError.join('|')); // githubApiError
            if(!window.GA_PAGEVIEW_SENT) {
              ga('send', 'pageview');
              GA_PAGEVIEW_SENT = true;
            }

            document.getElementsByClassName('stats')[0].className = 'stats github-api-failed';
          },
        }

        comcast.getRepos().then(stats.populateTotal("repos")).catch(stats.handleGithubFailure.bind(stats));
        comcast.listMembers({
          per_page: 100
        }).then(stats.populateTotal("members")).catch(stats.handleGithubFailure.bind(stats));
    });
}(jQuery));

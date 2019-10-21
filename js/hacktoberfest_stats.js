(function hacktoberfestStats() {
  const clientWithAuth = new Octokit({
    auth() { return 'token 6752827c8bd9591f64f14dd2505a38b723fadf10'; },
  });
  const orgs = ['xmidt-org', 'vinyldns', 'comcast'];
  const orgsAndRepos = orgs.map((orgName) => clientWithAuth.paginate('GET /orgs/:org/repos', {
    org: orgName,
    type: 'sources',
  }));
  const openIssues = [];
  const openPrs = [];
  let closedPrs = 0;
  const closedIssues = [];
  let contributors = [];
  const participatingRepos = [];
  const totalRepos = document.getElementById('total-repos');
  const totalOpenIssues = document.getElementById('total-open-issues');
  const totalContributors = document.getElementById('total-contributors');
  const totalOpenPullRequests = document.getElementById('total-open-pull-requests');
  const totalClosedIssues = document.getElementById('total-closed-issues');
  const totalClosedPullRequests = document.getElementById('total-closed-pull-requests');

  function formatContributor(contributor) {
    const html = `<a href="${contributor.html_url}"><img class="thumbnail" src="${contributor.avatar_url}" alt="${contributor.login}"/></a>`;
    return html;
  }

  function formatIssue(issue) {
    const orgAndRepo = issue.repository_url.replace('https://api.github.com/repos/', '');
    const html = `<li><a href="${issue.html_url}">${orgAndRepo}: ${issue.title}</a></li>`;
    return html;
  }

  function formatRepo(repoUrl) {
    const orgAndRepo = repoUrl.replace('https://api.github.com/repos/', '');
    const html = `<li><a href="https://github.com/${orgAndRepo}">${orgAndRepo}</a></li>`;
    return html;
  }

  function build(org) {
    return org
      .then((orgRepos) => orgRepos.map((repo) => clientWithAuth.paginate('GET /repos/:owner/:repo/issues', {
        owner: repo.owner.login,
        repo: repo.name,
        labels: 'hacktoberfest',
        state: 'all',
      })))
      .then((issuesAndPullRequests) => {
        return Promise.all(issuesAndPullRequests).then((values) => {
          values.forEach((v) => {
            if (v.length > 0) {
              v.forEach((issue) => {
                if (issue.pull_request && !issue.closed_at && issue.created_at > '2019-10-01') {
                  openPrs.push(issue);
                  contributors.push(formatContributor(issue.user));
                } else if (issue.pull_request && issue.closed_at >= '2019-10-01' && issue.closed_at <= '2019-10-31') {
                  closedPrs += 1;
                  contributors.push(formatContributor(issue.user));
                } else if (issue.closed_at && issue.closed_at >= '2019-10-01' && issue.closed_at <= '2019-10-31') {
                  closedIssues.push(issue);
                } else if (!issue.pull_request && !issue.closed_at) {
                  openIssues.push(issue);
                  document.getElementById('hacktoberfest-issues').innerHTML += formatIssue(issue);
                }
              });
              participatingRepos.push(v[0].repository_url);
              document.getElementById('hacktoberfest-repos').innerHTML += formatRepo(v[0].repository_url);
            }
          });
          contributors = [...new Set(contributors)];
          totalRepos.innerHTML = participatingRepos.length;
          totalOpenIssues.innerHTML = openIssues.length;
          totalContributors.innerHTML = contributors.length;
          totalOpenPullRequests.innerHTML = openPrs.length;
          totalClosedIssues.innerHTML = closedIssues.length;
          totalClosedPullRequests.innerHTML = closedPrs;
          document.getElementById('hacktoberfest-contributors').innerHTML = '';
          contributors.map((contributor) => {
            document.getElementById('hacktoberfest-contributors').innerHTML += contributor;
            return contributor;
          });
        });
      });
  }

  const loadingPromises = Object.keys(orgsAndRepos).map((org) => build(orgsAndRepos[org]));
  Promise.all(loadingPromises).then(function (values) {
    totalRepos.classList.remove('animated-loader');
    totalOpenIssues.classList.remove('animated-loader');
    totalContributors.classList.remove('animated-loader');
    totalOpenPullRequests.classList.remove('animated-loader');
    totalClosedIssues.classList.remove('animated-loader');
    totalClosedPullRequests.classList.remove('animated-loader');
  });
}());

function toggleContent(contentName) {
  document.getElementById(contentName).toggleAttribute('hidden');
  if (document.getElementById(`${contentName}-toggle`).innerHTML === 'show') {
    document.getElementById(`${contentName}-toggle`).innerHTML = 'hide';
  } else {
    document.getElementById(`${contentName}-toggle`).innerHTML = 'show';
  }
}

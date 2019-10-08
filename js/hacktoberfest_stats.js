(function hacktoberfestStats() {
  const clientWithAuth = new Octokit({
    auth() { return 'token 6752827c8bd9591f64f14dd2505a38b723fadf10'; },
  });
  const orgs = ['xmidt-org', 'vinyldns', 'comcast'];
  const orgsAndRepos = orgs.map((orgName) => clientWithAuth.paginate('GET /orgs/:org/repos', {
    org: orgName,
    type: 'sources',
  }));
  const allIssues = [];
  const allPrs = [];
  const openIssues = [];
  const openPrs = [];
  const closedPrs = [];
  const closedIssues = [];
  const openIssuesFormatted = [];
  const openPrsFormatted = [];
  let contributors = [];
  let participatingRepos = [];
  const totalRepos = document.getElementById('total-repos');
  const totalOpenIssues = document.getElementById('total-open-issues');
  const totalContributors = document.getElementById('total-contributors');
  const totalOpenPullRequests = document.getElementById('total-open-pull-requests');
  const totalClosedIssues = document.getElementById('total-closed-issues');
  const totalClosedPullRequests = document.getElementById('total-closed-pull-requests');

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
    org
      .then((orgRepos) => orgRepos.map((repo) => clientWithAuth.paginate('GET /repos/:owner/:repo/issues', {
        owner: repo.owner.login,
        repo: repo.name,
        labels: 'hacktoberfest',
        state: 'all',
      })))
      .then((issuesAndPullRequests) => {
        Promise.all(issuesAndPullRequests).then((values) => {
          values.forEach((v) => {
            if (v.length > 0) {
              v.forEach((issue) => {
                if (issue.pull_request && !issue.closed_at && issue.created_at > '2019-10-01') {
                  allPrs.push(issue);
                  openPrs.push(issue);
                  openPrsFormatted.push(formatIssue(issue));
                } else if (issue.pull_request && issue.closed_at >= '2019-10-01' && issue.closed_at <= '2019-10-31') {
                  allPrs.push(issue);
                  closedPrs.push(issue);
                } else if (issue.closed_at && issue.closed_at >= '2019-10-01' && issue.closed_at <= '2019-10-31') {
                  allIssues.push(issue);
                  closedIssues.push(issue);
                } else if (!issue.pull_request && !issue.closed_at) {
                  allIssues.push(issue);
                  openIssues.push(issue);
                  openIssuesFormatted.push(formatIssue(issue));
                }
              });
            }
          });
          contributors = [...new Set(allPrs.map((pr) => pr.user.login))];
          participatingRepos = [...new Set(allIssues.map((issue) => issue.repository_url))];
          totalRepos.innerHTML = participatingRepos.length;
          totalRepos.classList.remove('animated-loader');
          totalOpenIssues.innerHTML = openIssues.length;
          totalOpenIssues.classList.remove('animated-loader');
          totalContributors.innerHTML = contributors.length;
          totalContributors.classList.remove('animated-loader');
          totalOpenPullRequests.innerHTML = openPrs.length;
          totalOpenPullRequests.classList.remove('animated-loader');
          totalClosedIssues.innerHTML = closedIssues.length;
          totalClosedIssues.classList.remove('animated-loader');
          totalClosedPullRequests.innerHTML = closedPrs.length;
          totalClosedPullRequests.classList.remove('animated-loader');
          participatingRepos.forEach((repo) => {
            document.getElementById('hacktoberfest-repos').innerHTML += formatRepo(repo);
          });
          openIssuesFormatted.forEach((issue) => {
            document.getElementById('hacktoberfest-issues').innerHTML += issue;
          });
          openPrsFormatted.forEach((pr) => {
            document.getElementById('hacktoberfest-prs').innerHTML += pr;
          });
        });
      });
  }

  Object.keys(orgsAndRepos).forEach((org) => build(orgsAndRepos[org]));
}());

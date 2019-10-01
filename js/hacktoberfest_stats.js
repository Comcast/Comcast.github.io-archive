(function hacktoberfestStats() {
  const clientWithAuth = new Octokit({
    auth() { return 'token 6752827c8bd9591f64f14dd2505a38b723fadf10'; },
  });
  const orgs = ['comcast', 'vinyldns', 'xmidt-org'];
  const repos = orgs.map((orgName) => clientWithAuth.paginate('GET /orgs/:org/repos', {
    org: orgName,
    type: 'sources',
  }));

  function formatIssue(issue) {
    const regexOrgAndRepo = /(\w|-)*\/(\w|-)*$/;
    const orgAndRepo = issue.repository_url.match(regexOrgAndRepo)[0];
    const html = `<li><a href="${issue.html_url}">${orgAndRepo}: ${issue.title}</a></li>`;
    return html;
  }

  function formatRepo(repoUrl) {
    const regexOrgAndRepo = /(\w|-)*\/(\w|-)*$/;
    const orgAndRepo = repoUrl.match(regexOrgAndRepo)[0];
    const html = `<li><a href="https://github.com/${orgAndRepo}">${orgAndRepo}</a></li>`;
    return html;
  }

  Promise.all(repos)
    .then((response) => response.flatMap((r) => r))
    .then((orgRepos) => orgRepos.map((repo) => clientWithAuth.paginate('GET /repos/:owner/:repo/issues', {
      owner: repo.owner.login,
      repo: repo.name,
      labels: 'hacktoberfest',
      state: 'all',
    })))
    .then((issuesAndPullRequests) => {
      const allIssues = [];
      const allPrs = [];
      const openIssues = [];
      const openPrs = [];
      const closedPrs = [];
      const closedIssues = [];
      const openIssuesFormatted = [];
      const openPrsFormatted = [];
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
        const contributors = [...new Set(allPrs.map((pr) => pr.user.login))];
        const participatingRepos = [...new Set(allIssues.map((issue) => issue.repository_url))];
        document.getElementById('total-repos').innerHTML = participatingRepos.length;
        document.getElementById('total-open-issues').innerHTML = openIssues.length;
        document.getElementById('total-contributors').innerHTML = contributors.length;
        document.getElementById('total-open-pull-requests').innerHTML = openPrs.length;
        document.getElementById('total-closed-issues').innerHTML = closedIssues.length;
        document.getElementById('total-closed-pull-requests').innerHTML = closedPrs.length;
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
}());

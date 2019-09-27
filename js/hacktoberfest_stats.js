(function hacktoberfestStats() {
  const clientWithAuth = new Octokit({
    auth() { return 'token 6752827c8bd9591f64f14dd2505a38b723fadf10'; },
  });
  const orgs = ['comcast', 'vinyldns', 'xmidt-org'];
  const repos = orgs.map((orgName) => clientWithAuth.repos.listForOrg({
    org: orgName,
    type: 'sources',
  }));

  function formatIssue(issue) {
    const regexOrgAndRepo = /(\w|-)*\/(\w|-)*$/;
    const orgAndRepo = issue.repository_url.match(regexOrgAndRepo)[0];
    const html = `<li><a href="${issue.html_url}">${orgAndRepo}: ${issue.title}</a></li>`;
    return html;
  }

  Promise.all(repos)
    .then((response) => response.flatMap((r) => r.data))
    .then((orgRepos) => orgRepos.map((repo) => clientWithAuth.issues.listForRepo({
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
          if (v.data.length > 0) {
            v.data.forEach((issue) => {
              if (issue.pull_request && !issue.closed_at && issue.created_at > '2019-10-01') {
                allPrs.push(issue);
                openPrs.push(issue);
                openPrsFormatted.push(formatIssue(issue));
              } else if (issue.pull_request && issue.closed_at >= '2019-10-01' && '2019-10-31' >= issue.closed_at) {
                allPrs.push(issue);
                closedPrs.push(issue);
              } else if (issue.closed_at && issue.closed_at >= '2019-10-01' && '2019-10-31' >= issue.closed_at) {
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
        openIssuesFormatted.forEach((issue) => {
          document.getElementById('hacktoberfest-issues').innerHTML += issue;
        });
        openPrsFormatted.forEach((pr) => {
          document.getElementById('hacktoberfest-prs').innerHTML += pr;
        });
      });
    });
}());

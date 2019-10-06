(function(){
  'use strict';

  var $ul = document.querySelector('#stat-newest ul');

  fetchList()
  .then(function(data) {
    render(data);
  });

  function fetchList(){
    return fetch('https://api.github.com/orgs/Comcast/repos?type=sources&sort=created&direction=desc&per_page=100')
    .then(resolve)
    .catch(reject);
  }

  function resolve(response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }

    return response.json().then(function(data) {
      return data.filter(function(item) {
        return item.name !== '.github'
        && item.description
        && !item.archived;
      }).slice(0, 15);
    });
  }

  function reject(err) {
    console.log('Fetch Error :-S', err);
  }

  function render(data) {
    $ul.innerHTML = '';

    data.forEach(function (item, index) {
      renderItem(item, index);
    });
  }

  function renderItem(item, index) {
    var $li = renderLi(index);
    renderAnchor($li, item);
    renderSpan($li, item);
  }

  function renderLi(index) {
    var $li = $ul.appendChild(document.createElement('li'));
    $li.setAttribute('id', 'newest-' + (index + 1));

    return $li;
  }

  function renderAnchor($parent, item) {
    var $a = $parent.appendChild(document.createElement('a'));
    $a.innerHTML = item.name;
    $a.setAttribute('href', item.html_url);
    $a.setAttribute('rel', 'noopener');

    return $a;
  }

  function renderSpan($parent, item) {
    var $span = $parent.appendChild(document.createElement('span'));
    $span.innerHTML = item.description;
    $span.className = 'repo-description';

    return $span;
  }
}());

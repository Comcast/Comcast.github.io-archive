(function(){
  'use strict';

  var categoryLinks = document.querySelectorAll('.category-menu a');
  var i;
  var locationHash = window.location.hash;
  var githubContentElement = document.querySelector('.github-content');
  var showCategory = function(selectedCategoryAnchor) {
    var anchor = typeof selectedCategoryAnchor === 'string' ? selectedCategoryAnchor : this.href.split('#')[1];
    var category = anchor.substring(0, anchor.length-9); // removes '-projects'

    if (category === 'all') {
      githubContentElement.className = 'github-content';
    } else {
      githubContentElement.className = 'github-content category-selected ' + category + '-selected';
    }
  }

  for (i = 0; i < categoryLinks.length; i++) {
    categoryLinks[i].addEventListener('click', showCategory);
  }

  if (locationHash) {
    showCategory(locationHash.substring(1));
    setTimeout(function() { githubContentElement.scrollIntoView(); }, 60);
  }
}());

(function(){
  'use strict';

  var categoryLinks = document.querySelectorAll('.category-menu a');
  var i;
  var locationHash = window.location.hash;
  var githubContentElement = document.querySelector('.github-content');
  var anchorToLinkReference = {};
  var getAnchor = function(href) {
    return href.split('#')[1];
  }
  var setActiveLink = function(anchor) {
    var link = anchorToLinkReference[anchor];
    for (i = 0; i < categoryLinks.length; i++) {
      categoryLinks[i].className = '';
    }
    link.className = 'active';
  }
  var showCategory = function(selectedCategoryAnchor) {
    var anchor = typeof selectedCategoryAnchor === 'string' ? selectedCategoryAnchor : getAnchor(this.href);
    var category = anchor.substring(0, anchor.length-9); // removes '-projects'

    if (category === 'all') {
      githubContentElement.className = 'github-content';
    } else {
      githubContentElement.className = 'github-content category-selected ' + category + '-selected';
    }

    setActiveLink(anchor);
  }

  for (i = 0; i < categoryLinks.length; i++) {
    categoryLinks[i].addEventListener('click', showCategory);
    anchorToLinkReference[getAnchor(categoryLinks[i].href)] = categoryLinks[i];
  }

  if (locationHash) {
    showCategory(locationHash.substring(1));
    setTimeout(function() { githubContentElement.scrollIntoView(); }, 60);
  }
}());

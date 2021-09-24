// ==UserScript==
// @name     Chefkoch NoAd
// @version  2
// @grant    none
// @include  https://www.chefkoch.de/*
// ==/UserScript==

document.querySelectorAll('div').forEach(function(e) {
  // check each div
  if (e.textContent.trim() !== 'Ad' ) return;
  // If the only text is "Ad" - remove the div
  e.remove();
});
document.querySelectorAll('img[referrerpolicy="unsafe-url"]').forEach(function(e) {
  // check each mage
  var grandparent = e.parentNode.parentNode;
  if (grandparent.tagName == 'DIV ) {
      e.remove();
  }
});

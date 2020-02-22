// ==UserScript==
// @name     Chefkoch NoAd
// @version  1
// @grant    none
// @include  https://www.chefkoch.de/*
// ==/UserScript==

document.querySelectorAll('div').forEach(function(e) {
  // check each div
  if (e.textContent.trim() !== 'Ad' ) return;
  // If the only text is "Ad" - remove the div
  e.remove();
})

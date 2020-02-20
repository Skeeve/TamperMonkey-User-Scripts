// ==UserScript==
// @name     Chefkoch NoAd
// @version  1
// @grant    none
// @include  https://www.chefkoch.de/*
// ==/UserScript==
$('div').each(function(i,e) {
  if (e.textContent.trim() !== 'Ad' ) return;
  e.remove();
})

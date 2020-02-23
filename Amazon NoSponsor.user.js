// ==UserScript==
// @name     Amazon NoSponsor
// @version  1
// @grant    none
// @include  https://www.amazon.de/s?*
// ==/UserScript==

document
  .querySelectorAll('div.s-result-item')
  .forEach(
  	function(elt) {
      if (null !== elt.textContent.match(/Gesponsert/)) {
        elt.parentNode.removeChild(elt);
      }
    }
  )
// ==UserScript==
// @name     Amazon NoSponsor
// @version  1
// @grant    none
// @include  https://www.amazon.de/s?*
// ==/UserScript==

window.setTimeout(removeit, 100);

function removeit() {
  var removed= 0;
  document
    .querySelectorAll('div.s-result-item')
    .forEach(
      function(elt) {
        if (null !== elt.textContent.match(/Gesponsert/)) {
          elt.parentNode.removeChild(elt);
          ++removed;
        }
      }
    );
  if (removed == 0)  window.setTimeout(removeit, 100);
}
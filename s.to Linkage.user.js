// ==UserScript==
// @name     s.to Linkage
// @version  1
// @grant    none
// @include  https://s.to/serie/stream/*/staffel-*
// @exclude  https://s.to/serie/stream/*/staffel-*/episode-*
// ==/UserScript==

// Alle Links auf eine s.to Serien-Seite ändern,
var newlinks= document.querySelectorAll("i.icon");
for (var i= newlinks.length; i-->0;) {
  var thislink= newlinks[i];
  var pn= thislink.parentNode;
  // damit ein neues Fenster geöffnet wird.
  pn.setAttribute("target","_blank");
  pn.setAttribute("rel", "noopener noreferrer");
  // Ausserdem jedes Icon mit einem Link versehen
  var newa= pn.cloneNode(false);
  // Und dabei den Hoster als Target anhängen.
  newa.href += '#' + thislink.className.replace(/\s*icon\s*/,'');
  pn.replaceChild(newa, thislink);
  newa.appendChild(thislink);
}

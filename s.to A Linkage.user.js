// ==UserScript==
// @name     s.to A Linkage
// @namespace    http://tampermonkey.net/
// @author       https://github.com/Skeeve
// @version  8
// @description  Change every hoster-link in preparation for the other scripts 
// @grant    none
// @include  https://serien.sx/serie/stream/*/staffel-*
// @include  https://serien.vc/serie/stream/*/staffel-*
// @include  https://s.to/serie/stream/*/staffel-*
// @include  https://serien.ac/serie/stream/*/staffel-*
// @include  https://serien.*/serie/stream/*/staffel-*
// @include  https://serienstream.sx/serie/stream/*/staffel-*
// @exclude  https://serien.sx/serie/stream/*/staffel-*/episode-*
// @exclude  https://serien.vc/serie/stream/*/staffel-*/episode-*
// @exclude  https://s.to/serie/stream/*/staffel-*/episode-*
// @exclude  https://serien.ac/serie/stream/*/staffel-*/episode-*
// @exclude  https://serien.*/serie/stream/*/staffel-*/episode-*
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

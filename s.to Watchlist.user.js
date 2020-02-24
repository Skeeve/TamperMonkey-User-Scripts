// ==UserScript==
// @name     s.to watchlist
// @version  1
// @grant    none
// @include  https://s.to/account/watchlist
// @require  https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Userscript für s.to - Watchlist.
// Fügt hinter dem Genre die Staffel und Episodennummer der
// ersten ungesehenen Folge ein.

// Zunächst alle Serien einsammeln
$('.seriesListContainer a').each(
  function(i, elt) {
    // Die Haupseite jeder Serie laden
    $.ajax({
      url: elt.href,
      // Auf jeder Hauptseite
      success: function(result) {
        // Die Seite parsen (Pseudo-HTML durch umklammerndes root-Element)
        var series_info= $.parseHTML("<root>" + result + "</root>");
        // Alle Staffel Links herausziehen, die nicht as "seen" markiert sind
        // Das schließt auch die erste Staffel mit ein, da sie im Normalfall
        // als "active" markiert ist.
        // Zusätzlich werden alle Links ausgefiltert, deren Bezeichnung nicht ausschließlich
        // aus Ziffern besteht (Siehe Doctor Who "Filme")
        var seasons= $(series_info).find('#stream > ul:first-child a:not(a.seen)').filter(function(i){ return this.textContent.match(/^\d+/)!==null });
        // Alle Episoden-Links der ungesehenen Folgen der aktiven Staffel herausziehen
        var episodes= $(series_info).find('#stream > ul a[data-season-id]:not(a.seen)');
        // Das Genre Element holen
        var genre= $(elt).find('small');
        // Gibt es ungesehene Episoden in der aktuellen Staffel?
        if (episodes.length > 0) {
          // dann den Serienlink auf diese Staffel setzen
          elt.href= seasons[0].href;
          // Und die Informationen über die Episode hinter dem Genre einfügen.
          genre.text(genre.text() + " " + episodes[0].getAttribute("data-season-id") + "-" + episodes[0].innerText);
          // Highlight with an existing class
          $(elt).addClass('formsection');
        } else {
          // Gibt es eine ungesehene Staffel?
          if (seasons.length > 1) {
            // Dann den Serienlink auf diese Staffel setzen
            elt.href= seasons[1].href;
            // Die Staffelinformationen laden
            $.ajax({
              url: elt.href,
              // auf der Staffelseite
              success: function(result) {
                // wieder die Seite als Pseudo-HTML parsen
                var series_info= $.parseHTML("<root>" + result + "</root>");
                // Ungesehene Episoden herausziehen
                var episodes= $(series_info).find('#stream > ul a[data-season-id]:not(a.seen)');
                // Wenn es welche gab (das sollte eigentlich immer der Fall sein, wenn wir hier sind)
                if (episodes.length > 0) {
                  // Die Informationen hinter dem Genre einfügen
                  genre.text(genre.text() + " " + episodes[0].getAttribute("data-season-id") + "-" + episodes[0].innerText);
                  // Highlight with an existing class
				          $(elt).addClass('formsection');
                }
              }
            });
          }
        }
      }
    });
  }
);

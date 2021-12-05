// ==UserScript==
// @name         Mathekalender Übersicht
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://www.mathekalender.de/wp/de/kalender/aufgaben/
// @match        https://www.mathekalender.de/wp/calendar/challenges/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const aufgaben = document.querySelectorAll(`
        a[href^="https://www.mathekalender.de/wp/de/kalender/aufgaben/aufgabe-"],
        a[href^="https://www.mathekalender.de/wp/calendar/challenges/challenge-"]
    `);
    if (aufgaben == null) return;

    let wpb_column = aufgaben[0];
    let AntwortFehlt = ' - Antwort fehlt';
    let Antwort = ' - Antwort:';
    if (wpb_column.href.match(/challenges/)) {
        AntwortFehlt = ' - No answer yet';
        Antwort = ' - Answer:';
    }
    while ( !wpb_column.classList.contains('wpb_column')) {
        wpb_column = wpb_column.parentNode;
    }
    wpb_column.className = '';

    aufgaben.forEach( (aufgabe, idx) => {
        fetch(aufgabe.href)
        .then( response => response.text() )
        .then( html => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const selected = doc.querySelector('select[name="solution"] option[selected]')
            let solElt = undefined;
            if (selected === null) {
                solElt = document.createElement('i');
                solElt.innerText = AntwortFehlt;
            } else {
                solElt = document.createElement('span');
                solElt.innerText = Antwort + selected.value + " -" + loesungsText(doc, selected.index);
            }
            aufgabe.parentNode.append(solElt);
        })
    })

	function loesungsText(doc, index) {
		let text = '';
		doc.querySelectorAll('h4').forEach( h4 => {
			if (h4.textContent != 'Antwortmöglichkeiten:'
               && h4.textContent != 'Possible answers:') return;
			text = h4.parentNode.querySelectorAll('ol li')[index].textContent;
		});
		return text;
	}

})();
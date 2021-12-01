// ==UserScript==
// @name         Mathekalender Übersicht
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://www.mathekalender.de/wp/de/kalender/aufgaben/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('a[href^="https://www.mathekalender.de/wp/de/kalender/aufgaben/aufgabe-"]').forEach( aufgabe => {
        fetch(aufgabe.href)
        .then( response => response.text() )
        .then( html => {
            const solution = html.match(/selected>(\d+)<\/option>/);
            let solElt = undefined;
            if (solution === null) {
                solElt = document.createElement('i');
                solElt.innerText = ' Antwort fehlt';
            } else {
                solElt = document.createElement('span');
                solElt.innerText = " Antwort: " + solution[1];
            }
            aufgabe.parentNode.append(solElt);
        })
    })
})();
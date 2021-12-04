// ==UserScript==
// @name         Mathekalender Antwortmöglichkeiten
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://www.mathekalender.de/wp/de/kalender/aufgaben/aufgabe-*
// @match        ttps://www.mathekalender.de/wp/calendar/challenges/challenge-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('h4').forEach( h4 => {
        console.log("h4:", h4);
        if (h4.textContent != 'Antwortmöglichkeiten:'
           && h4.textContent != 'Possible answers:') return;
        const sol = document.querySelector('select[name="solution"]');
        sol.addEventListener('change', function() {
            document.querySelectorAll('input[name="solution-radio"]')[this.selectedIndex].checked=true
        });
        let selectedIndex = -1;
        if ( null !== document.querySelector('select[name="solution"] option[selected]') ) {
            selectedIndex = sol.selectedIndex;
        }
        h4.parentNode.querySelectorAll('ol li').forEach( (li, idx) => {
            const radio = document.createElement('input');
            radio.setAttribute('type', 'radio');
            radio.setAttribute('name', 'solution-radio');
            if (idx == selectedIndex) radio.setAttribute('checked', 'checked');
            li.insertBefore(radio, li.firstChild);
            li.addEventListener('click', function() {
                sol.selectedIndex = idx;
                let changeEvent = new Event('change');
                sol.dispatchEvent(changeEvent);
            });
        });
    });
})();
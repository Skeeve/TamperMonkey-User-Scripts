// ==UserScript==
// @name         Mathekalender Antwortmöglichkeiten
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @downloadURL  https://github.com/Skeeve/TamperMonkey-User-Scripts/raw/master/Mathekalender+Antwortmöglichkeiten.user.js
// @updateURL    https://github.com/Skeeve/TamperMonkey-User-Scripts/raw/master/Mathekalender+Antwortmöglichkeiten.user.js
// @match        https://www.mathekalender.de/wp/de/kalender/aufgaben/*
// @match        https://www.mathekalender.de/wp/calendar/challenges/2022-02-en/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        input[name="solution-radio"] {
            margin-right: 0.5em;
        }
    `);

    document.querySelectorAll('h4').forEach( h4 => {
        console.log("h4:", h4);
        if (! h4.textContent.startsWith('Antwortmöglichkeiten')
           && ! h4.textContent.startsWith('Possible answers')) return;
        const sol = document.querySelector('select[name="solution"]');
        console.log(sol);
        sol.addEventListener('change', function() {
            document.querySelectorAll('input[name="solution-radio"]')[this.selectedIndex].checked=true
        });
        let selectedIndex = -1;
        if ( null !== document.querySelector('select[name="solution"] option[selected]') ) {
            selectedIndex = sol.selectedIndex;
        }
        h4.parentNode.querySelectorAll('ol li,tr[class^="row-"] > td.column-1').forEach( (li, idx) => {
            console.log(li, idx);
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
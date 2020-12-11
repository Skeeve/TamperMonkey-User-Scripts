// ==UserScript==
// @name         Mathekalender Forum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.mathekalender.de/
// @match        https://www.mathekalender.de/index.php?*
// @grant        none
// ==/UserScript==

/*

Some small helpers for the greate Math+ Kalender www.mathekalender.de

1. Highlight the current day in red or green, depending of whether or
   not the problem is already open.
2. Highlight the previous day in blue(ish color).
3. Append on each problem direct links to their forum threads.
4. Append on the forum entry page links to the current threads.
5. On the forum main page, follow the link to the chosen thread
   to jump to the last entry.

*/
(function() {
    'use strict';

    function highlight(wrapper, day, color) {
        const tuerchen=document.querySelector("area[alt='Aufgabe "+day+"']");
        if(tuerchen === null) return;

        if(tuerchen.href === "") {
            color = "red";
        }
        const coords = tuerchen.coords.split(",");

        const highlight = document.createElement('div');
        highlight.style.position = "absolute";
        highlight.style.backgroundColor = color;
        highlight.style.left = coords[0] + "px";
        highlight.style.top = coords[1] + "px";
        highlight.style.width = (coords[2] - coords[0]) + "px";
        highlight.style.height = (coords[3] - coords[1]) + "px";
        highlight.style.zIndex = 10;
        highlight.style.opacity = 0.25;
        highlight.style.pointerEvents = 'none';
        wrapper.appendChild(highlight);
    }
    if (document.location.search.includes('page=calendar')) {
        const day = (new Date()).getDate();
        const kalender_map=document.querySelector("map[name='mk']");
        if (kalender_map === null) return;
        const kalender_img = document.querySelector('img[alt^="mathekalender"]');
        if (kalender_img === null) return;

        const wrapper = document.createElement('div');
        wrapper.style.position = "relative";

        kalender_map.after(wrapper);
        highlight(wrapper, day, "green");
        highlight(wrapper, day - 1, "blue");
        wrapper.appendChild(kalender_img);
        wrapper.appendChild(kalender_map);

        return;
    }
    if (document.location.search.includes('page=forum')) {
        const day = (new Date()).getDate();
        const forum = document.querySelector('a[href="http://forum.mathekalender.de"]');

        const fragen = forum.cloneNode();
        fragen.textContent = "Zu den Fragen";
        fragen.href += "#fragen-zu-aufgabe-" + day
        forum.parentNode.insertBefore(fragen, forum);
        forum.parentNode.insertBefore(document.createElement("br"), forum);

        const zusammenfassung = forum.cloneNode();
        zusammenfassung.textContent = "Zur Zusammenfassung";
        zusammenfassung.href += "#diskussion-zu-aufgabe-" + day
        forum.parentNode.insertBefore(zusammenfassung, forum);
        forum.parentNode.insertBefore(document.createElement("br"), forum);

        const feedback = forum.cloneNode();
        feedback.textContent = "Zum Feedback";
        feedback.href += "#feedback-zur-aufgabe-" + day
        forum.parentNode.insertBefore(feedback, forum);
        forum.parentNode.insertBefore(document.createElement("br"), forum);

        return;
    }
    if (document.location.search.includes('page=problem')) {
        const day = document.querySelector('h3.pageTitle').textContent.match(/\d+/)[0];
        const form = document.forms[0]

        const feedback = document.createElement('a');
        feedback.textContent = "Zum Feedback";
        feedback.href = "https://forum.mathekalender.de/#feedback-zur-aufgabe-" + day
        form.after(feedback,);
        form.after(document.createElement("br"));

        const zusammenfassung = document.createElement('a');
        zusammenfassung.textContent = "Zur Zusammenfassung";
        zusammenfassung.href = "https://forum.mathekalender.de/#diskussion-zu-aufgabe-" + day
        form.after(zusammenfassung);
        form.after(document.createElement("br"));

        const fragen = document.createElement('a');
        fragen.textContent = "Zu den Fragen";
        fragen.href = "https://forum.mathekalender.de/#fragen-zu-aufgabe-" + day
        form.after(fragen);

        return;
    }
    if (document.location.hash !== "") {
        document.querySelector('a[href*="-' + document.location.hash.substr(1) + '-"]').click()
        return;
    }
})();
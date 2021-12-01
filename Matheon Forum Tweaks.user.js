// ==UserScript==
// @name         Matheon Forum Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wir mathen das…
// @author       https://github.com/Skeeve
// @match        https://www.mathekalender.de/wp/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .forums.bbp-replies {
            font-size: 15px !important;
        }
    `);
})();
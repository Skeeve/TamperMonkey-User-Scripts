// ==UserScript==
// @name         Amazon www to smile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://www.amazon.com/*
// @match        https://www.amazon.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.location.href = document.location.href.replace(/^(https:\/\/)www\./, "$1smile.");
})();
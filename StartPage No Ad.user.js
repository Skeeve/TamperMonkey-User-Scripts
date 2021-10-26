// ==UserScript==
// @name         StartPage No Ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Startpage's Ads
// @author       https://github.com/Skeeve
// @match        https://startpage.com/*
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    	#adBlock { display: none; }
    `);
})();
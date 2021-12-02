// ==UserScript==
// @name         Matheon Forum Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Wir mathen das…
// @author       https://github.com/Skeeve
// @match        https://www.mathekalender.de/wp/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathekalender.de
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
	.forums.bbp-replies,
	.bbp-forum.content,
	.bbp-body {
		font-size: 15px !important;
	}
	.bsp-previewtext {
		display: none !important;
	}
	li.bbp-forum {
		display: block !important;
	}
	div > div > blockquote {
		background-color: beige;
		border-left: 0.5em solid blue;
		padding-left: 0.5em;
		margin: 0;
        margin-bottom: 0.5em;
	}
	div > div > blockquote:before,
	div > div > blockquote:after {
		display: none !important;
        margin: 0px;
        background-color: pink;
	}
`);
})();
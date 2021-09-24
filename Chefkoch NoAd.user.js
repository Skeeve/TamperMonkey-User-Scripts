// ==UserScript==
// @name     Chefkoch NoAd
// @version  3
// @grant    none
// @include  https://www.chefkoch.de/*
// @exclude  https://www.chefkoch.de/magazin/*
// ==/UserScript==


(function() {
    'use strict';
    var removable = 0;
    var callsremaining = 100;
    function waitforAds() {
        --callsremaining;
        var removables = document.querySelectorAll('img[referrerpolicy="unsafe-url"]');
        console.log(callsremaining, removable, removables);
        if (removables.length != removable || removable < 4) {
            removable = removables.length;
            if (callsremaining < 1) return;
            window.setTimeout(waitforAds, 100);
            console.log("waiting", document.location);
            return;
        }
        removables.forEach( e => {
            var grandparent = e.parentNode.parentNode;
            if (grandparent.tagName == 'DIV' ) {
                e.remove();
                console.log(e);
            }
        });
        document.querySelectorAll('div.swiper-slide').forEach( e => {
            if (e.textContent.match(/^Ad\s/)) e.remove()
        });
        document.querySelectorAll('guj-ad').forEach( e => {
            e.remove();
        });
    }

    window.setTimeout(waitforAds, 1);
})();


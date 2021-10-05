// ==UserScript==
// @name         Youtube Playlist Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://www.youtube.com/playlist*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let whatToAdd = []
    function remove() {
        let keep_waiting = true;
        document.querySelectorAll('ytd-menu-service-item-renderer').forEach(
            (elt) => {
                if(elt.textContent.match(/Aus ".*" entfernen/)){
                    elt.click();
                    keep_waiting = false;
                }});
        if (keep_waiting) {
            window.setTimeout(remove, 10);
        }
    }
    function addAll() {
        console.log("addAll", whatToAdd)
        if (whatToAdd.length > 0) {
            whatToAdd.shift().click()
            window.setTimeout(add, 10)
        }
    }
    function add() {
        console.log('add')
        let keep_waiting = true;
        document.querySelectorAll('ytd-menu-service-item-renderer').forEach(
            (elt) => {
                if(elt.textContent.match(/Zu Playlist hinzufügen/)){
                    elt.click();
                    keep_waiting = false;
                    window.setTimeout(anschauen, 10)
                }});
        if (keep_waiting) {
            window.setTimeout(add, 10);
        }
    }
    function anschauen() {
        console.log('anschauen')
        let elt = document.querySelector('yt-formatted-string[title="Anschauen"]')
        if (elt === null || elt.offsetParent === null) {
            window.setTimeout(anschauen, 10);
            return;
        }
        elt.click()
        window.setTimeout(clicked, 10)
    }
    function clicked() {
        let elt = document.querySelector('yt-formatted-string[title="Anschauen"]')
        if (elt.parentNode.parentNode.parentNode.parentNode.getAttribute('aria-checked') == "false" ) {
            window.setTimeout(clicked, 10)
            return;
        }
        while (elt.nodeName != 'YTD-ADD-TO-PLAYLIST-RENDERER') {
            elt = elt.parentNode
        }
        let btn = elt.querySelector('#close-button')
        window.setTimeout(function(){
            btn.click()
            window.setTimeout(added, 10)
        }, 100)
    }
    function added() {
        console.log('added')
        if (document.querySelector('yt-formatted-string[title="Anschauen"]')?.offsetParent === null) {
            window.setTimeout(addAll, 10);
        } else {
            window.setTimeout(added, 10)
        }
    }
    if (document.title.match(/(Anschauen|Flat Earth|Shorts) - YouTube/)) {
        document.querySelectorAll('ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer').forEach(
            (elt) => {
                let clicker = elt.querySelector('#menu > ytd-menu-renderer.style-scope.ytd-playlist-video-renderer');
                let wb = document.createElement('span');
                wb.textContent = '\u{1f5d1}';
                clicker.prepend(wb);
                wb.addEventListener("click", function(evt){
                    evt.target.parentNode.querySelector('#button').click();
                    window.setTimeout(remove, 10);
                    return false;
                })
            }
        )
    } else {
        let an = document.querySelector('button[aria-label="Zufallsmix"]').parentNode.parentNode.parentNode.parentNode
        let adder = document.createElement('span')
        document.querySelectorAll('ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer').forEach(
            (elt) => {
                whatToAdd.push( elt.querySelector('#menu > ytd-menu-renderer.style-scope.ytd-playlist-video-renderer').parentNode.querySelector('#button') )
            })
        adder.textContent = '\u{2795}'
        adder.addEventListener('click', addAll)
        an.append(adder)
    }
    // Your code here...
})();
// ==UserScript==
// @name         Youtube Playlist Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Some helpers for Youtube Playlists
// @author       https://github.com/Skeeve
// @match        https://www.youtube.com/playlist*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
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
    const downloadTo = window.name.replace(/^Download\b.*?(\w.*)$/, '$1');
    if (window.name == downloadTo) return;

    // DOWNLAODER BELOW ///////////////////////////////////////////////////////////////

    // My default location for storing stuff
    const TARGET =`/Volumes/${downloadTo}`;

    // A tag used to signal to jDownloader what to do with the links
    const TAG4JD = '#S-TO#';

    // flashgot link of jDownloader
    const JDOWNLOADER = "http://127.0.0.1:9666/flashgot";

    function toJDownloader (link, channel, title) {
        link+= TAG4JD + title;
        const saveto= `${TARGET}/${channel}/`;

        // collect the data to send to JD
        var data= {
            "passwords" : "",
            "source": "",
            "package": channel,
            "urls": link,
            "dir": saveto,
            "submit": "submit"
        };
        console.debug(JDOWNLOADER, data);
        // Send the data
        GM_xmlhttpRequest({
            method: "POST",
            url: JDOWNLOADER,
            data: objEncodeURIComponent(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if ( response.status === 200 ) {
                    console.log("Would close now");
                }
                else {
                    console.log(response);
                }
            },
        });
    }

    function objEncodeURIComponent(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    }

    document
        .querySelectorAll('ytd-playlist-video-list-renderer ytd-playlist-video-renderer')
        .forEach( vid => {
        const lnk = vid.querySelector('a#video-title');
        const href = lnk.href;
        const title = lnk.title;
        const channel = vid.querySelector('ytd-channel-name yt-formatted-string#text').textContent;
        toJDownloader(href, channel, title);
    });

    // Send current page - after some preparing - to jDownloader

})();
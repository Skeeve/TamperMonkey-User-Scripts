// ==UserScript==
// @name         Youtube Playlist Helper
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Some helpers for Youtube Playlists
// @author       https://github.com/Skeeve
// @match        https://www.youtube.com/watch?*
// @match        https://www.youtube.com/playlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      127.0.0.1
// ==/UserScript==

/* global ytInitialData */

(function() {
    'use strict';
    const theMatch = window.name.match(/^(\w+)(?:\W+(\w.*))?$/);
    console.log(">>>> ",theMatch);
    if (theMatch === null) return;
    window.name = '';
    switch(theMatch[1]) {
        case 'LikeAll':
            likeAll();
            break;
        case 'LikeThis':
            likeThis(theMatch[2]);
            break;
        case 'Remove':
            removeFromPlaylist();
            break;
        case 'Download':
            doDownload(theMatch[2]);
            addHelpers();
            break;
        default:
            addHelpers();
            break;
    }
    return

    // LIKE ALL ///////////////////////////////////////////////////////////////////////

    function likeAll() {
        if ( document.querySelector('.ytd-message-renderer#message') !== null) {
            console.log("DONE");
            return;
        }
        const vid = document.querySelector('ytd-playlist-video-list-renderer ytd-playlist-video-renderer');
        if (vid === null) {
            console.log('... Waiting likeAll');
            window.setTimeout( likeAll, 100);
            return;
        }
        console.log(">>>> liking");
        const lnk = vid.querySelector('a#video-title');
        const params = new URLSearchParams(lnk.search);
        const video_id = params.get('v');

        const goback = new URL(window.location);
        goback.hash = `#${video_id}`;

        window.name = `LikeThis ${goback}`;
        window.location.href = lnk.href;
    }

    // LIKE ONE ///////////////////////////////////////////////////////////////////////

    function likeThis(goback) {
        wait4btn();
        function wait4btn() {
            const likeBtn = document.querySelector('#menu-container #menu button#button');
            if (likeBtn !== null) {
                const pressed = likeBtn.getAttribute('aria-pressed');
                try {
                    if (pressed == 'false') {
                        likeBtn.click();
                    }
                    if (pressed == 'true') {
                        window.name = 'Remove';
                        window.location.href = goback;
                        return
                    }
                }
                finally {}
            }
            window.setTimeout(wait4btn, 100);
        }
    }

    // REMOVE ONE /////////////////////////////////////////////////////////////////////

    function removeFromPlaylist() {
        console.log("removeFromPlaylist");
        const removeVid = window.location.hash.substring(2);
        console.log("To remove:", removeVid);
        let vid = document.querySelector(`
            ytd-playlist-video-list-renderer
              ytd-playlist-video-renderer
                a#video-title[href*="${removeVid}"]
            `);
        if (vid === null) {
            console.log("... Waiting removeFromPlaylist");
            window.setTimeout(removeFromPlaylist, 100);
            return;
        }
        let rest = document
            .querySelectorAll('ytd-playlist-video-list-renderer ytd-playlist-video-renderer').length - 1;
        console.log("Vid:", vid);
        let menu = null;
        while (menu == null) {
            vid = vid.parentNode;
            menu = vid.querySelector('yt-icon.ytd-menu-renderer');
        }
        console.log("Menu:", menu);
        menu.click();
        doRemoval(rest);
    }

    function doRemoval(rest) {
        console.log("doRemoval");
        let popUp = document.querySelector('tp-yt-iron-dropdown:not([aria-hidden="true"])');
        if (popUp === null) {
            console.log(">>>> No menu items yet");
            window.setTimeout(function () { doRemoval(rest); }, 100);
            return;
        }
        let menuItems = popUp.querySelectorAll('ytd-menu-popup-renderer ytd-menu-service-item-renderer span');
        if (menuItems.length < 1) {
            console.log(">>>> No menu items yet");
            window.setTimeout(function () { doRemoval(rest); }, 100);
            return;
        }
        const playList = ytInitialData.metadata.playlistMetadataRenderer.title;
        console.log(">>>>", playList);
        menuItems.forEach( txt => {
            console.log(">>>> ", txt.textContent, txt.textContent == playList, playList);
            if (txt.textContent == playList) {
                console.log(">>>> CLICK");
                txt.click();
            }
        });
        let waitRefresh = function() {
            if (popUp.getAttribute('aria-hidden') !== 'true') {
                console.log("Waiting");
                window.setTimeout(waitRefresh, 100);
                return;
            }
            if (rest > 0) likeAll();
        };
        window.setTimeout(waitRefresh, 100);
    }

    function addHelpers() {
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
    }

    // DOWNLOADER BELOW ///////////////////////////////////////////////////////////////
    function doDownload(downloadTo) {
        // My default location for storing stuff
        const TARGET =`/Volumes/${downloadTo}`;

        // A tag used to signal to jDownloader what to do with the links
        const TAG4JD = '#S-TO#';

        // flashgot link of jDownloader
        const JDOWNLOADER = "http://127.0.0.1:9666/flashgot";

        function toJDownloader (link, channel, title, vid) {
            link+= TAG4JD + title;
            const saveto= `${TARGET}/${channel}/`.replaceAll(/['`´"]/g, '-');

            // collect the data to send to JD
            let data= {
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
                        vid.style.backgroundColor='aquamarine';
                    }
                    else {
                        console.log(response);
                        vid.style.backgroundColor='indianred';
                    }
                },
            });
        }

        function objEncodeURIComponent(obj) {
            let str = [];
            for (let p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        }

        let vids = document
            .querySelectorAll('ytd-playlist-video-list-renderer ytd-playlist-video-renderer');
        if (vids.length == 0) {
            console.log("... Waiting doDownload");
            window.setTimeout( function () { doDownload(downloadTo); }, 100 );
            return;
        }
		let delay = 500;
        vids.forEach( vid => {
            const lnk = vid.querySelector('a#video-title');
            const href = lnk.href;
            const title = lnk.title;
            const channel = vid.querySelector('ytd-channel-name yt-formatted-string#text').textContent;
            window.setTimeout(function(){toJDownloader(href, channel, title, vid);}, delay);
			delay += 1000;
        });
    }
})();
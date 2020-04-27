// ==UserScript==
// @name        bandcamp 2020
// @namespace   bandcamp
// @include     https://bandcamp.*.net/album/*
// @version     1
// @grant       none
// ==/UserScript==

/////////////////////////////////////////////////////////////////////

// A tag used to signal to jDownloader what to do with the links
var TAG4JD  = '#MP3#';

// Separator between information parts
var SEP     = '__';

// Sequence of information to go into the package
var pkgseq  = ["artist", "year", "album"];

// Sequence of information to go into the filename
var sequence= ["artist", "year", "album", "track", "title"];

// Queue of files to download
var queue   = [];

// URL of local jDownloader process
var JDOWNLOADER="http://127.0.0.1:9666/flashgot";

var init_countdown= 100;

init();

function init() {
    // Do we have the required Info?
    let AlbumData = unsafeWindow.TralbumData;
    if ("undefined" === typeof AlbumData) {
        if (init_countdown-->0) {
            window.setTimeout(init, 100);
        } else {
            alert("cannot find TralbumData.\n\nScript needs an update.");
        }
        return;
    }
    // Find the Album Cover
    let alb = document.querySelector('#tralbumArt a');
    // Indicate downloadability by changing the cursor
    alb.setAttribute('style','cursor:crosshair');
    // Get some album information
    let album = AlbumData.current.title;
    let artist = AlbumData.artist;
    let year = AlbumData.current.release_date.replace(/^.*\b(\d\d\d\d).*$/, "$1");
    // Make the cover clickable
    alb.onclick = function() {
        console.debug("start");
        let url= alb.href;
        // Schedule th cover for download
        mp3ToJDownloader({
            "url"   : url,
            "artist": artist,
            "year"  : year,
            "album" : album,
            "track" : 0,
            "title" : url,
        });
        let incomplete= 0;
        // For each track
        for (i in AlbumData.trackinfo) {
            let tr = AlbumData.trackinfo[i];
            let title = tr.title;
            let track = tr.track_num;
            let url = tr.file["mp3-128"];
            // something to find incompletes
            // schedule for download
            mp3ToJDownloader({
                "url"   : url,
                "artist": artist,
                "year"  : year,
                "album" : album,
                "track" : track,
                "title" : title + ".mp3"
            });
        }
        // Show an alert when tracks are missing. Start the download
        if (0 === incomplete || confirm("The album "+album+" is incomplete.\n\nMissing tracks: "+incomplete+"\n\nDownload anyway?")) {
            //startDownload();
        }
    }
}

function mp3ToJDownloader (mp3info) {
  // Adjust the url if required
  mp3info.url= mp3info.url.replace(/^\//, document.location.origin + "/");
  // Prepare the data to be send to jDownloader
  let data = new FormData();
  data.append("passwords", "")
  data.append("source", TAG4JD);
  data.append("package", pkgseq.map(v => mp3info[v]).join(SEP));
  data.append("urls", mp3info.url + TAG4JD + encodeURIComponent(sequence.map(v => mp3info[v]).join(SEP)));
  data.append("submit", "submit");
  // Queue the data
  queue.push(data);
}

function startDownload () {
    for (i=0; i<queue.length; ++i) {
        console.debug(queue[i]);
        fetch(JDOWNLOADER, {
            method: 'POST',
            body: queue[i]
        })
        .then((response) => console.log(response))
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

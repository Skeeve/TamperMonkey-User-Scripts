// ==UserScript==
// @name        bandcamp
// @namespace   bandcamp
// @include     https://*.bandcamp.com/album/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
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

// Find the Album Cover 
$("#tralbumArt img").each(function(idx, alb) {
  // Indicate downloadability by changing the cursor
  $(alb).css('cursor', 'crosshair');
  // Get some album information
  var album= $('#name-section h2.trackTitle').text().trim();
  var artist=$('#name-section span[itemProp="byArtist"]').text().trim();
  var year=$('meta[itemProp="datePublished"]').attr('content').trim().substr(0,4);
  // Make the cover clickable
  $(alb).click(function() {
    console.debug("start");
    var url= $(alb).closest('a').attr('href');
    // Schedule th cover for download
    mp3ToJDownloader({
      "url"   : url,
      "artist": artist,
      "year"  : year,
      "album" : album,
      "track" : 0,
      "title" : url.replace(/^.*?(?=\.[^\/.]+$)/, 'cover')
    });
    var incomplete= 0;
    // For each track
    $('#track_table').each(function(idx,trcks) {
      // Find its entry
      $(trcks).find('tr.track_row_view').each(function(idx,trck) {
        // Count incompleteness when a track is disabled
        if (1 === $(trck).find('div.play_status.disabled').length) {
          ++incomplete;
          return;
        }
        // Get track information
        var track= $(trck).find('div.track_number').text().trim().replace(/\.$/, '');
        var title= $(trck).find('div.title span[itemProp="name"]').text().trim();
        var url= $(trck).find('div.dl_link a').attr('href')
        if ( url === undefined ) {
          url= unsafeWindow.TralbumData.trackinfo[track-1].file["mp3-128"];
          console.log(url);
        }
        else {
        	url= url.replace(/\?.*/, '');
        }
        // schedule for download
        mp3ToJDownloader({
          "url"   : url,
          "artist": artist,
          "year"  : year,
          "album" : album,
          "track" : track,
          "title" : title + ".mp3"
        });
      });        
    });
    // Show an alert when tracks are missing. Start the download
    if (0 === incomplete || confirm("The album "+album+" is incomplete.\n\nMissing tracks: "+incomplete+"\n\nDownload anyway?")) {
    	startDownload();
    }
  });
});

function mp3ToJDownloader (mp3info) {
  // Adjust the url if required
  mp3info.url= mp3info.url.replace(/^\//, document.location.origin + "/");
  // Prepare the data to be send to jDownloader
  var data= {
    "passwords" : "",
    "source": TAG4JD,
    "package": pkgseq.map(v => mp3info[v]).join(SEP),
    "urls": mp3info.url + TAG4JD + encodeURIComponent(sequence.map(v => mp3info[v]).join(SEP)),
    "submit": "submit"
  };
  console.debug(JDOWNLOADER, data);
  // Queue the data
  queue.push(data);
}

function startDownload () {
  // for each queue entry
  for (i=0; i<queue.length; ++i) {
    // Send it to jDownloader
	  $.post( JDOWNLOADER, queue[i], function(data) {
  	  console.debug(data);
  	});
  }
}

// ==UserScript==
// @name     s.to C Stream Hosters
// @namespace    http://tampermonkey.net/
// @author       https://github.com/Skeeve
// @version  7
// @match  http://streamcloud.eu/*/.html
// @match  https://openload.co/embed/*
// @match  https://streamango.com/embed/*
// @match  https://streamtape.com/*
// @match  https://vidoza.net/*
// @match  https://vidoza.org/*
// @match  https://vivo.sx/*
// @match  https://voe.sx/*
// @match  https://gounlimited.to/*
// @match  https://oload.stream/*
// @match  https://upstream.to/*
// @match  https://streamtape.com/*
// @grant    GM_xmlhttpRequest
// ==/UserScript==

// My default location for storing stuff
var TARGET='/Volumes/Multimedia/Mediatheken/Serien';

// A tag used to signal to jDownloader what to do with the links
var TAG4JD='#S-TO#';

// Separator between information parts
var SEP='__';

// flashgot link of jDownloader
var JDOWNLOADER="http://127.0.0.1:9666/flashgot";

// Used to signal to the script that the window can be closed
var DONE='*DONE*';

function toJDownloader (link) {
  // The name is stored in the window name in the form of
  // SERIES $SEP SEASON# $SEP EPISODE# $SEP TITLE $SEP SEASONDIR
  if ( window.name === DONE ) {
    window.close();
    return;
  }
  var sinfo= window.name.split(SEP);
  if (sinfo.length == 1) {
      // Oops. It's missing. Search in the hash part
      sinfo= decodeURIComponent(document.location.hash.substr(1)).split(SEP);
  }
  var package= "";
  var saveto="";
  // So if we have something matching the pattern
  if ( sinfo.length >=4 ) {
    // The package becomes the Series
    package= sinfo[0];
    // The link gets tagged and will get the new filename in the form
    // EPISODE# " - " TITLE
    link+= TAG4JD + fill0(sinfo[2], 2) + " - " + sinfo[3];
    // This will be the dwnload target
    // $TARGET "/Season " SEASON# "/"
    saveto= TARGET + "/" + sinfo[0] + "/" + sinfo[4] + " " +sinfo[1] + "/";
  }
  // collect the data to send to JD
  var data= {
    "passwords" : "",
    "source": "",
    "package": package,
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
            document.querySelector('body').textContent="DONE!";
            window.name=DONE;
            window.location.reload();
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

// Prepend some zeros
function fill0(x, num) {
	x= ""+x;
  return "0".repeat(Math.max(2-x.length,0)) + x;
}

// Send current page - after some preparing - to jDownloader
toJDownloader(document.location.href.replace(/#.*$/, ''));

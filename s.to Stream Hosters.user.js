// ==UserScript==
// @name     s.to Stream Hosters
// @version  1
// @include  http://streamcloud.eu/*/.html
// @include  https://openload.co/embed/*
// @include  https://streamango.com/embed/*
// @include  https://vidoza.net/*
// @include  https://vidoza.org/*
// @include  https://vivo.sx/*
// @include  https://gounlimited.to/*
// @include  https://oload.stream/*
// @grant    GM.xmlHttpRequest
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
  GM.xmlHttpRequest({
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
      }
  	},
	});
}

function objEncodeURIComponent(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

// Prepend some zeros
function fill0(x, num) {
	x= ""+x;
  return "0".repeat(Math.max(2-x.length,0)) + x;
}

// Send current page - after some preparing - to jDownloader
toJDownloader(document.location.href);

// ==UserScript==
// @name     Musescore to jDownloader
// @version  1
// @grant    GM.xmlHttpRequest
// @include  https://musescore.com/user/*/scores/*
// ==/UserScript==

// URL of local jDownloader process
var JDOWNLOADER="http://127.0.0.1:9666/flashgot";
var SOURCE="MuseScore 2 jDownloader";

window.setTimeout(initialize, 10);

var imgs= [];
var imgdivs;
var imgcount; 

function initialize() {
  console.log("Initializing");
  var oneimg=document.querySelector('img[src*="/score_"][src*="?no-cache"]');
  if (oneimg===null) {
    window.setTimeout(initialize, 1000);
    return;
  }
  console.log("First image found");
	imgdivs= []
    .slice
    .call(oneimg.parentNode.parentNode.children);
  imgcount= imgdivs.length;
  imgs[imgcount-1]= undefined;
  console.log("Images required: ", imgcount);
  get_img_urls();
}

function get_img_urls() {
  console.log(imgcount, imgs);
  imgdivs.forEach(
    function(elt, i) {
      if ( imgs[i] !== undefined ) return;
      var img= elt.querySelector('img');
      if (img === null ) return;
			imgs[i]= img.src;
      --imgcount;
    }
  );
  if (imgcount > 0) {
    window.setTimeout(get_img_urls, 1000);
    return;
  }
  imgurls= imgs.join("\n");

	var title=document.querySelector('meta[property="og:title"]').getAttribute('content');
  var composer=document.querySelector('meta[property="musescore:composer"]').getAttribute('content');
  var author=document.querySelector('meta[property="musescore:author"]').getAttribute('content');
  toJDownloader({
    "urls"    : imgurls,
    "package": title + " - " + composer + " - " + author,
  });
}


function toJDownloader (info) {
  // Prepare the data to be send to jDownloader
  var data= {
    "source"    : SOURCE,
    "passwords" : "",
    "package"   : info.package,
    "urls"      : info.urls,
    "submit"    : "submit"
  };
  console.debug(JDOWNLOADER, objEncodeURIComponent(data));
  GM.xmlHttpRequest({
  	method: "POST",
  	url: JDOWNLOADER,
  	data: objEncodeURIComponent(data),
  	headers: {
 	  	"Content-Type": "application/x-www-form-urlencoded"
  	},
    onload: function(response) {
    	if ( response.status === 200 ) {
        //document.querySelector('body').textContent="DONE!";
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


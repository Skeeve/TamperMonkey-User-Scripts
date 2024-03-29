// ==UserScript==
// @name     s.to B Auto-Follow to Hoster
// @namespace    http://tampermonkey.net/
// @author       https://github.com/Skeeve
// @version  9
// @description  Follow to the selected hoster
// @grant    none
// @include  https://serien.sx/serie/stream/*/staffel-*/episode-*
// @include  https://serien.vc/serie/stream/*/staffel-*/episode-*
// @include  https://s.to/serie/stream/*/staffel-*/episode-*
// @include  https://serien.ac/serie/stream/*/staffel-*/episode-*
// @include  https://serien.*/serie/stream/*/staffel-*/episode-*
// @include  https://serienstream.sx/serie/stream/*/staffel-*/episode-*
// ==/UserScript==

// These episodes I want to get in english
var english= [
	'The Orville',
  /* 'Death in Paradise',*/
  /*'Young Sheldon',*/
  'The Big Bang Theory',
  'Doctor Who',
];

var sep = '__';

function do_stuff() {
  try {
    // Get the name of the series
    var series= document.querySelector('div.hosterSeriesTitle').textContent;

    // get the season and episode
    var siteTitle=document.querySelector('div.hosterSiteTitle');
	var season= siteTitle.getAttribute('data-season');
	var episode= siteTitle.getAttribute('data-episode');
    var title= '';
    var seasondir='';
	var currentLanguage=0;

	// get german and english?
	var de= document.querySelector("img[title='Deutsch']");
	var en= document.querySelector("img[title='Englisch']");
    // Is it a series watched in english OR do we not have german?
    if ( (english.indexOf(series) >= 0 || de === null) ) {
    	currentLanguage= en.getAttribute("data-lang-key");
        title= siteTitle.querySelector('h2 .episodeEnglishTitle').textContent;
		seasondir='Season';
    } else if (de !== null) {
    	currentLanguage= de.getAttribute("data-lang-key");
        title= siteTitle.querySelector('h2 .episodeGermanTitle').textContent;
		seasondir='Staffel'
	} else {
		alert("Neither German nor English found.");
		return;
	}
    // set the window name to the info just found
    window.name= [series, season, episode, title, seasondir].join(sep).replace(/\s*[:\/]\s*/g, ' - ');

    // preferred hosters
    var hosters= [ "Streamcloud", "Openload", "Streamango" ];
    // was a hoster appended?
    var hoster= document.location.hash.replace(/^#/, '');
    // Then push it to the front
    if (hoster !== "") {
      hosters.push(hoster);
    }

    // Try to find a link for the preferred hoster and language
    var n= null;
    while (n === null) {
      if (hosters.length < 1) {
        throw "No preferred hoster found";
      }
      hoster= hosters.pop();
      n= document.querySelector("li[data-lang-key='"+currentLanguage+"'] i.icon." + hoster);
    }
    console.log(hoster);

    // go to that page
    while (n.nodeName !== "LI") {
      n= n.parentNode;
    }
      let newLocation = n.getAttribute('data-link-target') + "#" + window.name;
      console.log(newLocation);
      document.location= newLocation;
  }
  catch (e) {
    console.log(e);
  }
}

do_stuff();

